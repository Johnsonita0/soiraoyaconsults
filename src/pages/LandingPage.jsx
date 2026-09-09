import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import AboutSlider from '../components/AboutSlider'
import HeroSlider from '../components/HeroSlider'
import PropertyGallery from '../components/PropertyGallery'
import ServiceModal from '../components/ServiceModal'
import FaqSection from '../components/FaqSection'
import InvestWithUs from '../components/InvestWithUs'
import { ArrowUpRight, Check, Mail, MapPin, Menu, Phone, X } from '../components/icons'
import { heroSlides } from '../data/content'

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
  const [sent, setSent] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [trustIndex, setTrustIndex] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', request: '' })
  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  const submit = (event) => { event.preventDefault(); setSent(true) }
  useEffect(() => { const timer = window.setInterval(() => setTrustIndex((index) => (index + 1) % trustMessages.length), 4000); return () => window.clearInterval(timer) }, [])

  return <div className="site-shell">
    <header className="site-header"><Brand goTo={goTo} /><nav className={mobileOpen ? 'nav-open' : ''}><a href="#approach" onClick={() => setMobileOpen(false)}>Our approach</a><a href="#services" onClick={() => setMobileOpen(false)}>Expertise</a><a href="#insight" onClick={() => setMobileOpen(false)}>Insights</a><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></nav><button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button><button className="header-cta" onClick={scrollToContact}>Start a conversation <ArrowUpRight size={16} /></button></header>
    <main>
      <HeroSlider slides={heroSlides} content={content} onContact={scrollToContact} />
      <section className="trust-strip"><p className="trust-message" key={trustIndex}>{trustMessages[trustIndex]}</p><div className="trust-items"><span>22+ <small>Years of experience</small></span><span>RC 9178187 <small>Corporate affairs commission</small></span><span>LAGOS <small>Rooted in the market</small></span></div></section>
      <AboutSlider />
      <section id="services" className="services-section"><div className="section-head"><div><p className="eyebrow">What we do</p><h2>Expertise that moves<br /><em>assets forward.</em></h2></div><p className="head-note">We advise across the full property lifecycle, from the first feasibility question to the long-term work of making an asset perform.</p></div><div className="service-grid">{content.services.map((service) => { const Icon = service.icon; return <button className="service-card" key={service.title} onClick={() => setSelectedService(service)} aria-label={`View details about ${service.title}`}><Icon size={25} strokeWidth={1.5} /><h3>{service.title}</h3><p>{service.text}</p><span className="service-card-arrow"><ArrowUpRight size={19} /></span></button> })}</div></section>
      <PropertyGallery onContact={scrollToContact} />
      <FaqSection onContact={scrollToContact} />
      <InvestWithUs onContact={scrollToContact} />
      <section id="contact" className="contact-section"><div><p className="eyebrow">Let’s talk property</p><h2>A better next step<br /><em>starts here.</em></h2><div className="contact-details"><span><MapPin size={17} /> Suite 30, Dolphin Plaza, Ikoyi, Lagos</span><span><Phone size={17} /> 0907 409 1408</span><span><Mail size={17} /> info@soiraoyaconsulting.com.ng</span></div></div><form onSubmit={submit}>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><h3>Thank you, {form.name || 'we have your note'}.</h3><p>Our advisory team will be in touch shortly.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Send another message <ArrowUpRight size={16} /></button></div> : <><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Amaka Okafor" /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label><label>How can we help?<select required value={form.request} onChange={(event) => setForm({ ...form, request: event.target.value })}><option value="">Select an area of interest</option><option>Property valuation</option><option>Investment advisory</option><option>Development strategy</option><option>Property management</option><option>Property listing</option></select></label><button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button></>}</form></section>
    </main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand light goTo={goTo} /><p>Strategic real-estate advisory for decisions that create lasting value.</p></div><div className="footer-column"><p className="footer-label">Explore</p><a href="#approach">About us</a><a href="#services">Our services</a><a href="#properties">Properties</a><a href="#faq">FAQs</a></div><div className="footer-column"><p className="footer-label">Contact</p><a href="mailto:info@soiraoyaconsulting.com.ng">info@soiraoyaconsulting.com.ng</a><a href="tel:+2349074091408">0907 409 1408</a><span>Suite 30, Dolphin Plaza<br />Ikoyi, Lagos</span></div><div className="footer-column footer-socials"><p className="footer-label">Follow our work</p><div className="social-links"><a className="social-facebook" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a><a className="social-instagram" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a><a className="social-linkedin" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a><a className="social-youtube" href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a></div><button className="admin-link" onClick={() => goTo('/admin')}>Admin workspace <ArrowUpRight size={14} /></button></div></div><div className="footer-bottom"><span>© 2026 S.O.Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div></footer>
    <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} onContact={() => { setSelectedService(null); scrollToContact() }} />
  </div>
}
