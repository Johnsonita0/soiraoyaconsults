import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from './icons'

export default function HeroSlider({ slides, content, onContact }) {
  const safeSlides = useMemo(() => {
    const activeSlides = Array.isArray(slides) ? slides.filter((slide) => slide.active !== false) : []

    return activeSlides.length
      ? activeSlides
      : [{
          image: '/image/hero/hero-1.jpg',
          fallback: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=88',
          title: content?.heroTitle || 'Own with confidence. Invest with insight. Manage for performance.',
          tagline: 'Professional real estate management and investment advisory.',
          active: true,
        }]
  }, [slides, content?.heroTitle])

  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImage, setFailedImage] = useState(null)
  const touchStart = useRef(null)
  const currentIndex = activeIndex % safeSlides.length
  const activeSlide = safeSlides[currentIndex]

  useEffect(() => {
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % safeSlides.length), 20000)
    return () => window.clearTimeout(timer)
  }, [safeSlides.length, activeIndex])

  const move = (direction) => setActiveIndex((index) => (index + direction + safeSlides.length) % safeSlides.length)

  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event) => {
    if (!touchStart.current) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) move(deltaX < 0 ? 1 : -1)
  }

  const handleImageError = () => {
    if (!activeSlide?.fallback) return
    setFailedImage(activeSlide.image)
  }

  return <section className="hero-section consultancy-hero" aria-label="Real estate advisory" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <img
      key={currentIndex}
      className="hero-background hero-background-zoom"
      src={failedImage === activeSlide.image && activeSlide.fallback ? activeSlide.fallback : activeSlide.image}
      onError={handleImageError}
      alt=""
      aria-hidden="true"
    />
    <div className="hero-overlay" />
    <div className="hero-content-row">
      <div className="hero-copy">
        <p className="eyebrow">Real estate management &amp; advisory <span>Lagos, Nigeria</span></p>
        <h1 key={activeSlide.title}>{activeSlide.title}</h1>
        <p className="hero-lede">{content?.heroText || 'We help property owners, investors, developers and institutions protect their assets and make informed real estate decisions.'}</p>
        <div className="hero-actions">
          <button className="button button-light" onClick={onContact}>Request a consultation <ArrowUpRight size={17} /></button>
          <a className="text-link" href="#services">Explore our services <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <aside className="hero-advisory-note" aria-label="Our areas of work">
        <span>Professional support across the asset lifecycle</span>
        <strong>Property operations</strong>
        <strong>Portfolio performance</strong>
        <strong>Investment decisions</strong>
      </aside>
    </div>
    <div className="hero-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous slide">←</button>
      <button type="button" onClick={() => move(1)} aria-label="Next slide">→</button>
    </div>
    <div className="hero-dots" aria-label="Choose a hero slide">
      {safeSlides.map((slide, index) => <button key={`${slide.title}-${index}`} type="button" className={index === currentIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}
    </div>
  </section>
}
