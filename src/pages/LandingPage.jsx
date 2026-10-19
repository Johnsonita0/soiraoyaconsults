import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import FaqSection from '../components/FaqSection'
import HeroSlider from '../components/HeroSlider'
import OfficeLocations from '../components/OfficeLocations'
import afmpLogo from '../assets/afmp.png'
import PropertyGallery from '../components/PropertyGallery'
import SiteHeader from '../components/SiteHeader'
import TestimonialsSection from '../components/TestimonialsSection'
import { slug as serviceSlug } from './ServicePage'
import { ArrowUp, ArrowUpRight, BarChart3, Building2, Check, ChevronDown, Facebook, Home, Instagram, Leaf, Linkedin, Mail, MapPin, Phone, Whatsapp, Youtube } from '../components/icons'
import { openWhatsAppConversation, whatsappUrl } from '../lib/whatsapp'
import './ConsultancyHome.css'

const whatsappChatUrl = whatsappUrl()
const revealEffects = ['fade-up', 'fade-right', 'zoom-in', 'fade-left', 'flip-up']
const revealEffect = (index) => revealEffects[(index * 3 + 1) % revealEffects.length]
const propertyFaqs = [
  {
    category: 'Problem 1: Poor visibility into property performance',
    question: 'Are you receiving clear information about rental income, operating expenses, maintenance costs and the overall performance of your property?',
    answer: 'Our response: We provide property management and reporting services designed to improve financial visibility, accountability and informed decision-making.',
  },
  {
    category: 'Problem 2: Inefficient property operations',
    question: "Unresolved maintenance issues, poor tenant administration, uncontrolled expenditure and inadequate service delivery can reduce a property's performance.",
    answer: 'Our response: We help coordinate property operations, maintenance, tenant-related processes and service providers within an agreed management framework.',
  },
  {
    category: 'Problem 3: Difficulty monitoring multiple properties',
    question: 'Managing several properties across different locations can make it difficult to compare performance, identify underperforming assets and allocate resources effectively.',
    answer: 'Our response: Our proposed portfolio management service focuses on consolidated reporting, performance monitoring, operating risks and recommendations for improvement.',
  },
  {
    category: 'Problem 4: Supervision of properties of Diaspora investors',
    question: 'Diaspora investors and other non-resident owners may find it difficult to verify the condition of their properties, monitor expenditure and supervise local service providers.',
    answer: 'Our response: We can provide agreed inspection, documentation, management reporting and property oversight services to keep clients informed about their assets.',
  },
  {
    category: 'Problem 5: Uncertainty during development and project planning',
    question: 'Real estate developments require careful consideration of market demand, costs, financing, phasing, revenue assumptions and development risks.',
    answer: 'Our response: We undertake feasibility studies and investment analysis to support development planning and commercial decision-making.',
  },
]

const audiences = [
  { title: 'Individual property owners', text: 'Professional oversight for owners who need support with tenant administration, maintenance, property condition and reporting.', icon: Home },
  { title: 'Diaspora investors', text: 'A structured way to monitor Nigerian property, coordinate local activities and stay informed while living abroad.', icon: MapPin },
  { title: 'Real estate investors', text: 'Investment analysis and portfolio oversight to help assess asset performance, risk and potential next steps.', icon: BarChart3 },
  { title: 'Developers', text: 'Feasibility and development advisory to test market assumptions, costs, revenue and implementation options.', icon: Building2 },
  { title: 'Institutions and financial organisations', text: 'Property and portfolio information to support investment, lending, asset management and governance decisions.', icon: BarChart3 },
  { title: 'Corporate and public-sector property owners', text: 'Valuation, facilities and property management support tailored to organisational assets and requirements.', icon: Leaf },
]

const engagementSteps = [
  { title: 'Initial consultation', text: 'We discuss your property, portfolio, investment or development objectives and the support you need.' },
  { title: 'Information and assessment', text: 'We review available property information, documentation and financial records and arrange further assessment where appropriate.' },
  { title: 'Scope and proposal', text: 'We set out the proposed services, deliverables, responsibilities, reporting arrangements, fees and timetable.' },
  { title: 'Appointment and mobilisation', text: 'Once the scope and terms are agreed, we establish the information and reporting arrangements and coordinate the work.' },
  { title: 'Reporting and recommendations', text: 'We communicate agreed deliverables, material findings and practical recommendations within the scope of the engagement.' },
]

const reportingItems = [
  'Rental income, collections and arrears',
  'Operating and maintenance expenditure',
  'Occupancy, tenancy and lease events',
  'Property inspections and condition observations',
  'Portfolio performance indicators and risks',
  'Recommended actions and management priorities',
]

