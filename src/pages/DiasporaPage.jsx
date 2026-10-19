import Brand from '../components/Brand'
import SiteHeader from '../components/SiteHeader'
import { ArrowUpRight, Check, Whatsapp } from '../components/icons'

const supportServices = [
  'Periodic property inspections and condition reports.',
  'Rental income and expenditure monitoring, as agreed.',
  'Tenant and lease administration within an agreed management mandate.',
  'Maintenance planning and coordination of repairs.',
  'Service provider and contractor supervision.',
  'Documented updates and agreed management reporting.',
]
const revealEffects = ['fade-right', 'zoom-in', 'fade-up', 'flip-up', 'fade-left']
const revealEffect = (index) => revealEffects[(index * 3 + 1) % revealEffects.length]

export default function DiasporaPage({ content, goTo }) {
  const whatsappChatUrl = `https://wa.me/2349074091408?text=${encodeURIComponent('Hello, I live abroad and would like to discuss oversight of my property in Nigeria.')}`

  const goToHomeSection = (event, sectionId) => {
    event.preventDefault()
    goTo('/')
    window.setTimeout(() => document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }
  const scrollToContact = () => {
    goTo('/')
    window.setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return <div className="site-shell diaspora-page">
    <SiteHeader content={content} goTo={goTo} onContact={scrollToContact} />

    <main>
      <section className="diaspora-hero" data-aos="fade-up">
        <div data-aos="fade-right">
          <p className="eyebrow">Property oversight for non-resident owners</p>
          <h1>Your property in Nigeria. Professional oversight you can rely on.</h1>
          <p>Owning property in Nigeria while living abroad should not mean being uncertain about its condition, income or management. We help diaspora investors and non-resident owners establish a structured approach to property supervision, maintenance coordination and reporting.</p>
          <button className="button button-light" onClick={(event) => goToHomeSection(event, '#contact')}>Discuss your property <ArrowUpRight size={17} /></button>
        </div>
        <aside className="diaspora-hero-note" data-aos="fade-left">
          <span>Stay informed about</span>
          <strong>Property condition</strong>
          <strong>Operations and expenditure</strong>
          <strong>Agreed management actions</strong>
        </aside>
      </section>

      <section className="diaspora-intro" data-aos="fade-up">
        <div><p className="eyebrow">A local perspective, with clear communication</p><h2>Be better informed about the property you own back home.</h2></div>
        <p>Whether you own a home, apartment building, commercial property or several assets, our work can be scoped around your property, location and priorities. We agree the mandate, reporting arrangements and responsibilities with you before work begins.</p>
      </section>

      <section className="diaspora-support" id="diaspora-support" data-aos="fade-up">
        <div className="consultancy-section-heading" data-aos="fade-up">
          <p className="eyebrow">How we can support you</p>
          <h2>Structured oversight for the things that need attention.</h2>
        </div>
        <div className="diaspora-support-grid">
          {supportServices.map((service, index) => <article key={service} data-aos={revealEffect(index)}><Check size={19} /><p>{service}</p></article>)}
        </div>
        <p className="diaspora-scope-note">Services depend on the property, agreed management mandate, available information and engagement terms.</p>
      </section>

      <section className="diaspora-process" data-aos="fade-up">
        <p className="eyebrow">Getting started</p>
        <h2>A clear process, from first discussion to agreed reporting.</h2>
        <ol>
          <li data-aos="fade-right"><div><h3>Tell us about your property</h3><p>Share its location, type, current situation and the support you are looking for.</p></div></li>
          <li data-aos="zoom-in"><div><h3>Agree the scope</h3><p>We discuss the information needed, proposed services, responsibilities and reporting cadence.</p></div></li>
          <li data-aos="fade-up"><div><h3>Receive a proposal</h3><p>We set out the deliverables, fees and terms for your consideration before an appointment is made.</p></div></li>
          <li data-aos="fade-left"><div><h3>Stay informed</h3><p>Following appointment, we provide updates and reports as agreed for the engagement.</p></div></li>
        </ol>
      </section>

      <section className="diaspora-cta" data-aos="fade-up">
        <div><p className="eyebrow">Your property. A clearer view.</p><h2>Let’s discuss the oversight you need.</h2></div>
        <button className="button button-light" onClick={(event) => goToHomeSection(event, '#contact')}>Request a consultation <ArrowUpRight size={17} /></button>
      </section>
    </main>

    <footer className="site-footer service-page-footer">
      <div className="footer-main">
        <div className="footer-brand"><Brand light goTo={goTo} /><p>Professional property oversight for owners and investors.</p></div>
        <div className="footer-column"><p className="footer-label">Explore</p><a href="/" onClick={(event) => { event.preventDefault(); goTo('/') }}>Home</a><a href="/#services" onClick={(event) => goToHomeSection(event, '#services')}>Services</a><a href="/#who-we-serve" onClick={(event) => goToHomeSection(event, '#who-we-serve')}>Who we serve</a></div>
        <div className="footer-column"><p className="footer-label">Contact</p><a href={`mailto:${content.contact?.email || 'info@soiraoyaconsulting.com.ng'}`}>{content.contact?.email || 'info@soiraoyaconsulting.com.ng'}</a><a href={`tel:${content.contact?.phone || '+2349074091408'}`}>{content.contact?.phone || '0907 409 1408'}</a><span>{content.contact?.location || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos'}</span></div>
      </div>
      <div className="footer-bottom"><span>© S.O. Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div>
    </footer>
    <a className="floating-whatsapp consultancy-whatsapp" href={whatsappChatUrl} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><Whatsapp size={24} /><span>Chat with us</span></a>
  </div>
}
