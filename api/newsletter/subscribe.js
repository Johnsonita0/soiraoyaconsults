import { getServiceClient } from '../_lib/admin.js'
import { emailLayout, newsletterUnsubscribeButton, sendEmail, siteUrl } from '../_lib/email.js'

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const subscribedMessage = "You're subscribed. A confirmation email is on its way."

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
      return response.status(200).json({ ok: true, message: "You're already subscribed. Thank you for being part of our newsletter." })
    }

    const { data: subscriber, error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      status: 'active',
      confirmation_token: null,
      consented_at: new Date().toISOString(),
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    }, { onConflict: 'email' }).select('unsubscribe_token').single()
    if (error) throw error

    const unsubscribeUrl = `${siteUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`
    try {
      await sendEmail({
        to: email,
        subject: 'Your S.O. Iraoya Consulting newsletter subscription is confirmed',
        text: `You're subscribed to S.O. Iraoya Consulting updates. Thank you for joining us.\n\nYou can unsubscribe at any time: ${unsubscribeUrl}`,
        html: emailLayout(
          'You are on the list',
          '<p>Your subscription is confirmed. Thank you for joining S.O. Iraoya Consulting updates. We will share considered property insights and company news with you.</p>',
          'Your S.O. Iraoya Consulting newsletter subscription is confirmed.',
          newsletterUnsubscribeButton(unsubscribeUrl),
        ),
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
    } catch (emailError) {
      console.error('Newsletter subscription confirmation email failed', emailError)
      return response.status(200).json({
        ok: true,
        notificationSent: false,
        message: "You're subscribed, but we couldn't send the confirmation email. Please contact us if you need help.",
      })
    }

    return response.status(200).json({ ok: true, message: subscribedMessage })
  } catch (error) {
    console.error('Newsletter subscription failed', error)
    return response.status(502).json({ ok: false, message: error.message || 'Could not process your subscription.' })
  }
}
