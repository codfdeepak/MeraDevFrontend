function ServiceCategoryIcon({ kind }) {
  const iconNodes = {
    website: (
      <>
        <rect x="2.8" y="4" width="14.4" height="12" rx="2.4" />
        <path d="M2.8 8.5h14.4" />
        <path d="M8.5 8.5v7.5" />
      </>
    ),
    app: (
      <>
        <rect x="6.2" y="2.8" width="7.6" height="14.4" rx="2" />
        <path d="M9.5 5.2h1" />
        <circle cx="10" cy="14.6" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
    webview: (
      <>
        <rect x="2.5" y="4" width="15" height="12" rx="2.3" />
        <path d="M2.5 8h15" />
        <path d="m8.2 11 1.8 1.8 3-3" />
      </>
    ),
    seo: (
      <>
        <path d="M4.1 14.7v-3.4" />
        <path d="M8.1 14.7V8.5" />
        <path d="M12.1 14.7v-5" />
        <path d="M16.1 14.7V6.2" />
      </>
    ),
    cloud: (
      <>
        <path d="M6.2 14.5h7.5a2.8 2.8 0 0 0 .3-5.6 3.8 3.8 0 0 0-7.1-1.2A2.8 2.8 0 0 0 6.2 14.5Z" />
        <path d="M10 9.9v5.4" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {iconNodes[kind] || iconNodes.website}
    </svg>
  )
}

export default ServiceCategoryIcon
