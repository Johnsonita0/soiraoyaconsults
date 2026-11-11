export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export function emailLayout(title, content, preview = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#f4f5f7;font-family:Arial,sans-serif;color:#18212b"><span style="display:none;max-height:0;overflow:hidden">${escapeHtml(preview)}</span><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f4f5f7"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden"><tr><td style="padding:28px 36px;background:#102b3f;color:#fff;font-size:18px;font-weight:bold">S.O. Iraoya Consulting</td></tr><tr><td style="padding:36px"><h1 style="margin:0 0 20px;font-size:24px;line-height:1.3">${escapeHtml(title)}</h1>${content}</td></tr><tr><td style="padding:20px 36px;background:#f8f8f6;color:#66717c;font-size:12px;line-height:1.6">S.O. Iraoya Consulting · Lagos, Nigeria<br>Professional real estate management and informed investment advice.</td></tr></table></td></tr></table></body></html>`
}

export async function sendEmail({ to, subject, html, text, replyTo, headers }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) throw new Error('Missing Resend configuration. Set RESEND_API_KEY and RESEND_FROM_EMAIL.')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo || process.env.RESEND_REPLY_TO_EMAIL || process.env.RESEND_TO_EMAIL || 'soiraoyaconsults@gmail.com',
      subject,
      html,
      text,
      ...(headers ? { headers } : {}),
    }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.message || 'Email delivery failed.')
  return payload
}

export function siteUrl() {
  return (process.env.SITE_URL || 'https://soiraoyaconsulting.org').replace(/\/+$/, '')
}

export function htmlResponse(response, content, status = 200) {
  return response.status(status).setHeader('Content-Type', 'text/html; charset=utf-8').send(content)
}

export function plainText(value = '') {
  return String(value).replace(/\r\n/g, '\n').split('\n').map((line) => escapeHtml(line)).join('<br>')
}
