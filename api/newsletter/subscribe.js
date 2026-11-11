import { randomUUID } from 'node:crypto'
import { emailLayout, escapeHtml, sendEmail, siteUrl } from '../_lib/email.js'
import { getServiceClient } from '../_lib/admin.js'

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      return response.status(200).json({ ok: true, message: 'Please check your inbox to confirm your subscription.' })
    }

    const token = randomUUID()
    const { error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      status: 'pending',
      confirmation_token: token,
      consented_at: new Date().toISOString(),
      unsubscribed_at: null,
    }, { onConflict: 'email' })
    if (error) throw error

    const confirmationUrl = `${siteUrl()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`
    await sendEmail({
      to: email,
      subject: 'Confirm your S.O. Iraoya Consulting newsletter subscription',
      text: `Please confirm your subscription: ${confirmationUrl}`,
      html: emailLayout('Confirm your subscription', `<p>Thank you for your interest in our property insights and company updates.</p><p><a href="${escapeHtml(confirmationUrl)}" style="display:inline-block;padding:13px 20px;background:#102b3f;color:#fff;text-decoration:none;border-radius:5px">Confirm subscription</a></p><p>If you did not request this, you can ignore this email.</p>`, 'Confirm your newsletter subscription.'),
    })
    return response.status(200).json({ ok: true, message: 'Please check your inbox to confirm your subscription.' })
  } catch (error) {
    console.error('Newsletter subscription failed', error)
    return response.status(502).json({ ok: false, message: error.message || 'Could not process your subscription.' })
  }
}
