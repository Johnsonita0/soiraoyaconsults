import { seedContent } from '../data/content'

export const normalizeOfficeLocation = (location) => {
  const value = typeof location === 'string' ? location.trim() : ''
  if (!value || (value.includes('Dolphin Plaza') && !value.includes('Ikota Shopping Complex'))) {
    return seedContent.contact.location
  }
  return value
}

export default function OfficeLocations({ location }) {
  return <span className="office-locations">{normalizeOfficeLocation(location)
    .split(/\s*\|\s*/)
    .map((office) => {
      const separatorIndex = office.indexOf(':')
      const label = separatorIndex >= 0 ? office.slice(0, separatorIndex).trim() : ''
      const address = separatorIndex >= 0 ? office.slice(separatorIndex + 1).trim() : office
      const labelClass = label === 'Head Office'
        ? 'office-location-label office-location-label--head'
        : label === 'Lekki/Ajah Office'
          ? 'office-location-label office-location-label--branch'
          : ''

      return <span className="office-location" key={office}>
        {label && <strong className={labelClass}>{label}:</strong>}
        <span>{address}</span>
      </span>
    })}</span>
}
