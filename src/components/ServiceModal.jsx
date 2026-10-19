import { ArrowUpRight, X } from './icons'

export const serviceDetails = {
  'Property Management': ['Tenant administration, lease monitoring and rent follow-up, as agreed', 'Property inspections, maintenance planning and contractor coordination', 'Operating expense monitoring and periodic management reporting'],
  'Real Estate Portfolio Management': ['Consolidated property and performance information', 'Occupancy, rental income, expenditure and portfolio risk monitoring', 'Identification of underperforming assets and practical improvement options'],
  'Facilities Management': ['Building operations and preventive or corrective maintenance coordination', 'Supervision of service providers, contractors and agreed service levels', 'Condition reviews, expenditure monitoring and facilities reporting'],
  'Real Estate Investment Analysis': ['Property investment appraisal and acquisition or disposal analysis', 'Cash-flow, income, yield and return analysis, as appropriate', 'Scenario, sensitivity and investment risk assessment'],
  'Feasibility Studies & Development Advisory': ['Site, location, market demand and development concept assessment', 'Development cost, revenue and financial feasibility analysis', 'Phasing, risk and implementation strategy recommendations'],
  'Valuation & Due Diligence': ['Market, rental, investment and development land valuation, within professional scope', 'Property documentation, occupancy, income and condition reviews', 'Identification of material issues requiring further professional investigation'],
}

export default function ServiceModal({ service, onClose, onContact }) {
  if (!service) return null
  return   <div className="service-modal-backdrop" role="presentation" onClick={onClose}><section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={(event) => event.stopPropagation()}><button className="service-modal-close" onClick={onClose} aria-label="Close service details"><X size={20} /></button><p className="eyebrow">Our expertise</p><h2 id="service-modal-title">{service.title}</h2><p className="service-modal-intro">{service.text}</p><div className="service-modal-rule"></div><p className="service-modal-label">How we help</p><ul>{(serviceDetails[service.title] || []).map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="button button-dark" onClick={onContact}>Discuss this service <ArrowUpRight size={17} /></button></section></div>
}
