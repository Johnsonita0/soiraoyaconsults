import { emailLayout, escapeHtml, sendEmail } from './_lib/email.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldLimits = {
  name: 120,
  organisation: 160,
  phone: 50,
  location: 160,
  category: 100,
  request: 160,
  propertyLocation: 160,
  propertyType: 80,
  propertyCount: 80,
  message: 3000,
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  if (request.body?.website) return response.status(200).json({ ok: true })

  const form = request.body || {}
  const name = String(form.name || '').trim()
  const email = String(form.email || '').trim().toLowerCase()
  if (!name || name.length > fieldLimits.name || !emailPattern.test(email) || email.length > 254 || !String(form.request || '').trim()) {
    return response.status(400).json({ ok: false, message: 'Provide your name, a valid email address, and a service required.' })
  }
  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (String(form[field] || '').length > limit) {
      return response.status(400).json({ ok: false, message: `${field} is too long.` })
    }
  }

  const fields = [
    ['Name', name],
    ['Email', email],
    ['Organisation', form.organisation],
    ['Phone', form.phone],
    ['Location', form.location],
    ['Client category', form.category],
    ['Service required', form.request],
    ['Property location', form.propertyLocation],
    ['Property type', form.propertyType],
    ['Number of properties', form.propertyCount],
    ['Message', form.message],
  ].filter(([, value]) => String(value || '').trim())

  const html = fields.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\r?\n/g, '<br>')}</p>`).join('')
  const text = fields.map(([label, value]) => `${label}: ${value}`).join('\n\n')
  try {
    await sendEmail({
      to: process.env.RESEND_TO_EMAIL || 'soiraoyaconsults@gmail.com',
      replyTo: email,
      subject: 'New website enquiry',
      html: emailLayout('New website enquiry', html, `New enquiry from ${name}.`),
      text,
    })
    return response.status(200).json({ ok: true })
  } catch (error) {
    console.error('Website enquiry notification failed', error)
    return response.status(502).json({ ok: false, message: 'We could not send your enquiry by email. Please continue in WhatsApp or contact us directly.' })
  }
}