const leadershipMembers = [
  {
    name: 'Dr. Olusegun Iraoya, PhD',
    role: 'Principal Partner',
    meta: 'RSV, NIESV | B.Sc (QS) | M.Sc | PhD',
    description: 'Experience spanning estate surveying, property management, valuation, facilities management, and strategic advisory across public and private sector assets.',
    tags: ['Asset Valuation', 'Facilities Management', 'Project Finance', 'Investment Analysis'],
  },
  {
    name: 'Dr. Akinbola Kazeem, PhD',
    role: 'Advisory Partner',
    meta: 'Estate Management | QS | Building Tech | Urban Planning',
    description: 'Former Senior Facilities Management Surveyor at Jide Taiwo & Co. with expertise in sustainable urban development, asset valuation, and property strategy.',
    tags: ['Asset Valuation', 'Facilities Management', 'Sustainability', 'Urban Planning'],
  },
]

const serviceIcons = {
  'Property Management': Home,
  'Real Estate Portfolio Management': BarChart3,
  'Facilities Management': Building2,
  'Real Estate Investment Analysis': BarChart3,
  'Feasibility Studies & Development Advisory': Building2,
  'Valuation & Due Diligence': Leaf,
}

const serviceRoute = (service) => service.title === 'Real Estate Portfolio Management'
  ? '/portfolio-management'
  : `/services/${serviceSlug(service.title)}`

