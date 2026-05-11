import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectHeroSlides, selectHeroStatus } from "../Redux/slices/heroSlice";
import { fetchPublicHeroSlides } from "../Redux/thunks/heroThunks";
import heroImage from "../assets/hero.png";

const FALLBACK_HERO_SLIDES = [
  {
    _id: "fallback-slide-1",
    image: heroImage,
    title: "We build scalable software solutions that drive measurable business growth.",
    text: "From product strategy and UX to architecture and engineering, we deliver production-ready systems at speed while ensuring long-term maintainability.",
  },
];

const HERO_SLIDE_DELAY_MS = 10000;
const HERO_SWIPE_THRESHOLD_PX = 56;
const HERO_CAPABILITIES = [
  "Web Platforms",
  "SaaS Products",
  "Cloud Deployment",
];
const HERO_HIGHLIGHTS = [
  { value: "100+", label: "Live Products Delivered" },
  { value: "15+", label: "Senior Dev Specialists" },
  { value: "3+", label: "Years in Client Delivery" },
];
const HERO_MEDIA_DETAILS = [
  { label: "Delivery Focus", value: "Management & Product Websites" },
  { label: "Tech Stack", value: "React • Node • AWS" },
];
const HERO_WHATSAPP_NUMBER = "919501924299";
const HERO_WHATSAPP_BASE_URL = `https://wa.me/${HERO_WHATSAPP_NUMBER}`;
const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));
const isInteractiveElement = (target) =>
  Boolean(target && typeof target.closest === "function" && target.closest("a, button, input, textarea, select, label"));

const sanitizeSlideTitle = (title = "", index = 0) => {
  const cleanedTitle = String(title)
    .replace(/^featured[\s:-]*/i, "")
    .trim();
  return cleanedTitle || `Software Delivery Track ${index + 1}`;
};

const normalizeSlide = (slide = {}, index = 0) => ({
  _id: slide?._id || "",
  image: String(slide?.image || "").trim(),
  title: sanitizeSlideTitle(slide?.title, index),
  text: String(slide?.description || slide?.text || "").trim(),
});

