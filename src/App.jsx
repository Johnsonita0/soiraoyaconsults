import { useEffect, useRef, useState } from 'react'
import LandingPage from './pages/LandingPage'
import ServicePage from './pages/ServicePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import { seedContent } from './data/content'
import { supabase } from './lib/supabase'
import { ToastProvider } from './components/ToastProvider'
import './css/App.css'

const isAuthenticatedUser = (user) => Boolean(user)
const serviceSlug = (title) => title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const mergeContent = (incoming = {}) => ({
  ...seedContent,
  ...incoming,
  heroSlides: incoming.heroSlides || seedContent.heroSlides,
  aboutSlides: incoming.aboutSlides || seedContent.aboutSlides,
  servicesVersion: seedContent.servicesVersion,
  services: incoming.servicesVersion === seedContent.servicesVersion ? incoming.services || seedContent.services : seedContent.services,
  gallery: incoming.gallery || seedContent.gallery,
  investOpportunities: incoming.investOpportunities || seedContent.investOpportunities,
  faqs: incoming.faqs || seedContent.faqs,
  testimonials: incoming.testimonials || seedContent.testimonials,
  contact: incoming.contact || seedContent.contact,
})

export default function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const [adminUser, setAdminUser] = useState(null)
  const contentDirtyRef = useRef(false)
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
        if (error || !data?.value || contentDirtyRef.current) return
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

  useEffect(() => {
    let focusedControl = null
    const isFormControl = (control) => control instanceof HTMLElement && control.matches('input, textarea, select, button.searchable-select-trigger')
    const centerFocusedControl = () => {
      if (!focusedControl || !window.matchMedia('(max-width: 900px)').matches) return
      focusedControl.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    const bringFocusedControlIntoView = (event) => {
      if (!window.matchMedia('(max-width: 900px)').matches) return
      const control = event.target
      if (!isFormControl(control)) return
      focusedControl = control
      window.setTimeout(centerFocusedControl, 250)
    }

    document.addEventListener('focusin', bringFocusedControlIntoView)
    window.visualViewport?.addEventListener('resize', centerFocusedControl)
    return () => {
      document.removeEventListener('focusin', bringFocusedControlIntoView)
      window.visualViewport?.removeEventListener('resize', centerFocusedControl)
    }
  }, [])

  const goTo = (path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canAccessDashboard = isAuthenticatedUser(adminUser)
  const updateContent = (nextContent) => {
    contentDirtyRef.current = true
    setContent(nextContent)
  }

  const servicePath = route.startsWith('/services/') ? route.slice('/services/'.length) : ''
  const service = content.services?.find((item) => serviceSlug(item.title) === servicePath)
  const page = route === '/login' || route === '/dashboard' || route === '/admin'
    ? canAccessDashboard ? <AdminPage content={content} setContent={updateContent} goTo={goTo} /> : <LoginPage goTo={goTo} />
    : service ? <ServicePage content={content} service={service} goTo={goTo} />
    : <LandingPage content={content} goTo={goTo} />

  return <ToastProvider>{page}</ToastProvider>
}
