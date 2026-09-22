import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'
import { ArrowUp, ArrowUpRight, Check, ChevronDown, Mail, MapPin, Menu, Phone, Whatsapp, X } from '../components/icons'

const filterProperties = (properties, filters) => properties.filter((property) => {
  const keyword = filters.keyword.toLowerCase()
  const title = filters.title.toLowerCase()
  const address = filters.address.toLowerCase()
  const listingType = String(property.listingType || 'For Sale').toLowerCase()
  return listingType === filters.listingType.toLowerCase()
    && (!keyword || [property.title, property.location, property.type, property.description].some((value) => String(value || '').toLowerCase().includes(keyword)))
    && (!title || property.title.toLowerCase().includes(title))
    && (!address || property.location.toLowerCase().includes(address))
})

export default function PropertySearchPage({ content, filters, goTo }) {
  const { showToast } = useToast()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', request: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const properties = [
    ...(content.gallery || []).map((property) => ({ ...property, listingType: property.listingType || 'For Sale' })),
    ...(content.rentalProperties || []),
  ]
  const results = filterProperties(properties, filters)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goHomeSection = (id) => {
    goTo('/')
    window.setTimeout(() => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }
  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.request) { setError('Select an area of interest before sending your request.'); return }
    try {
      const response = await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: content.contact?.email, subject: `New consultation request from ${form.name || 'website visitor'}`, text: [`Name: ${form.name}`, `Email: ${form.email}`, `Request: ${form.request}`, `Search: ${filters.listingType} properties in ${filters.address || 'any location'}`].join('\n') }) })
      if (!response.ok) throw new Error('Email delivery failed.')
      setSent(true)
      showToast('Your consultation request has been sent.', 'success')
    } catch (submitError) {
      setError(submitError.message)
      showToast(submitError.message, 'error')
    }
  }

  return <div className="property-search-page">
    <header className="site-header property-search-header"><Brand goTo={goTo} /><nav className={mobileOpen ? 'nav-open' : ''}><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><button type="button" className="property-search-nav-trigger" onClick={() => goHomeSection('#approach')}>About Us <ChevronDown size={14} /></button><button type="button" className="property-search-nav-trigger" onClick={() => goHomeSection('#services')}>Services <ChevronDown size={14} /></button><a href="#properties" onClick={(event) => { event.preventDefault(); goHomeSection('#properties') }}>Properties</a><a href="#invest" onClick={(event) => { event.preventDefault(); goHomeSection('#invest') }}>Invest</a><a href="#faq" onClick={(event) => { event.preventDefault(); goHomeSection('#faq') }}>FAQs</a><a href="#contact" onClick={(event) => { event.preventDefault(); scrollToContact() }}>Contact</a></nav><button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">{mobileOpen ? <X size={30} /> : <Menu size={30} />}</button><button className="header-cta" onClick={scrollToContact}>Start a conversation <ArrowUpRight size={16} /></button></header>
    <main>
      <section className="property-search-hero"><p className="eyebrow">Property search</p><h1>{filters.listingType} properties <em>for you.</em></h1><p>Explore available property opportunities and find the right next step with our advisory team.</p></section>
      <section className="property-results-section"><div className="property-results-heading"><div><p className="eyebrow">Search results</p><h2>{results.length} {filters.listingType.toLowerCase()} listings found.</h2></div></div>{results.length ? <div className="property-results-grid">{results.map((property) => <article className="property-result-card" key={property.title}><img src={property.image} alt={property.title} /><div><span>{property.type} · {property.listingType}</span><h3>{property.title}</h3><p><MapPin size={14} /> {property.location}</p><strong>{property.price}{property.listingType === 'For Rent' ? ' / month' : ''}</strong><button className="text-link" onClick={scrollToContact}>Contact about this property <ArrowUpRight size={16} /></button></div></article>)}</div> : <p className="property-search-empty">No matching properties found. Try a different keyword, title, or location.</p>}</section>
      <section id="contact" className="property-search-contact"><div><p className="eyebrow">Let’s talk property</p><h2>A better next step<br /><em>starts here.</em></h2><div className="contact-details"><span><MapPin size={17} /> {content.contact?.location}</span><span><Phone size={17} /> {content.contact?.phone}</span><span><Mail size={17} /> {content.contact?.email}</span></div></div><form onSubmit={submit}>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><h3>Thank you, {form.name || 'we have your note'}.</h3><p>Our advisory team will be in touch shortly.</p></div> : <><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>How can we help?<SearchableSelect value={form.request} onChange={(value) => setForm({ ...form, request: value })} ariaLabel="Consultation area" placeholder="Select an area of interest" options={(content.services || []).map((item) => ({ value: item.title, label: item.title }))} /></label>{error && <div className="login-error">{error}</div>}<button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button></>}</form></section>
    </main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand light goTo={goTo} /><p>Strategic real-estate advisory for decisions that create lasting value.</p></div><div className="footer-column"><p className="footer-label">Explore</p><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><a href="#services" onClick={(event) => { event.preventDefault(); goHomeSection('#services') }}>Our services</a><a href="#properties" onClick={(event) => { event.preventDefault(); goHomeSection('#properties') }}>Properties</a></div><div className="footer-column"><p className="footer-label">Contact</p><a href={`mailto:${content.contact?.email}`}>{content.contact?.email}</a><a href={`tel:${content.contact?.phone}`}>{content.contact?.phone}</a><span>{content.contact?.location}</span></div></div><div className="footer-bottom"><span>© 2026 S.O.Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div></footer>
    <a className="floating-whatsapp service-floating-whatsapp" href="https://wa.me/2349074091408" target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat"><Whatsapp size={25} /></a>{showBackToTop && <button className="floating-back-to-top service-floating-back" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={22} /></button>}
  </div>
}
