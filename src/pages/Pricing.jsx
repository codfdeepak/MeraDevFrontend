import { Link } from 'react-router-dom'
import PageFrame from '../components/PageFrame'

const PRICING_PLANS = [
  {
    title: 'WebView Integration',
    price: 'Under ₹5,000',
    summary:
      'Suitable for Android and iOS WebView setup where your website is packaged as an app shell with required basic configuration.',
  },
  {
    title: 'Static Website',
    price: 'Under ₹20,000',
    summary:
      'Best for brochure websites, startup landing pages, and businesses that need a clean web presence with faster launch time.',
  },
  {
    title: 'Dynamic Website',
    price: '₹34,999 - ₹74,999',
    summary:
      'Ideal for businesses that need admin panels, custom forms, content updates, and interactive workflows with scalable architecture.',
  },
  {
    title: 'Premium Website',
    price: 'From ₹79,999',
    summary:
      'Designed for advanced business requirements including complex features, integrations, performance optimization, and premium UI.',
  },
]

const PRICING_NOTES = [
  'These are base pricing ranges for initial planning.',
  'Final cost depends on features, integrations, and overall project scope.',
  'A detailed estimate is shared after requirement discussion.',
]

function Pricing() {
  return (
    <PageFrame id="pricing-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="pill small">Pricing</span>
        </div>
      </section>

      <section className="panel payment-policy-hero">
        <div className="payment-policy-copy">
          <span className="pill small">Website Pricing</span>
          <h1>We offer Static, Dynamic and Premium websites.</h1>
          <p className="lede">
            Transparent base pricing to help you pick the right website package for your business goals and delivery
            timeline.
          </p>
        </div>

        <aside className="payment-policy-highlight">
          <h2>Base Pricing</h2>
          <ul className="payment-policy-list">
            <li>WebView integration: under ₹5,000</li>
            <li>Static websites: under ₹20,000</li>
            <li>Dynamic websites: ₹34,999 - ₹74,999</li>
            <li>Premium websites: from ₹79,999</li>
          </ul>
        </aside>
      </section>

      <section className="panel payment-steps-panel">
        <div className="panel-head">
          <h2>Pricing Plans</h2>
          <span className="pill small">Base Packages</span>
        </div>

        <div className="payment-step-grid">
          {PRICING_PLANS.map((plan, index) => (
            <article className="payment-step-card" key={plan.title}>
              <div className="payment-step-top">
                <span className="payment-step-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="pill micro">{plan.price}</span>
              </div>
              <h3>{plan.title}</h3>
              <p className="muted payment-step-timing">{plan.price}</p>
              <p className="muted">{plan.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel payment-policy-panel">
          <div className="panel-head">
            <h2>Pricing Notes</h2>
            <span className="pill small">Important</span>
          </div>
          <ul className="payment-policy-list">
            {PRICING_NOTES.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="panel payment-policy-cta">
          <div className="panel-head">
            <h2>Need exact quote?</h2>
            <span className="pill small">Get Estimate</span>
          </div>
          <p className="muted">
            Share your requirement and we will provide a detailed pricing estimate based on your exact scope and
            feature set.
          </p>
          <div className="cta-row">
            <Link className="cta primary" to="/contact-us">
              Talk to Us
            </Link>
            <Link className="cta outline" to="/services">
              View Services
            </Link>
          </div>
        </article>
      </section>
    </PageFrame>
  )
}

export default Pricing
