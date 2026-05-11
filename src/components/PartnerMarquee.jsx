import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365
const SWIPE_INTERVAL_MS = 3200
const SWIPE_TRANSITION_MS = 650
const DESKTOP_VISIBLE_CARDS = 3
const SWIPE_THRESHOLD_PX = 42
const PRIMARY_OWNER_NAME = 'deepak kumar'
const DEEPAK_FALLBACK_PARTNER = {
  _id: 'fallback-deepak-owner-profile',
  isOwner: true,
  role: 'owner',
  user: {
    fullName: 'Deepak Kumar',
    role: 'owner',
  },
  about: {
    headline: 'FullStack Developer',
  },
  totalExperienceYears: 2,
}
const PARTNER_CATEGORY_VALUES = new Set(['leadership', 'tech', 'marketingBusiness', 'creativeDesign'])
const TECH_KEYWORDS = [
  'developer',
  'engineer',
  'software',
  'backend',
  'front end',
  'frontend',
  'full stack',
  'mobile',
  'android',
  'ios',
  'devops',
  'qa',
  'tester',
  'sde',
  'cloud',
  'architect',
  'data',
  'ai',
  'ml',
  'tech',
]

const formatYearsLabel = (value) => {
  const years = Number(value)
  if (!Number.isFinite(years) || years <= 0) return null
  const normalizedYears = Number.isInteger(years)
    ? String(years)
    : String(Math.round(years * 10) / 10)
  return `${normalizedYears}+ Years`
}

const getPartnerName = (partner) => partner?.user?.fullName || 'Partner Profile'
const normalizeName = (value) => String(value || '').trim().toLowerCase()
const isPrimaryOwnerPartner = (partner) => normalizeName(getPartnerName(partner)) === PRIMARY_OWNER_NAME

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

const getRoleValue = (partner) => String(partner?.role || partner?.user?.role || '').toLowerCase()

const getRoleRank = (partner) => {
  const role = getRoleValue(partner)
  if (role === 'owner') return 0
  if (role === 'admin') return 1
  return 2
}

const normalizePartnerCategory = (value) => {
  const category = String(value || '').trim()
  return PARTNER_CATEGORY_VALUES.has(category) ? category : null
}

const isTechPartner = (partner) => {
  const selectedCategory =
    normalizePartnerCategory(partner?.partnerCategory) ||
    normalizePartnerCategory(partner?.user?.featureAccess?.partnerCategory)

  if (selectedCategory === 'tech') return true
  if (selectedCategory === 'leadership') return false
  if (isOwnerPartner(partner)) return false

  const designation = String(getPartnerDesignation(partner) || '').toLowerCase()
  return TECH_KEYWORDS.some((keyword) => designation.includes(keyword))
}

const getHeroOrderPriority = (partner) => {
  if (isOwnerPartner(partner)) return 0
  if (isTechPartner(partner)) return 1
  return 2
}

const sortPartnersForHero = (partners) => {
  return [...partners].sort((a, b) => {
    const isPrimaryOwnerA = isPrimaryOwnerPartner(a)
    const isPrimaryOwnerB = isPrimaryOwnerPartner(b)
    if (isPrimaryOwnerA !== isPrimaryOwnerB) return isPrimaryOwnerA ? -1 : 1

    const priorityDiff = getHeroOrderPriority(a) - getHeroOrderPriority(b)
    if (priorityDiff !== 0) return priorityDiff

    const roleDiff = getRoleRank(a) - getRoleRank(b)
    if (roleDiff !== 0) return roleDiff

    return getPartnerName(a).localeCompare(getPartnerName(b))
  })
}

const getExperienceLabel = (partner) => {
  const directYearsLabel = formatYearsLabel(partner?.totalExperienceYears)
  if (directYearsLabel) return directYearsLabel

  const experience = Array.isArray(partner?.experience) ? partner.experience : []
  const startTimestamps = experience
    .map((item) => (item?.startDate ? new Date(item.startDate).getTime() : null))
    .filter(Boolean)

  if (startTimestamps.length > 0) {
    const firstStart = Math.min(...startTimestamps)
    const years = Math.max(1, Math.round((Date.now() - firstStart) / ONE_YEAR_MS))
    return formatYearsLabel(years) || '1+ Years'
  }

  const skills = Array.isArray(partner?.skills) ? partner.skills : []
  const maxSkillYears = Math.max(
    0,
    ...skills.map((skill) => {
      const value = Number(skill?.years)
      return Number.isFinite(value) ? value : 0
    }),
  )

  return formatYearsLabel(maxSkillYears) || '1+ Years'
}

