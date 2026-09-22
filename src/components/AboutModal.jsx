import { useEffect } from 'react'
import { ArrowUpRight, X } from './icons'

export default function AboutModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="about-modal-backdrop" role="presentation" onClick={onClose}>
    <section className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-modal-title" onClick={(event) => event.stopPropagation()}>
      <button className="about-modal-close" onClick={onClose} aria-label="Close about S.O. Iraoya Consulting"><X size={20} /></button>
      <div className="about-modal-heading">
        <p className="eyebrow">Welcome to S.O. Iraoya Consulting</p>
        <h2 id="about-modal-title">Company&apos;s Overview</h2>
        <p className="about-modal-intro">Professional insight for decisions that create lasting value.</p>
      </div>
      <div className="about-modal-content">
        <div className="about-modal-story">
          <p className="about-modal-label">About us</p>
          <p>S.O. Iraoya Consulting is a professional firm of Estate Surveyors &amp; Valuers delivering strategic real estate solutions to individuals, businesses, investors, and institutions.</p>
          <p>Our team combines professional expertise, market insight, and practical experience to provide comprehensive services across the Estate Surveying and Valuation profession. We are committed to helping our clients make informed property decisions, protect and maximise the value of their assets, and achieve their real estate objectives.</p>
          <p>At the heart of our practice is a simple philosophy: our success is measured by the value we create for our clients. We take the time to understand each client’s unique needs and work closely with them to deliver solutions that are commercially sound, practical, and results-driven.</p>
          <p>Built on professionalism, integrity, and client-focused service, S.O. Iraoya Consulting is committed to building lasting relationships and delivering excellence in every engagement.</p>
          <p>We don’t simply provide real estate services; we create value, unlock opportunities, and help our clients make better property decisions.</p>
        </div>
        <div className="about-modal-principles">
          <article><p className="about-modal-label">Our Vision</p><h3>Creating confident property decisions.</h3><p>To provide data-driven real estate solutions that create value, inform decisions, and meet the evolving needs of our clients.</p></article>
        </div>
      </div>
      <button className="button button-dark about-modal-action" onClick={onClose}>Explore our services <ArrowUpRight size={17} /></button>
    </section>
  </div>
}