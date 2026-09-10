import { useEffect, useState } from 'react'
import { ArrowUpRight, Check } from './icons'

export default function InvestWithUs({ items = [], onContact }) {
  const opportunities = items.length ? items : []
  const [activeIndex, setActiveIndex] = useState(0)
  const active = opportunities[activeIndex]

  useEffect(() => {
    if (!opportunities.length) return
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % opportunities.length), 6000)
    return () => window.clearInterval(timer)
  }, [opportunities.length])

  const move = (direction) => {
    if (!opportunities.length) return
    setActiveIndex((index) => (index + direction + opportunities.length) % opportunities.length)
  }

  if (!active) return null

  return <section id="invest" className="invest-section"><div className="invest-image"><img src={active.image} alt="Property investment opportunity" /><span>Opportunity is clearer<br /><em>with the right view.</em></span><div className="invest-controls"><button onClick={() => move(-1)} aria-label="Previous investment">←</button><button onClick={() => move(1)} aria-label="Next investment">→</button></div></div><div className="invest-content"><p className="eyebrow">Invest with us</p><h2 key={active.title}>{active.title}</h2><p className="invest-intro">{active.text}</p><div className="invest-focus">{(active.focus || []).map((area) => <span key={area}><Check size={15} /> {area}</span>)}</div><button className="button button-dark" onClick={onContact}>Explore an opportunity <ArrowUpRight size={17} /></button></div></section>
}
