import { useEffect, useState } from 'react'
import { ArrowUpRight, Check } from './icons'

const opportunities = [
  { title: 'Build with a clearer view.', text: 'Development opportunities assessed with market intelligence, practical assumptions, and a long-term view of value.', image: '/image/hero/hero-6.jpg', focus: ['Development appraisal', 'Market positioning', 'Risk assessment'] },
  { title: 'Invest where momentum is building.', text: 'Identify well-positioned residential and commercial opportunities before the market catches up.', image: '/image/hero/hero-2.jpg', focus: ['Location intelligence', 'Cash-flow analysis', 'Investment planning'] },
  { title: 'Turn land into potential.', text: 'Understand the development story behind a site and the steps required to unlock it responsibly.', image: '/image/hero/hero-5.jpg', focus: ['Site due diligence', 'Feasibility studies', 'Development strategy'] },
  { title: 'Make the long view work.', text: 'Build a property portfolio around sound decisions, resilient assets, and sustainable value creation.', image: '/image/hero/hero-7.jpg', focus: ['Portfolio analysis', 'Return modelling', 'Advisory support'] },
]

export default function InvestWithUs({ onContact }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = opportunities[activeIndex]
  const move = (direction) => setActiveIndex((index) => (index + direction + opportunities.length) % opportunities.length)
  useEffect(() => { const timer = window.setInterval(() => move(1), 6000); return () => window.clearInterval(timer) }, [])
  return <section id="invest" className="invest-section"><div className="invest-image"><img src={active.image} alt="Property investment opportunity" /><span>Opportunity is clearer<br /><em>with the right view.</em></span><div className="invest-controls"><button onClick={() => move(-1)} aria-label="Previous investment">←</button><button onClick={() => move(1)} aria-label="Next investment">→</button></div></div><div className="invest-content"><p className="eyebrow">Invest with us</p><h2 key={active.title}>{active.title}</h2><p className="invest-intro">{active.text}</p><div className="invest-focus">{active.focus.map((area) => <span key={area}><Check size={15} /> {area}</span>)}</div><button className="button button-dark" onClick={onContact}>Explore an opportunity <ArrowUpRight size={17} /></button></div></section>
}
