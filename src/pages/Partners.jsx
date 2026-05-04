import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PartnerCardList from '../components/PartnerCardList'
import PageFrame from '../components/PageFrame'
import { selectPartners, selectPartnersError, selectPartnersStatus } from '../Redux/slices/partnerSlice'
import { fetchPartners } from '../Redux/thunks/partnerThunks'

function Partners() {
  const dispatch = useDispatch()
  const partners = useSelector(selectPartners)
  const status = useSelector(selectPartnersStatus)
  const error = useSelector(selectPartnersError)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPartners())
    }
  }, [dispatch, status])

  return (
    <PageFrame id="partners">
      <section className="panel partners-panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="pill small">Partners</span>
        </div>
      </section>

      <section className="panel partners-panel">
        <div className="panel-head">
          <h2>Mera Dev Family</h2>
          <span className="pill small">{partners.length} Profiles</span>
        </div>
        <PartnerCardList partners={partners} status={status} error={error} />
      </section>
    </PageFrame>
  )
}

export default Partners
