import { getServiceClient } from '../_lib/admin.js'

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const subscribedMessage = "You're subscribed. Thank you for joining our newsletter."

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const email = String(request.body?.email || '').trim().toLowerCase()
  if (request.body?.website) return response.status(200).json({ ok: true })
  if (request.body?.consent !== true) {
    return response.status(400).json({ ok: false, message: 'Please agree to receive email updates before subscribing.' })
  }
  if (!validEmail.test(email) || email.length > 254) {
    return response.status(400).json({ ok: false, message: 'Enter a valid email address.' })
  }

  try {
    const supabase = getServiceClient()
    const { data: existing, error: lookupError } = await supabase
      .from('newsletter_subscribers').select('status').eq('email', email).maybeSingle()
    if (lookupError) throw lookupError
    if (existing?.status === 'active') {
      return response.status(200).json({ ok: true, message: subscribedMessage })
    }

    const { error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      status: 'active',
      confirmation_token: null,
      consented_at: new Date().toISOString(),
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    }, { onConflict: 'email' })
    if (error) throw error

    return response.status(200).json({ ok: true, message: subscribedMessage })
  } catch (error) {
    console.error('Newsletter subscription failed', error)
    return response.status(502).json({ ok: false, message: error.message || 'Could not process your subscription.' })
  }
}
