import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import AboutSlider from '../components/AboutSlider'
import HeroSlider from '../components/HeroSlider'
import PropertyGallery from '../components/PropertyGallery'
import ServiceModal from '../components/ServiceModal'
import FaqSection from '../components/FaqSection'
import InvestWithUs from '../components/InvestWithUs'
import TestimonialsSection from '../components/TestimonialsSection'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'
import { ArrowUp, ArrowUpRight, BarChart3, Building2, Check, Facebook, Home, Instagram, Leaf, Linkedin, Mail, MapPin, Menu, Phone, Whatsapp, X, Youtube } from '../components/icons'

const trustMessages = [
  'Trusted by people making consequential property decisions',
  'Independent advice for the moments that matter',
  'Protecting capital. Growing confidence.',
  'Local knowledge with an institutional view',
  'Clarity for every stage of the property lifecycle',
  'Built on integrity, insight, and accountability',
  'Helping investors move with conviction',
  'Turning property complexity into clear next steps',
  'A considered partner for lasting value',
  'Strategic real-estate advisory, rooted in Lagos',
]

export default function LandingPage({ content, goTo }) {
  const { showToast } = useToast()
  const [sent, setSent] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [trustIndex, setTrustIndex] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', request: '' })
  const [submitError, setSubmitError] = useState('')
  const navItems = [
    { label: 'Overview', id: '#approach' },
    { label: 'Services', id: '#services' },
    { label: 'Properties', id: '#properties' },
    { label: 'Invest', id: '#invest' },
    { label: 'Testimonials', id: '#testimonials' },
    { label: 'FAQs', id: '#faq' },
    { label: 'Contact', id: '#contact' },
  ]
  const scrollToSection = (id) => {
    const section = document.querySelector(id)
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top, behavior: 'smooth' })
  }
  const scrollToContact = () => scrollToSection('#contact')
  const serviceIcons = { 'Valuation & Advisory': BarChart3, 'Development Strategy': Building2, 'Property Management': Home, 'Investment Analysis': Leaf, 'Property Listing': Building2 }
  const handleNavClick = (event, id) => {
    event.preventDefault()
    setMobileOpen(false)
    scrollToSection(id)
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
          text: [
            `Name: ${form.name || 'Not provided'}`,
            `Email: ${form.email || 'Not provided'}`,
            `Request: ${form.request || 'Not provided'}`,
            `Message: A new consultation request was submitted from the website.`,
          ].join('\n'),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || 'Email delivery failed.')
      }

      setSent(true)
      showToast('Your consultation request has been sent.', 'success')
    } catch (error) {
      setSubmitError(error.message || 'We could not send your request right now. Please try again.')
      showToast(error.message || 'We could not send your request right now. Please try again.', 'error')
    }
  }
  useEffect(() => { const timer = window.setInterval(() => setTrustIndex((index) => (index + 1) % trustMessages.length), 4000); return () => window.clearInterval(timer) }, [])
  useEffect(() => { const onScroll = () => setShowBackToTop(window.scrollY > 500); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])

  return <div className="site-shell">
    <header className="site-header"><Brand goTo={goTo} /><nav className={mobileOpen ? 'nav-open' : ''}>{navItems.map((item) => <a key={item.id} href={item.id} onClick={(event) => handleNavClick(event, item.id)}>{item.label}</a>)}</nav><button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X size={30} /> : <Menu size={30} />}</button><button className="header-cta" onClick={scrollToContact}>Start a conversation <ArrowUpRight size={16} /></button></header>
    <main>
      <HeroSlider slides={content.heroSlides || []} content={content} onContact={scrollToContact} />
      <section className="trust-strip"><p className="trust-message" key={trustIndex}>{trustMessages[trustIndex]}</p><div className="trust-items"><span>22+ <small>Years of experience</small></span><span>RC 9178187 <small>Corporate affairs commission</small></span><span>LAGOS <small>Rooted in the market</small></span></div></section>
      <AboutSlider slides={content.aboutSlides || []} />
      <section id="services" className="services-section"><div className="section-head"><div><p className="eyebrow">What we do</p><h2>Expertise that moves<br /><em>assets forward.</em></h2></div><p className="head-note">We advise across the full property lifecycle, from the first feasibility question to the long-term work of making an asset perform.</p></div><div className="service-grid">{(content.services || []).map((service) => { const Icon = typeof service.icon === 'function' ? service.icon : serviceIcons[service.title] || Building2; return <button className="service-card" key={service.title} onClick={() => setSelectedService(service)} aria-label={`View details about ${service.title}`}><Icon size={25} strokeWidth={1.5} /><h3>{service.title}</h3><p>{service.text}</p><span className="service-card-arrow"><ArrowUpRight size={19} /></span></button> })}</div></section>
      <PropertyGallery onContact={scrollToContact} properties={content.gallery || []} />
      <FaqSection items={content.faqs || []} onContact={scrollToContact} />
      <InvestWithUs items={content.investOpportunities || []} onContact={scrollToContact} />
      <TestimonialsSection testimonials={content.testimonials || []} contactEmail={content.contact?.email} />
      <section id="contact" className="contact-section"><div><p className="eyebrow">Let’s talk property</p><h2>{content.contact?.title || 'A better next step'}<br /><em>starts here.</em></h2><div className="contact-details"><span><MapPin size={17} /> {content.contact?.location || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos'}</span><span><Phone size={17} /> {content.contact?.phone || '0907 409 1408'}</span><span><Mail size={17} /> {content.contact?.email || 'info@soiraoyaconsulting.com.ng'}</span></div></div><form onSubmit={submit}>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><h3>Thank you, {form.name || 'we have your note'}.</h3><p>Our advisory team will be in touch shortly.</p><button type="button" className="text-link" onClick={() => { setSent(false); setSubmitError('') }}>Send another message <ArrowUpRight size={16} /></button></div> : <><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Amaka Okafor" /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label><label>How can we help?<SearchableSelect value={form.request} onChange={(value) => setForm({ ...form, request: value })} ariaLabel="Consultation area" placeholder="Select an area of interest" options={[{ value: 'Property valuation', label: 'Property valuation' }, { value: 'Investment advisory', label: 'Investment advisory' }, { value: 'Development strategy', label: 'Development strategy' }, { value: 'Property management', label: 'Property management' }, { value: 'Property listing', label: 'Property listing' }]} /></label>{submitError && <div className="login-error">{submitError}</div>}<button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button></>}</form></section>
    </main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand light goTo={goTo} /><p>Strategic real-estate advisory for decisions that create lasting value.</p></div><div className="footer-column"><p className="footer-label">Explore</p><a href="#approach">About us</a><a href="#services">Our services</a><a href="#properties">Properties</a><a href="#faq">FAQs</a></div><div className="footer-column"><p className="footer-label">Contact</p><a href="mailto:info@soiraoyaconsulting.com.ng">info@soiraoyaconsulting.com.ng</a><a href="tel:+2349074091408">0907 409 1408</a><span>Suite 30, Dolphin Plaza<br />Ikoyi, Lagos</span></div><div className="footer-column footer-socials"><p className="footer-label">Follow our work</p><div className="social-links"><a className="social-facebook" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a><a className="social-instagram" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a className="social-linkedin" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a className="social-youtube" href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a></div></div></div><div className="footer-bottom"><span>© 2026 S.O.Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div></footer>
    <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} onContact={() => { setSelectedService(null); scrollToContact() }} />
    <a className="floating-whatsapp" href="https://wa.me/2349074091408" target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp"><Whatsapp size={25} /></a>
    {showBackToTop && <button className="floating-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"><ArrowUp size={22} /></button>}
  </div>
}