function TeamMemberAvatar({ member }) {
  const initials = member.name
    .replace(/\bDr\.|\bPhD\b|,/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return <div className="consultancy-team-avatar" role="img" aria-label={member.name}>{initials}</div>
}

export default function LandingPage({ content, goTo, showSplashOnEntry, onSplashShown }) {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [showSplash, setShowSplash] = useState(showSplashOnEntry)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    name: '',
    organisation: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    request: '',
    propertyLocation: '',
    propertyType: '',
    propertyCount: '',
    message: '',
  })
  const serviceItems = content.services || []

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!showSplash) return undefined
    onSplashShown()
    const timer = window.setTimeout(() => setShowSplash(false), 4700)
    return () => window.clearTimeout(timer)
  }, [showSplash, onSplashShown])

  const openService = (service) => {
    goTo(serviceRoute(service))
  }

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!form.request) {
      setSubmitError('Select an area of interest before sending your request.')
      return
    }

    openWhatsAppConversation()
    setSent(true)
  }

  return <div className="site-shell consultancy-home">
    {showSplash && <div className="consultancy-splash" role="status" aria-label="Loading S.O. Iraoya Consulting">
      <div className="consultancy-splash-brand">
        <img src="/image/logo11.png" alt="S.O. Iraoya Consulting" />
      </div>
      <p>Real estate managed with purpose.</p>
      <div className="consultancy-splash-progress" role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100">
        <span className="consultancy-splash-progress-fill" />
      </div>
    </div>}
    <SiteHeader content={content} goTo={goTo} onContact={openWhatsAppConversation} />

    <main>
      <HeroSlider slides={content.heroSlides || []} onContact={openWhatsAppConversation} />

      <section className="consultancy-proof-strip" aria-label="Our services">
        <div className="consultancy-proof-track" aria-label="Property management, portfolio oversight, investment advisory, valuation, and facilities management">
          {[0, 1].map((copy) => <div className="consultancy-proof-group" key={copy} aria-hidden={copy === 1}>
            <span>Property management</span><i>·</i><span>Portfolio oversight</span><i>·</i><span>Investment advisory</span><i>·</i><span>Valuation &amp; due diligence</span><i>·</i><span>Facilities management</span><i>·</i>
          </div>)}
        </div>
      </section>

      <section className="consultancy-introduction" aria-labelledby="consultancy-introduction-title">
        <div className="consultancy-introduction-heading">
          <p className="eyebrow">Our commitment</p>
          <h2 id="consultancy-introduction-title">Property ownership, with confidence and peace of mind.</h2>
        </div>
        <div className="consultancy-introduction-copy">
          <p>For nearly 20 years, our team has been committed to helping property owners manage their investments with confidence, transparency, and peace of mind. Whether you live in Lagos, Canada, the UK, or elsewhere, our goal is to make property ownership easier, even when you cannot be there in person.</p>
          <p>We believe property ownership should not come with the stress of daily operations or the uncertainty of not knowing how your investment is performing. That is why we prioritise honest communication, responsible management, and keeping our clients informed every step of the way.</p>
          <p>At Soiraoya Consulting, we take a deliberate approach to every property entrusted to us, providing consistent updates, clear monthly reports, and transparent financial records. Our commitment is simple: to protect your interests, manage your property responsibly, and give you the confidence to own without the burden of managing every detail yourself.</p>
        </div>
      </section>

      <div data-aos="fade-up"><FaqSection items={propertyFaqs} onContact={openWhatsAppConversation} /></div>

      <section className="consultancy-services" id="services" aria-labelledby="services-title" data-aos="fade-up">
        <div className="consultancy-section-heading consultancy-section-heading-row" data-aos="zoom-in">
          <div><p className="eyebrow">Our services</p><h2 id="services-title">Professional support across the property lifecycle.</h2></div>
          <p>From day-to-day property operations to investment and development decisions, we tailor our work to your assets and objectives.</p>
        </div>
        <div className="consultancy-service-grid">
          {serviceItems.map((service, index) => {
            const Icon = serviceIcons[service.title] || Building2
            return <button className="consultancy-service-card" type="button" key={service.title} onClick={() => openService(service)} data-aos={revealEffect(index)}>
              <Icon size={25} strokeWidth={1.5} />
              <span className="consultancy-card-arrow"><ArrowUpRight size={18} /></span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="consultancy-card-link">Explore service</span>
            </button>
          })}
        </div>
      </section>

      <PropertyGallery onContact={openWhatsAppConversation} onViewAll={() => goTo('/properties')} properties={content.gallery || []} />

      <section className="consultancy-portfolio-band" data-aos="fade-up">
        <div data-aos="fade-right">
          <p className="eyebrow">A portfolio-wide perspective</p>
          <h2>Property-by-property detail. One decision-ready view.</h2>
          <p>Understand what you own, how it is performing and what may need attention across your portfolio.</p>
          <button className="button button-light" onClick={() => goTo('/portfolio-management')}>Explore portfolio management <ArrowUpRight size={17} /></button>
        </div>
        <div className="consultancy-portfolio-points">
          <article data-aos="fade-left"><div><h3>See the whole picture</h3><p>Bring asset, financial and operational information together.</p></div></article>
          <article data-aos="zoom-in"><div><h3>Understand what is working</h3><p>Review income, occupancy, costs, condition and risk.</p></div></article>
          <article data-aos="fade-right"><div><h3>Decide what comes next</h3><p>Consider whether to hold, improve, reposition or invest.</p></div></article>
        </div>
      </section>

      <section className="consultancy-audiences" id="who-we-serve" aria-labelledby="audiences-title" data-aos="fade-up">
        <div className="consultancy-section-heading" data-aos="fade-left">
          <p className="eyebrow">Who we serve</p>
          <h2 id="audiences-title">Advice shaped around the people responsible for property.</h2>
        </div>
        <div className="consultancy-audience-grid">
          {audiences.map(({ title, text, icon: Icon }, index) => <article className="consultancy-audience-card" key={title} data-aos={revealEffect(index)}>
            <Icon size={24} strokeWidth={1.5} />
            <h3>{title}</h3>
            <p>{text}</p>
            {title === 'Diaspora investors' && <button type="button" className="consultancy-audience-link" onClick={() => goTo('/diaspora-property-management')}>Explore diaspora property support <ArrowUpRight size={15} /></button>}
          </article>)}
        </div>
      </section>

      <section className="consultancy-process" id="process" aria-labelledby="process-title" data-aos="fade-up">
        <div className="consultancy-section-heading consultancy-section-heading-row" data-aos="fade-right">
          <div><p className="eyebrow">How our engagement works</p><h2 id="process-title">From first conversation to professional oversight.</h2></div>
          <p>Clear scope, agreed responsibilities and useful reporting are part of how we approach each assignment.</p>
        </div>
        <ol className="consultancy-process-list">
          {engagementSteps.map((step, index) => <li key={step.title} data-aos={revealEffect(index)}>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="consultancy-reporting" data-aos="fade-up">
        <div className="consultancy-reporting-copy" data-aos="fade-right">
          <p className="eyebrow">Reporting and accountability</p>
          <h2>You should not have to guess how your property is performing.</h2>
          <p>Depending on the agreed services, structured reporting can help make property performance, operating expenditure, maintenance requirements and management issues easier to understand.</p>
          <p className="consultancy-reporting-note">Reporting formats and frequency are agreed as part of each engagement.</p>
        </div>
        <div className="consultancy-reporting-list" data-aos="fade-left">
          {reportingItems.map((item, index) => <div key={item} data-aos={revealEffect(index)}><Check size={18} /><span>{item}</span></div>)}
        </div>
      </section>

      <section className="consultancy-about" id="approach" aria-labelledby="about-title" data-aos="fade-up">
        <div className="consultancy-about-copy" data-aos="fade-right">
          <p className="eyebrow">Company overview</p>
          <h2 id="about-title">Professional real estate advisory and management.</h2>
          <p><strong>S.O. Iraoya Consulting</strong> is a professional firm of Estate Surveyors &amp; Valuers advising individuals, businesses, investors and institutions across the property lifecycle.</p>
          <p>Our services bring property management together with portfolio performance monitoring, facilities management, valuation, investment analysis, feasibility studies and due diligence.</p>
          <p>We aim to help clients understand their assets, manage them effectively and evaluate opportunities with greater clarity.</p>
        </div>
        <div className="consultancy-about-principles" data-aos="fade-left">
          <article data-aos="fade-left"><span>Our mission</span><p>To provide professional real estate management and advisory services that help clients protect assets, improve property performance and make informed investment decisions.</p></article>
          <article data-aos="zoom-in"><span>Our vision</span><p>To be a trusted real estate consultancy recognised for professional excellence, accountability and the quality of its contribution to property investment and asset management.</p></article>
          <div className="consultancy-values">
            <span>Professionalism</span><span>Integrity</span><span>Accountability</span><span>Client focus</span><span>Evidence-based advice</span>
          </div>
        </div>
      </section>

      <section className="consultancy-team" id="team" aria-labelledby="team-title" data-aos="fade-up">
        <div className="consultancy-section-heading" data-aos="zoom-in">
          <p className="eyebrow">Leadership</p>
          <h2 id="team-title">Experience brought to each assignment.</h2>
        </div>
        <div className="consultancy-team-grid">
          {leadershipMembers.map((member, index) => <article className="consultancy-team-card" key={member.name} data-aos={revealEffect(index)}>
            <TeamMemberAvatar member={member} />
            <span className="consultancy-team-role">{member.role}</span>
            <h3>{member.name}</h3>
            <p className="consultancy-team-meta">{member.meta}</p>
            <p>{member.description}</p>
            <div className="consultancy-team-tags">{member.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </article>)}
        </div>
      </section>

      <section className="consultancy-affiliates" aria-label="Professional Regulators" data-aos="fade-up">
        <div className="consultancy-affiliates-heading"><p className="eyebrow">Professional Regulators</p><h2>We are duly registered with:</h2></div>
        <div className="consultancy-affiliate-grid">
          {[
            ['ESVARBON', 'Estate Surveyors and Valuers Registration Board of Nigeria', '/logo/esvarbon.jpg'],
            ['NIESV', 'Nigerian Institution of Estate Surveyors and Valuers', '/logo/niesv.jpg'],
            ['AFMP', 'Association of Facilities Management Practitioners', afmpLogo],
          ].map(([name, description, image]) => <figure className="consultancy-affiliate-item" key={name}>
            <img src={image} alt={`${name} logo`} />
            <figcaption><strong>{name}</strong><span>{description}</span></figcaption>
          </figure>)}
        </div>
      </section>

      <div data-aos="fade-up"><TestimonialsSection testimonials={content.testimonials || []} contactEmail={content.contact?.email} /></div>

      <section className="consultancy-contact" id="contact" aria-labelledby="contact-title">
        <div className="consultancy-contact-intro">
          <p className="eyebrow">Start a conversation</p>
          <h2 id="contact-title">Let’s discuss your property or investment objectives.</h2>
          <p>Tell us about your requirements and we will consider how our services may assist you.</p>
          <div className="consultancy-contact-details">
            <span><MapPin size={17} /> <OfficeLocations location={content.contact?.location} /></span>
            <a href={`tel:${content.contact?.phone || '+2349074091408'}`}><Phone size={17} /> {content.contact?.phone || '0907 409 1408'}</a>
            <a href={`mailto:${content.contact?.email || 'soiraoyaconsults@gmail.com'}`}><Mail size={17} /> {content.contact?.email || 'soiraoyaconsults@gmail.com'}</a>
          </div>
        </div>
        <div className={`consultancy-enquiry-panel ${showEnquiryForm ? 'is-open' : ''}`}>
          <button type="button" className="consultancy-enquiry-toggle" onClick={() => setShowEnquiryForm((open) => !open)} aria-expanded={showEnquiryForm}>
            <span>{showEnquiryForm ? 'Hide request details form' : 'Add request details first'}</span>
            <ChevronDown size={18} />
          </button>
          {showEnquiryForm && <form className="consultancy-enquiry-form" onSubmit={submit}>
          {sent ? <div className="consultancy-form-success">
            <span><Check size={22} /></span>
            <h3>Thank you, {form.name || 'we have your note'}.</h3>
            <p>WhatsApp is open. Send your enquiry there to start the conversation.</p>
            <button type="button" className="text-link" onClick={() => { setSent(false); setSubmitError('') }}>Send another request <ArrowUpRight size={16} /></button>
          </div> : <>
            <div className="consultancy-form-grid">
              <label>Full name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} autoComplete="name" /></label>
              <label>Organisation <span>(optional)</span><input value={form.organisation} onChange={(event) => updateForm('organisation', event.target.value)} autoComplete="organization" /></label>
              <label>Email address<input required type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} autoComplete="email" /></label>
              <label>Telephone / WhatsApp<input type="tel" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} autoComplete="tel" /></label>
              <label>Your location<input value={form.location} onChange={(event) => updateForm('location', event.target.value)} placeholder="Country and city" /></label>
              <label>Client category<select value={form.category} onChange={(event) => updateForm('category', event.target.value)}><option value="">Select a category</option>{['Individual owner', 'Diaspora investor', 'Real estate investor', 'Institutional investor', 'Developer', 'Bank or financial institution', 'Pension fund', 'Government agency', 'Corporate property owner', 'Other'].map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>Service required<select required value={form.request} onChange={(event) => updateForm('request', event.target.value)}><option value="">Select a service</option>{serviceItems.map((service) => <option key={service.title}>{service.title}</option>)}<option>Property listing or sale/letting</option><option>Other</option></select></label>
              <label>Property location<input value={form.propertyLocation} onChange={(event) => updateForm('propertyLocation', event.target.value)} placeholder="City or location" /></label>
              <label>Property type<select value={form.propertyType} onChange={(event) => updateForm('propertyType', event.target.value)}><option value="">Select a property type</option>{['Residential', 'Commercial', 'Retail', 'Mixed-use', 'Development land', 'Other'].map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>Number of properties<select value={form.propertyCount} onChange={(event) => updateForm('propertyCount', event.target.value)}><option value="">Select a range</option>{['One', 'Two to five', 'Six to ten', 'More than ten', 'Not yet determined'].map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className="consultancy-form-message">Brief description<textarea rows="4" value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder="Tell us a little about your property, portfolio or proposed investment." /></label>
            </div>
            {submitError && <p className="consultancy-form-error" role="alert">{submitError}</p>}
            <p className="consultancy-privacy-note">Please do not include confidential or sensitive documents in this form. Your information will be used to respond to your enquiry.</p>
            <button className="button button-light" type="submit">Request a consultation <ArrowUpRight size={18} /></button>
          </>}
          </form>}
        </div>
      </section>
    </main>

    <footer className="site-footer consultancy-footer">
      <div className="footer-main">
        <div className="footer-brand"><Brand light goTo={goTo} /><p>Professional real estate management and informed investment advice for lasting asset performance.</p></div>
        <div className="footer-column"><p className="footer-label">Explore</p><a href="#approach">About us</a><a href="#services">Our services</a><a href="#who-we-serve">Who we serve</a><a href="/portfolio-management" onClick={(event) => { event.preventDefault(); goTo('/portfolio-management') }}>Portfolio management</a><a href="/properties" onClick={(event) => { event.preventDefault(); goTo('/properties') }}>Properties</a><a href="#faq">FAQ</a></div>
        <div className="footer-column"><p className="footer-label">Contact</p><a href={`mailto:${content.contact?.email || 'soiraoyaconsults@gmail.com'}`}>{content.contact?.email || 'soiraoyaconsults@gmail.com'}</a><a href={`tel:${content.contact?.phone || '+2349074091408'}`}>{content.contact?.phone || '0907 409 1408'}</a><span><OfficeLocations location={content.contact?.location} /></span></div>
        <div className="footer-column footer-socials"><p className="footer-label">Follow our work</p><div className="social-links"><a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href="https://www.linkedin.com/in/soiraoya-consulting-983372445/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a></div></div>
      </div>
      <div className="footer-bottom"><span>© S.O. Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div>
    </footer>

    <a className="floating-whatsapp consultancy-whatsapp" href={whatsappChatUrl} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><Whatsapp size={24} /><span>Chat with us</span></a>
    {showBackToTop && <button type="button" className="back-to-top consultancy-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={18} /></button>}
  </div>
}
