import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365
const SWIPE_INTERVAL_MS = 3200
const SWIPE_TRANSITION_MS = 650
const DESKTOP_VISIBLE_CARDS = 3

const getPartnerName = (partner) => partner?.user?.fullName || 'Partner Profile'

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

const isOwnerPartner = (partner) =>
  Boolean(partner?.isOwner) ||
  String(partner?.role || '').toLowerCase() === 'owner' ||
  String(partner?.role || '').toLowerCase() === 'admin' ||
  String(partner?.user?.role || '').toLowerCase() === 'owner' ||
  String(partner?.user?.role || '').toLowerCase() === 'admin'

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

function PartnerMarquee({ partners, status, error }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [enableTransition, setEnableTransition] = useState(true)

  const hasPartners = partners.length > 0
  const hasMultiplePartners = partners.length > 1

  const carouselItems = useMemo(() => {
    if (!hasMultiplePartners) return partners

    const cloneItems = Array.from({ length: DESKTOP_VISIBLE_CARDS }, (_, index) => {
      return partners[index % partners.length]
    })

    return [...partners, ...cloneItems]
  }, [partners, hasMultiplePartners])

  useEffect(() => {
    setActiveIndex(0)
    setEnableTransition(true)
  }, [partners.length])

  useEffect(() => {
    if (!hasMultiplePartners) return undefined

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => current + 1)
      setEnableTransition(true)
    }, SWIPE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [hasMultiplePartners])

  useEffect(() => {
    if (enableTransition) return undefined
    const frame = window.requestAnimationFrame(() => setEnableTransition(true))
    return () => window.cancelAnimationFrame(frame)
  }, [enableTransition])

  useEffect(() => {
    if (!hasMultiplePartners) return undefined
    if (activeIndex < partners.length) return undefined

    const timer = window.setTimeout(() => {
      setEnableTransition(false)
      setActiveIndex(0)
    }, SWIPE_TRANSITION_MS + 40)

    return () => window.clearTimeout(timer)
  }, [activeIndex, hasMultiplePartners, partners.length])

  const handleTransitionEnd = () => {
    if (!hasMultiplePartners) return
    if (activeIndex >= partners.length) {
      setEnableTransition(false)
      setActiveIndex(0)
    }
  }

  if (status === 'loading' && !hasPartners) {
    return (
      <section className="partners-marquee-only">
        <div className="partners-carousel-shell">
          <div className="partners-carousel-track partners-carousel-track-static">
            <div className="partners-carousel-item">
              <article className="partner-card loading" />
            </div>
            <div className="partners-carousel-item">
              <article className="partner-card loading" />
            </div>
            <div className="partners-carousel-item">
              <article className="partner-card loading" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'error' && !hasPartners) {
    return (
      <section className="partners-marquee-only">
        <div className="partners-error">Failed to load partners: {error}</div>
      </section>
    )
  }

  if (status !== 'loading' && !hasPartners) {
    return (
      <section className="partners-marquee-only">
        <div className="muted">No partners found.</div>
      </section>
    )
  }

  return (
    <section className="partners-marquee-only" aria-label="Partner cards auto swipe">
      <div className="partners-carousel-shell">
        <div
          className="partners-carousel-track"
          style={{
            transform: `translateX(calc(-${activeIndex} * (var(--carousel-card-width) + var(--carousel-gap))))`,
            transition: enableTransition ? 'transform 650ms ease' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {carouselItems.map((partner, index) => {
            const name = getPartnerName(partner)
            const designation = getPartnerDesignation(partner)
            const experienceLabel = getExperienceLabel(partner)
            const avatar = partner?.about?.avatar
            const isOwner = isOwnerPartner(partner)
            const userId = typeof partner?.user === 'string' ? partner.user : partner?.user?._id
            const cardKey = `${partner?._id || userId || name}-${index}`

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

            return (
              <div className="partners-carousel-item" key={cardKey}>
                {userId ? (
                  <Link to={`/profile/${userId}`} className="partner-card-link">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PartnerMarquee
