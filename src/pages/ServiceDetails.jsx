import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import ConsultationModal from '../components/ConsultationModal'
import PageFrame from '../components/PageFrame'
import ecommerceServiceImage from '../assets/ecommerce-service.svg'
import {
  selectActiveService,
  selectServiceDetailError,
  selectServiceDetailStatus,
} from '../Redux/slices/serviceSlice'
import { fetchPublicServiceById } from '../Redux/thunks/serviceThunks'
import { getServiceSections } from '../utils/serviceCatalog'

function ServiceDetails() {
  const { serviceId } = useParams()
  const dispatch = useDispatch()
  const service = useSelector(selectActiveService)
  const status = useSelector(selectServiceDetailStatus)
  const error = useSelector(selectServiceDetailError)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchPublicServiceById(serviceId))
    }
  }, [dispatch, serviceId])

  const contentSections = getServiceSections(service)
  const serviceSummary = String(service?.description || '').trim() || contentSections[0]?.description || ''
  const totalBulletPoints = contentSections.reduce(
    (sum, section) => sum + (Array.isArray(section?.bulletPoints) ? section.bulletPoints.length : 0),
    0,
  )

  return (
    <PageFrame id="service-details-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/services">
            ← Back to Services
          </Link>
          <span className="pill small">Service Details</span>
        </div>
      </section>

      {status === 'loading' && (
        <section className="panel">
          <p className="muted">Loading service details...</p>
        </section>
      )}

      {status === 'error' && (
        <section className="panel">
          <p className="muted">Unable to load service details. {error}</p>
        </section>
      )}

      {status === 'loaded' && !service && (
        <section className="panel">
          <p className="muted">Service not found.</p>
        </section>
      )}

      {service && (
        <>
          <section className="panel service-details-hero service-details-hero-text-only">
            <div className="service-details-copy service-details-copy-full">
              <div className="service-details-meta-row">
                <span className="pill small">Detailed View</span>
                <span className="service-details-kpi">{contentSections.length} Sections</span>
                <span className="service-details-kpi">{totalBulletPoints} Key Points</span>
              </div>
              <h1>{service.name || 'Service'}</h1>
              <p className="muted">{serviceSummary || 'Service details will be added soon.'}</p>

              <div className="service-details-actions">
                <button
                  className="cta primary cta-btn"
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                >
                  Get Free Consultation
                </button>
              </div>
            </div>
          </section>

          <section className="panel service-detail-sections-panel">
            <div className="panel-head service-detail-sections-head">
              <h2>Service Content Sections</h2>
              <span className="pill small">{contentSections.length} Sections</span>
            </div>

            {contentSections.length === 0 && <p className="muted">No sections published for this service yet.</p>}

            {contentSections.length > 0 && (
              <div className="service-detail-sections">
                {contentSections.map((section, index) => (
                  <article className="service-detail-section" key={`service-section-${index}`}>
                    <div className="service-detail-section-media">
                      <span className="service-section-index">Section {String(index + 1).padStart(2, '0')}</span>
                      <img
                        src={section.image || ecommerceServiceImage}
                        alt={`${service.name || 'Service'} section ${index + 1}`}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = ecommerceServiceImage
                        }}
                      />
                    </div>
                    <div className="service-detail-section-copy">
                      <span className="pill small">Section {index + 1}</span>
                      <p className="muted service-detail-description">
                        {section.description || 'Section description not available yet.'}
                      </p>

                      {section.bulletPoints.length > 0 && (
                        <ul className="service-details-bullets">
                          {section.bulletPoints.map((point, pointIndex) => (
                            <li key={`detail-point-${index}-${pointIndex}`}>{point}</li>
                          ))}
                        </ul>
                      )}

                      {section.bulletPoints.length === 0 && (
                        <p className="muted service-detail-empty-points">Detailed bullet points will be added here.</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {isConsultationOpen && (
        <ConsultationModal
          onClose={() => setIsConsultationOpen(false)}
          defaultServiceName={service?.name || ''}
        />
      )}
    </PageFrame>
  )
}

export default ServiceDetails
