import { getServiceClient } from '../_lib/admin.js'
import { sendAdminNotification } from '../_lib/email.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldLimits = { name: 120, email: 254, role: 160, quote: 3000 }

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })

  const form = request.body || {}
  if (form.website) return response.status(200).json({ ok: true })
  const name = String(form.name || '').trim()
  const email = String(form.email || '').trim().toLowerCase()
  const role = String(form.role || '').trim()
  const quote = String(form.quote || '').trim()
  const rating = Number(form.rating)

  if (!name || name.length > fieldLimits.name || (email && (!emailPattern.test(email) || email.length > fieldLimits.email))) {
    return response.status(400).json({ ok: false, message: 'Provide your name and a valid email address.' })
  }
  if (role.length > fieldLimits.role || quote.length < 3 || quote.length > fieldLimits.quote) {
    return response.status(400).json({ ok: false, message: 'Check the role and testimonial length, then try again.' })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return response.status(400).json({ ok: false, message: 'Choose a rating from 1 to 5.' })
  }

  try {
    const supabase = getServiceClient()
    const { error } = await supabase.from('testimonials').insert({
      name,
      email: email || null,
      role: role || null,
      quote,
      rating,
      status: 'pending',
    })
    if (error) throw error

    let notificationSent = true
    try {
      await sendAdminNotification({
        subject: 'Testimonial awaiting review',
        details: {
          Name: name,
          Email: email || 'Not provided',
          'Role or company': role || 'Not provided',
          Rating: `${rating}/5`,
          Testimonial: quote,
        },
      })
    } catch (notificationError) {
      notificationSent = false
      console.error('New testimonial admin notification failed', notificationError)
    }

    return response.status(200).json({ ok: true, notificationSent })
  } catch (error) {
    console.error('Could not save testimonial', error)
    return response.status(502).json({ ok: false, message: 'We could not submit your testimonial right now. Please try again.' })
  }
}
