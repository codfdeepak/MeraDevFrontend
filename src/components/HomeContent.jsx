import Hero from './Hero'

const NOW_TIMESTAMP = Date.now()

function HomeContent({ profile, status, error, showHero = true }) {
  const displayName = profile?.user?.fullName || profile?.about?.headline || 'Your Name'
  const summary = profile?.about?.summary || 'Full-stack Specialist crafting robust experiences.'
  const location = profile?.about?.location || 'Remote · Worldwide'
  const avatar = profile?.about?.avatar
  const userMobile = profile?.user?.mobile

  const socials = profile?.socials || []
  const skills = profile?.skills || []
  const projects = profile?.projects || []
  const experience = profile?.experience || []
  const services = profile?.services || []
  const education = profile?.education || []
  const contact = profile?.contact || {}

  const primaryContactLink = contact.phone
    ? `tel:${contact.phone}`
    : contact.email
      ? `mailto:${contact.email}`
      : null

  const topSocials = socials.slice(0, 4)

  const starts = experience.map((exp) => (exp.startDate ? new Date(exp.startDate).getTime() : null)).filter(Boolean)
  const yearsOfExperience = starts.length
    ? Math.max(1, Math.round((NOW_TIMESTAMP - Math.min(...starts)) / (1000 * 60 * 60 * 24 * 365)))
    : null

  const keywords = Array.from(
    new Set(
      skills
        .flatMap((skill) => skill.keywords || [])
        .filter(Boolean)
        .map((keyword) => keyword.trim()),
    ),
  ).slice(0, 14)

  const statCards = [
    { label: 'Years in craft', value: yearsOfExperience ? `${yearsOfExperience}+` : '1+' },
    { label: 'Projects shipped', value: projects.length || '—' },
    { label: 'Services offered', value: services.length || '—' },
    { label: 'Core skills', value: skills.length || '—' },
  ]

  return (
    <>
      {showHero && <Hero />}

      <header className="hero" id="about">
        <div className="eyebrow">Portfolio Snapshot</div>
        <h1>{displayName}</h1>
        <p className="lede">{summary}</p>
        <div className="meta">
          <span className="pill">{location}</span>
          <span className="pill pill-ghost">
            {status === 'loading' ? 'Loading profile…' : 'Synced from CMS'}
          </span>
          {userMobile && <span className="pill">📱 {userMobile}</span>}
          {contact.website && (
            <a className="pill linkish" href={contact.website} target="_blank" rel="noreferrer">
              Portfolio ↗
            </a>
          )}
        </div>

        <div className="identity-card">
          <div className="avatar-ring">
            {avatar ? <img src={avatar} alt="Profile avatar" /> : <span>👤</span>}
          </div>
          <div className="id-copy">
            <p className="muted">{profile?.about?.headline || 'Role'}</p>
            <h3>{displayName}</h3>
            <p className="muted">{summary}</p>
            <div className="id-meta">
              {contact.email && <span className="pill micro">✉️ {contact.email}</span>}
              {userMobile && <span className="pill micro">📞 {userMobile}</span>}
            </div>
          </div>
        </div>

        <div className="cta-row">
          {contact.email && (
            <a className="cta primary" href={`mailto:${contact.email}`}>
              Book a project
            </a>
          )}
          {contact.phone && (
            <a className="cta ghost" href={`tel:${contact.phone}`}>
              Call / WhatsApp
            </a>
          )}
          {contact.linkedin && (
            <a className="cta outline" href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
        </div>

        <div className="stat-grid">
          {statCards.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="social-grid">
          {topSocials.length === 0 && (
            <div className="social-card ghost">Connect your social snapshots in CMS</div>
          )}
          {topSocials.map((social) => (
            <div className="social-card" key={`${social.platform}-${social.handle}`}>
              <div className="social-top">
                <span className="pill small">{social.platform}</span>
                <span className="muted">@{social.handle}</span>
              </div>
              <div className="social-metrics">
                <div>
                  <strong>{(social.followers || 0).toLocaleString()}</strong>
                  <small>Followers</small>
                </div>
                <div>
                  <strong>{social.engagementRate ? `${social.engagementRate}%` : '—'}</strong>
                  <small>Engagement</small>
                </div>
                <div>
                  <strong>{social.impressionsLast30 ? social.impressionsLast30.toLocaleString() : '—'}</strong>
                  <small>30d Views</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="grid two">
        <div className="panel">
          <div className="panel-head">
            <h2>Skills & Stacks</h2>
            <span className="pill small">Craft</span>
          </div>
          <div className="chips">
            {skills.length === 0 && <span className="muted">Add skills in admin</span>}
            {skills.map((skill) => (
              <div className="chip" key={`${skill.name}-${skill.stack}`}>
                <div>
                  <strong>{skill.name}</strong>
                  <small>{skill.stack}</small>
                </div>
                <span className="pill micro">
                  {skill.level || 'mid'} · {skill.years || 0}y
                </span>
              </div>
            ))}
          </div>

          {keywords.length > 0 && (
            <div className="tags keyword-cloud">
              {keywords.map((keyword) => (
                <span key={keyword} className="tag">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="panel" id="services">
          <div className="panel-head">
            <h2>Freelance Services</h2>
            <span className="pill small success">
              {profile?.isFreelanceOpen ? 'Available' : 'Booked'}
            </span>
          </div>
          <div className="services">
            {services.length === 0 && <span className="muted">Define services in admin</span>}
            {services.map((service) => (
              <div className="service-card" key={service.name}>
                <div>
                  <strong>{service.name}</strong>
                  <p className="muted">{service.summary}</p>
                </div>
                <div className="price">
                  {service.priceFrom ? (
                    <>
                      <span className="number">
                        {service.currency || 'USD'} {service.priceFrom}
                      </span>
                      <small>per {service.unit || 'project'}</small>
                    </>
                  ) : (
                    <small>Custom pricing</small>
                  )}
                </div>
                <div className="tags">
                  {(service.tags || []).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                {primaryContactLink && (
                  <a className="pill micro linkish" href={primaryContactLink}>
                    Enquire →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Education</h2>
          <span className="pill small">Learning</span>
        </div>
        <div className="education-list">
          {education.length === 0 && <span className="muted">Add education in admin</span>}
          {education.map((edu) => (
            <div className="edu-card" key={`${edu.institution}-${edu.degree}`}>
              <div>
                <h3>{edu.institution}</h3>
                <p className="muted">
                  {edu.degree} {edu.field && `· ${edu.field}`}
                </p>
              </div>
              <div className="edu-meta">
                <span className="pill micro">{edu.location || 'Location N/A'}</span>
                <span className="pill micro">
                  {edu.startYear || '—'} – {edu.currentlyStudying ? 'Present' : edu.endYear || '—'}
                </span>
              </div>
              {(edu.highlights || []).length > 0 && (
                <ul className="edu-highlights">
                  {edu.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Highlighted Projects</h2>
          <span className="pill small">Builds</span>
        </div>
        <div className="cards">
          {projects.length === 0 && <span className="muted">Add projects in admin</span>}
          {projects.map((project) => (
            <div className="card project-card" key={project.title}>
              {project.coverImage && (
                <div className="card-cover" style={{ backgroundImage: `url(${project.coverImage})` }} />
              )}
              <div className="card-head">
                <div>
                  <h3>{project.title}</h3>
                  <p className="muted">{project.role}</p>
                </div>
                <span className="pill micro">{project.status}</span>
              </div>
              <p>{project.description}</p>
              <div className="muted small">
                {(project.startedAt || project.endedAt) && (
                  <>
                    {project.startedAt?.slice(0, 10) || '—'} → {project.endedAt?.slice(0, 10) || 'Present'}
                  </>
                )}
              </div>
              <div className="tags">
                {(project.tech || []).map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
              {(project.highlights || []).length > 0 && (
                <ul className="project-highlights">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
              <div className="links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live ↗
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    Code ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Experience</h2>
          <span className="pill small">Timeline</span>
        </div>
        <div className="timeline">
          {experience.length === 0 && <span className="muted">Add roles in admin</span>}
          {experience.map((exp) => (
            <div className="timeline-item" key={`${exp.company}-${exp.title}`}>
              <div className="dot" />
              <div className="timeline-body">
                <div className="timeline-top">
                  <h3>{exp.title}</h3>
                  <span className="pill micro">{exp.employmentType}</span>
                </div>
                <p className="muted">{exp.company}</p>
                <p className="muted">{exp.location}</p>
                <p className="muted">
                  {exp.startDate?.slice(0, 10)} — {exp.currentlyWorking ? 'Present' : exp.endDate?.slice(0, 10)}
                </p>
                <ul>
                  {(exp.achievements || []).map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
                <div className="tags">
                  {(exp.tech || []).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Partners</h2>
          <span className="pill small">Network</span>
        </div>
        <div className="social-list">
          {socials.length === 0 && <span className="muted">Add socials in admin</span>}
          {socials.map((social) => (
            <div className="social-row" key={`${social.platform}-${social.handle}`}>
              <div>
                <strong>{social.platform}</strong>
                <p className="muted">@{social.handle}</p>
              </div>
              <div className="social-stats">
                <span>{(social.followers || 0).toLocaleString()} followers</span>
                {social.engagementRate ? <span>{social.engagementRate}% engagement</span> : <span>—</span>}
              </div>
              {social.url && (
                <a href={social.url} target="_blank" rel="noreferrer" className="pill micro linkish">
                  View ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Enquiry</h2>
          <span className="pill small">Let&apos;s talk</span>
        </div>
        <p className="muted">
          Tell me about your project, timeline, and goals. I respond within one business day.
        </p>
        <div className="cta-row">
          {contact.email && (
            <a className="cta primary" href={`mailto:${contact.email}`}>
              Email enquiry
            </a>
          )}
          {contact.phone && (
            <a className="cta outline" href={`tel:${contact.phone}`}>
              Call / WhatsApp
            </a>
          )}
          {contact.linkedin && (
            <a className="cta ghost" href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn DM
            </a>
          )}
        </div>
      </section>

      <section className="panel contact-panel">
        <div className="panel-head">
          <h2>Contact</h2>
          <span className="pill small">Reach out</span>
        </div>
        <div className="contact-grid">
          <div>
            <p className="muted">Email</p>
            <a href={`mailto:${contact.email || ''}`}>{contact.email || 'Add email'}</a>
          </div>
          <div>
            <p className="muted">Phone</p>
            <span>{contact.phone || 'Add phone'}</span>
          </div>
          <div>
            <p className="muted">Website</p>
            {contact.website ? (
              <a href={contact.website} target="_blank" rel="noreferrer">
                {contact.website} ↗
              </a>
            ) : (
              <span>Add website</span>
            )}
          </div>
          <div>
            <p className="muted">Location</p>
            <span>{profile?.about?.location || 'Update location'}</span>
          </div>
        </div>
        {primaryContactLink && (
          <div className="cta-row contact-cta">
            <a className="cta primary wide" href={primaryContactLink}>
              Start a project
            </a>
            {contact.linkedin && (
              <a className="cta outline" href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn profile
              </a>
            )}
          </div>
        )}
      </section>

      {status === 'error' && <div className="toast error">Failed to load profile: {error}</div>}
    </>
  )
}

export default HomeContent
