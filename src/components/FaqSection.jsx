import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from './icons'

const faqs = [
  ['What services does S.O.Iraoya Consulting provide?', 'We advise across valuation, development strategy, property management, investment analysis, and property listing for owners, investors, institutions, and organisations.'],
  ['Who do you work with?', 'Our clients include private property owners, investors, financial institutions, corporate organisations, government agencies, and Nigerians investing from abroad.'],
  ['How do I request a property valuation?', 'Send us a consultation request with the property location and the purpose of the valuation. Our team will follow up with the right scope and next steps.'],
  ['Can you help with a new development?', 'Yes. We support development decisions from site identification and due diligence through feasibility, market positioning, appraisal, and project coordination.'],
  ['Do you manage residential and commercial properties?', 'Yes. Our property management work covers leasing, tenant selection, rent reviews, service charges, brokerage, and portfolio performance.'],
  ['How quickly can we start?', 'Once we understand your instruction and objectives, we will confirm the scope, information required, and a practical timeline for commencement.'],
]

export default function FaqSection({ onContact }) {
  const [openIndex, setOpenIndex] = useState(0)
  return <section id="faq" className="faq-section"><div className="faq-intro"><p className="eyebrow">Questions, answered</p><h2>Clarity before<br /><em>the next step.</em></h2><p>Still have a question? Our advisory team is ready to talk through your situation.</p><button className="text-link" onClick={onContact}>Talk to our team <ArrowUpRight size={16} /></button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={question}><button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? -1 : index)} aria-expanded={openIndex === index}><span>{question}</span><ChevronDown size={18} /></button>{openIndex === index && <p className="faq-answer">{answer}</p>}</div>)}</div></section>
}
