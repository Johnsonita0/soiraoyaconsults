import { ArrowUpRight } from './icons'

export default function HeroSlider({ slides, onContact }) {
  const activeSlide = Array.isArray(slides) ? slides.find((slide) => slide.active !== false) : null
  const image = activeSlide?.image || '/image/hero/hero-1.jpg'

  return <section className="hero-section consultancy-hero" aria-label="Real estate management">
    <img className="hero-background" src={image} alt="" aria-hidden="true" />
    <div className="hero-overlay" />
    <div className="hero-content-row">
      <div className="hero-copy">
        <p className="eyebrow">Real estate management <span>Lagos · Residential and Commercial</span></p>
        <h1>Own with confidence.<br /><em>We manage professionally.</em></h1>
        <p className="hero-lede">Rent collected promptly. Remittances made without delay. Tenants managed professionally. Repairs carried out. Monthly reports sent to landlords and investors.</p>
        <div className="hero-actions">
          <button className="button button-light" onClick={onContact}>Request a consultation <ArrowUpRight size={17} /></button>
          <a className="text-link" href="#services">Explore our services <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <aside className="hero-side-cards" aria-label="Our approach">
        <div className="hero-investment-card">
          <span>Protect and grow</span>
          <p>Your Property Is an Investment. We Help You Protect and Grow Its Value.</p>
        </div>
        <div className="hero-welcome-card">
          <span>Now welcoming</span>
          <p>Property owners, investors and organisations seeking <em>professional management</em> and trusted advice.</p>
        </div>
        <div className="hero-promise-card">
          <span>Our commitment</span>
          <p>You’ll always stay informed about your property’s performance without needing to call us.</p>
        </div>
      </aside>
    </div>
    <div className="consultancy-hero-caption">
      <span>S.O. IRAOYA CONSULTING</span>
      <p>Real estate managed with purpose.</p>
    </div>
  </section>
}
