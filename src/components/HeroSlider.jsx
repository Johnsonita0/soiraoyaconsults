import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck } from './icons'

export default function HeroSlider({ slides, content, onContact }) {
  const safeSlides = useMemo(() => {
    const activeSlides = Array.isArray(slides) ? slides.filter((slide) => slide.active !== false) : []

    return activeSlides.length
      ? activeSlides
      : [{
          image: '/image/hero/hero-1.jpg',
          fallback: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=88',
          title: content?.heroTitle || 'Property decisions, made with conviction.',
          tagline: 'Perspective changes everything.',
          active: true,
        }]
  }, [slides, content?.heroTitle])

  const [activeIndex, setActiveIndex] = useState(0)
  const [imageSources, setImageSources] = useState(() => safeSlides.map((slide) => slide.image))
  const activeSlide = safeSlides[activeIndex] || safeSlides[0]
  const visibleSlide = activeIndex === 0 ? { ...activeSlide, title: content?.heroTitle || activeSlide.title, tagline: 'Perspective changes everything.' } : activeSlide

  useEffect(() => {
    setImageSources(safeSlides.map((slide) => slide.image))
    setActiveIndex((index) => (safeSlides.length === 0 ? 0 : index >= safeSlides.length ? 0 : index))
  }, [safeSlides])

  useEffect(() => {
    if (!safeSlides.length) return
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % safeSlides.length), 6500)
    return () => window.clearInterval(timer)
  }, [safeSlides.length])

  const move = (direction) => {
    if (!safeSlides.length) return
    setActiveIndex((index) => (index + direction + safeSlides.length) % safeSlides.length)
  }

  const handleImageError = () => {
    if (!activeSlide?.fallback) return
    setImageSources((sources) => sources.map((source, index) => index === activeIndex ? activeSlide.fallback : source))
  }

  return <section className="hero-section" style={{ backgroundImage: 'none', backgroundColor: '#10295f' }}>
    <img className="hero-background" src={imageSources[activeIndex]} onError={handleImageError} alt="Property advisory" style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
    <div className="hero-overlay"></div>
    <div className="hero-copy"><p className="eyebrow">Independent real-estate advisory <span>Since 2002</span></p><h1 key={activeIndex}>{visibleSlide.title}</h1><p className="hero-lede" key={`copy-${activeIndex}`}>{activeIndex === 0 ? content?.heroText : visibleSlide.tagline}</p><div className="hero-actions"><button className="button button-light" onClick={onContact}>Tell us what you’re building <span>↗</span></button><a className="text-link" href="#services">Explore our expertise <span>›</span></a></div></div>
    <div className="hero-caption"><p>{visibleSlide.tagline}</p></div><div className="hero-controls" style={{ position: 'absolute', left: 16, right: 16, top: '50%', width: 'calc(100% - 32px)', height: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none' }}><button style={{ pointerEvents: 'auto' }} onClick={() => move(-1)} aria-label="Previous slide">←</button><button style={{ pointerEvents: 'auto' }} onClick={() => move(1)} aria-label="Next slide">→</button></div><div className="hero-dots">{safeSlides.map((slide, index) => <button key={`${slide.title}-${index}`} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><div className="hero-stamp"><ShieldCheck size={18} /><span>Licensed &amp; trusted<br /><b>ESVARBON A7725</b></span></div>
  </section>
}
