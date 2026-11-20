import { getAdminClient } from '../_lib/admin.js'

const pageSize = 50

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  const supabase = await getAdminClient(request, response)
  if (!supabase) return

  const offsetValue = Number(request.query?.offset || 0)
  if (!Number.isInteger(offsetValue) || offsetValue < 0 || offsetValue > 1000000) {
    return response.status(400).json({ ok: false, message: 'A valid visitor list offset is required.' })
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data, count, error } = await supabase.from('site_visit_logs')
    .select('id,page_path,section,ip_address,device,browser,operating_system,visited_at', { count: 'exact' })
    .gte('visited_at', cutoff)
    .order('visited_at', { ascending: false })
    .range(offsetValue, offsetValue + pageSize - 1)

  if (error) {
    console.error('Could not load visitor logs', error)
    return response.status(500).json({ ok: false, message: 'Could not load visitor logs.' })
  }

  return response.status(200).json({ ok: true, visits: data || [], total: count || 0 })
}
