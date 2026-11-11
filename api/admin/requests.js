import { getAdminClient } from '../_lib/admin.js'

const requestFields = 'id,name,email,organisation,phone,location,category,request,property_location,property_type,property_count,message,status,created_at,contacted_at'

export default async function handler(request, response) {
  if (!['GET', 'PATCH'].includes(request.method)) {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  const supabase = await getAdminClient(request, response)
  if (!supabase) return

  if (request.method === 'GET') {
    const { data, error } = await supabase.from('contact_messages')
      .select(requestFields)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) {
      console.error('Could not load consultation requests', error)
      return response.status(500).json({ ok: false, message: 'Could not load consultation requests.' })
    }
    return response.status(200).json({ ok: true, requests: data || [] })
  }

  const { requestId, status } = request.body || {}
  if (!requestId || status !== 'contacted') {
    return response.status(400).json({ ok: false, message: 'A request ID and contacted status are required.' })
  }

  const { data, error } = await supabase.from('contact_messages')
    .update({ status: 'contacted', contacted_at: new Date().toISOString() })
    .eq('id', requestId)
    .select(requestFields)
    .maybeSingle()
  if (error) {
    console.error('Could not update consultation request', error)
    return response.status(500).json({ ok: false, message: 'Could not update this request.' })
  }
  if (!data) return response.status(404).json({ ok: false, message: 'Consultation request was not found.' })

  return response.status(200).json({ ok: true, request: data })
}
