import { useEffect, useMemo, useState } from 'react'
import { Search, ShieldCheck } from './icons'

export default function HeroSlider({ slides, content, onContact, onSearch }) {
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
  const [listingType, setListingType] = useState('For Sale')
  const [searchFields, setSearchFields] = useState({ keyword: '', title: '', address: '' })
  const activeSlide = safeSlides[activeIndex] || safeSlides[0]

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

  const handleSearch = (event) => {
    event.preventDefault()
    onSearch?.({ listingType, ...searchFields })
  }

  const updateSearchField = (field, value) => setSearchFields((current) => ({ ...current, [field]: value }))

  return <section className="hero-section" style={{ backgroundImage: 'none', backgroundColor: '#10295f' }}>
    <img key={activeIndex} className="hero-background hero-background-zoom" src={imageSources[activeIndex]} onError={handleImageError} alt="Property advisory" style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
    <div className="hero-overlay"></div>
    <div className="hero-content-row">
      <div className="hero-copy"><p className="eyebrow">Independent real-estate advisory <span>Since 2002</span></p><h1>Discover Your Dream Home Today!</h1><p className="hero-lede">Explore listings, find your perfect property, and make your dream a reality with our expert guidance.</p><div className="hero-actions"><button className="button button-light" onClick={onContact}>Tell us what you’re building <span>↗</span></button><a className="text-link" href="#services">Explore our expertise <span>›</span></a></div></div>
      <form className="hero-search-panel" onSubmit={handleSearch}>
        <div className="hero-search-tabs" role="tablist" aria-label="Property listing type"><button type="button" className={listingType === 'For Sale' ? 'active' : ''} onClick={() => setListingType('For Sale')}>For Sale</button><button type="button" className={listingType === 'For Rent' ? 'active' : ''} onClick={() => setListingType('For Rent')}>For Rent</button></div>
        <label><span className="sr-only">Search keyword</span><input value={searchFields.keyword} onChange={(event) => updateSearchField('keyword', event.target.value)} placeholder="Enter Keyword..." /></label>
        <label><span className="sr-only">Property title</span><input value={searchFields.title} onChange={(event) => updateSearchField('title', event.target.value)} placeholder="Title" /></label>
        <label><span className="sr-only">Property address</span><input value={searchFields.address} onChange={(event) => updateSearchField('address', event.target.value)} placeholder="Address" /></label>
        <button className="hero-search-submit" type="submit"><Search size={15} /> Search</button>
      </form>
    </div>
    <div className="hero-controls" style={{ position: 'absolute', left: 16, right: 16, top: '50%', width: 'calc(100% - 32px)', height: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none' }}><button style={{ pointerEvents: 'auto' }} onClick={() => move(-1)} aria-label="Previous slide">←</button><button style={{ pointerEvents: 'auto' }} onClick={() => move(1)} aria-label="Next slide">→</button></div><div className="hero-dots">{safeSlides.map((slide, index) => <button key={`${slide.title}-${index}`} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><div className="hero-stamp"><ShieldCheck size={18} /><span>Licensed &amp; trusted<br /><b>ESVARBON A7725</b></span></div>
  </section>
}
