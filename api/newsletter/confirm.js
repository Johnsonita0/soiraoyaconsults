import { emailLayout, htmlResponse, sendEmail, siteUrl } from '../_lib/email.js'
import { getServiceClient } from '../_lib/admin.js'

function confirmationPage(message, success = false) {
  const color = success ? '#23734a' : '#102b3f'
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Newsletter subscription</title><body style="margin:0;padding:40px 16px;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><main style="max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:12px"><p style="color:${color};font-weight:bold">S.O. Iraoya Consulting</p><h1>Newsletter subscription</h1><p>${message}</p><a href="${process.env.SITE_URL || 'https://soiraoyaconsulting.org'}" style="color:#102b3f">Return to our website</a></main></body></html>`
}

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const token = String(request.query?.token || '')
    if (!token || token.length > 100) return htmlResponse(response, confirmationPage('This confirmation link is invalid or has expired.'), 400)
    const action = `/api/newsletter/confirm?token=${encodeURIComponent(token)}`
    return htmlResponse(response, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Confirm newsletter subscription</title><body style="margin:0;padding:40px 16px;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><main style="max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:12px"><p style="color:#102b3f;font-weight:bold">S.O. Iraoya Consulting</p><h1>Confirm your subscription</h1><p>Confirm that you would like to receive our newsletter.</p><form method="post" action="${action}"><button style="padding:13px 20px;background:#102b3f;color:#fff;border:0;border-radius:5px;font-size:16px">Confirm subscription</button></form></main></body></html>`)
  }
  if (request.method !== 'POST') return response.status(405).send('Method not allowed.')

  const token = String(request.query?.token || request.body?.token || '')
  if (!token || token.length > 100) return htmlResponse(response, confirmationPage('This confirmation link is invalid or has expired.'), 400)

  try {
    const supabase = getServiceClient()
    const { data: subscriber, error: lookupError } = await supabase
      .from('newsletter_subscribers').select('id,email,unsubscribe_token').eq('confirmation_token', token).eq('status', 'pending').maybeSingle()
    if (lookupError) throw lookupError
    if (!subscriber) return htmlResponse(response, confirmationPage('This confirmation link is invalid or has already been used.'), 400)

    const { error } = await supabase.from('newsletter_subscribers')
      .update({ status: 'active', confirmation_token: null, subscribed_at: new Date().toISOString(), unsubscribed_at: null })
      .eq('id', subscriber.id)
    if (error) throw error

    const unsubscribeUrl = `${siteUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`
    try {
      await sendEmail({
        to: subscriber.email,
        subject: 'You are subscribed to S.O. Iraoya Consulting updates',
        text: `Your subscription is confirmed. You can unsubscribe any time: ${unsubscribeUrl}`,
        html: emailLayout('You are on the list', `<p>Your subscription is confirmed. We will share considered property insights and company updates with you.</p><p><a href="${unsubscribeUrl}" style="color:#102b3f">Unsubscribe from this newsletter</a></p>`),
      })
    } catch (emailError) {
      console.error('Newsletter welcome email failed', emailError)
    }
    return htmlResponse(response, confirmationPage('Your subscription is confirmed. Thank you for joining our newsletter.', true))
  } catch (error) {
    console.error('Newsletter confirmation failed', error)
    return htmlResponse(response, confirmationPage('We could not confirm your subscription right now. Please try again later.'), 500)
  }
}
