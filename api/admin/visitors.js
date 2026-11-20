import { getAdminClient } from '../_lib/admin.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  const supabase = await getAdminClient(request, response)
  if (!supabase) return

  const { data, error } = await supabase.rpc('get_site_visit_stats')
  if (error) {
    console.error('Could not load visitor statistics', error)
    return response.status(500).json({ ok: false, message: 'Could not load visitor statistics.' })
  }

  return response.status(200).json({ ok: true, stats: data })
}