function Hero({ onDiscuss }) {
  const dispatch = useDispatch();
  const storedSlides = useSelector(selectHeroSlides);
  const heroStatus = useSelector(selectHeroStatus);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const dragStartXRef = useRef(null);
  const dragMovedRef = useRef(false);
  const mouseDragActiveRef = useRef(false);
  const clearDragFlagTimerRef = useRef(null);

  useEffect(() => {
    if (heroStatus === "idle") {
      dispatch(fetchPublicHeroSlides());
    }
  }, [dispatch, heroStatus]);

  const slides = useMemo(() => {
    const normalized = (storedSlides || [])
      .map((slide, index) => normalizeSlide(slide, index))
      .filter((slide) => slide.image && slide.title && slide.text);

    return normalized.length ? normalized : FALLBACK_HERO_SLIDES;
  }, [storedSlides]);

  useEffect(() => {
    setActiveIndex(0);
    setPreviousIndex(0);
  }, [slides.length]);

  const hasMultipleSlides = slides.length > 1;

  const goToNextSlide = useCallback(() => {
    if (!hasMultipleSlides) return;
    setActiveIndex((current) => {
      const nextIndex = (current + 1) % slides.length;
      setPreviousIndex(current);
      return nextIndex;
    });
  }, [hasMultipleSlides, slides.length]);

  const goToPreviousSlide = useCallback(() => {
    if (!hasMultipleSlides) return;
    setActiveIndex((current) => {
      const nextIndex = (current - 1 + slides.length) % slides.length;
      setPreviousIndex(current);
      return nextIndex;
    });
  }, [hasMultipleSlides, slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides) return undefined;

    const timer = window.setInterval(() => {
      goToNextSlide();
    }, HERO_SLIDE_DELAY_MS);

    return () => window.clearInterval(timer);
  }, [goToNextSlide, hasMultipleSlides]);

  useEffect(() => {
    return () => {
      if (clearDragFlagTimerRef.current) {
        window.clearTimeout(clearDragFlagTimerRef.current);
      }
    };
  }, []);

  const beginDrag = useCallback((clientX) => {
    dragStartXRef.current = clientX;
    dragMovedRef.current = false;
  }, []);

  const trackDrag = useCallback((clientX) => {
    if (dragStartXRef.current === null) return;
    if (Math.abs(clientX - dragStartXRef.current) > 8) {
      dragMovedRef.current = true;
    }
  }, []);

  const endDrag = useCallback((clientX) => {
    if (dragStartXRef.current === null) return;

    const dragDistance = clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (!dragMovedRef.current || Math.abs(dragDistance) < HERO_SWIPE_THRESHOLD_PX) {
      dragMovedRef.current = false;
      return;
    }

    if (dragDistance < 0) {
      goToNextSlide();
    } else {
      goToPreviousSlide();
    }

    if (clearDragFlagTimerRef.current) {
      window.clearTimeout(clearDragFlagTimerRef.current);
    }
    clearDragFlagTimerRef.current = window.setTimeout(() => {
      dragMovedRef.current = false;
      clearDragFlagTimerRef.current = null;
    }, 0);
  }, [goToNextSlide, goToPreviousSlide]);

  const resetDrag = useCallback(() => {
    dragStartXRef.current = null;
    dragMovedRef.current = false;
    mouseDragActiveRef.current = false;
    if (clearDragFlagTimerRef.current) {
      window.clearTimeout(clearDragFlagTimerRef.current);
      clearDragFlagTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!hasMultipleSlides) return undefined;

    const handleWindowMouseMove = (event) => {
      if (!mouseDragActiveRef.current) return;
      trackDrag(event.clientX);
    };

    const handleWindowMouseUp = (event) => {
      if (!mouseDragActiveRef.current) return;
      mouseDragActiveRef.current = false;
      endDrag(event.clientX);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [endDrag, hasMultipleSlides, trackDrag]);

  const handleMouseDown = (event) => {
    if (!hasMultipleSlides) return;
    if (event.button !== 0) return;
    if (isInteractiveElement(event.target)) return;

    mouseDragActiveRef.current = true;
    beginDrag(event.clientX);
  };

  const handleTouchStart = (event) => {
    if (!hasMultipleSlides) return;
    if (isInteractiveElement(event.target)) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    beginDrag(touch.clientX);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    trackDrag(touch.clientX);
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) {
      resetDrag();
      return;
    }
    endDrag(touch.clientX);
  };

  const handleTouchCancel = () => {
    resetDrag();
  };

  const handleNativeDragStart = (event) => {
    if (!hasMultipleSlides) return;
    event.preventDefault();
  };

  const handleSliderClickCapture = (event) => {
    if (!dragMovedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragMovedRef.current = false;
  };

  const setSlideByDot = (nextIndex) => {
    if (nextIndex === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
  };

  const getWhatsAppLink = (slideTitle) => {
    const message = `Hi, I want to discuss a project about: ${slideTitle}`;
    return `${HERO_WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  };

  const getHeroTitleSizing = (slideTitle = "") => {
    const titleLength = String(slideTitle).trim().length;
    const overflowChars = Math.max(0, titleLength - 46);
    const titleScale = clampNumber(1 - overflowChars * 0.0064, 0.68, 1);
    const titleMaxCh = clampNumber(Math.round(15 + overflowChars * 0.2), 15, 26);

    return {
      "--hero-title-scale": Number(titleScale.toFixed(3)),
      "--hero-title-max-ch": titleMaxCh,
    };
  };

  const getHeroDescriptionSizing = (slideText = "") => {
    const textLength = String(slideText).trim().length;
    const overflowChars = Math.max(0, textLength - 110);
    const descriptionScale = clampNumber(1 - overflowChars * 0.0016, 0.72, 1);
    const descriptionLineHeight = clampNumber(1.62 - overflowChars * 0.0009, 1.34, 1.62);

    return {
      "--hero-description-scale": Number(descriptionScale.toFixed(3)),
      "--hero-description-line-height": Number(descriptionLineHeight.toFixed(2)),
    };
  };

  return (
    <section
      className={`hero-slider ${hasMultipleSlides ? "is-draggable" : ""}`}
      aria-label="Hero slider"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onDragStart={handleNativeDragStart}
      onClickCapture={handleSliderClickCapture}
    >
      {slides.map((slide, index) => (
        <article
          key={slide._id || `${slide.title}-${index}`}
          className={`hero-slide split-slide ${
            index === activeIndex
              ? "active is-entering"
              : index === previousIndex
                ? "is-exiting"
                : "is-hidden"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <div className="hero-split-layout">
            <div className="hero-copy-pane">
              <div className="hero-overlay split-overlay">
                <h2 className="hero-title" style={getHeroTitleSizing(slide.title)}>
                  {slide.title}
                </h2>
                <p className="hero-description" style={getHeroDescriptionSizing(slide.text)}>
                  {slide.text}
                </p>
                <div className="hero-capability-row" aria-hidden="true">
                  {HERO_CAPABILITIES.map((capability) => (
                    <span key={capability} className="hero-capability-chip">
                      {capability}
                    </span>
                  ))}
                </div>
                <div className="hero-metrics" aria-label="Team highlights">
                  {HERO_HIGHLIGHTS.map((metric) => (
                    <div className="hero-metric" key={metric.label}>
                      <span className="hero-metric-value">{metric.value}</span>
                      <span className="hero-metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-actions">
                  <button
                    className="cta cta-btn hero-discuss-btn"
                    type="button"
                    onClick={() => onDiscuss?.(slide.title)}
                  >
                    Discuss with us
                  </button>
                  <a
                    className="cta hero-whatsapp-btn"
                    href={getWhatsAppLink(slide.title)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Chat on WhatsApp"
                  >
                    WhatsApp
                  </a>
                  <Link className="cta hero-view-work-btn" to="/projects">
                    View Work
                  </Link>
                </div>
              </div>
            </div>
            <div className="hero-media-pane">
              <div className="hero-media-card">
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={index === activeIndex ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
              <div className="hero-media-meta" aria-hidden="true">
                {HERO_MEDIA_DETAILS.map((detail) => (
                  <div className="hero-media-meta-card" key={detail.label}>
                    <span className="hero-media-meta-label">
                      {detail.label}
                    </span>
                    <span className="hero-media-meta-value">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={`${slide._id || slide.title}-dot-${index}`}
            className={`hero-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => setSlideByDot(index)}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
