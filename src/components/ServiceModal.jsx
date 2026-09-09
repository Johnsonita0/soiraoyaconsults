import { ArrowUpRight, X } from './icons'

const details = {
  'Valuation & Advisory': ['Mortgage and insurance valuations', 'Asset registers and balance-sheet reporting', 'Acquisition, merger, and compulsory acquisition advice'],
  'Development Strategy': ['Site identification and due diligence', 'Market positioning and scheme planning', 'Project coordination from feasibility to delivery'],
  'Property Management': ['Leasing and tenant selection', 'Rent reviews and service-charge management', 'Portfolio performance and relationship oversight'],
  'Investment Analysis': ['Feasibility studies and development appraisals', 'Cash-flow modelling and risk assessment', 'Real-estate finance and investment planning'],
  'Property Listing': ['Property preparation and positioning', 'Professional listing copy and visual presentation', 'Qualified buyer and tenant enquiries'],
}

export default function ServiceModal({ service, onClose, onContact }) {
  if (!service) return null
  return <div className="service-modal-backdrop" role="presentation" onClick={onClose}><section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={(event) => event.stopPropagation()}><button className="service-modal-close" onClick={onClose} aria-label="Close service details"><X size={20} /></button><p className="eyebrow">Our expertise</p><h2 id="service-modal-title">{service.title}</h2><p className="service-modal-intro">{service.text}</p><div className="service-modal-rule"></div><p className="service-modal-label">How we help</p><ul>{details[service.title].map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="button button-dark" onClick={onContact}>Discuss this service <ArrowUpRight size={17} /></button></section></div>
}
