import { useState } from 'react'
import { ArrowUpRight, X } from './icons'

const defaultProperties = [
  ['Ikoyi Garden Residence', 'Ikoyi, Lagos', 'Residential', '₦185m', 'A considered family residence with generous light, mature landscaping, and quiet access to the city.', 'hero-1.jpg'],
  ['Victoria Island Offices', 'Victoria Island, Lagos', 'Commercial', '₦420m', 'A flexible office asset positioned for businesses looking for a central Lagos address.', 'hero-4.jpg'],
  ['Lekki Waterside Villa', 'Lekki Phase 1, Lagos', 'Residential', '₦265m', 'Contemporary waterfront living with adaptable spaces for family life and entertaining.', 'hero-2.jpg'],
  ['Yaba Creative Quarter', 'Yaba, Lagos', 'Development', '₦98m', 'A well-positioned development opportunity in one of Lagos most active emerging districts.', 'hero-5.jpg'],
  ['Banana Island Compound', 'Banana Island, Lagos', 'Residential', '₦680m', 'A private compound with exceptional proportions, security, and long-term value potential.', 'hero-7.jpg'],
  ['Maryland Business Hub', 'Maryland, Lagos', 'Commercial', '₦310m', 'A connected commercial property designed for strong occupancy and dependable performance.', 'hero-3.jpg'],
  ['Chevron Park Land', 'Chevron, Lekki', 'Land', '₦155m', 'A strategic parcel with clear development potential in a growing residential corridor.', 'hero-6.jpg'],
  ['Oniru Apartment Collection', 'Oniru, Lagos', 'Residential', '₦240m', 'Modern apartments with a strong rental proposition and proximity to the citys coastal lifestyle.', 'hero-1.jpg'],
  ['Ikeja Business House', 'Ikeja GRA, Lagos', 'Commercial', '₦375m', 'A well-located office and retail opportunity in an established business district.', 'hero-4.jpg'],
  ['Epe Development Site', 'Epe, Lagos', 'Development', '₦72m', 'A large development site for investors taking a long view of Lagos expansion.', 'hero-2.jpg'],
  ['Parkview Family Home', 'Parkview Estate, Lagos', 'Residential', '₦495m', 'A calm, secure home with generous outdoor space and a strong neighbourhood setting.', 'hero-7.jpg'],
  ['Adeniyi Jones Offices', 'Ikeja, Lagos', 'Commercial', '₦285m', 'A practical office building for organisations seeking visibility and efficient operations.', 'hero-5.jpg'],
  ['Sangotedo Growth Plot', 'Sangotedo, Lagos', 'Land', '₦48m', 'An accessible landholding with strong upside for residential or mixed-use development.', 'hero-6.jpg'],
  ['Maitama Residence', 'Maitama, Abuja', 'Residential', '₦540m', 'An elegant residence in a distinguished district, suited to private ownership or investment.', 'hero-3.jpg'],
  ['Ikoyi Investment Block', 'Ikoyi, Lagos', 'Investment', '₦760m', 'A rare investment opportunity with a compelling location and multiple value-creation routes.', 'hero-4.jpg'],
].map(([title, location, type, price, description, image]) => ({ title, location, type, price, description, image: `/image/hero/${image}` }))

export default function PropertyGallery({ onContact, properties, searchFilters = null }) {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [marqueeDirection, setMarqueeDirection] = useState('normal')
  const sourceProperties = properties === undefined ? defaultProperties : properties
  const normalizedFilters = searchFilters ? Object.values(searchFilters).some(Boolean) ? searchFilters : null : null
  const galleryItems = normalizedFilters
    ? sourceProperties.filter((property) => {
        const keyword = normalizedFilters.keyword.trim().toLowerCase()
        const title = normalizedFilters.title.trim().toLowerCase()
        const address = normalizedFilters.address.trim().toLowerCase()
        const matchesKeyword = !keyword || [property.title, property.location, property.type, property.description].some((value) => String(value || '').toLowerCase().includes(keyword))
        const matchesTitle = !title || String(property.title || '').toLowerCase().includes(title)
        const matchesAddress = !address || String(property.location || '').toLowerCase().includes(address)
        const propertyListingType = property.listingType || property.status
        const matchesListingType = !propertyListingType || String(propertyListingType).toLowerCase() === normalizedFilters.listingType.toLowerCase()
        return matchesKeyword && matchesTitle && matchesAddress && matchesListingType
      })
    : sourceProperties

  return <>
    <section id="properties" className="property-section">
      <div className="property-section-head"><div><p className="eyebrow">Selected opportunities</p><h2>Property with<br /><em>potential.</em></h2></div><p>Explore a considered selection of residential, commercial, land, and development opportunities.</p></div>
      <div className="property-viewport">{galleryItems.length ? <><div className="property-controls"><button onClick={() => setMarqueeDirection('reverse')} aria-label="Move properties right">←</button><button onClick={() => setMarqueeDirection('normal')} aria-label="Move properties left">→</button></div><div className="property-track" style={{ animationDirection: marqueeDirection }}>{[...galleryItems, ...galleryItems].map((property, index) => <button className="property-card" key={`${property.title}-${index}`} onClick={() => setSelectedProperty(property)}><img src={property.image} alt={property.title} /><div className="property-card-body"><span>{property.type}</span><h3>{property.title}</h3><p>{property.location}</p><b>{property.price}</b><ArrowUpRight size={17} /></div></button>)}</div></> : <p className="property-search-empty">No properties matched your search. Try a different keyword or address.</p>}</div>
    </section>
    {selectedProperty && <div className="property-modal-backdrop" onClick={() => setSelectedProperty(null)}><section className="property-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="property-modal-close" onClick={() => setSelectedProperty(null)} aria-label="Close property details"><X size={20} /></button><img src={selectedProperty.image} alt={selectedProperty.title} /><div className="property-modal-body"><p className="eyebrow">{selectedProperty.type} · {selectedProperty.location}</p><h2>{selectedProperty.title}</h2><b className="property-modal-price">{selectedProperty.price}</b><p>{selectedProperty.description}</p><button className="button button-dark" onClick={() => { setSelectedProperty(null); onContact() }}>Contact us about this property <ArrowUpRight size={17} /></button></div></section></div>}
  </>
}
