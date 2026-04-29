import { API_URL } from "../config/api";

const STORAGE_KEYS = {
  visitorId: "meradev_analytics_visitor_id",
  sessionId: "meradev_analytics_session_id",
  sessionStartedAt: "meradev_analytics_session_started_at",
  locationHint: "meradev_analytics_location_hint_v1",
};

const EVENT_ENDPOINT = `${API_URL}/api/analytics/events`;
const MAX_BATCH_SIZE = 20;
const MAX_QUEUE_SIZE = 300;
const FLUSH_INTERVAL_MS = 5000;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 30000;
const LOCATION_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const GEOLOCATION_TIMEOUT_MS = 4500;
const GEOLOCATION_MAX_AGE_MS = 5 * 60 * 1000;
const GEO_REVERSE_LOOKUP_TIMEOUT_MS = 3500;
const GEO_REVERSE_LOOKUP_ENDPOINTS = [
  "https://api.bigdatacloud.net/data/reverse-geocode-client",
  "https://api-bdc.net/data/reverse-geocode-client",
];

let queue = [];
let isSending = false;
let flushTimer = null;
let heartbeatTimer = null;
let trackerRefCount = 0;
let detachListeners = null;
let analyticsBatchSender = null;
let lastPageView = {
  path: "",
  at: 0,
};
let latestLocationHint = null;
let locationHintPromise = null;
let locationResolvedEventSent = false;

const randomId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;

const readStorageValue = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (_error) {
    return "";
  }
};

const writeStorageValue = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (_error) {
    // Ignore storage write failures in privacy/SSR contexts.
  }
};

const readStorageJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

const writeStorageJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // Ignore storage write failures in privacy/SSR contexts.
  }
};

const getOrCreateVisitorId = () => {
  const existing = readStorageValue(STORAGE_KEYS.visitorId);
  if (existing) return existing;
  const generated = `v-${randomId()}`;
  writeStorageValue(STORAGE_KEYS.visitorId, generated);
  return generated;
};

const getOrCreateSessionId = () => {
  const existingSessionId = readStorageValue(STORAGE_KEYS.sessionId);
  const rawSessionStartedAt = Number(readStorageValue(STORAGE_KEYS.sessionStartedAt) || 0);
  const now = Date.now();

  if (existingSessionId && rawSessionStartedAt && now - rawSessionStartedAt < SESSION_TIMEOUT_MS) {
    return existingSessionId;
  }

  const nextSessionId = `s-${randomId()}`;
  writeStorageValue(STORAGE_KEYS.sessionId, nextSessionId);
  writeStorageValue(STORAGE_KEYS.sessionStartedAt, String(now));
  return nextSessionId;
};

const safeText = (value, max = 200) => String(value || "").trim().slice(0, max);
const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const boundedCoordinate = (value, min, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < min || parsed > max) return null;
  return parsed;
};

const resolveBrowserTimezone = () =>
  safeText(Intl.DateTimeFormat().resolvedOptions?.().timeZone, 80);

const normalizeLocationHint = (value) => {
  if (!value || typeof value !== "object") return null;

  const city = safeText(value.city, 80);
  const region = safeText(value.region, 80);
  const country = safeText(value.country, 80);
  const timezone = safeText(value.timezone, 80);
  const source = safeText(value.source, 40);
  const accuracyMeters = Math.max(0, Math.round(safeNumber(value.accuracyMeters)));

  if (!city && !region && !country && !timezone) {
    return null;
  }

  return {
    city,
    region,
    country,
    timezone,
    source: source || "ip_approx",
    accuracyMeters,
  };
};

const readCachedLocationHint = () => {
  const cached = readStorageJson(STORAGE_KEYS.locationHint);
  if (!cached || typeof cached !== "object") return null;

  const expiresAt = safeNumber(cached.expiresAt);
  if (!expiresAt || expiresAt <= Date.now()) return null;
  return normalizeLocationHint(cached.location);
};

