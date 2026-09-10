import { useEffect, useState } from 'react'

export default function AboutSlider({ slides = [] }) {
  const safeSlides = slides.length ? slides : []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = safeSlides[activeIndex] || safeSlides[0]

  useEffect(() => {
    if (!safeSlides.length) return
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % safeSlides.length), 6000)
    return () => window.clearInterval(timer)
  }, [safeSlides.length])

  const move = (direction) => {
    if (!safeSlides.length) return
    setActiveIndex((index) => (index + direction + safeSlides.length) % safeSlides.length)
  }

  if (!activeSlide) return null

  return <section id="approach" className="about-section">
    <div className="about-image-wrap"><img src={activeSlide.image} alt="Property advisory and development" className="about-image" /><div className="about-image-label">S.O.Iraoya Consulting <span>Since 2002</span></div></div>
    <div className="about-content"><div className="about-topline"><p className="eyebrow">{activeSlide.label}</p></div><h2 key={activeSlide.title}>{activeSlide.title === 'Core values' ? <>Built on <em>principle.</em></> : activeSlide.title === 'Mission' ? <>Advice with <em>purpose.</em></> : <>A clear view of <em>what comes next.</em></>}</h2><p className="about-text">{activeSlide.text}</p><div className="about-points">{(activeSlide.points || []).map((point) => <span key={point}>● {point}</span>)}</div><div className="about-controls"><button onClick={() => move(-1)} aria-label="Previous about section">←</button><button onClick={() => move(1)} aria-label="Next about section">→</button><div className="about-tabs">{safeSlides.map((slide) => <button key={slide.title} className={slide.title === activeSlide.title ? 'active' : ''} onClick={() => setActiveIndex(safeSlides.indexOf(slide))}>{slide.title}</button>)}</div></div></div>
  </section>
}
