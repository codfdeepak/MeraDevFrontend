import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PageFrame from '../components/PageFrame'
import {
  selectProjects,
  selectProjectsError,
  selectProjectsStatus,
} from '../Redux/slices/projectSlice'
import { fetchPublicProjects } from '../Redux/thunks/projectThunks'

const toPrettyStatus = (status) => (String(status || '').toLowerCase() === 'delivered' ? 'Delivered' : 'Live')
const AUTO_PROJECT_ORDER = 999
const normalizeProjectStatus = (status) => (String(status || '').toLowerCase() === 'delivered' ? 'delivered' : 'live')

const normalizeProjectType = (type) => {
  const value = String(type || '').trim()
  return value || 'General'
}

const toCategoryKey = (type) =>
  normalizeProjectType(type)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const getProjectIconKind = (type) => {
  const normalized = String(type || '').toLowerCase()

  if (normalized.includes('commerce') || normalized.includes('shop') || normalized.includes('store')) {
    return 'ecommerce'
  }
  if (normalized.includes('delivery') || normalized.includes('logistic') || normalized.includes('transport')) {
    return 'logistics'
  }
  if (normalized.includes('finance') || normalized.includes('fintech') || normalized.includes('payment')) {
    return 'finance'
  }
  if (normalized.includes('health') || normalized.includes('medical') || normalized.includes('clinic')) {
    return 'healthcare'
  }
  if (normalized.includes('education') || normalized.includes('learning') || normalized.includes('edtech')) {
    return 'education'
  }
  if (normalized.includes('saas') || normalized.includes('software') || normalized.includes('platform')) {
    return 'saas'
  }

  return 'general'
}

const ProjectTypeIcon = ({ type }) => {
  const kind = getProjectIconKind(type)

  const iconNodes = {
    ecommerce: (
      <>
        <path d="M3 5h2l2 9h8l2-6H7.5" />
        <circle cx="10" cy="17" r="1.2" />
        <circle cx="15" cy="17" r="1.2" />
      </>
    ),
    logistics: (
      <>
        <path d="M2.5 7.5h9v6h-9z" />
        <path d="M11.5 10h3.2l2 2v1.5h-5.2z" />
        <circle cx="6" cy="15.5" r="1.3" />
        <circle cx="14.7" cy="15.5" r="1.3" />
      </>
    ),
    finance: (
      <>
        <rect x="3" y="5.5" width="14" height="10" rx="2" />
        <path d="M3 9h14" />
        <circle cx="13.5" cy="12.5" r="1.2" />
      </>
    ),
    healthcare: (
      <>
        <path d="M10 4v12" />
        <path d="M4 10h12" />
        <rect x="3" y="3" width="14" height="14" rx="3" />
      </>
    ),
    education: (
      <>
        <path d="M2.5 8 10 4.5 17.5 8 10 11.5 2.5 8Z" />
        <path d="M5.5 9.4v3.6c0 1.2 2 2.2 4.5 2.2s4.5-1 4.5-2.2V9.4" />
      </>
    ),
    saas: (
      <>
        <path d="M5.5 14.5h8.5a3 3 0 0 0 .5-6 4.2 4.2 0 0 0-8-1.2A3 3 0 0 0 5.5 14.5Z" />
      </>
    ),
    general: (
      <>
        <rect x="3.5" y="6" width="13" height="10" rx="2" />
        <path d="M7 6V4.5h6V6" />
      </>
    ),
  }

  return (
    <span className={`project-type-icon ${kind}`} aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        {iconNodes[kind] || iconNodes.general}
      </svg>
    </span>
  )
}

const ProjectStatusIcon = ({ status }) => {
  if (status === 'delivered') {
    return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M3.8 7.2 10 4.4l6.2 2.8v5.8L10 15.8l-6.2-2.8z" />
        <path d="M3.8 7.2 10 10l6.2-2.8" />
        <path d="m8.2 12.1 1.5 1.4 2.3-2.4" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="m5.8 10.2 2.9 2.8 5.6-5.7" />
    </svg>
  )
}

