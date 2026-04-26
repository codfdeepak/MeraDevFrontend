import { Link } from 'react-router-dom'

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365

const getExperienceLabel = (partner) => {
  const experience = Array.isArray(partner?.experience) ? partner.experience : []
  const startTimestamps = experience
    .map((item) => (item?.startDate ? new Date(item.startDate).getTime() : null))
    .filter(Boolean)

  if (startTimestamps.length > 0) {
    const firstStart = Math.min(...startTimestamps)
    const years = Math.max(1, Math.round((Date.now() - firstStart) / ONE_YEAR_MS))
    return `${years}+ Years`
  }

  const skills = Array.isArray(partner?.skills) ? partner.skills : []
  const maxSkillYears = Math.max(
    0,
    ...skills.map((skill) => {
      const value = Number(skill?.years)
      return Number.isFinite(value) ? value : 0
    }),
  )

  return maxSkillYears > 0 ? `${maxSkillYears}+ Years` : '1+ Years'
}

const getPartnerName = (partner) => partner?.user?.fullName || 'Partner Profile'

const isOwnerPartner = (partner) =>
  Boolean(partner?.isOwner) ||
  String(partner?.role || '').toLowerCase() === 'owner' ||
  String(partner?.role || '').toLowerCase() === 'admin' ||
  String(partner?.user?.role || '').toLowerCase() === 'owner' ||
  String(partner?.user?.role || '').toLowerCase() === 'admin'

const getPartnerDesignation = (partner) => {
  if (partner?.about?.headline) return partner.about.headline
  if (partner?.skills?.[0]?.stack) {
    return `${partner.skills[0].stack[0].toUpperCase()}${partner.skills[0].stack.slice(1)} Specialist`
  }
  return 'Developer'
}

const getPartnerInitials = (name) => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'P'
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase()
  return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`.toUpperCase()
}

function PartnerCardList({ partners, status, error }) {
  return (
    <div className="partners-grid">
      {status === 'loading' && partners.length === 0 && (
        <>
          <div className="partner-card loading" />
          <div className="partner-card loading" />
          <div className="partner-card loading" />
        </>
      )}

      {status === 'error' && <div className="partners-error">Failed to load partners: {error}</div>}

      {status !== 'loading' && partners.length === 0 && <div className="muted">No partners found.</div>}

      {partners.map((partner) => {
        const name = getPartnerName(partner)
        const designation = getPartnerDesignation(partner)
        const experienceLabel = getExperienceLabel(partner)
        const avatar = partner?.about?.avatar
        const isOwner = isOwnerPartner(partner)
        const userId = typeof partner?.user === 'string' ? partner.user : partner?.user?._id
        const itemKey = partner._id || userId || name

        const cardContent = (
          <article className="partner-card">
            {avatar ? (
              <img src={avatar} alt={`${name} avatar`} className="partner-avatar" />
            ) : (
              <div className="partner-avatar fallback">{getPartnerInitials(name)}</div>
            )}

            <h3 className="partner-name">{name}</h3>
            <p className="partner-designation">{designation}</p>

            <div className="partner-rating">
              <div className="partner-stars" aria-label="4 out of 5 star partner rating">
                <span className="filled">★</span>
                <span className="filled">★</span>
                <span className="filled">★</span>
                <span className="filled">★</span>
                <span className="empty">☆</span>
              </div>
            </div>

            <div className="partner-meta">
              <span className="pill micro">{experienceLabel}</span>
              {isOwner && <span className="partner-owner-badge">Owner</span>}
            </div>
          </article>
        )

        if (!userId) return <div key={itemKey}>{cardContent}</div>

        return (
          <Link to={`/profile/${userId}`} className="partner-card-link" key={itemKey}>
            {cardContent}
          </Link>
        )
      })}
    </div>
  )
}

export default PartnerCardList
