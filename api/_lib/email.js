const defaultFromEmail = 'S.O. Iraoya Consulting <notifications@soiraoyaconsulting.org>'

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export function emailLayout(title, content, preview = '', footerContent = '') {
  const websiteUrl = siteUrl()
  const footer = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f8f6;border-top:1px solid #e8ecef"><tr><td align="center" style="padding:24px 24px 10px;color:#66717c;font-size:12px;line-height:1.7"><strong style="color:#18212b">S.O. Iraoya Consulting</strong><br>Estate Surveyors &amp; Valuers<br><a href="${websiteUrl}" style="color:#102b3f">soiraoyaconsulting.org</a> &nbsp;·&nbsp; <a href="mailto:soiraoyaconsults@gmail.com" style="color:#102b3f">soiraoyaconsults@gmail.com</a><br><a href="tel:+2349074091408" style="color:#102b3f">+234 907 409 1408</a><br><br><strong style="color:#18212b">Head Office</strong><br>Suite 30, Dolphin Plaza, Ikoyi, Lagos, Nigeria<br><strong style="color:#18212b">Lekki/Ajah Office</strong><br>Suite H272, Ikota Shopping Complex, Lagos, Nigeria</td></tr><tr><td align="center" style="padding:0 24px 18px"><a href="https://wa.me/2349074091408" style="display:inline-block;padding:11px 20px;border-radius:999px;background:#167a50;color:#fff;text-decoration:none;font-size:13px;font-weight:bold">Chat with us on WhatsApp</a></td></tr><tr><td align="center" style="padding:0 24px 16px"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding:0 5px"><a href="https://www.facebook.com" aria-label="Facebook" style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#102b3f;color:#fff;text-align:center;text-decoration:none;font:bold 14px/28px Arial,sans-serif">f</a></td><td style="padding:0 5px"><a href="https://www.instagram.com" aria-label="Instagram" style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#102b3f;color:#fff;text-align:center;text-decoration:none;font:18px/28px Arial,sans-serif">&#9678;</a></td><td style="padding:0 5px"><a href="https://www.linkedin.com/in/soiraoya-consulting-983372445/" aria-label="LinkedIn" style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#102b3f;color:#fff;text-align:center;text-decoration:none;font:bold 11px/28px Arial,sans-serif">in</a></td><td style="padding:0 5px"><a href="https://www.youtube.com" aria-label="YouTube" style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#102b3f;color:#fff;text-align:center;text-decoration:none;font:13px/28px Arial,sans-serif">&#9654;</a></td></tr></table></td></tr>${footerContent ? `<tr><td align="center" style="padding:0 24px 16px;font-size:12px;line-height:1.6">${footerContent}</td></tr>` : ''}<tr><td align="center" style="padding:0 24px 24px;color:#87919a;font-size:11px;line-height:1.6">You are receiving this message from S.O. Iraoya Consulting.<br><a href="${websiteUrl}/privacy-policy" style="color:#66717c">Privacy policy</a> &nbsp;·&nbsp; <a href="${websiteUrl}/data-usage" style="color:#66717c">Data usage policy</a></td></tr></table>`
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#f2f4f7;font-family:Arial,sans-serif;color:#18212b"><span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preview)}</span><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f2f4f7"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fff;border:1px solid #e8ecef;border-radius:12px;overflow:hidden"><tr><td align="center" style="padding:24px 24px 20px;border-top:4px solid #d8ae4a;background:#fff"><a href="${websiteUrl}" style="display:inline-block"><img src="${websiteUrl}/image/logo2.png" alt="S.O. Iraoya Consulting" width="260" style="display:block;width:100%;max-width:260px;height:auto;border:0"></a></td></tr><tr><td style="padding:30px 36px 36px"><h1 style="margin:0 0 24px;color:#102b3f;text-align:center;font-size:24px;line-height:1.35">${escapeHtml(title)}</h1><div style="font-size:15px;line-height:1.75;color:#35434d">${content}</div></td></tr><tr><td>${footer}</td></tr></table></td></tr></table></body></html>`
}

export function resendFromEmail() {
  const configuredFrom = process.env.RESEND_FROM_EMAIL || defaultFromEmail
  const address = configuredFrom.match(/<([^<>]+)>/)?.[1] || configuredFrom
  return `S.O. Iraoya Consulting <${address.trim()}>`
}

export async function sendEmail({ to, subject, html, text, replyTo, headers }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = resendFromEmail()
  if (!apiKey) throw new Error('Missing Resend configuration. Set RESEND_API_KEY.')

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