function Projects({ embedded = false }) {
  const dispatch = useDispatch()
  const projects = useSelector(selectProjects)
  const status = useSelector(selectProjectsStatus)
  const error = useSelector(selectProjectsError)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublicProjects())
    }
  }, [dispatch, status])

  const categoryData = useMemo(() => {
    const items = projects || []
    const map = new Map()

    items.forEach((project) => {
      const label = normalizeProjectType(project?.type)
      const key = toCategoryKey(label) || 'general'
      const existing = map.get(key)

      if (existing) {
        existing.count += 1
      } else {
        map.set(key, { key, label, count: 1 })
      }
    })

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [projects])

  useEffect(() => {
    if (selectedCategory === 'all') return
    if (!categoryData.some((item) => item.key === selectedCategory)) {
      setSelectedCategory('all')
    }
  }, [categoryData, selectedCategory])

  const filteredProjects = useMemo(() => {
    const items = projects || []
    if (selectedCategory === 'all') return items

    return items.filter((project) => toCategoryKey(project?.type) === selectedCategory)
  }, [projects, selectedCategory])

  const totalProjectsCount = (projects || []).length

  const deliveredCount = useMemo(
    () => (projects || []).filter((project) => String(project?.status || '').toLowerCase() === 'delivered').length,
    [projects],
  )
  const liveCount = Math.max(0, totalProjectsCount - deliveredCount)

  const activeCategoryLabel = useMemo(() => {
    if (selectedCategory === 'all') return 'All'
    return categoryData.find((item) => item.key === selectedCategory)?.label || 'All'
  }, [categoryData, selectedCategory])

  const categoryTabs = useMemo(
    () => [{ key: 'all', label: 'All', count: (projects || []).length }, ...categoryData],
    [categoryData, projects],
  )

  const getDisplayOrder = (project, fallbackIndex) => {
    const order = Number(project?.sortOrder)
    if (Number.isFinite(order) && order > 0 && order !== AUTO_PROJECT_ORDER) {
      return Math.floor(order)
    }

    return fallbackIndex + 1
  }

  const hasProjects = (projects || []).length > 0

  const categoryProjectCount = useMemo(
    () => (selectedCategory === 'all' ? totalProjectsCount : filteredProjects.length),
    [filteredProjects.length, selectedCategory, totalProjectsCount],
  )

  const categorySummaryText = useMemo(() => {
    if (!hasProjects) return ''
    if (selectedCategory === 'all') return 'Showing projects from all categories'
    return `Showing ${categoryProjectCount} project${categoryProjectCount === 1 ? '' : 's'} in ${activeCategoryLabel}`
  }, [activeCategoryLabel, categoryProjectCount, hasProjects, selectedCategory])

  const heroContextText = useMemo(() => {
    if (!hasProjects) return 'New projects will appear here soon.'
    if (selectedCategory === 'all') {
      return `Currently showcasing ${totalProjectsCount} projects across ${categoryData.length} categories.`
    }

    return `Currently viewing ${categoryProjectCount} project${categoryProjectCount === 1 ? '' : 's'} in ${activeCategoryLabel}.`
  }, [activeCategoryLabel, categoryData.length, categoryProjectCount, hasProjects, selectedCategory, totalProjectsCount])

  const projectsGridClassName = useMemo(() => {
    if (filteredProjects.length === 1) return 'projects-grid projects-grid-single'
    if (filteredProjects.length === 2) return 'projects-grid projects-grid-double'
    return 'projects-grid'
  }, [filteredProjects.length])

  const projectsContent = (
    <>
      {!embedded && (
        <section className="panel service-details-top">
          <div className="service-details-nav">
            <Link className="pill small profile-back-link" to="/">
              ← Back to Home
            </Link>
            <span className="pill small">Projects</span>
          </div>
        </section>
      )}

      <section className={`panel projects-hero-panel ${embedded ? 'embedded' : ''}`}>
        <div className="projects-hero-copy">
          <span className="projects-hero-eyebrow">Project Portfolio</span>
          <h1>Projects We Built & Delivered</h1>
          <p className="lede">
            Real software built for real business outcomes. Explore live products and delivered solutions crafted by
            our team across web, SaaS, and custom product development.
          </p>
          <p className="projects-hero-context">{heroContextText}</p>
        </div>
        <div className="projects-hero-metrics-wrap">
          <div className="projects-hero-active-view" aria-live="polite">
            <span className="projects-hero-active-label">Active View</span>
            <span className="projects-hero-active-value">{selectedCategory === 'all' ? 'All Categories' : activeCategoryLabel}</span>
          </div>
          <div className="projects-hero-metrics" aria-label="Project stats">
            <div className="projects-metric-card total">
              <span className="projects-metric-value">{totalProjectsCount}</span>
              <span className="projects-metric-label">Total Projects</span>
            </div>
            <div className="projects-metric-card">
              <span className="projects-metric-value">{liveCount}</span>
              <span className="projects-metric-label">Live</span>
            </div>
            <div className="projects-metric-card">
              <span className="projects-metric-value">{deliveredCount}</span>
              <span className="projects-metric-label">Delivered</span>
            </div>
          </div>
        </div>
      </section>

      {hasProjects && (
        <section className="panel projects-filter-panel">
          <div className="projects-filter-head">
            <h2>Browse Projects by Category</h2>
            <p className="muted">{categorySummaryText}</p>
          </div>
          <div className="projects-category-tabs" role="tablist" aria-label="Project categories">
            {categoryTabs.map((category) => (
              <button
                key={category.key}
                type="button"
                className={`projects-category-tab ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.key)}
                aria-pressed={selectedCategory === category.key}
              >
                <span>{category.label}</span>
                <span className="projects-category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="projects-grid-panel">
        {status === 'loading' && <p className="muted">Loading latest projects...</p>}
        {status === 'error' && <p className="muted">Unable to load projects right now. {error}</p>}

        {status === 'loaded' && !hasProjects && (
          <article className="projects-empty">
            <p className="muted">No projects published yet. Please check back soon.</p>
          </article>
        )}

        {status === 'loaded' && hasProjects && filteredProjects.length === 0 && (
          <article className="projects-empty">
            <p className="muted">No projects found in this category yet.</p>
          </article>
        )}

        {filteredProjects.length > 0 && (
          <div className={projectsGridClassName}>
            {filteredProjects.map((project, index) => {
              const technologyItems = Array.isArray(project?.technologies)
                ? project.technologies.map((item) => String(item || '').trim()).filter(Boolean)
                : []
              const visibleTechnologies = technologyItems.slice(0, 5)
              const hiddenCount = Math.max(0, technologyItems.length - visibleTechnologies.length)
              const details = String(project?.details || '').trim()
              const statusText = normalizeProjectStatus(project?.status)

              return (
                <article className="project-card" key={project?._id || `${project?.name}-${index}`}>
                  <div className="project-card-head">
                    <span className="project-type-pill">
                      <ProjectTypeIcon type={project?.type} />
                      <span>{normalizeProjectType(project?.type)}</span>
                    </span>
                    <span className={`project-status-chip ${statusText}`}>
                      <span className="project-status-icon" aria-hidden="true">
                        <ProjectStatusIcon status={statusText} />
                      </span>
                      <span className="project-status-label">{toPrettyStatus(project?.status)}</span>
                    </span>
                  </div>

                  <div className="project-content">
                    <div className="project-title-row">
                      <h3 className="project-name">{project?.name || `Project ${index + 1}`}</h3>
                      <span className="project-order-chip" title="Project display order">
                        #{String(getDisplayOrder(project, index)).padStart(2, '0')}
                      </span>
                    </div>

                    {details ? <p className="project-details-line">{details}</p> : null}

                    <div className="project-tech-section">
                      {visibleTechnologies.length > 0 ? (
                        <div className="project-tech-list" aria-label="Technologies used">
                          {visibleTechnologies.map((item, techIndex) => (
                            <span className="project-tech-chip" key={`${project?._id || project?.name || index}-tech-${techIndex}`}>
                              {item}
                            </span>
                          ))}
                          {hiddenCount > 0 ? (
                            <span className="project-tech-chip more">+{hiddenCount} more</span>
                          ) : null}
                        </div>
                      ) : (
                        <p className="project-tech-empty">Tech stack not published yet.</p>
                      )}
                    </div>
                  </div>

                <div className="project-footer">
                  <div className="project-card-actions">
                    {project?.link ? (
                      <a className="cta primary cta-btn project-open-link" href={project.link} target="_blank" rel="noreferrer">
                          <span>Open</span>
                          <span className="project-open-icon" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <span className="cta outline disabled">Link Unavailable</span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )

  if (embedded) {
    return <div id="projects-page">{projectsContent}</div>
  }

  return (
    <PageFrame id="projects-page">
      {projectsContent}
    </PageFrame>
  )
}

export default Projects
