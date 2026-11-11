import { emailLayout, htmlResponse } from '../_lib/email.js'
import { getServiceClient } from '../_lib/admin.js'

function unsubscribePage(token, done = false, invalid = false) {
  if (invalid) return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Invalid unsubscribe link</title><body style="margin:0;padding:40px 16px;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><main style="max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:12px"><p style="color:#102b3f;font-weight:bold">S.O. Iraoya Consulting</p><h1>Unsubscribe link unavailable</h1><p>This link is invalid or incomplete. Please use the unsubscribe link in a newsletter email.</p></main></body></html>`
  if (done) return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Unsubscribed</title><body style="margin:0;padding:40px 16px;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><main style="max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:12px"><p style="color:#102b3f;font-weight:bold">S.O. Iraoya Consulting</p><h1>You are unsubscribed</h1><p>You will no longer receive our newsletter at this email address.</p><a href="${process.env.SITE_URL || 'https://soiraoyaconsulting.org'}" style="color:#102b3f">Return to our website</a></main></body></html>`
  const action = `/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Unsubscribe</title><body style="margin:0;padding:40px 16px;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><main style="max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:12px"><p style="color:#102b3f;font-weight:bold">S.O. Iraoya Consulting</p><h1>Unsubscribe from our newsletter?</h1><p>Confirm below to stop receiving newsletter emails.</p><form method="post" action="${action}"><button style="padding:13px 20px;background:#102b3f;color:#fff;border:0;border-radius:5px;font-size:16px">Unsubscribe</button></form></main></body></html>`
}

export default async function handler(request, response) {
  const token = String(request.query?.token || request.body?.token || '')
  if (!token || token.length > 100) return htmlResponse(response, unsubscribePage('', false, true), 400)

  if (request.method === 'GET') return htmlResponse(response, unsubscribePage(token))
  if (request.method !== 'POST') return response.status(405).send('Method not allowed.')

  try {
    const supabase = getServiceClient()
    const { data: subscriber, error: lookupError } = await supabase.from('newsletter_subscribers')
      .select('id').eq('unsubscribe_token', token).eq('status', 'active').maybeSingle()
    if (lookupError) throw lookupError
    if (subscriber) {
      const { error } = await supabase.from('newsletter_subscribers')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('id', subscriber.id)
      if (error) throw error
    }
    return htmlResponse(response, unsubscribePage('', true))
  } catch (error) {
    console.error('Newsletter unsubscribe failed', error)
    return htmlResponse(response, emailLayout('Unsubscribe unavailable', '<p>We could not process your request right now. Please try again later.</p>'), 500)
  }
}
