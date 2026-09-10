import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import { seedContent } from './data/content'
import { supabase } from './lib/supabase'
import './css/App.css'

const ADMIN_EMAIL = 'admin@soiraoyaconsulting.com.ng'
const ADMIN_USER_ID = '8b4f5926-c6ec-43a0-aa34-7277a2732577'

const isAllowedAdminUser = (user) => {
  if (!user) return false

  const emailMatches = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  const idMatches = user.id === ADMIN_USER_ID

  return emailMatches && idMatches
}

export default function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const [adminUser, setAdminUser] = useState(null)
  const [content, setContent] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('soiraoya-content'))
      return stored ? { ...seedContent, ...stored, heroSlides: stored.heroSlides || seedContent.heroSlides, gallery: stored.gallery || seedContent.gallery } : seedContent
    } catch {
      return seedContent
    }
  })

  useEffect(() => {
    const syncUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAdminUser(user)

      const path = window.location.pathname
      if (path === '/admin' || path === '/dashboard') {
        if (!isAllowedAdminUser(user)) {
          window.history.replaceState({}, '', '/login')
          setRoute('/login')
          return
        }

        window.history.replaceState({}, '', '/dashboard')
        setRoute('/dashboard')
        return
      }

      if (path === '/login' && isAllowedAdminUser(user)) {
        window.history.replaceState({}, '', '/dashboard')
        setRoute('/dashboard')
      }
    }

    syncUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setAdminUser(user)

      const path = window.location.pathname
      if (path === '/admin' || path === '/dashboard') {
        if (!isAllowedAdminUser(user)) {
          window.history.replaceState({}, '', '/login')
          setRoute('/login')
          return
        }

        window.history.replaceState({}, '', '/dashboard')
        setRoute('/dashboard')
        return
      }

      if (path === '/login' && isAllowedAdminUser(user)) {
        window.history.replaceState({}, '', '/dashboard')
        setRoute('/dashboard')
      }
    })

    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const goTo = (path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canAccessDashboard = isAllowedAdminUser(adminUser)

  if (route === '/login') {
    return canAccessDashboard ? <AdminPage content={content} setContent={setContent} goTo={goTo} /> : <LoginPage goTo={goTo} />
  }

  if (route === '/dashboard') {
    return canAccessDashboard ? <AdminPage content={content} setContent={setContent} goTo={goTo} /> : <LoginPage goTo={goTo} />
  }

  if (route === '/admin') {
    return canAccessDashboard ? <AdminPage content={content} setContent={setContent} goTo={goTo} /> : <LoginPage goTo={goTo} />
  }

  return <LandingPage content={content} goTo={goTo} />
}
