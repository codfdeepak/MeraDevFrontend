export const SERVICE_CATEGORY_OPTIONS = [
  {
    key: 'website-development',
    label: 'Website Development',
    description: 'Business websites, portals, and commerce-ready platforms.',
    icon: 'website',
    highlights: [
      'E-Commerce websites',
      'Business and corporate websites',
      'All types of websites',
    ],
  },
  {
    key: 'app-development',
    label: 'App Development',
    description: 'Android, iOS, and cross-platform app delivery services.',
    icon: 'app',
    highlights: [
      'E-Commerce mobile apps',
      'Booking and service apps',
      'All types of mobile apps',
    ],
  },
  {
    key: 'webview-development',
    label: 'WebView Development',
    description: 'Fast WebView app wrappers for your existing web products.',
    icon: 'webview',
    highlights: [
      'Website to Android WebView apps',
      'Website to iOS WebView apps',
      'All types of WebView apps',
    ],
  },
  {
    key: 'seo-content-marketing',
    label: 'SEO & Content Marketing',
    description: 'Organic growth services focused on search and visibility.',
    icon: 'seo',
    highlights: [
      'On-page SEO optimization',
      'Content strategy and blog planning',
      'All types of SEO and content services',
    ],
  },
  {
    key: 'cloud-server-management',
    label: 'Cloud & Server Management',
    description: 'Deployment, hosting, scaling, and infrastructure support.',
    icon: 'cloud',
    highlights: [
      'Cloud hosting setup on AWS, GCP, and Azure',
      'Server security and performance tuning',
      'All types of cloud and server services',
    ],
  },
]

export const DEFAULT_SERVICE_CATEGORY = SERVICE_CATEGORY_OPTIONS[0].key

const SERVICE_CATEGORY_SET = new Set(SERVICE_CATEGORY_OPTIONS.map((item) => item.key))

export const getServiceCategoryByKey = (categoryKey = '') => {
  const normalizedCategory = String(categoryKey || '').trim().toLowerCase()
  return SERVICE_CATEGORY_OPTIONS.find((item) => item.key === normalizedCategory) || null
}

export const normalizeSection = (section = {}) => {
  const image = String(section?.image || '').trim()
  const description = String(section?.description || '').trim()
  const bulletPoints = Array.isArray(section?.bulletPoints)
    ? section.bulletPoints.map((point) => String(point || '').trim()).filter(Boolean)
    : []

  if (!image && !description && bulletPoints.length === 0) {
    return null
  }

  return {
    image,
    description,
    bulletPoints,
  }
}

export const getServiceSections = (service = {}) => {
  const newSections = Array.isArray(service?.contentSections)
    ? service.contentSections.map((section) => normalizeSection(section)).filter(Boolean)
    : []

  if (newSections.length > 0) {
    return newSections
  }

  const fallbackSection = normalizeSection({
    image: String(service?.snapshots?.[0] || '').trim(),
    description: String(service?.description || '').trim(),
    bulletPoints: Array.isArray(service?.bulletPoints)
      ? service.bulletPoints.map((point) => String(point || '').trim()).filter(Boolean)
      : [],
  })

  return fallbackSection ? [fallbackSection] : []
}

export const normalizeServiceCategory = (rawCategory, service = {}) => {
  const category = String(rawCategory || '').trim().toLowerCase()
  if (SERVICE_CATEGORY_SET.has(category)) {
    return category
  }

  const source = `${String(service?.name || '').toLowerCase()} ${String(service?.description || '').toLowerCase()}`

  if (source.includes('webview')) {
    return 'webview-development'
  }
  if (
    source.includes('app') ||
    source.includes('android') ||
    source.includes('ios') ||
    source.includes('mobile') ||
    source.includes('react native') ||
    source.includes('flutter')
  ) {
    return 'app-development'
  }
  if (source.includes('seo') || source.includes('search') || source.includes('content') || source.includes('marketing')) {
    return 'seo-content-marketing'
  }
  if (
    source.includes('cloud') ||
    source.includes('server') ||
    source.includes('deployment') ||
    source.includes('devops') ||
    source.includes('hosting')
  ) {
    return 'cloud-server-management'
  }

  return DEFAULT_SERVICE_CATEGORY
}

export const mapServicesToCards = (services = [], fallbackImage = '') =>
  (services || []).map((service, index) => {
    const sections = getServiceSections(service)
    const leadSection = sections[0] || {}
    const sectionPoints = Array.isArray(leadSection?.bulletPoints) ? leadSection.bulletPoints : []
    const legacyPoints = Array.isArray(service?.bulletPoints)
      ? service.bulletPoints.map((point) => String(point || '').trim()).filter(Boolean)
      : []

    return {
      id: service?._id || '',
      title: service?.name || `Service ${index + 1}`,
      category: normalizeServiceCategory(service?.category, service),
      image: leadSection.image || fallbackImage,
      alt: service?.name
        ? `${service.name} service preview image`
        : 'Service preview image with website and software interface',
      summary:
        String(service?.description || '').trim() ||
        leadSection.description ||
        'Customized implementation based on your business goals.',
      points:
        sectionPoints.length > 0
          ? sectionPoints.slice(0, 3)
          : legacyPoints.length > 0
            ? legacyPoints.slice(0, 3)
            : ['Custom strategy', 'Secure implementation', 'Business-ready delivery'],
    }
  })

export const getServiceCategoryCountMap = (serviceCards = []) => {
  const counts = SERVICE_CATEGORY_OPTIONS.reduce((accumulator, item) => {
    accumulator[item.key] = 0
    return accumulator
  }, {})

  serviceCards.forEach((service) => {
    const categoryKey = Object.prototype.hasOwnProperty.call(counts, service?.category)
      ? service.category
      : DEFAULT_SERVICE_CATEGORY
    counts[categoryKey] += 1
  })

  return counts
}

const normalizeLine = (value = '') => String(value || '').replace(/\s+/g, ' ').trim()

const shortenLine = (line = '', maxLength = 84) => {
  const compact = normalizeLine(line)
  if (!compact) return ''
  if (compact.length <= maxLength) return compact
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`
}

const pushUniqueLine = (bucket = [], line = '', maxLength = 84) => {
  const nextLine = shortenLine(line, maxLength)
  if (!nextLine) return
  const lineKey = nextLine.toLowerCase()

  if (bucket.some((entry) => entry.toLowerCase() === lineKey)) {
    return
  }

  bucket.push(nextLine)
}

export const getServiceCategoryHighlightsMap = (serviceCards = [], options = {}) => {
  const maxBullets = Number(options?.maxBullets) > 0 ? Number(options.maxBullets) : 3
  const maxLength = Number(options?.maxLength) > 0 ? Number(options.maxLength) : 84

  const highlights = SERVICE_CATEGORY_OPTIONS.reduce((accumulator, item) => {
    accumulator[item.key] = []
    return accumulator
  }, {})

  serviceCards.forEach((service) => {
    const categoryKey = Object.prototype.hasOwnProperty.call(highlights, service?.category)
      ? service.category
      : DEFAULT_SERVICE_CATEGORY
    const bucket = highlights[categoryKey]

    if (bucket.length < maxBullets && Array.isArray(service?.points)) {
      service.points.forEach((point) => {
        if (bucket.length >= maxBullets) return
        pushUniqueLine(bucket, point, maxLength)
      })
    }

    if (bucket.length < maxBullets) {
      pushUniqueLine(bucket, service?.summary, maxLength)
    }

    if (bucket.length < maxBullets) {
      pushUniqueLine(bucket, `${service?.title || 'Service'} implementation`, maxLength)
    }
  })

  return highlights
}
