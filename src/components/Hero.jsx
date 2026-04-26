import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectHeroSlides, selectHeroStatus } from "../Redux/slices/heroSlice";
import { fetchPublicHeroSlides } from "../Redux/thunks/heroThunks";
import heroImage from "../assets/hero.png";

const FALLBACK_HERO_SLIDES = [
  {
    _id: "fallback-slide-1",
    image: heroImage,
    title: "We engineer software products that scale with your business.",
    text: "Strategy, UI, architecture, and development aligned to ship fast and stay maintainable in production.",
  },
  {
    _id: "fallback-slide-2",
    image: heroImage,
    title:
      "From MVP to enterprise systems, we build for speed and reliability.",
    text: "Modern web stack, automation-ready workflows, and clean code practices built around real business outcomes.",
  },
];

const HERO_SLIDE_DELAY_MS = 10000;
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

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % slides.length;
        setPreviousIndex(current);
        return nextIndex;
      });
    }, HERO_SLIDE_DELAY_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const setSlideByDot = (nextIndex) => {
    if (nextIndex === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
  };

  const getWhatsAppLink = (slideTitle) => {
    const message = `Hi, I want to discuss a project about: ${slideTitle}`;
    return `${HERO_WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="hero-slider" aria-label="Hero slider">
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
                <h2>{slide.title}</h2>
                <p className="hero-description">{slide.text}</p>
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
