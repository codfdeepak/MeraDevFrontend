import { Link } from 'react-router-dom'
import PageFrame from '../components/PageFrame'

const CONTACT_CHANNELS = [
  {
    title: 'Email',
    tone: 'email',
    value: 'codfdeepak@gmail.com',
    href: 'mailto:codfdeepak@gmail.com',
    note: 'Best for project briefs, documents, and detailed requirements.',
  },
  {
    title: 'Phone',
    tone: 'phone',
    value: '+91 95019 24299',
    href: 'tel:+919501924299',
    note: 'Quick call for urgent requirements and direct discussion.',
  },
  {
    title: 'WhatsApp',
    tone: 'whatsapp',
    value: 'Start WhatsApp Chat',
    href: 'https://wa.me/919501924299',
    external: true,
    note: 'Fast updates, follow-ups, and project communication.',
  },
]

const DELIVERY_COMMITMENTS = [
  'Clear communication from discussion to final handover',
  'Secure and performance-focused implementation standards',
  'Milestone-based progress with predictable timelines',
  'On-time delivery with post-launch support availability',
]

const PROJECT_FLOW = [
  'Share your requirement and business goal',
  'Receive solution plan with timeline and scope',
  'Start execution with regular updates and reviews',
  'Final delivery, launch support, and handover',
]

function ContactUs() {
  return (
    <PageFrame id="contact-us-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="pill small">Contact Us</span>
        </div>
      </section>

      <section className="panel contact-hero-panel">
        <div className="contact-hero-copy">
          <span className="pill small">Let&apos;s build your next project</span>
          <h1>Talk to us about your website, web app, or e-commerce idea.</h1>
          <p className="lede">
            Share your goal, timeline, and key requirements. We provide a practical execution plan focused on secure
            development, fast performance, and reliable delivery.
          </p>

          <div className="contact-hero-actions">
            <a className="cta primary" href="mailto:codfdeepak@gmail.com">
              Email Us
            </a>
            <a className="cta outline" href="https://wa.me/919501924299" target="_blank" rel="noreferrer">
              WhatsApp Chat
            </a>
          </div>
        </div>

        <aside className="contact-hero-highlight">
          <h2>Response Promise</h2>
          <ul className="contact-checklist">
            <li>Initial response within one business day</li>
            <li>Transparent quote and realistic timeline</li>
            <li>No hidden process, clear next steps</li>
            <li>Project-first support from start to launch</li>
          </ul>
        </aside>
      </section>

      <section className="panel contact-channels-panel">
        <div className="panel-head">
          <h2>Direct Contact Channels</h2>
          <span className="pill small">Reach Us</span>
        </div>
        <div className="contact-channel-grid">
          {CONTACT_CHANNELS.map((channel) => (
            <article className={`contact-channel-card contact-channel-card-${channel.tone}`} key={channel.title}>
              <span className="pill small contact-channel-pill">{channel.title}</span>
              <a
                className="contact-channel-link"
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noreferrer' : undefined}
              >
                {channel.value}
              </a>
              <p className="muted">{channel.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel contact-delivery-panel">
          <div className="panel-head">
            <h2>Delivery Standards</h2>
            <span className="pill small">Quality</span>
          </div>
          <ul className="contact-checklist">
            {DELIVERY_COMMITMENTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="panel contact-flow-panel">
          <div className="panel-head">
            <h2>How We Start</h2>
            <span className="pill small">Process</span>
          </div>
          <ol className="contact-flow-list">
            {PROJECT_FLOW.map((step, index) => (
              <li className="contact-flow-item" key={step}>
                <span className="contact-flow-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="panel contact-cta-panel">
        <h2>Need a quick project discussion?</h2>
        <p className="lede">
          Reach out now and we will guide you with the right technical direction, timeline estimate, and development
          plan for your business.
        </p>
        <div className="cta-row">
          <a className="cta primary" href="tel:+919501924299">
            Call Now
          </a>
          <Link className="cta outline" to="/services">
            View Services
          </Link>
        </div>
      </section>
    </PageFrame>
  )
}

export default ContactUs
