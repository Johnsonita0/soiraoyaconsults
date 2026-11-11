import { emailLayout, escapeHtml, sendEmail } from './_lib/email.js'
import { getServiceClient } from './_lib/admin.js'

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

  const requestRecord = {
    name,
    email,
    organisation: String(form.organisation || '').trim() || null,
    phone: String(form.phone || '').trim() || null,
    location: String(form.location || '').trim() || null,
    category: String(form.category || '').trim() || null,
    request: String(form.request).trim(),
    property_location: String(form.propertyLocation || '').trim() || null,
    property_type: String(form.propertyType || '').trim() || null,
    property_count: String(form.propertyCount || '').trim() || null,
    message: String(form.message || '').trim() || null,
    status: 'new',
  }

  let supabase
  try {
    supabase = getServiceClient()
  } catch (error) {
    console.error('Consultation request storage is unavailable', error)
    return response.status(500).json({ ok: false, message: 'We could not save your request. Please contact us directly.' })
  }
  const { error: saveError } = await supabase.from('contact_messages').insert(requestRecord)
  if (saveError) {
    console.error('Could not save consultation request', saveError)
    return response.status(500).json({ ok: false, message: 'We could not save your request. Please contact us directly.' })
  }

  const fields = [
    ['Name', name],
    ['Email', email],
    ['Organisation', requestRecord.organisation],
    ['Phone', requestRecord.phone],
    ['Location', requestRecord.location],
    ['Client category', requestRecord.category],
    ['Service required', requestRecord.request],
    ['Property location', requestRecord.property_location],
    ['Property type', requestRecord.property_type],
    ['Number of properties', requestRecord.property_count],
    ['Message', requestRecord.message],
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
    return response.status(200).json({ ok: true, notificationSent: false, message: 'Your request was saved, but the email notification could not be sent. Please also contact us by WhatsApp.' })
  }
}
