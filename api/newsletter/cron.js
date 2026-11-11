import { getServiceClient } from '../_lib/admin.js'
import { escapeHtml, siteUrl } from '../_lib/email.js'

const batchSize = 50

function campaignHtml(campaign, unsubscribeUrl) {
  const paragraphs = campaign.body.split(/\n\s*\n/).map((paragraph) => `<p style="font-size:16px;line-height:1.7">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`).join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(campaign.subject)}</title></head><body style="margin:0;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><span style="display:none;max-height:0;overflow:hidden">${escapeHtml(campaign.preview_text || campaign.subject)}</span><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f4f5f7"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden"><tr><td style="padding:28px 36px;background:#102b3f;color:#fff;font-size:18px;font-weight:bold">S.O. Iraoya Consulting</td></tr><tr><td style="padding:36px"><h1 style="font-size:24px;line-height:1.3">${escapeHtml(campaign.subject)}</h1>${paragraphs}</td></tr><tr><td style="padding:20px 36px;background:#f8f8f6;color:#66717c;font-size:12px;line-height:1.6">S.O. Iraoya Consulting · Lagos, Nigeria<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#102b3f">Unsubscribe from this newsletter</a></td></tr></table></td></tr></table></body></html>`
}

export default async function handler(request, response) {
  const secret = process.env.CRON_SECRET
  const authorization = request.headers.authorization || ''
  if (!secret || authorization !== `Bearer ${secret}`) {
    return response.status(401).json({ ok: false, message: 'Unauthorized.' })
  }
  if (request.method !== 'GET' && request.method !== 'POST') {
    return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  try {
    const supabase = getServiceClient()
    const { data: campaigns, error: claimError } = await supabase.rpc('claim_newsletter_campaign')
    if (claimError) throw claimError
    const campaign = campaigns?.[0]
    if (!campaign) return response.status(200).json({ ok: true, message: 'No newsletters are due.' })

    const subscriberQuery = supabase.from('newsletter_subscribers')
      .select('id,email,unsubscribe_token')
      .eq('status', 'active')
      .order('id', { ascending: true })
      .limit(batchSize + 1)
    const { data: subscribers, error: subscriberError } = campaign.last_subscriber_id
      ? await subscriberQuery.gt('id', campaign.last_subscriber_id)
      : await subscriberQuery
    if (subscriberError) throw subscriberError

    const batch = (subscribers || []).slice(0, batchSize)
    if (!batch.length) {
      const { error } = await supabase.from('newsletter_campaigns')
        .update({ status: 'sent', sent_at: new Date().toISOString(), claimed_at: null })
        .eq('id', campaign.id)
      if (error) throw error
      return response.status(200).json({ ok: true, campaignId: campaign.id, sent: 0 })
    }

    const unsubscribeBase = `${siteUrl()}/api/newsletter/unsubscribe`
    const messages = batch.map((subscriber) => {
      const unsubscribeUrl = `${unsubscribeBase}?token=${encodeURIComponent(subscriber.unsubscribe_token)}`
      return {
        from: process.env.RESEND_FROM_EMAIL,
        to: [subscriber.email],
        subject: campaign.subject,
        html: campaignHtml(campaign, unsubscribeUrl),
        text: `${campaign.subject}\n\n${campaign.body}\n\nUnsubscribe: ${unsubscribeUrl}`,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }
    })

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || !process.env.RESEND_FROM_EMAIL) throw new Error('Missing Resend configuration.')
    const emailResponse = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    })
    const payload = await emailResponse.json().catch(() => ({}))
    const deliverySucceeded = emailResponse.ok && Array.isArray(payload.data) && payload.data.length === batch.length
    const deliveryMessage = deliverySucceeded ? null : payload?.message || 'Email delivery failed.'

    const deliveryRows = batch.map((subscriber) => ({
      campaign_id: campaign.id,
      subscriber_id: subscriber.id,
      status: deliverySucceeded ? 'sent' : 'failed',
      sent_at: deliverySucceeded ? new Date().toISOString() : null,
      error_message: deliveryMessage,
    }))
    const { error: deliveryError } = await supabase.from('newsletter_deliveries')
      .upsert(deliveryRows, { onConflict: 'campaign_id,subscriber_id' })
    if (deliveryError) throw deliveryError

    const hasMore = (subscribers || []).length > batchSize
    const sentCount = campaign.sent_count + (deliverySucceeded ? batch.length : 0)
    const failedCount = campaign.failed_count + (deliverySucceeded ? 0 : batch.length)
    const { error: updateError } = await supabase.from('newsletter_campaigns').update({
      last_subscriber_id: batch[batch.length - 1].id,
      sent_count: sentCount,
      failed_count: failedCount,
      status: hasMore ? 'sending' : 'sent',
      sent_at: hasMore ? null : new Date().toISOString(),
      claimed_at: null,
    }).eq('id', campaign.id)
    if (updateError) throw updateError

    return response.status(200).json({
      ok: deliverySucceeded,
      campaignId: campaign.id,
      sent: deliverySucceeded ? batch.length : 0,
      failed: deliverySucceeded ? 0 : batch.length,
      hasMore,
    })
  } catch (error) {
    console.error('Scheduled newsletter run failed', error)
    return response.status(500).json({ ok: false, message: error.message || 'Scheduled newsletter delivery failed.' })
  }
}
