import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from './icons'

const fallbackFaqs = [
  {
    question: 'What services does S.O.Iraoya Consulting provide?',
    answer: 'We advise across valuation, development strategy, property management, investment analysis, and property listing for owners, investors, institutions, and organisations.',
  },
  {
    question: 'Who do you work with?',
    answer: 'Our clients include private property owners, investors, financial institutions, corporate organisations, government agencies, and Nigerians investing from abroad.',
  },
  {
    question: 'How do I request a property valuation?',
    answer: 'Send us a consultation request with the property location and the purpose of the valuation. Our team will follow up with the right scope and next steps.',
  },
  {
    question: 'Can you help with a new development?',
    answer: 'Yes. We support development decisions from site identification and due diligence through feasibility, market positioning, appraisal, and project coordination.',
  },
  {
    question: 'Do you manage residential and commercial properties?',
    answer: 'Yes. Our property management work covers leasing, tenant selection, rent reviews, service charges, brokerage, and portfolio performance.',
  },
  {
    question: 'How quickly can we start?',
    answer: 'Once we understand your instruction and objectives, we will confirm the scope, information required, and a practical timeline for commencement.',
  },
]

export default function FaqSection({ items = [], onContact }) {
  const [openIndex, setOpenIndex] = useState(0)
  const faqs = Array.isArray(items) && items.length ? items : fallbackFaqs

  return <section id="faq" className="faq-section"><div className="faq-intro"><p className="eyebrow">Questions, answered</p><h2>Clarity before<br /><em>the next step.</em></h2><p>Still have a question? Our advisory team is ready to talk through your situation.</p><button className="text-link" onClick={onContact}>Talk to our team <ArrowUpRight size={16} /></button></div><div className="faq-list">{faqs.map((item, index) => <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={item.question || `faq-${index}`}><button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? -1 : index)} aria-expanded={openIndex === index}><span>{item.question}</span><ChevronDown size={18} /></button>{openIndex === index && <p className="faq-answer">{item.answer}</p>}</div>)}</div></section>
}