function PartnerMarquee({ partners, status, error }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [enableTransition, setEnableTransition] = useState(true)
  const previousJumpFrameRef = useRef(null)
  const clearDragFlagTimerRef = useRef(null)
  const dragStartXRef = useRef(null)
  const dragMovedRef = useRef(false)
  const mouseDragActiveRef = useRef(false)

  const orderedPartners = useMemo(() => sortPartnersForHero(partners), [partners])
  const hasFetchedPartners = orderedPartners.length > 0
  const shouldShowDeepakFallback = !hasFetchedPartners && (status === 'loading' || status === 'idle')
  const displayPartners = shouldShowDeepakFallback ? [DEEPAK_FALLBACK_PARTNER] : orderedPartners
  const hasPartners = displayPartners.length > 0
  const hasMultiplePartners = displayPartners.length > 1

  const carouselItems = useMemo(() => {
    if (!hasMultiplePartners) return displayPartners

    const cloneItems = Array.from({ length: DESKTOP_VISIBLE_CARDS }, (_, index) => {
      return displayPartners[index % displayPartners.length]
    })

    return [...displayPartners, ...cloneItems]
  }, [displayPartners, hasMultiplePartners])

  useEffect(() => {
    setActiveIndex(0)
    setEnableTransition(true)
  }, [displayPartners.length])

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
    if (activeIndex < displayPartners.length) return undefined

    const timer = window.setTimeout(() => {
      setEnableTransition(false)
      setActiveIndex(0)
    }, SWIPE_TRANSITION_MS + 40)

    return () => window.clearTimeout(timer)
  }, [activeIndex, hasMultiplePartners, displayPartners.length])

  useEffect(() => {
    return () => {
      if (previousJumpFrameRef.current) {
        window.cancelAnimationFrame(previousJumpFrameRef.current)
      }
      if (clearDragFlagTimerRef.current) {
        window.clearTimeout(clearDragFlagTimerRef.current)
      }
    }
  }, [])

  const handleNext = useCallback(() => {
    if (!hasMultiplePartners) return
    setEnableTransition(true)
    setActiveIndex((current) => current + 1)
  }, [hasMultiplePartners])

  const handlePrevious = useCallback(() => {
    if (!hasMultiplePartners) return

    if (activeIndex === 0) {
      setEnableTransition(false)
      setActiveIndex(displayPartners.length)

      if (previousJumpFrameRef.current) {
        window.cancelAnimationFrame(previousJumpFrameRef.current)
      }

      previousJumpFrameRef.current = window.requestAnimationFrame(() => {
        previousJumpFrameRef.current = null
        setEnableTransition(true)
        setActiveIndex(displayPartners.length - 1)
      })

      return
    }

    setEnableTransition(true)
    setActiveIndex((current) => current - 1)
  }, [activeIndex, hasMultiplePartners, displayPartners.length])

  const handleTransitionEnd = () => {
    if (!hasMultiplePartners) return
    if (activeIndex >= displayPartners.length) {
      setEnableTransition(false)
      setActiveIndex(0)
    }
  }

  const beginDrag = useCallback((clientX) => {
    dragStartXRef.current = clientX
    dragMovedRef.current = false
  }, [])

  const trackDrag = useCallback((clientX) => {
    if (dragStartXRef.current === null) return
    if (Math.abs(clientX - dragStartXRef.current) > 8) {
      dragMovedRef.current = true
    }
  }, [])

  const endDrag = useCallback(
    (clientX) => {
      if (dragStartXRef.current === null) return

      const dragDistance = clientX - dragStartXRef.current
      dragStartXRef.current = null

      if (!dragMovedRef.current || Math.abs(dragDistance) < SWIPE_THRESHOLD_PX) {
        dragMovedRef.current = false
        return
      }

      if (dragDistance < 0) {
        handleNext()
      } else {
        handlePrevious()
      }

      if (clearDragFlagTimerRef.current) {
        window.clearTimeout(clearDragFlagTimerRef.current)
      }
      clearDragFlagTimerRef.current = window.setTimeout(() => {
        dragMovedRef.current = false
        clearDragFlagTimerRef.current = null
      }, 0)
    },
    [handleNext, handlePrevious],
  )

  const resetDrag = useCallback(() => {
    dragStartXRef.current = null
    dragMovedRef.current = false
    mouseDragActiveRef.current = false
    if (clearDragFlagTimerRef.current) {
      window.clearTimeout(clearDragFlagTimerRef.current)
      clearDragFlagTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!hasMultiplePartners) return undefined

    const handleWindowMouseMove = (event) => {
      if (!mouseDragActiveRef.current) return
      trackDrag(event.clientX)
    }

    const handleWindowMouseUp = (event) => {
      if (!mouseDragActiveRef.current) return
      mouseDragActiveRef.current = false
      endDrag(event.clientX)
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [endDrag, hasMultiplePartners, trackDrag])

  const handleMouseDown = (event) => {
    if (!hasMultiplePartners) return
    if (event.button !== 0) return

    mouseDragActiveRef.current = true
    beginDrag(event.clientX)
  }

  const handleTouchStart = (event) => {
    if (!hasMultiplePartners) return
    const touch = event.touches?.[0]
    if (!touch) return
    beginDrag(touch.clientX)
  }

  const handleTouchMove = (event) => {
    const touch = event.touches?.[0]
    if (!touch) return
    trackDrag(touch.clientX)
  }

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches?.[0]
    if (!touch) {
      resetDrag()
      return
    }
    endDrag(touch.clientX)
  }

  const handleTouchCancel = () => {
    resetDrag()
  }

  const handleNativeDragStart = (event) => {
    if (!hasMultiplePartners) return
    event.preventDefault()
  }

  const handleShellClickCapture = (event) => {
    if (!dragMovedRef.current) return

    event.preventDefault()
    event.stopPropagation()
    dragMovedRef.current = false
  }

  if (status === 'error' && !hasPartners) {
    return (
      <section className="partners-marquee-only">
        <div className="partners-error">Failed to load partners: {error}</div>
      </section>
    )
  }

  if (status !== 'loading' && status !== 'idle' && !hasPartners) {
    return (
      <section className="partners-marquee-only">
        <div className="muted">No partners found.</div>
      </section>
    )
  }

  return (
    <section className="partners-marquee-only" aria-label="Partner cards auto swipe">
      <div
        className={`partners-carousel-shell ${hasMultiplePartners ? 'is-draggable' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onDragStart={handleNativeDragStart}
        onClickCapture={handleShellClickCapture}
      >
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
            const isFallbackLoadingProfile =
              shouldShowDeepakFallback && partner?._id === DEEPAK_FALLBACK_PARTNER._id
            const userId = typeof partner?.user === 'string' ? partner.user : partner?.user?._id
            const cardKey = `${partner?._id || userId || name}-${index}`

            const cardContent = (
              <article className={`partner-card ${isFallbackLoadingProfile ? 'is-fetching-fallback' : ''}`}>
                {avatar ? (
                  <img src={avatar} alt={`${name} avatar`} className="partner-avatar" draggable={false} />
                ) : (
                  <div className="partner-avatar fallback">{getPartnerInitials(name)}</div>
                )}

                <h3 className="partner-name">{name}</h3>
                <p className="partner-designation">{designation}</p>
                {isFallbackLoadingProfile && (
                  <p className="partner-fetching-hint" aria-live="polite">
                    Syncing live profile data...
                  </p>
                )}

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
                  {isFallbackLoadingProfile && <span className="partner-sync-badge">Loading</span>}
                  {isOwner && <span className="partner-owner-badge">Owner</span>}
                </div>
              </article>
            )

            return (
              <div className="partners-carousel-item" key={cardKey}>
                {userId ? (
                  <Link to={`/profile/${userId}`} className="partner-card-link" draggable={false}>
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
