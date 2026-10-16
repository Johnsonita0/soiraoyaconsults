import { useState } from 'react'
import Brand from '../components/Brand'
import { ArrowUpRight, Check, Menu, X } from '../components/icons'

const portfolioServices = [
  {
    title: 'Portfolio intelligence',
    text: 'Bring property, income, occupancy, operating costs, valuation and risk information into a clearer portfolio-level view.',
  },
  {
    title: 'Performance monitoring',
    text: 'Review rental collection, vacancies, lease events, expenditure and asset-level results against agreed objectives.',
  },
  {
    title: 'Asset optimisation',
    text: 'Identify practical opportunities to improve income, manage operating costs, plan maintenance and strengthen asset performance.',
  },
  {
    title: 'Investment and risk review',
    text: 'Support acquisition and hold decisions with valuation, feasibility, due diligence coordination and risk-aware analysis.',
  },
]

const investorChallenges = [
  {
    title: 'Fragmented information',
    text: 'Property and financial records sit across different managers, spreadsheets and reports, making the overall position hard to see.',
  },
  {
    title: 'Unclear performance',
    text: 'Without consistent measures, it can be difficult to spot weak occupancy, rent arrears, rising costs or assets missing their targets.',
  },
  {
    title: 'Uncertain next steps',
    text: 'Owners need a sound basis to decide whether to hold, improve, reposition, refinance or dispose of an asset.',
  },
]

export default function PortfolioManagementPage({ content, goTo }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const goToHomeSection = (event, sectionId) => {
    event.preventDefault()
    setMobileOpen(false)
    goTo('/')
    window.setTimeout(() => document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return <div className="portfolio-page">
    <header className="site-header">
      <Brand goTo={goTo} />
      <nav className={mobileOpen ? 'nav-open' : ''} aria-label="Main navigation">
        <a href="/" onClick={(event) => goToHomeSection(event, '#approach')}>Home</a>
        <a href="#portfolio-offer" onClick={(event) => { event.preventDefault(); document.querySelector('#portfolio-offer')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false) }}>Our approach</a>
        <a href="#portfolio-services" onClick={(event) => { event.preventDefault(); document.querySelector('#portfolio-services')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false) }}>What we do</a>
        <a href="/#contact" onClick={(event) => goToHomeSection(event, '#contact')}>Contact</a>
      </nav>
      <button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">{mobileOpen ? <X size={30} /> : <Menu size={30} />}</button>
      <button className="header-cta" onClick={(event) => goToHomeSection(event, '#contact')}>Discuss your portfolio <ArrowUpRight size={16} /></button>
    </header>

    <main>
      <section className="portfolio-hero">
        <div className="portfolio-hero-copy">
          <p className="eyebrow">Real estate portfolio management</p>
          <h1>See the whole portfolio. Make the next move with clarity.</h1>
          <p>We help property owners and investors bring asset information, performance and risk into focus—so decisions are based on a clearer view of what they own and how it is performing.</p>
          <button className="button button-light" onClick={(event) => goToHomeSection(event, '#contact')}>Talk to our advisory team <ArrowUpRight size={17} /></button>
        </div>
        <div className="portfolio-hero-note">
          <span>THE INVESTOR’S VIEW</span>
          <strong>What do I own?</strong>
          <strong>Is it performing?</strong>
          <strong>What should I do next?</strong>
        </div>
      </section>

      <section className="portfolio-intro" id="portfolio-offer">
        <div>
          <p className="eyebrow">The portfolio management challenge</p>
          <h2>Property-by-property details. One decision-ready view.</h2>
        </div>
        <div className="portfolio-intro-copy">
          <p>Investors can have valuers, property managers, facilities teams and legal advisers—and still lack a consistent picture of portfolio-wide performance, exposure and priorities.</p>
          <p>S.O. Iraoya Consulting brings the relevant property information together, reviews it against your objectives and helps you identify informed, practical actions. The engagement is scoped to your assets, records and reporting needs.</p>
        </div>
      </section>

      <section className="portfolio-challenges">
        <div className="portfolio-section-heading">
          <p className="eyebrow">Where we can help</p>
          <h2>Make the issues visible before they become harder to manage.</h2>
        </div>
        <div className="portfolio-challenge-grid">
          {investorChallenges.map((challenge) => (
            <article className="portfolio-challenge-card" key={challenge.title}>
              <h3>{challenge.title}</h3>
              <p>{challenge.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-services" id="portfolio-services">
        <div className="portfolio-section-heading">
          <p className="eyebrow">Portfolio management, in practice</p>
          <h2>From asset information to the next informed action.</h2>
          <p>We bring our valuation and property expertise together to support the decisions that shape portfolio performance.</p>
        </div>
        <div className="portfolio-service-grid">
          {portfolioServices.map((service) => (
            <article className="portfolio-service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
        <div className="portfolio-scope-note">
          <Check size={19} />
          <p>Where an engagement involves legal title opinions or specialist technical assessments, we coordinate with appropriately qualified professionals as required by the agreed scope.</p>
        </div>
      </section>

      <section className="portfolio-audience">
        <p className="eyebrow">Who we support</p>
        <h2>Built for people responsible for property capital.</h2>
        <div className="portfolio-audience-list">
          <span>Institutional investors</span>
          <span>Property and asset managers</span>
          <span>Businesses and family offices</span>
          <span>Diaspora investors</span>
          <span>Property owners with multi-asset holdings</span>
        </div>
      </section>

      <section className="portfolio-cta">
        <div>
          <p className="eyebrow">A clearer portfolio starts with a conversation</p>
          <h2>Understand your assets. Decide what comes next.</h2>
        </div>
        <button className="button button-light" onClick={(event) => goToHomeSection(event, '#contact')}>Discuss your portfolio <ArrowUpRight size={17} /></button>
      </section>
    </main>
    <footer className="site-footer service-page-footer">
      <div className="footer-main">
        <div className="footer-brand"><Brand light goTo={goTo} /><p>Portfolio management and real-estate advisory for better-informed property decisions.</p></div>
        <div className="footer-column"><p className="footer-label">Explore</p><a href="/" onClick={(event) => goToHomeSection(event, '#approach')}>Home</a><a href="#portfolio-services" onClick={(event) => { event.preventDefault(); document.querySelector('#portfolio-services')?.scrollIntoView({ behavior: 'smooth' }) }}>Portfolio services</a></div>
        <div className="footer-column"><p className="footer-label">Contact</p><a href={`mailto:${content.contact?.email || 'info@soiraoyaconsulting.com.ng'}`}>{content.contact?.email || 'info@soiraoyaconsulting.com.ng'}</a><a href={`tel:${content.contact?.phone || '+2349074091408'}`}>{content.contact?.phone || '0907 409 1408'}</a><span>{content.contact?.location || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos'}</span></div>
      </div>
      <div className="footer-bottom"><span>© 2026 S.O.Iraoya Consulting. All rights reserved.</span><span>Registered with CAC · Licensed by ESVARBON</span></div>
    </footer>
  </div>
}