const cacheLocationHint = (hint) => {
  const normalized = normalizeLocationHint(hint);
  if (!normalized) return;
  writeStorageJson(STORAGE_KEYS.locationHint, {
    location: normalized,
    expiresAt: Date.now() + LOCATION_CACHE_TTL_MS,
  });
};

const resolveLanguageCode = () => {
  const rawLanguage = typeof navigator !== "undefined" ? navigator.language : "";
  const raw = safeText(rawLanguage, 40).replace("_", "-");
  if (!raw) return "en";
  const [code] = raw.split("-");
  return safeText(code, 8).toLowerCase() || "en";
};

const fetchJsonWithTimeout = async (url, timeoutMs) => {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = setTimeout(() => {
    controller?.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller?.signal,
    });
    if (!response.ok) return null;
    return response.json().catch(() => null);
  } catch (_error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const parseReverseGeoPayload = (payload, fallbackTimezone) => {
  if (!payload || typeof payload !== "object") return null;

  const city = safeText(payload.city || payload.locality, 80);
  const region = safeText(payload.principalSubdivision || payload.locality, 80);
  const country = safeText(payload.countryName || payload.countryCode, 80);
  const timezone = safeText(
    payload?.timeZone?.ianaTimeId || payload?.timezone || fallbackTimezone,
    80,
  );

  return normalizeLocationHint({
    city,
    region,
    country,
    timezone,
    source: "browser_geo",
  });
};

const reverseGeocodeCoordinates = async ({ latitude, longitude, language, timezone }) => {
  const query = `latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&localityLanguage=${encodeURIComponent(language)}`;

  for (const endpoint of GEO_REVERSE_LOOKUP_ENDPOINTS) {
    const payload = await fetchJsonWithTimeout(
      `${endpoint}?${query}`,
      GEO_REVERSE_LOOKUP_TIMEOUT_MS,
    );
    const hint = parseReverseGeoPayload(payload, timezone);
    if (hint) return hint;
  }

  return null;
};

const getCurrentBrowserPosition = () =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not available"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: GEOLOCATION_MAX_AGE_MS,
      },
    );
  });

const getPermissionStateForGeolocation = async () => {
  if (
    typeof navigator === "undefined" ||
    !navigator.permissions ||
    typeof navigator.permissions.query !== "function"
  ) {
    return "prompt";
  }
  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return safeText(result?.state, 20).toLowerCase() || "prompt";
  } catch (_error) {
    return "prompt";
  }
};

const resolvePreciseLocationHint = async () => {
  const cached = readCachedLocationHint();
  if (cached) return cached;

  const permissionState = await getPermissionStateForGeolocation();
  if (permissionState === "denied") {
    return null;
  }

  const timezone = resolveBrowserTimezone();
  const language = resolveLanguageCode();

  try {
    const position = await getCurrentBrowserPosition();
    const latitude = boundedCoordinate(position?.coords?.latitude, -90, 90);
    const longitude = boundedCoordinate(position?.coords?.longitude, -180, 180);
    const accuracyMeters = Math.max(
      0,
      Math.round(safeNumber(position?.coords?.accuracy)),
    );

    if (latitude === null || longitude === null) return null;

    const resolved = await reverseGeocodeCoordinates({
      latitude,
      longitude,
      language,
      timezone,
    });

    const finalHint = normalizeLocationHint({
      ...(resolved || {}),
      timezone: resolved?.timezone || timezone,
      source: "browser_geo",
      accuracyMeters,
    });

    if (finalHint) {
      cacheLocationHint(finalHint);
    }
    return finalHint;
  } catch (_error) {
    return null;
  }
};

const warmupPreciseLocationHint = () => {
  if (latestLocationHint) return;
  if (locationHintPromise) return;

  locationHintPromise = resolvePreciseLocationHint()
    .then((hint) => {
      latestLocationHint = hint || null;
      if (hint && !locationResolvedEventSent) {
        locationResolvedEventSent = true;
        pushEvent({
          eventType: "custom",
          category: "location",
          action: "precise_area_resolved",
          status: "success",
          metadata: {
            location: hint,
          },
        });
      }
    })
    .finally(() => {
      locationHintPromise = null;
    });
};

