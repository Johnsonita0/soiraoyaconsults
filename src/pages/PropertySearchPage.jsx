import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'
import { ArrowUp, ArrowUpRight, Check, ChevronDown, Mail, MapPin, Menu, Phone, Whatsapp, X } from '../components/icons'
import './PropertySearch.css'

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
  const [searchForm, setSearchForm] = useState(filters)
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
  const submitSearch = (event) => {
    event.preventDefault()
    const query = new URLSearchParams(searchForm)
    goTo(`/properties/search?${query.toString()}`)
  }
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
    <header className="site-header property-search-header"><Brand goTo={goTo} /><nav className={mobileOpen ? 'nav-open' : ''}><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><button type="button" className="property-search-nav-trigger" onClick={() => goHomeSection('#approach')}>About Us <ChevronDown size={14} /></button><button type="button" className="property-search-nav-trigger" onClick={() => goHomeSection('#services')}>Services <ChevronDown size={14} /></button><a href="/properties" onClick={(event) => { event.preventDefault(); goTo('/properties') }}>Properties</a><a href="/portfolio-management" onClick={(event) => { event.preventDefault(); goTo('/portfolio-management') }}>Portfolio management</a><a href="#contact" onClick={(event) => { event.preventDefault(); scrollToContact() }}>Contact</a></nav><button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">{mobileOpen ? <X size={30} /> : <Menu size={30} />}</button><button className="header-cta" onClick={scrollToContact}>List your property <ArrowUpRight size={16} /></button></header>
    <main>
      <section className="property-search-hero" data-aos="fade-up"><p className="eyebrow">Property listings</p><h1>Find a property that fits <em>your plans.</em></h1><p>Explore selected sale and rental opportunities. Contact our team to discuss a listing or ask us to help identify a property that meets your requirements.</p><button type="button" className="button button-light" onClick={scrollToContact}>List your property <ArrowUpRight size={17} /></button></section>
      <section className="property-results-section" data-aos="fade-up">
        <div className="property-results-heading"><div><p className="eyebrow">Available properties</p><h2>{results.length} {filters.listingType.toLowerCase()} listings found.</h2></div></div>
        <form className="property-listing-search" onSubmit={submitSearch}>
          <label>Listing type<select value={searchForm.listingType} onChange={(event) => setSearchForm({ ...searchForm, listingType: event.target.value })}><option>For Sale</option><option>For Rent</option></select></label>
          <label>Keyword<input value={searchForm.keyword} onChange={(event) => setSearchForm({ ...searchForm, keyword: event.target.value })} placeholder="Property, type or area" /></label>
          <label>Property title<input value={searchForm.title} onChange={(event) => setSearchForm({ ...searchForm, title: event.target.value })} placeholder="Enter a property name" /></label>
          <label>Location<input value={searchForm.address} onChange={(event) => setSearchForm({ ...searchForm, address: event.target.value })} placeholder="City or neighbourhood" /></label>
          <button type="submit" className="button button-dark">Search properties <ArrowUpRight size={16} /></button>
        </form>
        {results.length ? <div className="property-results-grid">{results.map((property, index) => <article className="property-result-card" key={property.title} data-aos={['fade-up', 'zoom-in', 'fade-left'][index % 3]}><img src={property.image} alt={property.title} /><div><span>{property.type} · {property.listingType}</span><h3>{property.title}</h3><p><MapPin size={14} /> {property.location}</p><strong>{property.price}{property.listingType === 'For Rent' ? ' / month' : ''}</strong><button className="text-link" onClick={scrollToContact}>Contact about this property <ArrowUpRight size={16} /></button></div></article>)}</div> : <p className="property-search-empty">No matching properties found. Try a different keyword, title, or location, or <button type="button" className="text-link" onClick={scrollToContact}>tell us what you are looking for</button>.</p>}
      </section>
      <section id="contact" className="property-search-contact" data-aos="fade-up"><div><p className="eyebrow">List a property or ask our team</p><h2>Let’s discuss your property.<br /><em>Start here.</em></h2><div className="contact-details"><span><MapPin size={17} /> {content.contact?.location}</span><span><Phone size={17} /> {content.contact?.phone}</span><span><Mail size={17} /> {content.contact?.email}</span></div></div><form onSubmit={submit}>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><h3>Thank you, {form.name || 'we have your note'}.</h3><p>Our advisory team will be in touch shortly.</p></div> : <><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>How can we help?<SearchableSelect value={form.request} onChange={(value) => setForm({ ...form, request: value })} ariaLabel="Consultation area" placeholder="Select an area of interest" options={[...(content.services || []).map((item) => ({ value: item.title, label: item.title })), { value: 'Property listing or sale/letting', label: 'Property listing or sale/letting' }]} /></label>{error && <div className="login-error">{error}</div>}<button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button></>}</form></section>
    </main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand light goTo={goTo} /><p>Professional real estate management and informed investment advice for lasting asset performance.</p></div><div className="footer-column"><p className="footer-label">Explore</p><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><a href="#services" onClick={(event) => { event.preventDefault(); goHomeSection('#services') }}>Our services</a><a href="#properties" onClick={(event) => { event.preventDefault(); goHomeSection('#properties') }}>Properties</a></div><div className="footer-column"><p className="footer-label">Contact</p><a href={`mailto:${content.contact?.email}`}>{content.contact?.email}</a><a href={`tel:${content.contact?.phone}`}>{content.contact?.phone}</a><span>{content.contact?.location}</span></div></div><div className="footer-bottom"><span>© S.O. Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div></footer>
    <a className="floating-whatsapp service-floating-whatsapp" href="https://wa.me/2349074091408" target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat"><Whatsapp size={25} /></a>{showBackToTop && <button className="floating-back-to-top service-floating-back" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={22} /></button>}
  </div>
}
