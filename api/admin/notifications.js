import { getAdminClient } from '../_lib/admin.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  const supabase = await getAdminClient(request, response)
  if (!supabase) return

  const [
    { data: requests, error: requestError },
    { data: testimonials, error: testimonialError },
    { data: campaigns, error: campaignError },
    { data: subscribers, error: subscriberError },
  ] = await Promise.all([
    supabase.from('contact_messages')
      .select('id,name,request,created_at')
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('testimonials')
      .select('id,name,created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('newsletter_campaigns')
      .select('id,subject,status,scheduled_at,sent_at,failed_count,updated_at,created_at')
      .in('status', ['scheduled', 'sending', 'sent'])
      .order('updated_at', { ascending: false })
      .limit(10),
    supabase.from('newsletter_subscribers')
      .select('id,email,subscribed_at')
      .eq('status', 'active')
      .not('subscribed_at', 'is', null)
      .order('subscribed_at', { ascending: false })
      .limit(10),
  ])

  const error = requestError || testimonialError || campaignError || subscriberError
  if (error) {
    console.error('Could not load admin notifications', error)
    return response.status(500).json({ ok: false, message: 'Could not load dashboard notifications.' })
  }

  const notifications = [
    ...(requests || []).map((item) => ({
      id: `request:${item.id}`,
      type: 'request',
      title: 'New consultation request',
      detail: `${item.name || 'A client'} - ${item.request || 'Service enquiry'}`,
      createdAt: item.created_at,
    })),
    ...(testimonials || []).map((item) => ({
      id: `testimonial:${item.id}`,
      type: 'testimonial',
      title: 'Testimonial awaiting review',
      detail: `${item.name || 'A client'} shared a testimonial.`,
      createdAt: item.created_at,
    })),
    ...(subscribers || []).map((item) => ({
      id: `subscriber:${item.id}`,
      type: 'newsletter',
      title: 'New newsletter subscriber',
      detail: item.email,
      createdAt: item.subscribed_at,
    })),
    ...(campaigns || []).map((item) => ({
      id: `campaign:${item.id}:${item.status}:${item.updated_at}`,
      type: 'newsletter',
      title: item.failed_count > 0 ? 'Newsletter delivery needs attention' : `Newsletter ${item.status}`,
      detail: item.failed_count > 0
        ? `${item.subject} - ${item.failed_count} recipient${item.failed_count === 1 ? '' : 's'} failed.`
        : item.subject,
      createdAt: item.sent_at || item.scheduled_at || item.updated_at || item.created_at,
    })),
  ].sort((first, second) => Date.parse(second.createdAt || '') - Date.parse(first.createdAt || '')).slice(0, 30)

  return response.status(200).json({ ok: true, notifications })
}