const currentPath = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search || ""}`;
};

const baseEvent = () => {
  const cachedLocation = latestLocationHint || readCachedLocationHint();
  if (cachedLocation) {
    latestLocationHint = cachedLocation;
  }

  return {
    sourceApp: "MeraDevFrontend",
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
    path: currentPath(),
    referrer: safeText(document?.referrer, 320),
    metadata: {
      title: safeText(document?.title, 120),
      language: safeText(
        typeof navigator !== "undefined" ? navigator.language : "",
        40,
      ),
      viewport: `${window.innerWidth || 0}x${window.innerHeight || 0}`,
      timezone: resolveBrowserTimezone(),
      ...(cachedLocation ? { location: cachedLocation } : {}),
    },
  };
};

const normalizeEvent = (event = {}) => {
  const defaults = baseEvent();
  return {
    ...defaults,
    ...event,
    eventType: safeText(event.eventType || "custom", 40).toLowerCase(),
    status: safeText(event.status || "info", 20).toLowerCase(),
    path: safeText(event.path || currentPath(), 240),
    action: safeText(event.action, 180),
    category: safeText(event.category, 120),
    label: safeText(event.label, 240),
    metadata: {
      ...defaults.metadata,
      ...(event.metadata && typeof event.metadata === "object" ? event.metadata : {}),
    },
    occurredAt: new Date().toISOString(),
  };
};

export const configureAnalyticsBatchSender = (sender) => {
  analyticsBatchSender = typeof sender === "function" ? sender : null;
};

const sendBatch = async (events) => {
  if (!events.length) return true;

  const payload = JSON.stringify({ events });

  if (typeof navigator !== "undefined" && navigator.sendBeacon && document.visibilityState === "hidden") {
    const blob = new Blob([payload], { type: "application/json" });
    const sent = navigator.sendBeacon(EVENT_ENDPOINT, blob);
    return sent;
  }

  if (analyticsBatchSender) {
    const sentViaRedux = await analyticsBatchSender(events);
    return Boolean(sentViaRedux);
  }

  const response = await fetch(EVENT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
  return response.ok;
};

const flushQueue = async () => {
  if (isSending || !queue.length) return;

  isSending = true;
  const batch = queue.slice(0, MAX_BATCH_SIZE);
  queue = queue.slice(MAX_BATCH_SIZE);

  try {
    const sent = await sendBatch(batch);
    if (!sent) {
      queue = [...batch, ...queue].slice(0, MAX_QUEUE_SIZE);
    }
  } catch (_error) {
    queue = [...batch, ...queue].slice(0, MAX_QUEUE_SIZE);
  } finally {
    isSending = false;
    if (queue.length) {
      window.setTimeout(() => {
        flushQueue();
      }, 800);
    }
  }
};

const pushEvent = (event) => {
  queue.push(normalizeEvent(event));
  if (queue.length > MAX_QUEUE_SIZE) {
    queue = queue.slice(queue.length - MAX_QUEUE_SIZE);
  }
  if (queue.length >= MAX_BATCH_SIZE) {
    flushQueue();
  }
};

const pickClickTarget = (target) => {
  if (!target || typeof target.closest !== "function") return null;
  return target.closest(
    "a, button, input[type='button'], input[type='submit'], [role='button'], [data-analytics-label]",
  );
};

const describeClickTarget = (element) => {
  if (!element) return "Unknown click target";
  const explicitLabel = safeText(element.getAttribute?.("data-analytics-label"), 120);
  if (explicitLabel) return explicitLabel;
  const ariaLabel = safeText(element.getAttribute?.("aria-label"), 120);
  if (ariaLabel) return ariaLabel;
  const text = safeText(element.textContent, 120);
  if (text) return text;
  return safeText(element.tagName, 40) || "Unknown";
};

const attachGlobalListeners = () => {
  const onClick = (event) => {
    const clickable = pickClickTarget(event.target);
    if (!clickable) return;

    pushEvent({
      eventType: "click",
      category: "interaction",
      action: safeText(clickable.tagName, 40).toLowerCase(),
      label: describeClickTarget(clickable),
      metadata: {
        href: safeText(clickable.getAttribute?.("href"), 220),
      },
    });
  };

  const onError = (event) => {
    pushEvent({
      eventType: "error",
      status: "failed",
      category: "runtime",
      action: "window_error",
      label: safeText(event.message || "Unknown runtime error", 200),
      metadata: {
        file: safeText(event.filename, 200),
        line: Number(event.lineno) || 0,
        column: Number(event.colno) || 0,
      },
    });
  };

  const onRejection = (event) => {
    pushEvent({
      eventType: "error",
      status: "failed",
      category: "runtime",
      action: "promise_rejection",
      label: safeText(event.reason?.message || event.reason || "Unhandled promise rejection", 200),
    });
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      flushQueue();
    }
  };

  const onBeforeUnload = () => {
    flushQueue();
  };

  document.addEventListener("click", onClick, { capture: true, passive: true });
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeunload", onBeforeUnload);

  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("beforeunload", onBeforeUnload);
  };
};

const startFlushLoop = () => {
  if (flushTimer) return;
  flushTimer = window.setInterval(() => {
    flushQueue();
  }, FLUSH_INTERVAL_MS);
};

const stopFlushLoop = () => {
  if (!flushTimer) return;
  window.clearInterval(flushTimer);
  flushTimer = null;
};

const startHeartbeatLoop = () => {
  if (heartbeatTimer) return;
  heartbeatTimer = window.setInterval(() => {
    if (document.visibilityState === "hidden") return;
    trackFrontendEvent({
      eventType: "custom",
      category: "session",
      action: "heartbeat",
      status: "info",
    });
  }, HEARTBEAT_INTERVAL_MS);
};

const stopHeartbeatLoop = () => {
  if (!heartbeatTimer) return;
  window.clearInterval(heartbeatTimer);
  heartbeatTimer = null;
};

export const trackFrontendEvent = (event) => {
  if (typeof window === "undefined") return;
  pushEvent(event);
};

export const trackPageView = (path, metadata = {}) => {
  const safePath = safeText(path || currentPath(), 240);
  const now = Date.now();
  if (lastPageView.path === safePath && now - lastPageView.at < 600) {
    return;
  }
  lastPageView = {
    path: safePath,
    at: now,
  };

  trackFrontendEvent({
    eventType: "page_view",
    category: "navigation",
    action: "route_view",
    path: safePath,
    metadata,
  });
};

export const trackReduxAsyncLifecycle = ({
  actionType,
  lifecycle,
  status,
  errorMessage,
}) => {
  if (!actionType || !lifecycle) return;
  trackFrontendEvent({
    eventType: "api_call",
    category: "redux_async",
    action: safeText(actionType, 180),
    status,
    metadata: {
      endpoint: safeText(actionType, 180),
      lifecycle: safeText(lifecycle, 30),
      errorMessage: safeText(errorMessage, 220),
    },
  });
};

export const startWebAnalyticsTracking = () => {
  if (typeof window === "undefined") return () => {};

  trackerRefCount += 1;
  startFlushLoop();
  startHeartbeatLoop();
  warmupPreciseLocationHint();

  if (!detachListeners) {
    detachListeners = attachGlobalListeners();
    trackFrontendEvent({
      eventType: "session_start",
      category: "session",
      action: "session_start",
      status: "success",
    });
  }

  return () => {
    trackerRefCount = Math.max(0, trackerRefCount - 1);
    if (trackerRefCount > 0) return;

    if (detachListeners) {
      detachListeners();
      detachListeners = null;
    }
    stopFlushLoop();
    stopHeartbeatLoop();
    flushQueue();
  };
};
