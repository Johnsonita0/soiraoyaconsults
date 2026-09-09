import { useEffect, useState } from 'react'
import { ShieldCheck } from './icons'

export default function HeroSlider({ slides, content, onContact }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageSources, setImageSources] = useState(() => slides.map((slide) => slide.image))
  const activeSlide = slides[activeIndex]
  const visibleSlide = activeIndex === 0 ? { ...activeSlide, title: content.heroTitle, tagline: 'Perspective changes everything.' } : activeSlide
  useEffect(() => { const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 6500); return () => window.clearInterval(timer) }, [slides.length])
  const move = (direction) => setActiveIndex((index) => (index + direction + slides.length) % slides.length)
  const handleImageError = () => setImageSources((sources) => sources.map((source, index) => index === activeIndex ? activeSlide.fallback : source))
  return <section className="hero-section" style={{ backgroundImage: 'none', backgroundColor: '#10295f' }}>
    <img className="hero-background" src={imageSources[activeIndex]} onError={handleImageError} alt="Property advisory" style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
    <div className="hero-overlay"></div>
    <div className="hero-copy"><p className="eyebrow">Independent real-estate advisory <span>Since 2002</span></p><h1 key={activeIndex}>{visibleSlide.title}</h1><p className="hero-lede" key={`copy-${activeIndex}`}>{activeIndex === 0 ? content.heroText : visibleSlide.tagline}</p><div className="hero-actions"><button className="button button-light" onClick={onContact}>Tell us what you’re building <span>↗</span></button><a className="text-link" href="#services">Explore our expertise <span>›</span></a></div></div>
    <div className="hero-caption"><p>{visibleSlide.tagline}</p></div><div className="hero-controls" style={{ position: 'absolute', left: 16, right: 16, top: '50%', width: 'calc(100% - 32px)', height: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none' }}><button style={{ pointerEvents: 'auto' }} onClick={() => move(-1)} aria-label="Previous slide">←</button><button style={{ pointerEvents: 'auto' }} onClick={() => move(1)} aria-label="Next slide">→</button></div><div className="hero-dots">{slides.map((slide, index) => <button key={slide.title} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><div className="hero-stamp"><ShieldCheck size={18} /><span>Licensed &amp; trusted<br /><b>ESVARBON A7725</b></span></div>
  </section>
}
