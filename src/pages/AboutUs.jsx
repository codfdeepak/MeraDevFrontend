import { Link } from 'react-router-dom'
import PageFrame from '../components/PageFrame'

const ABOUT_STATS = [
  { label: 'Client Satisfaction Focus', value: '100%' },
  { label: 'Delivery Commitment', value: 'On-Time' },
  { label: 'Support Coverage', value: 'End-to-End' },
]

const CORE_SERVICES = [
  {
    title: 'E-Commerce Websites',
    description:
      'Complete e-commerce websites with catalog, cart, checkout, payments, and admin-ready management flow.',
  },
  {
    title: 'Business Websites',
    description:
      'Professional websites for all business categories, designed for trust, lead generation, and conversion.',
  },
  {
    title: 'Custom Web Applications',
    description:
      'Workflow-focused web applications tailored to your operations, with scalable architecture and clean UX.',
  },
  {
    title: 'WebView App Integration',
    description:
      'WebView-ready implementation for Android and iOS apps with optimized loading and stable interactions.',
  },
]

const DELIVERY_MODEL = [
  'Requirement discussion and scope clarity',
  'UI planning with business-focused structure',
  'Secure, fast, and scalable development',
  'Quality testing, launch, and handover support',
]

const QUALITY_PILLARS = [
  'Secure coding standards and data-safe implementation',
  'Performance-first builds for fast loading experience',
  'SEO-aware structure for discoverability and growth',
  'Clear communication and predictable milestone updates',
]

function AboutUs() {
  return (
    <PageFrame id="about-us-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="pill small">About Us</span>
        </div>
      </section>

      <section className="panel about-hero-panel">
        <div className="about-hero-copy">
          <span className="pill small">MeraDev Technologies</span>
          <h1>We build reliable digital products that help businesses grow with confidence.</h1>
          <p className="lede">
            We specialize in e-commerce websites, business websites, web applications, and WebView-ready solutions.
            Our approach is simple: strong planning, secure execution, fast performance, and on-time delivery.
          </p>

          <div className="about-stat-grid">
            {ABOUT_STATS.map((item) => (
              <div className="stat-card" key={item.label}>
                <div className="stat-value">{item.value}</div>
                <div className="muted">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="about-hero-highlight">
          <h2>Why businesses choose us</h2>
          <ul className="about-checklist">
            <li>Business-first strategy for practical outcomes</li>
            <li>High-quality execution without unnecessary delays</li>
            <li>Transparent communication from start to delivery</li>
            <li>Post-launch support for stability and growth</li>
          </ul>
        </aside>
      </section>

      <section className="panel about-services-panel">
        <div className="panel-head">
          <h2>Core Services</h2>
          <span className="pill small">Solutions</span>
        </div>
        <div className="about-service-grid">
          {CORE_SERVICES.map((service) => (
            <article className="about-service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p className="muted">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel about-process-panel">
          <div className="panel-head">
            <h2>How We Deliver</h2>
            <span className="pill small">Process</span>
          </div>
          <ol className="about-process-list">
            {DELIVERY_MODEL.map((step, index) => (
              <li key={step} className="about-process-item">
                <span className="about-process-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="panel about-quality-panel">
          <div className="panel-head">
            <h2>Quality Standards</h2>
            <span className="pill small">Assurance</span>
          </div>
          <ul className="about-checklist">
            {QUALITY_PILLARS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel about-cta-panel">
        <h2>Ready to start your project?</h2>
        <p className="lede">
          Share your business goal and timeline with us. We will provide a clear plan and execution approach tailored
          to your requirement.
        </p>
        <div className="cta-row">
          <Link className="cta primary" to="/services">
            Explore Services
          </Link>
          <Link className="cta outline" to="/contact-us">
            Contact Us
          </Link>
        </div>
      </section>
    </PageFrame>
  )
}

export default AboutUs
