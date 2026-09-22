import { BarChart3, Building2, Home, Leaf } from '../components/icons'

export const seedContent = {
  heroTitle: 'Property decisions, made with conviction.',
  heroText: 'Strategic real-estate advisory for people and institutions who want to protect capital, unlock opportunity, and build lasting value.',
  heroSlides: [
    { image: '/image/hero/hero-1.jpg', fallback: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=88', title: 'Property decisions, made with conviction.', tagline: 'Perspective changes everything.', active: true },
    { image: '/image/hero/hero-2.jpg', fallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=88', title: 'Build value that lasts.', tagline: 'The long view creates stronger assets.', active: true },
    { image: '/image/hero/hero-3.jpg', fallback: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=88', title: 'See the opportunity behind the property.', tagline: 'Clarity gives ambition somewhere to go.', active: true },
    { image: '/image/hero/hero-4.jpg', fallback: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=88', title: 'Make every square metre count.', tagline: 'Performance starts with a considered plan.', active: true },
    { image: '/image/hero/hero-5.jpg', fallback: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=88', title: 'Move from possibility to proof.', tagline: 'Rigour turns good ideas into real outcomes.', active: true },
    { image: '/image/hero/hero-6.jpg', fallback: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1600&q=88', title: 'A better next step starts here.', tagline: 'Independent advice for consequential decisions.', active: true },
    { image: '/image/hero/hero-7.jpg', fallback: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=88', title: 'Your property. Our priority.', tagline: 'Protecting capital. Growing confidence.', active: true },
  ],
  services: [
    { title: 'Valuation & Advisory', text: 'Independent valuations that give lenders, owners, and investors a clear basis for action.', icon: BarChart3 },
    { title: 'Development Strategy', text: 'From site selection to delivery, we make the route from ambition to asset more certain.', icon: Building2 },
    { title: 'Property Management', text: 'Thoughtful stewardship that keeps properties performing and relationships working.', icon: Home },
    { title: 'Investment Analysis', text: 'Feasibility, cash flow, risk, and market intelligence for better investment decisions.', icon: Leaf },
    { title: 'Property Listing', text: 'Well-positioned property marketing that connects quality assets with serious buyers and tenants.', icon: Building2 },
  ],
  gallery: [
    { title: 'Ikoyi Garden Residence', location: 'Ikoyi, Lagos', type: 'Residential', price: '₦185m', description: 'A considered family residence with generous light, mature landscaping, and quiet access to the city.', image: '/image/hero/hero-1.jpg' },
    { title: 'Victoria Island Offices', location: 'Victoria Island, Lagos', type: 'Commercial', price: '₦420m', description: 'A flexible office asset positioned for businesses looking for a central Lagos address.', image: '/image/hero/hero-4.jpg' },
    { title: 'Lekki Waterside Villa', location: 'Lekki Phase 1, Lagos', type: 'Residential', price: '₦265m', description: 'Contemporary waterfront living with adaptable spaces for family life and entertaining.', image: '/image/hero/hero-2.jpg' },
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
    { question: 'What services does S.O.Iraoya Consulting provide?', answer: 'We advise across valuation, development strategy, property management, investment analysis, and property listing for owners, investors, institutions, and organisations.' },
    { question: 'Who do you work with?', answer: 'Our clients include private property owners, investors, financial institutions, corporate organisations, government agencies, and Nigerians investing from abroad.' },
    { question: 'How do I request a property valuation?', answer: 'Send us a consultation request with the property location and the purpose of the valuation. Our team will follow up with the right scope and next steps.' },
    { question: 'Can you help with a new development?', answer: 'Yes. We support development decisions from site identification and due diligence through feasibility, market positioning, appraisal, and project coordination.' },
    { question: 'Do you manage residential and commercial properties?', answer: 'Yes. Our property management work covers leasing, tenant selection, rent reviews, service charges, brokerage, and portfolio performance.' },
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
