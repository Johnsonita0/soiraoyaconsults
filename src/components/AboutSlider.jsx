import { useEffect, useState } from 'react'

const slides = [
  {
    label: 'About us',
    title: 'Mission',
    text: 'To deliver clear, independent, and commercially useful real-estate advice that protects our clients interests and helps their property decisions create lasting value.',
    image: '/image/hero/hero-2.jpg',
    points: ['Client-centred advice', 'Practical market intelligence'],
  },
  {
    label: 'About us',
    title: 'Vision',
    text: 'To be the trusted advisory partner people and institutions turn to when property decisions carry long-term financial, social, and strategic importance.',
    image: '/image/hero/hero-5.jpg',
    points: ['A trusted Nigerian practice', 'Long-term value creation'],
  },
  {
    label: 'About us',
    title: 'Core values',
    text: 'Integrity, transparency, reliability, innovation, and sustainable value guide every instruction we accept and every recommendation we make.',
    image: '/image/hero/hero-7.jpg',
    points: ['Integrity in every recommendation', 'Accountability in every outcome'],
  },
]

export default function AboutSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex]
  const move = (direction) => setActiveIndex((index) => (index + direction + slides.length) % slides.length)
  useEffect(() => { const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 6000); return () => window.clearInterval(timer) }, [])

  return <section id="approach" className="about-section">
    <div className="about-image-wrap"><img src={activeSlide.image} alt="Property advisory and development" className="about-image" /><div className="about-image-label">S.O.Iraoya Consulting <span>Since 2002</span></div></div>
    <div className="about-content"><div className="about-topline"><p className="eyebrow">{activeSlide.label}</p></div><h2 key={activeSlide.title}>{activeSlide.title === 'Core values' ? <>Built on <em>principle.</em></> : activeSlide.title === 'Mission' ? <>Advice with <em>purpose.</em></> : <>A clear view of <em>what comes next.</em></>}</h2><p className="about-text">{activeSlide.text}</p><div className="about-points">{activeSlide.points.map((point) => <span key={point}>● {point}</span>)}</div><div className="about-controls"><button onClick={() => move(-1)} aria-label="Previous about section">←</button><button onClick={() => move(1)} aria-label="Next about section">→</button><div className="about-tabs">{slides.map((slide) => <button key={slide.title} className={slide.title === activeSlide.title ? 'active' : ''} onClick={() => setActiveIndex(slides.indexOf(slide))}>{slide.title}</button>)}</div></div></div>
  </section>
}
