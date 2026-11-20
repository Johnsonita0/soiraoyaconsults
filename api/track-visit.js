import { isIP } from 'node:net'
import { getServiceClient } from './_lib/admin.js'

const validPagePath = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/

function getClientIp(request) {
  const realIp = String(request.headers['x-real-ip'] || '').trim()
  const forwardedIp = String(request.headers['x-forwarded-for'] || '').split(',')[0].trim()
  const candidates = [realIp, forwardedIp]
  return candidates.find((candidate) => isIP(candidate)) || null
}

function getDeviceDetails(userAgent) {
  const tablet = /ipad|tablet|kindle|silk|android(?!.*mobile)/i.test(userAgent)
  const mobile = /mobile|iphone|ipod|android/i.test(userAgent)
  const device = tablet ? 'Tablet' : mobile ? 'Mobile' : userAgent ? 'Desktop' : 'Unknown'
  const operatingSystem = /windows/i.test(userAgent) ? 'Windows'
    : /iphone|ipad|ipod/i.test(userAgent) ? 'iOS'
      : /android/i.test(userAgent) ? 'Android'
        : /macintosh|mac os x/i.test(userAgent) ? 'macOS'
          : /cros/i.test(userAgent) ? 'ChromeOS'
            : /linux/i.test(userAgent) ? 'Linux' : 'Unknown'
  const browser = /edg\//i.test(userAgent) ? 'Edge'
    : /opr\//i.test(userAgent) ? 'Opera'
      : /samsungbrowser/i.test(userAgent) ? 'Samsung Internet'
        : /firefox\//i.test(userAgent) ? 'Firefox'
          : /chrome\//i.test(userAgent) ? 'Chrome'
            : /safari\//i.test(userAgent) ? 'Safari' : 'Unknown'

  return { device, operatingSystem, browser }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  const pagePath = request.body?.pagePath
  if (typeof pagePath !== 'string' || pagePath.length > 200 || !validPagePath.test(pagePath)) {
    return response.status(400).json({ ok: false, message: 'A valid page path is required.' })
  }
  const section = request.body?.section || null
  if (section !== null && (typeof section !== 'string' || !/^[a-z0-9-]{1,100}$/.test(section))) {
    return response.status(400).json({ ok: false, message: 'A valid page section is required.' })
  }

  try {
    const userAgent = String(request.headers['user-agent'] || '')
    const deviceDetails = getDeviceDetails(userAgent)
    const supabase = getServiceClient()
    const { error } = await supabase.rpc('record_site_visit_detail', {
      p_page_path: pagePath,
      p_section: section,
      p_ip_address: getClientIp(request),
      p_device: deviceDetails.device,
      p_browser: deviceDetails.browser,
      p_operating_system: deviceDetails.operatingSystem,
    })
    if (error) throw error
    return response.status(204).end()
  } catch (error) {
    console.error('Could not record site visit', error)
    return response.status(502).json({ ok: false, message: 'Could not record site visit.' })
  }
}
