import { BarChart3, Building2, Home, Leaf } from '../components/icons'

export const seedContent = {
  heroTitle: 'Own with confidence. Invest with insight. Manage for performance.',
  heroText: 'We help property owners, investors, developers and institutions protect their assets, monitor performance and make informed real estate decisions.',
  heroSlides: [
    { image: '/image/hero/hero-1.jpg', fallback: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=88', title: 'Own with confidence. Invest with insight. Manage for performance.', tagline: 'Professional real estate management and investment advisory.', active: true },
    { image: '/image/hero/hero-2.jpg', fallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=88', title: 'Your property is an investment. Protect its value.', tagline: 'A considered approach to property operations and oversight.', active: true },
    { image: '/image/hero/hero-3.jpg', fallback: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=88', title: 'Make informed decisions about every asset.', tagline: 'Clearer information for complex real estate decisions.', active: true },
    { image: '/image/hero/hero-4.jpg', fallback: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=88', title: 'See the opportunity behind the property.', tagline: 'Independent advice for every stage of the property lifecycle.', active: true },
    { image: '/image/hero/hero-5.jpg', fallback: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=88', title: 'Plan with evidence. Move with clarity.', tagline: 'Investment analysis and feasibility grounded in the fundamentals.', active: true },
    { image: '/image/hero/hero-6.jpg', fallback: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1600&q=88', title: 'A better next step starts with a clearer view.', tagline: 'Practical guidance for owners, investors and institutions.', active: true },
    { image: '/image/hero/hero-7.jpg', fallback: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=88', title: 'Bring your property and investment goals into focus.', tagline: 'Protecting assets through professional oversight.', active: true },
  ],
  servicesVersion: 3,
  services: [
    { title: 'Property Management', text: 'Professional oversight of property operations, tenancy administration, maintenance and reporting.', icon: Home },
    { title: 'Real Estate Portfolio Management', text: 'A clearer, portfolio-wide view of asset performance, operating risks and strategic priorities.', icon: BarChart3 },
    { title: 'Facilities Management', text: 'Coordinated building operations and maintenance to support reliable service and asset preservation.', icon: Building2 },
    { title: 'Real Estate Investment Analysis', text: 'Commercial and financial analysis to help assess property investments and development opportunities.', icon: BarChart3 },
    { title: 'Feasibility Studies & Development Advisory', text: 'Market, cost, revenue and risk assessment to inform real estate development decisions.', icon: Building2 },
    { title: 'Valuation & Due Diligence', text: 'Property evidence and risk reviews to support acquisition, disposal, financing and asset decisions.', icon: Leaf },
  ],
  gallery: [
    { title: 'Ikoyi Garden Residence', location: 'Ikoyi, Lagos', type: 'Residential', price: '₦185m', description: 'A considered family residence with generous light, mature landscaping, and quiet access to the city.', image: '/image/hero/hero-1.jpg' },
    { title: 'Victoria Island Offices', location: 'Victoria Island, Lagos', type: 'Commercial', price: '₦420m', description: 'A flexible office asset positioned for businesses looking for a central Lagos address.', image: '/image/hero/hero-4.jpg' },
    { title: 'Lekki Waterside Villa', location: 'Lekki Phase 1, Lagos', type: 'Residential', price: '₦265m', description: 'Contemporary waterfront living with adaptable spaces for family life and entertaining.', image: '/image/hero/hero-2.jpg' },
  ],
  rentalProperties: [
    { title: 'Ikoyi Garden Apartment', location: 'Ikoyi, Lagos', type: 'Residential', price: '₦8.5m', description: 'A bright, well-appointed apartment with secure parking and convenient access to Ikoyi amenities.', image: '/image/hero/hero-1.jpg', listingType: 'For Rent' },
    { title: 'Lekki Waterside Home', location: 'Lekki Phase 1, Lagos', type: 'Residential', price: '₦12m', description: 'A spacious contemporary home near the waterfront, suited to comfortable family living.', image: '/image/hero/hero-2.jpg', listingType: 'For Rent' },
    { title: 'Victoria Island Executive Suite', location: 'Victoria Island, Lagos', type: 'Residential', price: '₦10m', description: 'A polished city residence with excellent access to business, dining, and coastal neighbourhoods.', image: '/image/hero/hero-3.jpg', listingType: 'For Rent' },
  ],
  aboutSlides: [
    {
      label: 'Company overview',
      title: 'Our Vision',
      text: 'To provide data-driven real estate solutions that create value, inform decisions, and meet the evolving needs of our clients.',
      points: ['Data-driven solutions', 'Lasting client value'],
    },
    {
      label: 'About us',
      title: 'Core values',
      text: 'Integrity, relationships, a growth mindset, and care guide how we advise, collaborate, and create value for our clients.',
      points: ['Integrity', 'Relationships', 'Growth mindset', 'Care'],
    },
  ],
  investOpportunities: [
    { title: 'Build with a clearer view.', text: 'Development opportunities assessed with market intelligence, practical assumptions, and a long-term view of value.', image: '/image/hero/hero-6.jpg', focus: ['Development appraisal', 'Market positioning', 'Risk assessment'] },
    { title: 'Invest where momentum is building.', text: 'Identify well-positioned residential and commercial opportunities before the market catches up.', image: '/image/hero/hero-2.jpg', focus: ['Location intelligence', 'Cash-flow analysis', 'Investment planning'] },
    { title: 'Turn land into potential.', text: 'Understand the development story behind a site and the steps required to unlock it responsibly.', image: '/image/hero/hero-5.jpg', focus: ['Site due diligence', 'Feasibility studies', 'Development strategy'] },
    { title: 'Make the long view work.', text: 'Build a property portfolio around sound decisions, resilient assets, and sustainable value creation.', image: '/image/hero/hero-7.jpg', focus: ['Portfolio analysis', 'Return modelling', 'Advisory support'] },
  ],
  testimonials: [
    { quote: 'S.O.Iraoya gave us the clarity to move forward with confidence. Their advice was practical, measured, and easy to act on.', name: 'Mariam Bello', role: 'Private investor', rating: 5 },
    { quote: 'They understood both the numbers and the people behind the decision. We felt properly advised at every stage.', name: 'Kola Adeyemi', role: 'Managing director, K&A Holdings', rating: 5 },
    { quote: 'The team brought structure to a complicated property question and helped us see a much stronger route ahead.', name: 'Tolu Ogunleye', role: 'Development partner', rating: 5 },
  ],
  faqs: [
    { question: 'What services does S.O.Iraoya Consulting provide?', answer: 'We provide property and portfolio management, facilities management, valuation, due diligence, investment analysis, and development feasibility advisory.' },
    { question: 'Who do you work with?', answer: 'We support individual property owners, diaspora investors, real estate investors, developers, institutional investors, financial institutions, government agencies and corporate property owners.' },
    { question: 'How do I request a property valuation?', answer: 'Send us a consultation request with the property location and the purpose of the valuation. Our team will follow up with the right scope and next steps.' },
    { question: 'Can you help with a new development?', answer: 'Yes. We support development decisions from site identification and due diligence through feasibility, market positioning, appraisal, and project coordination.' },
    { question: 'Do you manage properties for owners who live abroad?', answer: 'We can discuss an agreed management mandate covering property inspections, tenancy administration, maintenance coordination and reporting for non-resident owners.' },
    { question: 'Can you help assess an investment before acquisition?', answer: 'Yes. Depending on the assignment, we can provide valuation, investment analysis and due diligence services to help you assess the asset and relevant risks.' },
    { question: 'How much do your services cost?', answer: 'Fees depend on the property, number of assets, location, complexity and agreed scope. Following an initial discussion, we can provide a proposal setting out the services, deliverables and fees.' },
    { question: 'How quickly can we start?', answer: 'Once we understand your instruction and objectives, we will confirm the scope, information required, and a practical timeline for commencement.' },
  ],
  contact: {
    title: 'Let’s talk property',
    location: 'Suite 30, Dolphin Plaza, Ikoyi, Lagos',
    phone: '0907 409 1408',
    email: 'info@soiraoyaconsulting.com.ng',
  },
}

export const seedRequests = [
  { name: 'Adewale Ogunleye', type: 'Property valuation', date: 'Today, 09:42', status: 'New', initials: 'AO' },
  { name: 'Mariam Bello', type: 'Investment advisory', date: 'Yesterday, 16:18', status: 'In review', initials: 'MB' },
  { name: 'Kola & Sons Ltd.', type: 'Development strategy', date: 'Sep 06, 11:05', status: 'Scheduled', initials: 'KS' },
]

export const heroSlides = seedContent.heroSlides
