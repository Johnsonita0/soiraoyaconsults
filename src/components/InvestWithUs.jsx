import { useEffect, useState } from 'react'
import { ArrowUpRight, Check } from './icons'

export default function InvestWithUs({ items = [], properties = [], rentalProperties = [], onContact }) {
  const opportunities = [
    ...items.map((item) => ({ ...item, kind: 'opportunity' })),
    ...properties.map((property) => ({ ...property, kind: 'property', listingType: property.listingType || 'For Sale' })),
    ...rentalProperties.map((property) => ({ ...property, kind: 'rental' })),
  ]
  const [activeIndex, setActiveIndex] = useState(() => opportunities.length ? Math.floor(Math.random() * opportunities.length) : 0)
  const active = opportunities[activeIndex]

  useEffect(() => {
    if (!opportunities.length) return
    const timer = window.setInterval(() => setActiveIndex((index) => {
      if (opportunities.length < 2) return index
      let nextIndex = index
      while (nextIndex === index) nextIndex = Math.floor(Math.random() * opportunities.length)
      return nextIndex
    }), 6000)
    return () => window.clearInterval(timer)
  }, [opportunities.length])

  const move = (direction) => {
    if (!opportunities.length) return
    setActiveIndex((index) => (index + direction + opportunities.length) % opportunities.length)
  }

  if (!active) return null

  const isProperty = active.kind === 'property' || active.kind === 'rental'
  const isRental = active.kind === 'rental'
  return <section id="invest" className="invest-section"><div className="invest-image"><img src={active.image} alt={active.title} /><span>{isRental ? <>Available for rent<br /><em>Find your next address.</em></> : active.kind === 'property' ? <>Available for sale<br /><em>Find your next opportunity.</em></> : <>Opportunity is clearer<br /><em>with the right view.</em></>}</span><div className="invest-controls"><button onClick={() => move(-1)} aria-label="Previous investment">←</button><button onClick={() => move(1)} aria-label="Next investment">→</button></div></div><div className="invest-content"><p className="eyebrow">{isRental ? 'Properties for rent' : active.kind === 'property' ? 'Properties for sale' : 'Invest with us'}</p><h2 key={active.title}>{active.title}</h2>{isProperty ? <><p className="invest-rental-location">{active.location}</p><strong className="invest-rental-price">{active.price}<small>{isRental ? ' / month' : ''}</small></strong><p className="invest-intro">{active.description}</p></> : <><p className="invest-intro">{active.text}</p><div className="invest-focus">{(active.focus || []).map((area) => <span key={area}><Check size={15} /> {area}</span>)}</div></>}<button className="button button-dark" onClick={onContact}>{isProperty ? 'Contact about this property' : 'Explore an opportunity'} <ArrowUpRight size={17} /></button></div></section>
}
