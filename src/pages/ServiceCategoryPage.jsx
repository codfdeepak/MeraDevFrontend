import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import ConsultationModal from '../components/ConsultationModal'
import PageFrame from '../components/PageFrame'
import ServiceCategoryIcon from '../components/ServiceCategoryIcon'
import { selectServices, selectServicesError, selectServicesStatus } from '../Redux/slices/serviceSlice'
import { fetchPublicServices } from '../Redux/thunks/serviceThunks'
import {
  getServiceCategoryByKey,
  getServiceCategoryCountMap,
  mapServicesToCards,
  SERVICE_CATEGORY_OPTIONS,
} from '../utils/serviceCatalog'

function ServiceCategoryPage() {
  const { categoryKey } = useParams()
  const dispatch = useDispatch()
  const services = useSelector(selectServices)
  const status = useSelector(selectServicesStatus)
  const error = useSelector(selectServicesError)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const [selectedServiceName, setSelectedServiceName] = useState('')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublicServices())
    }
  }, [dispatch, status])

  const activeCategory = useMemo(() => getServiceCategoryByKey(categoryKey), [categoryKey])

  const allServices = useMemo(
    () => mapServicesToCards(services),
    [services],
  )

  const categoryCounts = useMemo(() => getServiceCategoryCountMap(allServices), [allServices])

  const categoryCards = useMemo(
    () =>
      SERVICE_CATEGORY_OPTIONS.map((item) => ({
        ...item,
        count: categoryCounts[item.key] || 0,
      })),
    [categoryCounts],
  )

  const filteredServices = useMemo(() => {
    if (!activeCategory) return []
    return allServices.filter((service) => service.category === activeCategory.key)
  }, [activeCategory, allServices])

  const openConsultationForm = (serviceName = '') => {
    setSelectedServiceName(serviceName)
    setIsConsultationOpen(true)
  }

  if (!activeCategory) {
    return <Navigate to="/services" replace />
  }

  return (
    <PageFrame id="service-category-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/services">
            ← Back to Services
          </Link>
          <span className="pill small">{activeCategory.label}</span>
        </div>
      </section>

      <section className="panel service-category-hero">
        <div className="service-category-title">
          <span className="services-category-icon" aria-hidden="true">
            <ServiceCategoryIcon kind={activeCategory.icon} />
          </span>
          <div>
            <h1>{activeCategory.label}</h1>
            <p className="muted">{activeCategory.description}</p>
          </div>
        </div>

        <div className="service-category-switch" aria-label="Service categories">
          {categoryCards.map((category) => (
            <Link
              key={category.key}
              className={`service-category-switch-link ${category.key === activeCategory.key ? 'active' : ''}`}
              to={`/services/category/${category.key}`}
            >
              {category.label}
              <small>{category.count} service{category.count === 1 ? '' : 's'}</small>
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
            <button className="cta primary cta-btn" type="button" onClick={() => openConsultationForm('')}>
              Get Free Consultation
            </button>
          </article>
        )}

        {status === 'loaded' && allServices.length > 0 && filteredServices.length === 0 && (
          <article className="web-service-empty">
            <p className="muted">No services available in this category right now.</p>
          </article>
        )}

        {status === 'loaded' && filteredServices.length > 0 && (
          <>
            <div className="web-services-head">
              <div>
                <h2>{activeCategory.label}</h2>
                <p className="muted">{activeCategory.description}</p>
              </div>
              <span className="pill small">
                {filteredServices.length} Service{filteredServices.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="web-service-grid category-service-grid">
              {filteredServices.map((service, index) => {
                const serviceNumber = String(index + 1).padStart(2, '0')

                return (
                  <article
                    className="web-service-card category-service-card"
                    key={service.id || `${service.title}-${serviceNumber}`}
                  >
                    <div className="web-service-content category-service-content">
                      <div className="category-service-top">
                        <h3 className="category-service-title-inline">{service.title}</h3>
                        <div className="category-service-badges">
                          <span className="pill small category-service-id">Service {serviceNumber}</span>
                        </div>
                      </div>
                      <div className="category-service-headline">
                        <p className="muted web-service-summary category-service-summary">{service.summary}</p>
                      </div>
                      <ul className="web-service-points category-service-points">
                        {service.points.map((point, pointIndex) => (
                          <li key={`${serviceNumber}-point-${pointIndex}`}>{point}</li>
                        ))}
                      </ul>

                      <div className="service-card-actions category-service-actions">
                        <button
                          className="cta primary cta-btn"
                          type="button"
                          onClick={() => openConsultationForm(service.title)}
                        >
                          Get Free Consultation
                        </button>
                        {service.id ? (
                          <Link className="cta outline category-learn-more" to={`/services/${service.id}`}>
                            <span>Learn More</span>
                            <span className="category-learn-more-icon" aria-hidden="true">↗</span>
                          </Link>
                        ) : (
                          <span className="cta outline category-learn-more disabled">
                            <span>Learn More</span>
                            <span className="category-learn-more-icon" aria-hidden="true">↗</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </section>

      {isConsultationOpen && (
        <ConsultationModal
          onClose={() => setIsConsultationOpen(false)}
          defaultServiceName={selectedServiceName}
        />
      )}
    </PageFrame>
  )
}

export default ServiceCategoryPage
