import { API_URL } from "../config/api";

const STORAGE_KEYS = {
  visitorId: "meradev_analytics_visitor_id",
  sessionId: "meradev_analytics_session_id",
  sessionStartedAt: "meradev_analytics_session_started_at",
};

const EVENT_ENDPOINT = `${API_URL}/api/analytics/events`;
const MAX_BATCH_SIZE = 20;
const MAX_QUEUE_SIZE = 300;
const FLUSH_INTERVAL_MS = 5000;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 30000;

let queue = [];
let isSending = false;
let flushTimer = null;
let heartbeatTimer = null;
let trackerRefCount = 0;
let detachListeners = null;
let lastPageView = {
  path: "",
  at: 0,
};

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

const currentPath = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search || ""}`;
};

const baseEvent = () => ({
  sourceApp: "MeraDevFrontend",
  sessionId: getOrCreateSessionId(),
  visitorId: getOrCreateVisitorId(),
  path: currentPath(),
  referrer: safeText(document?.referrer, 320),
  metadata: {
    title: safeText(document?.title, 120),
    language: safeText(navigator?.language, 40),
    viewport: `${window.innerWidth || 0}x${window.innerHeight || 0}`,
  },
});

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

const sendBatch = async (events) => {
  if (!events.length) return true;

  const payload = JSON.stringify({ events });

  if (typeof navigator !== "undefined" && navigator.sendBeacon && document.visibilityState === "hidden") {
    const blob = new Blob([payload], { type: "application/json" });
    const sent = navigator.sendBeacon(EVENT_ENDPOINT, blob);
    return sent;
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
