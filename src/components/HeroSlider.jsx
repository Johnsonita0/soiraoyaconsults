import { ArrowUpRight } from './icons'
import { useEffect, useMemo, useState } from 'react'

export default function HeroSlider({ slides, onContact }) {
  const activeSlides = useMemo(
    () => Array.isArray(slides) ? slides.filter((slide) => slide.active !== false && slide.image) : [],
    [slides],
  )
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    if (activeSlides.length < 2) return undefined
    const timer = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % activeSlides.length)
    }, 5_700)
    return () => window.clearInterval(timer)
  }, [activeSlides.length])
  const activeIndex = activeSlides.length ? slideIndex % activeSlides.length : 0

  return <section className="hero-section consultancy-hero" aria-label="Real estate management">
    {activeSlides.length ? activeSlides.map((slide, index) => <img
      key={`${slide.image}-${index}`}
      className={`hero-background${index === activeIndex ? ' is-active' : ''}`}
      src={slide.image}
      alt=""
      aria-hidden="true"
      loading={index === activeIndex ? 'eager' : 'lazy'}
    />) : <img className="hero-background is-active" src="/image/hero/hero-1.jpg" alt="" aria-hidden="true" />}
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
          <span>Protect and grow it</span>
          <p>Your Property Is an Investment. We Help You Protect and Grow Its Value.</p>
        </div>
        <div className="hero-welcome-card">
          <span>Always Welcoming</span>
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
