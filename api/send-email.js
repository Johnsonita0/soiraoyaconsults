export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  try {
    const { to, subject, text, html, from, replyTo } = request.body || {}

    if (!subject || (!text && !html)) {
      return response.status(400).json({ ok: false, message: 'Subject and email body are required.' })
    }

    const apiKey = process.env.RESEND_API_KEY
    const sender = from || process.env.RESEND_FROM_EMAIL
    const adminEmail = Array.isArray(to) ? to : [to || process.env.RESEND_TO_EMAIL || 'admin@soiraoyaconsulting.com.ng']

    if (!apiKey || !sender) {
      return response.status(500).json({ ok: false, message: 'Missing Resend configuration.' })
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: adminEmail,
        reply_to: replyTo || process.env.RESEND_REPLY_TO_EMAIL || adminEmail[0],
        subject,
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
      }),
    })

    const payload = await resendResponse.json().catch(() => ({}))

    if (!resendResponse.ok) {
      return response.status(502).json({ ok: false, message: payload?.message || 'Email delivery failed.' })
    }

    return response.status(200).json({ ok: true, id: payload.id || null })
  } catch (error) {
    return response.status(500).json({ ok: false, message: error?.message || 'Unexpected email error.' })
  }
}
