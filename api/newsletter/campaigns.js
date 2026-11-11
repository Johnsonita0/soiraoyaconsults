import { getAdminClient } from '../_lib/admin.js'

const maximumLength = 20000

export default async function handler(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }
  const supabase = await getAdminClient(request, response)
  if (!supabase) return

  if (request.method === 'GET') {
    const [{ data: campaigns, error }, { count, error: countError }] = await Promise.all([
      supabase.from('newsletter_campaigns').select('id,subject,preview_text,body,status,scheduled_at,sent_at,sent_count,failed_count,created_at').order('created_at', { ascending: false }).limit(50),
      supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ])
    if (error || countError) {
      console.error('Could not load newsletter dashboard', error || countError)
      return response.status(500).json({ ok: false, message: 'Could not load newsletter campaigns.' })
    }
    return response.status(200).json({ ok: true, campaigns: campaigns || [], subscriberCount: count || 0 })
  }

  const { action, campaignId, subject, previewText = '', body = '', scheduledAt } = request.body || {}
  if (action === 'cancel') {
    if (!campaignId) return response.status(400).json({ ok: false, message: 'Campaign ID is required.' })
    const { data, error } = await supabase.from('newsletter_campaigns')
      .update({ status: 'cancelled', claimed_at: null })
      .eq('id', campaignId).in('status', ['draft', 'scheduled']).select('id').maybeSingle()
    if (error) {
      console.error('Could not cancel newsletter campaign', error)
      return response.status(500).json({ ok: false, message: 'Could not cancel this campaign.' })
    }
    if (!data) return response.status(409).json({ ok: false, message: 'Only draft or scheduled campaigns can be cancelled.' })
    return response.status(200).json({ ok: true })
  }

  if (!['save', 'schedule', 'send-now'].includes(action)) {
    return response.status(400).json({ ok: false, message: 'Choose a valid campaign action.' })
  }
  if (typeof subject !== 'string' || subject.trim().length < 3 || subject.length > 150) {
    return response.status(400).json({ ok: false, message: 'Subject must be between 3 and 150 characters.' })
  }
  if (/[\r\n]/.test(subject)) {
    return response.status(400).json({ ok: false, message: 'Subject cannot contain line breaks.' })
  }
  if (typeof previewText !== 'string' || previewText.length > 180) {
    return response.status(400).json({ ok: false, message: 'Preview text must be 180 characters or fewer.' })
  }
  if (typeof body !== 'string' || body.trim().length < 3 || body.length > maximumLength) {
    return response.status(400).json({ ok: false, message: 'Newsletter content must be between 3 and 20,000 characters.' })
  }

  const scheduledFor = action === 'save' ? null : action === 'send-now' ? new Date().toISOString() : new Date(scheduledAt)
  if (action === 'schedule' && (!scheduledAt || Number.isNaN(scheduledFor.getTime()) || scheduledFor.getTime() < Date.now() + 30000)) {
    return response.status(400).json({ ok: false, message: 'Choose a future date and time for this campaign.' })
  }

  const values = {
    subject: subject.trim(),
    preview_text: previewText.trim(),
    body: body.trim(),
    status: action === 'save' ? 'draft' : 'scheduled',
    scheduled_at: scheduledFor,
    claimed_at: null,
    last_subscriber_id: null,
    sent_count: 0,
    failed_count: 0,
    sent_at: null,
  }
  let query = supabase.from('newsletter_campaigns')
  if (campaignId) {
    query = query.update(values).eq('id', campaignId).in('status', ['draft', 'scheduled'])
  } else {
    query = query.insert(values)
  }
  const { data, error } = await query.select('id').maybeSingle()
  if (error) {
    console.error('Could not save newsletter campaign', error)
    return response.status(500).json({ ok: false, message: 'Could not save this campaign.' })
  }
  if (!data) return response.status(409).json({ ok: false, message: 'This campaign can no longer be edited.' })
  return response.status(200).json({ ok: true, campaignId: data.id })
}
