import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import { seedContent } from './data/content'
import { supabase } from './lib/supabase'
import './css/App.css'

const isAuthenticatedUser = (user) => Boolean(user)

const mergeContent = (incoming = {}) => ({
  ...seedContent,
  ...incoming,
  heroSlides: incoming.heroSlides || seedContent.heroSlides,
  aboutSlides: incoming.aboutSlides || seedContent.aboutSlides,
  services: incoming.services || seedContent.services,
  gallery: incoming.gallery || seedContent.gallery,
  investOpportunities: incoming.investOpportunities || seedContent.investOpportunities,
  faqs: incoming.faqs || seedContent.faqs,
  contact: incoming.contact || seedContent.contact,
})

export default function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const [adminUser, setAdminUser] = useState(null)
  const [content, setContent] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('soiraoya-content'))
      return stored ? mergeContent(stored) : seedContent
    } catch {
      return seedContent
    }
  })

  useEffect(() => {
    const loadSavedContent = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('key, value').eq('key', 'landing_content').maybeSingle()
        if (error || !data?.value) return
        const nextContent = mergeContent(data.value)
        setContent(nextContent)
        localStorage.setItem('soiraoya-content', JSON.stringify(nextContent))
      } catch (error) {
        console.error('Could not load saved landing content', error)
      }
    }

    void loadSavedContent()

    const syncUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAdminUser(user)

      const path = window.location.pathname
      if (path === '/admin' || path === '/dashboard') {
        if (!isAuthenticatedUser(user)) {
          window.history.replaceState({}, '', '/login')
          setRoute('/login')
          return
        }

        window.history.replaceState({}, '', '/dashboard')
        setRoute('/dashboard')
        return
      }

      if (path === '/login' && isAuthenticatedUser(user)) {
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
        if (!isAuthenticatedUser(user)) {
          window.history.replaceState({}, '', '/login')
          setRoute('/login')
          return
        }

        window.history.replaceState({}, '', '/dashboard')
        setRoute('/dashboard')
        return
      }

      if (path === '/login' && isAuthenticatedUser(user)) {
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

  const canAccessDashboard = isAuthenticatedUser(adminUser)

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
