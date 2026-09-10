import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import { seedContent } from './data/content'
import { supabase } from './lib/supabase'
import './css/App.css'

const ADMIN_EMAIL = 'admin@soiraoyaconsulting.com.ng'
const ADMIN_USER_ID = '8b4f5926-c6ec-43a0-aa34-7277a2732577'

const isAllowedAdminUser = (user) => {
  if (!user) return false
  return user.id === ADMIN_USER_ID || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname.startsWith('/admin'))
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
    const syncAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAdminUser(user)
      if (window.location.pathname.startsWith('/admin') && !isAllowedAdminUser(user)) {
        window.history.replaceState({}, '', '/')
        setIsAdmin(false)
      }
    }

    syncAdminAccess()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setAdminUser(user)

      if (window.location.pathname.startsWith('/admin') && !isAllowedAdminUser(user)) {
        window.history.replaceState({}, '', '/')
        setIsAdmin(false)
      }
    })

    const onPopState = () => setIsAdmin(window.location.pathname.startsWith('/admin'))
    window.addEventListener('popstate', onPopState)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const goTo = (path) => {
    window.history.pushState({}, '', path)
    setIsAdmin(path.startsWith('/admin'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canAccessAdmin = isAllowedAdminUser(adminUser)

  return isAdmin && canAccessAdmin ? <AdminPage content={content} setContent={setContent} goTo={goTo} /> : <LandingPage content={content} goTo={goTo} />
}
