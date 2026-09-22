import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import { serviceDetails } from '../components/ServiceModal'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'
import { ArrowUp, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, Menu, Phone, Whatsapp, X } from '../components/icons'

export const slug = (title) => title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const serviceImages = {
  'Property & Asset Valuation': '/image/hero/hero-1.jpg',
  'Property Management': '/image/hero/hero-2.jpg',
  'Facility Management': '/image/hero/hero-4.jpg',
  'Project Management': '/image/hero/hero-5.jpg',
  'Real Estate Consultancy': '/image/hero/hero-3.jpg',
  'General Estate Agency': '/image/hero/hero-1.jpg',
  'Feasibility & Viability Appraisal': '/image/hero/hero-6.jpg',
}
const heroImages = Object.values(serviceImages)
const serviceTagline = 'Strategic real-estate advisory for decisions that create lasting value.'
const whatsappChatUrl = `https://wa.me/2349074091408?text=${encodeURIComponent('Hello, I would like to discuss a property opportunity.')}`

export default function ServicePage({ content, service, goTo }) {
  const { showToast } = useToast()
  const [heroIndex, setHeroIndex] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', request: '' })
  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % heroImages.length), 5000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const goToSection = (id) => {
    setMobileOpen(false)
    goTo('/')
    window.setTimeout(() => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }
  const openServiceRoute = (item) => {
    setServicesMenuOpen(false)
    setMobileOpen(false)
    goTo(`/services/${slug(item.title)}`)
  }
  const submit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    if (!form.request) {
      setSubmitError('Select an area of interest before sending your request.')
      return
    }
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: content.contact?.email || 'admin@soiraoyaconsulting.com.ng',
          subject: `New consultation request from ${form.name || 'website visitor'}`,
          text: [`Name: ${form.name || 'Not provided'}`, `Email: ${form.email || 'Not provided'}`, `Request: ${form.request}`, 'Message: A new consultation request was submitted from a service page.'].join('\n'),
        }),
      })
      if (!response.ok) throw new Error('Email delivery failed.')
      setSent(true)
      showToast('Your consultation request has been sent.', 'success')
    } catch (error) {
      setSubmitError(error.message || 'We could not send your request right now. Please try again.')
      showToast(error.message || 'We could not send your request right now. Please try again.', 'error')
    }
  }

  return <div className="service-page">
    <header className="site-header service-page-header"><Brand goTo={goTo} /><nav className={mobileOpen ? 'nav-open' : ''} aria-label="Main navigation"><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><div className={`about-nav-item ${aboutMenuOpen ? 'is-open' : ''}`} onMouseLeave={() => setAboutMenuOpen(false)}><button type="button" className="about-nav-trigger" aria-expanded={aboutMenuOpen} onClick={() => setAboutMenuOpen((open) => !open)}>About Us <ChevronDown size={14} /></button><ul className="about-submenu"><li><a href="/#approach" onClick={(event) => { event.preventDefault(); goToSection('#approach') }}>Company Overview</a></li><li><a href="/#management-team" onClick={(event) => { event.preventDefault(); goToSection('#management-team') }}>Management Team</a></li></ul></div><div className={`services-nav-item ${servicesMenuOpen ? 'is-open' : ''}`} onMouseLeave={() => setServicesMenuOpen(false)}><button type="button" className="services-nav-trigger" aria-expanded={servicesMenuOpen} onClick={() => setServicesMenuOpen((open) => !open)}>Services <ChevronDown size={14} /></button><ul className="services-submenu">{content.services.map((item) => <li key={item.title}><button type="button" onClick={() => openServiceRoute(item)}>{item.title}</button></li>)}</ul></div><a href="/#properties" onClick={(event) => { event.preventDefault(); goToSection('#properties') }}>Properties</a><a href="/#invest" onClick={(event) => { event.preventDefault(); goToSection('#invest') }}>Invest</a><a href="/#faq" onClick={(event) => { event.preventDefault(); goToSection('#faq') }}>FAQs</a><a href="#contact" onClick={(event) => { event.preventDefault(); goToSection('#contact') }}>Contact</a></nav><button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">{mobileOpen ? <X size={30} /> : <Menu size={30} />}</button><button className="header-cta" onClick={scrollToContact}>Start a conversation <ArrowUpRight size={16} /></button></header>
    <main>
      <section className="service-page-hero" style={{ '--service-image': `url(${heroImages[heroIndex]})` }}><div className="service-page-hero-copy"><p className="eyebrow">Our services</p><h1>{service.title}</h1><p>{serviceTagline}</p></div><div className="service-page-hero-controls"><button type="button" onClick={() => setHeroIndex((heroIndex - 1 + heroImages.length) % heroImages.length)} aria-label="Previous service image"><ChevronLeft size={18} /></button><button type="button" onClick={() => setHeroIndex((heroIndex + 1) % heroImages.length)} aria-label="Next service image"><ChevronRight size={18} /></button></div><div className="service-page-hero-dots" aria-label="Service image slides">{heroImages.map((image, index) => <button key={image} type="button" className={index === heroIndex ? 'active' : ''} onClick={() => setHeroIndex(index)} aria-label={`Show service image ${index + 1}`} />)}</div></section>
      <section className="service-page-content"><div><p className="eyebrow">Professional support</p><h2>Clear advice for better property decisions.</h2></div><div className="service-page-details"><p className="service-modal-label">How we help</p><ul>{(serviceDetails[service.title] || []).map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="button button-dark" onClick={scrollToContact}>Discuss this service <ArrowUpRight size={17} /></button></div></section>
      <section id="contact" className="service-page-contact"><div><p className="eyebrow">Let’s talk property</p><h2>{content.contact?.title || 'A better next step'}<br /><em>starts here.</em></h2><div className="service-page-contact-details"><span><MapPin size={17} /> {content.contact?.location || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos'}</span><span><Phone size={17} /> {content.contact?.phone || '0907 409 1408'}</span><span><Mail size={17} /> {content.contact?.email || 'info@soiraoyaconsulting.com.ng'}</span></div></div><form id="contact-form" onSubmit={submit}>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><h3>Thank you, {form.name || 'we have your note'}.</h3><p>Our advisory team will be in touch shortly.</p><button type="button" className="text-link" onClick={() => { setSent(false); setSubmitError('') }}>Send another message <ArrowUpRight size={16} /></button></div> : <><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Amaka Okafor" /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label><label>How can we help?<SearchableSelect value={form.request} onChange={(value) => setForm({ ...form, request: value })} ariaLabel="Consultation area" placeholder="Select an area of interest" options={(content.services || []).map((item) => ({ value: item.title, label: item.title }))} /></label>{submitError && <div className="login-error">{submitError}</div>}<button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button></>}</form></section>
    </main>
    <footer className="site-footer service-page-footer"><div className="footer-main"><div className="footer-brand"><Brand light goTo={goTo} /><p>Strategic real-estate advisory for decisions that create lasting value.</p></div><div className="footer-column"><p className="footer-label">Explore</p><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><a href="/#services" onClick={(event) => { event.preventDefault(); goTo('/') }}>Our services</a><a href="/#properties" onClick={(event) => { event.preventDefault(); goTo('/') }}>Properties</a></div><div className="footer-column"><p className="footer-label">Contact</p><a href="mailto:info@soiraoyaconsulting.com.ng">info@soiraoyaconsulting.com.ng</a><a href="tel:+2349074091408">0907 409 1408</a><span>Suite 30, Dolphin Plaza<br />Ikoyi, Lagos</span></div></div><div className="footer-bottom"><span>© 2026 S.O.Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div></footer>
    <a className="floating-whatsapp service-floating-whatsapp" href={whatsappChatUrl} target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat" title="Open WhatsApp chat"><Whatsapp size={25} /></a>
    {showBackToTop && <button className="floating-back-to-top service-floating-back" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"><ArrowUp size={22} /></button>}
  </div>
}

ServicePage.slug = slug