import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark'

  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setNavOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))

  return (
    <>
      <AppHeader
        theme={theme}
        navOpen={navOpen}
        onToggleTheme={toggleTheme}
        onToggleNav={() => setNavOpen((value) => !value)}
        onCloseNav={() => setNavOpen(false)}
      />
      <Outlet />
    </>
  )
}

export default AppLayout
