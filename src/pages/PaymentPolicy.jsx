import { Link } from 'react-router-dom'
import PageFrame from '../components/PageFrame'

const PAYMENT_STEPS = [
  {
    title: 'Step 1: Order Confirmation Advance',
    timing: 'At order registration',
    summary:
      'At the time of confirming your project or service, total payment is divided into three parts. The first part is paid during booking to lock the order and formally start execution.',
    value: 'Part 1 / 3',
  },
  {
    title: 'Step 2: Delivery Stage Payment',
    timing: 'At delivery stage',
    summary:
      'When the agreed service or project build is delivered as per scope, the second payment part is collected. This keeps progress transparent and milestones aligned.',
    value: 'Part 2 / 3',
  },
  {
    title: 'Step 3: Final Handover Payment',
    timing: 'After testing success and handover',
    summary:
      'Once testing is completed successfully and full handover is done, the final payment is collected. This ensures confidence and complete closure on both sides.',
    value: 'Part 3 / 3',
  },
]

const POLICY_POINTS = [
  'Payment is always split in 3 clear milestones for trust and clarity.',
  'Work starts only after order confirmation and initial advance.',
  'Each payment stage is connected with project progress and delivery.',
  'Final settlement is taken only after successful testing and complete handover.',
]

function PaymentPolicy() {
  return (
    <PageFrame id="payment-policy-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="pill small">Payment Policy</span>
        </div>
      </section>

      <section className="panel payment-policy-hero">
        <div className="payment-policy-copy">
          <span className="pill small">Transparent Billing Framework</span>
          <h1>Our payment policy follows a 3-stage structure for trust and accountability.</h1>
          <p className="lede">
            Whenever a customer confirms a service or project, we divide the total amount into three structured
            payments. This approach keeps delivery smooth, reduces confusion, and protects both client and team.
          </p>
        </div>

        <aside className="payment-policy-highlight">
          <h2>Why this model works</h2>
          <ul className="payment-policy-list">
            <li>Clear financial milestones from start to handover</li>
            <li>Mutual trust with documented progress stages</li>
            <li>Project momentum without payment ambiguity</li>
            <li>Final payment only after successful testing</li>
          </ul>
        </aside>
      </section>

      <section className="panel payment-steps-panel">
        <div className="panel-head">
          <h2>3-Step Payment Flow</h2>
          <span className="pill small">Structured Process</span>
        </div>

        <div className="payment-step-grid">
          {PAYMENT_STEPS.map((step, index) => (
            <article className="payment-step-card" key={step.title}>
              <div className="payment-step-top">
                <span className="payment-step-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="pill micro">{step.value}</span>
              </div>
              <h3>{step.title}</h3>
              <p className="muted payment-step-timing">{step.timing}</p>
              <p className="muted">{step.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel payment-policy-panel">
          <div className="panel-head">
            <h2>Policy Notes</h2>
            <span className="pill small">Important</span>
          </div>
          <ul className="payment-policy-list">
            {POLICY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="panel payment-policy-cta">
          <div className="panel-head">
            <h2>Need project estimate?</h2>
            <span className="pill small">Get Started</span>
          </div>
          <p className="muted">
            Share your requirement and we will provide a scope-based plan with timeline and payment milestones before
            project start.
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

export default PaymentPolicy
