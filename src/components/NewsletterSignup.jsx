import { useEffect, useState } from 'react'
import { ArrowUpRight, Mail } from './icons'
import './NewsletterSignup.css'

const openEventName = 'soiraoya:open-newsletter'
const shownKey = 'soiraoya-newsletter-prompt-shown'

export default function NewsletterSignup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let alreadyShown = false
    try {
      alreadyShown = sessionStorage.getItem(shownKey) === 'true'
    } catch (storageError) {
      console.error('Could not read newsletter prompt state', storageError)
    }

    const timer = alreadyShown ? null : window.setTimeout(() => {
      setIsOpen(true)
      try {
        sessionStorage.setItem(shownKey, 'true')
      } catch (storageError) {
        console.error('Could not save newsletter prompt state', storageError)
      }
    }, 8000)
    const openFromFooter = () => {
      setIsOpen(true)
      setError('')
      setMessage('')
      try {
        sessionStorage.setItem(shownKey, 'true')
      } catch (storageError) {
        console.error('Could not save newsletter prompt state', storageError)
      }
    }
    window.addEventListener(openEventName, openFromFooter)
    return () => {
      if (timer !== null) window.clearTimeout(timer)
      window.removeEventListener(openEventName, openFromFooter)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const subscribe = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, consent: true }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not process your subscription.')
      setMessage(result.message || "You're subscribed. Thank you for joining our newsletter.")
      setEmail('')
    } catch (submitError) {
      setError(submitError.message || 'Could not process your subscription. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return <div className="newsletter-backdrop" onMouseDown={(event) => {
    if (event.target === event.currentTarget) setIsOpen(false)
  }}>
    <section className="newsletter-modal" role="dialog" aria-modal="true" aria-labelledby="newsletter-title">
      <button className="newsletter-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close newsletter signup">×</button>
      <span className="newsletter-icon"><Mail size={21} /></span>
      <p className="eyebrow">S.O. Iraoya Consulting</p>
      <h2 id="newsletter-title">A considered view on property.</h2>
      <p className="newsletter-description">Get occasional property insights, investment perspectives and company updates in your inbox.</p>
      {message ? <div className="newsletter-message newsletter-success" role="status">{message}</div> : <form onSubmit={subscribe}>
        <label className="newsletter-email-label" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        <label className="newsletter-consent"><input type="checkbox" required /> <span>I agree to receive email updates. I can unsubscribe at any time.</span></label>
        <label className="newsletter-honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
        {error && <p className="newsletter-message newsletter-error" role="alert">{error}</p>}
        <button type="submit" className="button button-dark" disabled={isSubmitting}>{isSubmitting ? 'Subscribing…' : 'Subscribe'} <ArrowUpRight size={17} /></button>
      </form>}
      <p className="newsletter-footnote">Read our <a href="/privacy-policy">Privacy Policy</a> and <a href="/data-usage">Data Usage Policy</a>.</p>
    </section>
  </div>
}
