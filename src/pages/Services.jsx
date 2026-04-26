import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ecommerceServiceImage from '../assets/ecommerce-service.svg'
import ConsultationModal from '../components/ConsultationModal'
import PageFrame from '../components/PageFrame'
import ServiceCategoryIcon from '../components/ServiceCategoryIcon'
import { selectServices, selectServicesError, selectServicesStatus } from '../Redux/slices/serviceSlice'
import { fetchPublicServices } from '../Redux/thunks/serviceThunks'
import {
  getServiceCategoryCountMap,
  mapServicesToCards,
  SERVICE_CATEGORY_OPTIONS,
} from '../utils/serviceCatalog'

function Services({ embedded = false }) {
  const dispatch = useDispatch()
  const services = useSelector(selectServices)
  const status = useSelector(selectServicesStatus)
  const error = useSelector(selectServicesError)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublicServices())
    }
  }, [dispatch, status])

  const allServices = useMemo(
    () => mapServicesToCards(services, ecommerceServiceImage),
    [services],
  )

  const categoryCounts = useMemo(() => getServiceCategoryCountMap(allServices), [allServices])

  const categoryCards = useMemo(
    () =>
      SERVICE_CATEGORY_OPTIONS.map((item) => ({
        ...item,
        count: categoryCounts[item.key] || 0,
        bullets: [item.description, ...(Array.isArray(item.highlights) ? item.highlights : [])]
          .map((line) => String(line || '').trim())
          .filter((line, index, lines) => line && lines.findIndex((entry) => entry.toLowerCase() === line.toLowerCase()) === index)
          .slice(0, 4),
      })),
    [categoryCounts],
  )

  const deliveryPromises = [
    'On-time product delivery with clear milestones',
    'Secure development for websites and software products',
    'Performance-focused builds with SEO-ready architecture',
  ]

  const openConsultationForm = () => {
    setIsConsultationOpen(true)
  }

  const servicesContent = (
    <>
      {!embedded && (
        <section className="panel service-details-top">
          <div className="service-details-nav">
            <Link className="pill small profile-back-link" to="/">
              ← Back to Home
            </Link>
            <span className="pill small">Services</span>
          </div>
        </section>
      )}

      <section className="panel services-hero-panel">
        <div className="services-hero-copy">
          <h1>Our Services</h1>
          <p className="lede">
            We provide reliable digital solutions that help businesses launch faster, operate better, and grow with
            confidence. We ensure on-time product delivery and secure services, and every website or software product
            we build is developed with strong security standards.
          </p>
        </div>

        <aside className="services-trust-card" aria-label="Delivery and security promise">
          <h2>Delivery & Security Promise</h2>
          <ul className="services-trust-list">
            {deliveryPromises.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
          <button className="cta primary cta-btn" type="button" onClick={openConsultationForm}>
            Get Free Consultation
          </button>
        </aside>
      </section>

      <section className="panel services-category-panel">
        <div className="services-category-grid" aria-label="Service categories">
          {categoryCards.map((category) => (
            <Link
              key={category.key}
              className="services-category-card services-category-card-link"
              to={`/services/category/${category.key}`}
            >
              <span className="services-category-icon" aria-hidden="true">
                <ServiceCategoryIcon kind={category.icon} />
              </span>
              <strong>{category.label}</strong>
              <ul className="services-category-bullets">
                {category.bullets.map((line) => (
                  <li key={`${category.key}-${line}`}>{line}</li>
                ))}
              </ul>
              <div className="services-category-meta">
                <span className="services-category-count">{category.count} service{category.count === 1 ? '' : 's'}</span>
                <span className="services-category-cta">Open Page →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="web-services-panel">
        {status === 'loading' && <p className="muted">Loading latest services...</p>}
        {status === 'error' && <p className="muted">Unable to load services right now. {error}</p>}
        {status === 'loaded' && allServices.length === 0 && (
          <article className="web-service-empty">
            <p className="muted">No services published yet. Please check back soon.</p>
          </article>
        )}
      </section>

      {isConsultationOpen && (
        <ConsultationModal
          onClose={() => setIsConsultationOpen(false)}
          defaultServiceName=""
        />
      )}
    </>
  )

  if (embedded) {
    return <div id="services-page">{servicesContent}</div>
  }

  return <PageFrame id="services-page">{servicesContent}</PageFrame>
}

export default Services
