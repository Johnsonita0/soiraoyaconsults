import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from './icons'

export default function FaqSection({ items = [], onContact }) {
  const [openIndex, setOpenIndex] = useState(0)
  const faqs = items.length ? items : []

  return <section id="faq" className="faq-section"><div className="faq-intro"><p className="eyebrow">Questions, answered</p><h2>Clarity before<br /><em>the next step.</em></h2><p>Still have a question? Our advisory team is ready to talk through your situation.</p><button className="text-link" onClick={onContact}>Talk to our team <ArrowUpRight size={16} /></button></div><div className="faq-list">{faqs.map((item, index) => <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={item.question || `faq-${index}`}><button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? -1 : index)} aria-expanded={openIndex === index}><span>{item.question}</span><ChevronDown size={18} /></button>{openIndex === index && <p className="faq-answer">{item.answer}</p>}</div>)}</div></section>
}
