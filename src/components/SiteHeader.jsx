import { useState } from 'react'
import Brand from './Brand'
import { ArrowUpRight, ChevronDown, Menu, X } from './icons'

const serviceSlug = (title) => title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function SiteHeader({ content, goTo, onContact }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const services = content.services || []

  const navigate = (event, path) => {
    event.preventDefault()
    setMobileOpen(false)
    setServicesOpen(false)
    goTo(path)
  }

  const navigateToSection = (event, section) => {
    event.preventDefault()
    setMobileOpen(false)
    setServicesOpen(false)
    if (window.location.pathname === '/' && document.querySelector(section)) {
      document.querySelector(section).scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    goTo('/')
    window.setTimeout(() => document.querySelector(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const visitContact = (event) => {
    event.preventDefault()
    setMobileOpen(false)
    setServicesOpen(false)
    onContact?.()
  }

  const openService = (service) => {
    setMobileOpen(false)
    setServicesOpen(false)
    goTo(service.title === 'Real Estate Portfolio Management' ? '/portfolio-management' : `/services/${serviceSlug(service.title)}`)
  }

  return <header className="site-header shared-site-header">
    <Brand goTo={goTo} />
    <nav className={mobileOpen ? 'nav-open' : ''} aria-label="Main navigation">
      <a href="/#approach" onClick={(event) => navigateToSection(event, '#approach')}>About</a>
      <div className={`services-nav-item ${servicesOpen ? 'is-open' : ''}`} onMouseLeave={() => setServicesOpen(false)}>
        <button type="button" className="services-nav-trigger" aria-expanded={servicesOpen} onClick={() => setServicesOpen((open) => !open)}>Management <ChevronDown size={14} /></button>
        <ul className="services-submenu">
          {services.map((service) => <li key={service.title}><button type="button" onClick={() => openService(service)}>{service.title}</button></li>)}
        </ul>
      </div>
      <a href="/properties/search?listingType=For+Rent" onClick={(event) => navigate(event, '/properties/search?listingType=For+Rent')}>Shortlets</a>
      <a href="/properties" onClick={(event) => navigate(event, '/properties')}>Buy &amp; rent</a>
      <a href="/properties/search?keyword=land" onClick={(event) => navigate(event, '/properties/search?keyword=land')}>Acres</a>
      <a href="/portfolio-management" onClick={(event) => navigate(event, '/portfolio-management')}>Portfolio</a>
      <a href="/services/property-management" onClick={(event) => navigate(event, '/services/property-management')}>RentAssist</a>
      <a href="/#faq" onClick={(event) => navigateToSection(event, '#faq')}>Blog</a>
      <a href="/#contact" onClick={visitContact}>Contact</a>
    </nav>
    <button type="button" className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>{mobileOpen ? <X size={27} /> : <Menu size={27} />}</button>
    <button type="button" className="header-cta" onClick={visitContact}>Reach us <ArrowUpRight size={16} /></button>
  </header>
}
