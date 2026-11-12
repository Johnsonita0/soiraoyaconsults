import { getServiceClient } from '../_lib/admin.js'
import { emailLayout, escapeHtml, resendFromEmail, siteUrl } from '../_lib/email.js'

const batchSize = 50

function campaignHtml(campaign, unsubscribeUrl) {
  const paragraphs = campaign.body.split(/\n\s*\n/).map((paragraph) => `<p style="font-size:16px;line-height:1.7">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`).join('')
  const image = campaign.image_url
    ? `<img src="${escapeHtml(campaign.image_url)}" alt="" width="528" style="display:block;width:100%;height:auto;margin:0 0 24px;border-radius:8px">`
    : ''
  const unsubscribe = `<a href="${escapeHtml(unsubscribeUrl)}" style="color:#102b3f">Unsubscribe from this newsletter</a>`
  return emailLayout(campaign.subject, `${image}${paragraphs}`, campaign.preview_text || campaign.subject, unsubscribe)
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
      .in('status', ['active', 'pending'])
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
        from: resendFromEmail(),
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
    if (!apiKey) throw new Error('Missing Resend configuration. Set RESEND_API_KEY.')
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
