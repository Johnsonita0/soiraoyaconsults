import { getServiceClient } from '../_lib/admin.js'

export default async function handler(request, response) {
  const secret = process.env.CRON_SECRET
  const authorization = request.headers.authorization || ''
  if (!secret || authorization !== `Bearer ${secret}`) {
    return response.status(401).json({ ok: false, message: 'Unauthorized.' })
  }
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  try {
    const supabase = getServiceClient()
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await supabase.from('site_visit_logs').delete().lt('visited_at', cutoff)
    if (error) throw error
    return response.status(200).json({ ok: true })
  } catch (error) {
    console.error('Could not clean up expired visitor logs', error)
    return response.status(500).json({ ok: false, message: 'Could not clean up expired visitor logs.' })
  }
}
