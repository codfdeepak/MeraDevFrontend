import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365
const PRIMARY_OWNER_NAME = 'deepak kumar'

const formatYearsLabel = (value) => {
  const years = Number(value)
  if (!Number.isFinite(years) || years <= 0) return null
  const normalizedYears = Number.isInteger(years)
    ? String(years)
    : String(Math.round(years * 10) / 10)
  return `${normalizedYears}+ Years`
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

const getPartnerName = (partner) => partner?.user?.fullName || 'Partner Profile'
const normalizeName = (value) => String(value || '').trim().toLowerCase()
const isPrimaryOwnerPartner = (partner) => normalizeName(getPartnerName(partner)) === PRIMARY_OWNER_NAME

const getRoleValue = (partner) =>
  String(partner?.role || partner?.user?.role || '').toLowerCase()

const isOwnerPartner = (partner) =>
  Boolean(partner?.isOwner) ||
  getRoleValue(partner) === 'owner' ||
  getRoleValue(partner) === 'admin'

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

const KEYWORDS = {
  management: [
    'manager',
    'management',
    'lead',
    'head',
    'director',
    'founder',
    'ceo',
    'cto',
    'coo',
    'cmo',
    'vp',
    'principal',
    'operations',
    'product',
    'project manager',
    'hr',
  ],
  tech: [
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
  ],
  marketingBusiness: [
    'marketing',
    'business',
    'sales',
    'growth',
    'seo',
    'sem',
    'brand',
    'branding',
    'strategy',
    'partnership',
    'account',
    'client',
    'bdm',
  ],
  creativeDesign: [
    'designer',
    'design',
    'creative',
    'ui',
    'ux',
    'graphics',
    'graphic',
    'video',
    'content',
    'illustration',
    'motion',
    'animation',
  ],
}

const TEAM_ORDER = ['leadership', 'tech', 'marketingBusiness', 'creativeDesign', 'general']
const PARTNER_CATEGORY_VALUES = new Set([
  'leadership',
  'tech',
  'marketingBusiness',
  'creativeDesign',
])

const TEAM_CONFIG = {
  leadership: {
    title: 'Owner & Management',
    subtitle: 'Core leadership driving direction, execution, and team alignment.',
    className: 'team-leadership',
  },
  tech: {
    title: 'Tech Team',
    subtitle: 'Engineering experts focused on product architecture, feature development, and reliable delivery.',
    className: 'team-tech',
  },
  marketingBusiness: {
    title: 'Marketing & Business Team',
    subtitle: 'Growth, market strategy, client partnerships, and business outcomes.',
    className: 'team-marketing',
  },
  creativeDesign: {
    title: 'Creative & Design Team',
    subtitle: 'Visual identity, UI/UX systems, and communication design excellence.',
    className: 'team-creative',
  },
  general: {
    title: 'Operations & Support Team',
    subtitle: 'Cross-functional contributors supporting smooth project execution.',
    className: 'team-general',
  },
}

const includesKeyword = (text, keywords) => keywords.some((keyword) => text.includes(keyword))
const normalizePartnerCategory = (value) => {
  const category = String(value || '').trim()
  return PARTNER_CATEGORY_VALUES.has(category) ? category : null
}

const getTeamBucket = (partner) => {
  const selectedCategory =
    normalizePartnerCategory(partner?.partnerCategory) ||
    normalizePartnerCategory(partner?.user?.featureAccess?.partnerCategory)
  if (selectedCategory) return selectedCategory

  if (isOwnerPartner(partner)) return 'leadership'

  const designation = String(getPartnerDesignation(partner) || '').toLowerCase()

  if (includesKeyword(designation, KEYWORDS.management)) return 'leadership'
  if (includesKeyword(designation, KEYWORDS.tech)) return 'tech'
  if (includesKeyword(designation, KEYWORDS.marketingBusiness)) return 'marketingBusiness'
  if (includesKeyword(designation, KEYWORDS.creativeDesign)) return 'creativeDesign'

  return 'general'
}

const getExperienceValue = (partner) => {
  const directExperience = Number(partner?.totalExperienceYears)
  if (Number.isFinite(directExperience) && directExperience > 0) {
    return directExperience
  }

  const skills = Array.isArray(partner?.skills) ? partner.skills : []
  return Math.max(
    0,
    ...skills.map((skill) => {
      const value = Number(skill?.years)
      return Number.isFinite(value) ? value : 0
    }),
  )
}

const getRoleRank = (partner) => {
  const role = getRoleValue(partner)
  if (role === 'owner') return 0
  if (role === 'admin') return 1
  return 2
}

const sortPartners = (a, b) => {
  const isPrimaryOwnerA = isPrimaryOwnerPartner(a)
  const isPrimaryOwnerB = isPrimaryOwnerPartner(b)
  if (isPrimaryOwnerA !== isPrimaryOwnerB) return isPrimaryOwnerA ? -1 : 1

  const roleDiff = getRoleRank(a) - getRoleRank(b)
  if (roleDiff !== 0) return roleDiff

  const experienceDiff = getExperienceValue(b) - getExperienceValue(a)
  if (experienceDiff !== 0) return experienceDiff

  return getPartnerName(a).localeCompare(getPartnerName(b))
}

const renderPartnerCard = (partner) => {
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

  if (!userId) return <div className="partner-card-link partner-card-static" key={itemKey}>{cardContent}</div>

  return (
    <Link to={`/profile/${userId}`} className="partner-card-link" key={itemKey}>
      {cardContent}
    </Link>
  )
}

function PartnerCardList({ partners, status, error }) {
  const groupedPartners = useMemo(() => {
    const groups = {
      leadership: [],
      tech: [],
      marketingBusiness: [],
      creativeDesign: [],
      general: [],
    }

    partners.forEach((partner) => {
      groups[getTeamBucket(partner)].push(partner)
    })

    TEAM_ORDER.forEach((key) => {
      groups[key].sort(sortPartners)
    })

    return TEAM_ORDER.map((key) => ({
      key,
      ...TEAM_CONFIG[key],
      members: groups[key],
    })).filter((section) => section.key !== 'general' || section.members.length > 0)
  }, [partners])

  return (
    <div className="partners-hierarchy">
      {status === 'loading' && partners.length === 0 && (
        <div className="partners-grid partners-team-grid">
          <div className="partner-card loading" />
          <div className="partner-card loading" />
          <div className="partner-card loading" />
          <div className="partner-card loading" />
        </div>
      )}

      {status === 'error' && partners.length === 0 && (
        <div className="partners-error">Failed to load partners: {error}</div>
      )}

      {status !== 'loading' && partners.length === 0 && (
        <div className="muted">No partners found.</div>
      )}

      {partners.length > 0 &&
        groupedPartners.map((section, index) => (
          <section
            className={`partner-team-section ${section.className} ${
              index === 0 ? 'is-root' : ''
            } ${index === groupedPartners.length - 1 ? 'is-leaf' : ''}`}
            key={section.key}
          >
            <header className="partner-team-head">
              <div>
                <p className="partner-team-level">Level {index + 1}</p>
                <h3>{section.title}</h3>
                <p className="muted">{section.subtitle}</p>
              </div>
              <span className="pill small">{section.members.length} Members</span>
            </header>

            {section.members.length === 0 ? (
              <p className="muted partner-empty-state">No profiles assigned in this section yet.</p>
            ) : (
              <div className="partner-zigzag-board" role="list" aria-label={`${section.title} hierarchy`}>
                {section.members.map((partner, memberIndex) => {
                  const isLeftSide = memberIndex % 2 === 0
                  return (
                    <article
                      className={`partner-zigzag-row ${isLeftSide ? 'left' : 'right'}`}
                      key={`${section.key}-${partner?._id || partner?.user?._id || memberIndex}`}
                      role="listitem"
                    >
                      <div className="partner-zigzag-slot left">
                        {isLeftSide ? renderPartnerCard(partner) : <span className="partner-zigzag-placeholder" aria-hidden="true" />}
                      </div>

                      <div className="partner-zigzag-center" aria-hidden="true">
                        <span className="partner-zigzag-node" />
                      </div>

                      <div className="partner-zigzag-slot right">
                        {!isLeftSide ? renderPartnerCard(partner) : <span className="partner-zigzag-placeholder" aria-hidden="true" />}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        ))}
    </div>
  )
}

export default PartnerCardList
