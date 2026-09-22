import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import AboutModal from '../components/AboutModal'
import HeroSlider from '../components/HeroSlider'
import PropertyGallery from '../components/PropertyGallery'
import ServiceModal from '../components/ServiceModal'
import { slug as serviceSlug } from './ServicePage'
import FaqSection from '../components/FaqSection'
import InvestWithUs from '../components/InvestWithUs'
import TestimonialsSection from '../components/TestimonialsSection'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'
import { ArrowUp, ArrowUpRight, BarChart3, Building2, Check, ChevronDown, Facebook, Home, Instagram, Leaf, Linkedin, Mail, MapPin, Menu, Phone, Whatsapp, X, Youtube } from '../components/icons'

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

const whatsappTips = [
  'Chat with us on WhatsApp',
  'Ask us about your property',
  'Let’s discuss your next move',
  'Get property advice today',
  'Message our advisory team',
  'Start your property conversation',
  'Find clarity for your property',
]

const whatsappChatUrl = `https://wa.me/2349074091408?text=${encodeURIComponent('Hello, I would like to discuss a property opportunity.')}`

export default function LandingPage({ content, goTo }) {
  const { showToast } = useToast()
  const [sent, setSent] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [trustIndex, setTrustIndex] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showWhatsappTip, setShowWhatsappTip] = useState(true)
  const [showAboutModal, setShowAboutModal] = useState(true)
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [propertySearch, setPropertySearch] = useState(null)
  const [whatsappTipIndex, setWhatsappTipIndex] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', request: '' })
  const [submitError, setSubmitError] = useState('')
  const leadershipMembers = [
    {
      name: 'Dr. Olusegun Iraoya, PhD',
      role: 'Principal Partner',
      meta: 'RSV, NIESV | B.Sc (QS) | M.Sc | PhD',
      description: '22+ years’ experience spanning estate survey, property valuation, facilities management, and strategic advisory across public and private sector assets.',
      tags: ['Asset Valuation', 'Facilities Mgmt', 'Project Finance', 'Investment Analysis'],
    },
    {
      name: 'Dr. Akinbola Kazeem, PhD',
      role: 'Advisory Partner',
      meta: 'Estate Management | QS | Building Tech | Urban Planning',
      description: 'Former Senior Facilities Management Surveyor at Jide Taiwo & Co. with strong expertise in sustainable urban development, asset valuation, and performance-driven property strategy.',
      tags: ['Asset Valuation', 'Facilities Mgmt', 'Sustainability', 'Urban Planning'],
    },
  ]
  const supportMembers = [
    { name: 'Olamide Olawale Oladale', role: 'B.Sc. Quantity Surveying', initials: 'OO' },
    { name: 'Glory Danito', role: 'B.Sc. Business Development', initials: 'GD' },
    { name: 'Wisdom Asom Ayongha', role: 'B.Sc. History & International Relations', initials: 'WA' },
    { name: 'Israel Anselm', role: 'B.Sc. Banking & Finance', initials: 'IA' },
  ]
  const showTeamAndAwards = true
  const showAwards = false
  const aboutItems = [
    { label: 'Company Overview', id: '#approach' },
    { label: 'Professional Affiliates', id: '#professional-affiliates' },
    ...(showTeamAndAwards ? [{ label: 'Management Team', id: '#management-team' }] : []),
    ...(showAwards ? [{ label: 'Awards & Accolades', id: '#awards-accolades' }] : []),
  ]
  const navItems = [
    { label: 'Properties', id: '#properties' },
    { label: 'Invest', id: '#invest' },
    { label: 'Testimonials', id: '#testimonials' },
    { label: 'FAQs', id: '#faq' },
    { label: 'Contact', id: '#contact' },
  ]
  const serviceNavItems = content.services || []
  const scrollToSection = (id) => {
    const section = document.querySelector(id)
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top, behavior: 'smooth' })
  }
  const scrollToContact = () => scrollToSection('#contact')
  const serviceIcons = { 'Property & Asset Valuation': BarChart3, 'Property Management': Home, 'Facility Management': Building2, 'Project Management': Building2, 'Real Estate Consultancy': Leaf, 'General Estate Agency': Home, 'Feasibility & Viability Appraisal': BarChart3 }
  const handleNavClick = (event, id) => {
    event.preventDefault()
    setMobileOpen(false)
    scrollToSection(id)
  }
  const handleAboutItemClick = (event, id) => {
    handleNavClick(event, id)
    setAboutMenuOpen(false)
  }
  const openServiceFromMenu = (service) => {
    setServicesMenuOpen(false)
    setMobileOpen(false)
    goTo(`/services/${serviceSlug(service.title)}`)
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
  useEffect(() => {
    let cancelled = false
    let hideTip
    let nextTip
    const showNextTip = () => {
      const displayDuration = 3500 + Math.floor(Math.random() * 1501)
      hideTip = window.setTimeout(() => {
        if (cancelled) return
        setShowWhatsappTip(false)
        nextTip = window.setTimeout(() => {
          if (cancelled) return
          setWhatsappTipIndex((index) => (index + 1 + Math.floor(Math.random() * (whatsappTips.length - 1))) % whatsappTips.length)
          setShowWhatsappTip(true)
          showNextTip()
        }, 7000)
      }, displayDuration)
    }
    showNextTip()
    return () => {
      cancelled = true
      window.clearTimeout(hideTip)
      window.clearTimeout(nextTip)
    }
  }, [])

  return <div className="site-shell">
    <header className="site-header"><Brand goTo={goTo} /><nav className={mobileOpen ? 'nav-open' : ''}><div className={`about-nav-item ${aboutMenuOpen ? 'is-open' : ''}`} onMouseLeave={() => setAboutMenuOpen(false)}><button type="button" className="about-nav-trigger" aria-expanded={aboutMenuOpen} onClick={() => setAboutMenuOpen((open) => !open)}>About Us <ChevronDown size={14} /></button><ul className="about-submenu">{aboutItems.map((item) => <li key={item.id}><a href={item.id} onClick={(event) => handleAboutItemClick(event, item.id)}>{item.label}</a></li>)}</ul></div><div className={`services-nav-item ${servicesMenuOpen ? 'is-open' : ''}`} onMouseLeave={() => setServicesMenuOpen(false)}><button type="button" className="services-nav-trigger" aria-expanded={servicesMenuOpen} onClick={() => setServicesMenuOpen((open) => !open)}>Services <ChevronDown size={14} /></button><ul className="services-submenu">{serviceNavItems.map((item) => <li key={item.title}><button type="button" onClick={() => openServiceFromMenu(item)}>{item.title}</button></li>)}</ul></div>{navItems.map((item) => <a key={item.id} href={item.id} onClick={(event) => handleNavClick(event, item.id)}>{item.label}</a>)}</nav><button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X size={30} /> : <Menu size={30} />}</button><button className="header-cta" onClick={scrollToContact}>Start a conversation <ArrowUpRight size={16} /></button></header>
    <main>
      <HeroSlider slides={content.heroSlides || []} content={content} onContact={scrollToContact} onSearch={(filters) => { setPropertySearch(filters); goTo(`/properties/search?${new URLSearchParams(filters).toString()}`) }} />
      <section className="trust-strip"><p className="trust-message" key={trustIndex}>{trustMessages[trustIndex]}</p><div className="trust-items"><span>22+ <small>Years of experience</small></span><span>RC 9178187 <small>Corporate affairs commission</small></span><span>LAGOS <small>Rooted in the market</small></span></div></section>
      <section id="approach" className="about-section">
        <div className="section-head about-lead">
          <div>
            <p className="eyebrow">Company overview</p>
            <h2>Company <em>overview</em></h2>
          </div>
        </div>

        <div className="about-grid">
          <article className="about-card about-fullwidth">
            {/* <p className="about-card-label">About us</p> */}
            <div className="about-card-text about-company-copy">
              <p><strong>S.O. Iraoya Consulting</strong> is a professional firm of Estate Surveyors &amp; Valuers delivering strategic real estate solutions to individuals, businesses, investors, and institutions.</p>
              <p>Our team combines professional expertise, market insight, and practical experience to provide comprehensive services across the Estate Surveying and Valuation profession. We are committed to helping our clients make informed property decisions, protect and maximise the value of their assets, and achieve their real estate objectives.</p>
              <p>At the heart of our practice is a simple philosophy: our success is measured by the value we create for our clients. We take the time to understand each client’s unique needs and work closely with them to deliver solutions that are commercially sound, practical, and results-driven.</p>
              <p>Built on professionalism, integrity, and client-focused service, S.O. Iraoya Consulting is committed to building lasting relationships and delivering excellence in every engagement.</p>
              <p>We don’t simply provide real estate services; we create value, unlock opportunities, and help our clients make better property decisions.</p>
            </div>
          </article>

          <article className="about-card">
            <h3>Our Vision</h3>
            <p className="about-card-text">To provide data-driven real estate solutions that create value, inform decisions, and meet the evolving needs of our clients.</p>
            <ul className="about-points">
              <li>Trusted advisory support</li>
              <li>Long-term value creation</li>
            </ul>
          </article>

          <div className="about-values-heading">
            <p className="about-card-label">Our foundation</p>
            <h3>Core values</h3>
            <p className="about-card-text">The principles that guide how we advise, collaborate, and create value for our clients.</p>
          </div>
          <div className="about-values-grid">
            <article className="about-value-card"><span className="about-value-icon" aria-hidden="true">✓</span><h4>Integrity</h4><p>We act with honesty, accountability, and professional responsibility in every engagement.</p></article>
            <article className="about-value-card"><span className="about-value-icon" aria-hidden="true">◎</span><h4>Relationships</h4><p>We build lasting partnerships through listening, trust, and dependable support.</p></article>
            <article className="about-value-card"><span className="about-value-icon" aria-hidden="true">↗</span><h4>Growth mindset</h4><p>We stay curious, learn continuously, and look for better ways to solve property challenges.</p></article>
            <article className="about-value-card"><span className="about-value-icon" aria-hidden="true">♥</span><h4>Care</h4><p>We bring thoughtfulness and attention to the people, assets, and outcomes entrusted to us.</p></article>
          </div>
        </div>
      </section>
      {showTeamAndAwards && <section id="management-team" className="leadership-section" aria-label="Leadership and support team">
        <div className="leadership-banner">
          <div className="leadership-badge" aria-hidden="true"><span /></div>
          <h2>OUR LEADERSHIP</h2>
        </div>

        <div className="leadership-grid">
          {leadershipMembers.map((member) => (
            <article key={member.name} className="leadership-member-card">
              <div className="leadership-avatar" aria-label={member.name}>{member.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
              <div className="leadership-role">{member.role}</div>
              <h3>{member.name}</h3>
              <p className="leadership-meta">{member.meta}</p>
              <p className="leadership-description">{member.description}</p>
              <div className="leadership-tags">
                {member.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>

        <div className="support-banner">SUPPORT TEAM</div>

        <div className="support-grid">
          {supportMembers.map((member) => (
            <article key={member.name} className="support-member-card">
              <div className="support-avatar" aria-label={member.name}>{member.initials}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </article>
          ))}
        </div>

      </section>}
      <section className="about-detail-section" aria-label="About us details">
        <article id="professional-affiliates" className="about-detail-card affiliates-detail-card"><p className="eyebrow">Professional affiliates</p><h2>Professional <em>Affiliates</em></h2><p>Our professional network connects clients and colleagues to the standards, knowledge, and international perspective shaping estate surveying and valuation.</p><ul className="affiliate-list"><li><div className="affiliate-logo"><img src="/logo/esvarbon.jpg" alt="ESVARBON logo" /></div><div><strong>ESVARBON</strong><span>Regulates and controls the practice of estate surveying and valuation in Nigeria.</span></div></li><li><div className="affiliate-logo"><img src="/logo/niesv.jpg" alt="NIESV logo" /></div><div><strong>NIESV</strong><span>Supports the interests and professional development of estate surveyors and valuers in Nigeria.</span></div></li><li><div className="affiliate-logo"><img src="/logo/fiabci.jpg" alt="FIABCI logo" /></div><div><strong>FIABCI</strong><span>Connects real estate professionals for knowledge sharing and international business.</span></div></li><li><div className="affiliate-logo"><img src="/logo/rics.jpg" alt="RICS logo" /></div><div><strong>RICS</strong><span>Accredits professionals across land, property, and construction sectors worldwide.</span></div></li><li><div className="affiliate-logo"><img src="/logo/afres.jpg" alt="AfRES logo" /></div><div><strong>AfRES</strong><span>Promotes networking, research, and education among property professionals across Africa.</span></div></li></ul><a className="text-link" href="#contact" onClick={(event) => handleNavClick(event, '#contact')}>Start a conversation <ArrowUpRight size={16} /></a></article>
      </section>
      {showAwards && <section id="awards-accolades" className="awards-section" aria-label="Awards and accolades">
        <div className="awards-section-head"><div><p className="eyebrow">Awards &amp; accolades</p><h2>Recognition that reflects <em>excellence.</em></h2></div><p>A record of professional recognition earned through disciplined service, industry contribution, and lasting commitment to the real estate profession.</p></div>
        <div className="awards-grid"><article className="award-card"><span>2019</span><h3>Outstanding Estate Surveying Firm</h3><p>NIESV, Lagos Branch</p></article><article className="award-card"><span>2019</span><h3>Chairman’s Special Award of Recognition</h3><p>NIESV, Lagos Branch</p></article><article className="award-card"><span>2017</span><h3>Real Estate Agency of the Year</h3><p>Real Estate Excellence Awards</p></article><article className="award-card"><span>2016</span><h3>Recognition of Contribution to the Growth of the Faculty &amp; Institution</h3><p>Nigerian Institution of Estate Surveyors and Valuers</p></article><article className="award-card"><span>2015</span><h3>Best Real Estate Support Service Firm</h3><p>Real Estate Unite</p></article><article className="award-card"><span>2015</span><h3>Award for Outstanding Achievement and Appreciation</h3><p>Re.in.vent</p></article></div>
      </section>}
      <section id="services" className="services-section"><div className="section-head"><div><p className="eyebrow">What we do</p><h2>Expertise that moves<br /><em>assets forward.</em></h2></div><p className="head-note">We advise across the full property lifecycle, from the first feasibility question to the long-term work of making an asset perform.</p></div><div className="service-grid">{(content.services || []).map((service) => { const Icon = typeof service.icon === 'function' ? service.icon : serviceIcons[service.title] || Building2; return <button className="service-card" key={service.title} onClick={() => setSelectedService(service)} aria-label={`View details about ${service.title}`}><Icon size={25} strokeWidth={1.5} /><h3>{service.title}</h3><p>{service.text}</p><span className="service-card-arrow"><ArrowUpRight size={19} /></span></button> })}</div></section>
      <PropertyGallery onContact={scrollToContact} properties={content.gallery || []} searchFilters={propertySearch} />
      <FaqSection items={content.faqs || []} onContact={scrollToContact} />
      <InvestWithUs items={content.investOpportunities || []} properties={content.gallery || []} rentalProperties={content.rentalProperties || []} onContact={scrollToContact} />
      <TestimonialsSection testimonials={content.testimonials || []} contactEmail={content.contact?.email} />
      <section id="contact" className="contact-section"><div><p className="eyebrow">Let’s talk property</p><h2>{content.contact?.title || 'A better next step'}<br /><em>starts here.</em></h2><div className="contact-details"><span><MapPin size={17} /> {content.contact?.location || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos'}</span><span><Phone size={17} /> {content.contact?.phone || '0907 409 1408'}</span><span><Mail size={17} /> {content.contact?.email || 'info@soiraoyaconsulting.com.ng'}</span></div></div><form onSubmit={submit}>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><h3>Thank you, {form.name || 'we have your note'}.</h3><p>Our advisory team will be in touch shortly.</p><button type="button" className="text-link" onClick={() => { setSent(false); setSubmitError('') }}>Send another message <ArrowUpRight size={16} /></button></div> : <><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Amaka Okafor" /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label><label>How can we help?<SearchableSelect value={form.request} onChange={(value) => setForm({ ...form, request: value })} ariaLabel="Consultation area" placeholder="Select an area of interest" options={[{ value: 'Property valuation', label: 'Property valuation' }, { value: 'Investment advisory', label: 'Investment advisory' }, { value: 'Development strategy', label: 'Development strategy' }, { value: 'Property management', label: 'Property management' }, { value: 'Property listing', label: 'Property listing' }]} /></label>{submitError && <div className="login-error">{submitError}</div>}<button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button></>}</form></section>
    </main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand light goTo={goTo} /><p>Strategic real-estate advisory for decisions that create lasting value.</p></div><div className="footer-column"><p className="footer-label">Explore</p><a href="#approach">About us</a><a href="#services">Our services</a><a href="#properties">Properties</a><a href="#faq">FAQs</a></div><div className="footer-column"><p className="footer-label">Contact</p><a href="mailto:info@soiraoyaconsulting.com.ng">info@soiraoyaconsulting.com.ng</a><a href="tel:+2349074091408">0907 409 1408</a><span>Suite 30, Dolphin Plaza<br />Ikoyi, Lagos</span></div><div className="footer-column footer-socials"><p className="footer-label">Follow our work</p><div className="social-links"><a className="social-facebook" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a><a className="social-instagram" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a className="social-linkedin" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a className="social-youtube" href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a></div></div></div><div className="footer-bottom"><span>© 2026 S.O.Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div></footer>
    <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} onContact={() => { setSelectedService(null); scrollToContact() }} />
    {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} onExploreServices={() => { setShowAboutModal(false); window.setTimeout(() => scrollToSection('#services'), 0) }} />}
    <div className="floating-whatsapp-wrap"><span className={`floating-whatsapp-tip ${showWhatsappTip ? 'visible' : ''}`} aria-hidden="true">{whatsappTips[whatsappTipIndex]}</span><a className="floating-whatsapp" href={whatsappChatUrl} target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat" title="Open WhatsApp chat"><Whatsapp size={25} /></a></div>
    {showBackToTop && <button className="floating-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"><ArrowUp size={22} /></button>}
  </div>
}
