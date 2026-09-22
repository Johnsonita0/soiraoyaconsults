import { ArrowUpRight, X } from './icons'

export const serviceDetails = {
  'Property & Asset Valuation': ['Mortgage and insurance valuations', 'Asset registers and balance-sheet reporting', 'Acquisition, merger, and compulsory acquisition advice'],
  'Property Management': ['Leasing and tenant selection', 'Rent reviews and service-charge management', 'Portfolio performance and relationship oversight'],
  'Facility Management': ['Planned and reactive maintenance coordination', 'Facilities operations and service oversight', 'Compliance, safety, and lifecycle support'],
  'Project Management': ['Scope, programme, and cost coordination', 'Consultant and contractor liaison', 'Progress monitoring through project delivery'],
  'Real Estate Consultancy': ['Market and property advice', 'Strategic options and decision support', 'Portfolio and asset performance guidance'],
  'General Estate Agency': ['Property marketing and inspections', 'Buyer, seller, landlord, and tenant support', 'Negotiation and transaction coordination'],
  'Feasibility & Viability Appraisal': ['Development potential assessment', 'Market, cost, and revenue analysis', 'Risk evaluation and investment recommendations'],
}

export default function ServiceModal({ service, onClose, onContact }) {
  if (!service) return null
  return <div className="service-modal-backdrop" role="presentation" onClick={onClose}><section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={(event) => event.stopPropagation()}><button className="service-modal-close" onClick={onClose} aria-label="Close service details"><X size={20} /></button><p className="eyebrow">Our expertise</p><h2 id="service-modal-title">{service.title}</h2><p className="service-modal-intro">{service.text}</p><div className="service-modal-rule"></div><p className="service-modal-label">How we help</p><ul>{serviceDetails[service.title].map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="button button-dark" onClick={onContact}>Discuss this service <ArrowUpRight size={17} /></button></section></div>
}
