const SITE_ORIGIN = 'https://soiraoyaconsulting.org'
const SITE_NAME = 'S.O. Iraoya Consulting'
const DEFAULT_IMAGE = `${SITE_ORIGIN}/image/hero/hero-1.jpg`

const serviceTitles = {
  'Property Management': 'Property Management in Lagos | S.O. Iraoya',
  'Facilities Management': 'Facilities Management in Lagos | S.O. Iraoya',
  'Real Estate Investment Analysis or Analysis': 'Real Estate Investment Analysis in Lagos | S.O. Iraoya',
  'Feasibility Studies & Development Advisory': 'Feasibility & Development Advisory in Lagos | S.O. Iraoya',
  'Valuation & Due Diligence': 'Valuation & Due Diligence in Lagos | S.O. Iraoya',
}

const pageMetadata = {
  '/': {
    title: 'Real Estate Advisory in Lagos | S.O. Iraoya Consulting',
    description: 'S.O. Iraoya Consulting provides real estate advisory, property management and investment analysis in Lagos, Nigeria.',
  },
  '/portfolio-management': {
    title: 'Real Estate Portfolio Management in Nigeria | S.O. Iraoya',
    description: 'Improve visibility across property assets with portfolio performance monitoring, investment analysis and real estate advisory in Nigeria.',
  },
  '/diaspora-property-management': {
    title: 'Diaspora Property Management in Nigeria | S.O. Iraoya',
    description: 'Professional property oversight, maintenance coordination and reporting for Nigerians abroad and non-resident property owners.',
  },
  '/properties': {
    title: 'Properties for Sale & Rent in Lagos | S.O. Iraoya',
    description: 'Explore selected residential and commercial properties for sale and rent in Lagos, Nigeria, and contact our team about a listing.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | S.O. Iraoya Consulting',
    description: 'Learn how S.O. Iraoya Consulting collects, uses, shares and protects personal information through its website and newsletter.',
  },
  '/data-usage': {
    title: 'Data Usage Policy | S.O. Iraoya Consulting',
    description: 'Understand how S.O. Iraoya Consulting uses enquiry, newsletter and website information.',
  },
}

const conciseDescription = (description) => {
  if (description.length <= 155) return description
  return `${description.slice(0, 152).replace(/\s+\S*$/, '')}.`
}

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [key, name] = attribute
    element.setAttribute(key, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

const setCanonical = (url) => {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

export function updateSeoMetadata({ routePath, content, service }) {
  const isPrivatePage = ['/login', '/dashboard', '/admin'].includes(routePath)
  const isSearchPage = routePath === '/properties/search'
  const canonicalPath = isSearchPage ? '/properties' : routePath
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`
  let metadata = pageMetadata[routePath] || pageMetadata['/']

  if (service) {
    metadata = {
      title: serviceTitles[service.title] || `${service.title} | S.O. Iraoya`,
      description: conciseDescription(`${service.text} Professional real estate support in Lagos, Nigeria.`),
    }
  }

  document.title = metadata.title
  setMeta('meta[name="description"]', ['name', 'description'], metadata.description)
  setMeta(
    'meta[name="robots"]',
    ['name', 'robots'],
    isPrivatePage || isSearchPage ? 'noindex, follow' : 'index, follow',
  )
  setCanonical(canonicalUrl)
  setMeta('meta[property="og:title"]', ['property', 'og:title'], metadata.title)
  setMeta('meta[property="og:description"]', ['property', 'og:description'], metadata.description)
  setMeta('meta[property="og:url"]', ['property', 'og:url'], canonicalUrl)
  setMeta('meta[property="og:image"]', ['property', 'og:image'], DEFAULT_IMAGE)
  setMeta('meta[name="twitter:title"]', ['name', 'twitter:title'], metadata.title)
  setMeta('meta[name="twitter:description"]', ['name', 'twitter:description'], metadata.description)
  setMeta('meta[name="twitter:image"]', ['name', 'twitter:image'], DEFAULT_IMAGE)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description: pageMetadata['/'].description,
    email: content?.contact?.email || 'soiraoyaconsults@gmail.com',
    telephone: '+2349074091408',
    areaServed: [
      { '@type': 'City', name: 'Lagos' },
      { '@type': 'Country', name: 'Nigeria' },
    ],
    image: DEFAULT_IMAGE,
  }
  let script = document.head.querySelector('#business-structured-data')
  if (!script) {
    script = document.createElement('script')
    script.id = 'business-structured-data'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(structuredData)
}
