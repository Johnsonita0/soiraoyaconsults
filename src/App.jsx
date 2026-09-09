import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import { seedContent } from './data/content'
import './css/App.css'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname.startsWith('/admin'))
  const [content, setContent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soiraoya-content')) || seedContent } catch { return seedContent }
  })

  useEffect(() => {
    const onPopState = () => setIsAdmin(window.location.pathname.startsWith('/admin'))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const goTo = (path) => {
    window.history.pushState({}, '', path)
    setIsAdmin(path.startsWith('/admin'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return isAdmin ? <AdminPage content={content} setContent={setContent} goTo={goTo} /> : <LandingPage content={content} goTo={goTo} />
}
