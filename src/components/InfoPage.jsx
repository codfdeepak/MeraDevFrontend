import { Link } from 'react-router-dom'
import PageFrame from './PageFrame'

function InfoPage({ title, label, description }) {
  return (
    <PageFrame>
      <section className="panel simple-page">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="pill small">{label}</span>
        </div>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
        <div className="cta-row">
          <Link className="cta primary" to="/">
            Go to Home
          </Link>
          <Link className="cta outline" to="/contact-us">
            Contact Us
          </Link>
        </div>
      </section>
    </PageFrame>
  )
}

export default InfoPage
