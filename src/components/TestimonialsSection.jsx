import { useEffect, useState } from 'react'
import { ArrowUpRight, Check } from './icons'
import SearchableSelect from './SearchableSelect'
import { useToast } from './ToastProvider'
import { supabase } from '../lib/supabase'

const emptyForm = { name: '', email: '', role: '', rating: '5', testimonial: '' }

export default function TestimonialsSection({ testimonials = [], contactEmail }) {
  const { showToast } = useToast()
  const safeTestimonials = testimonials.filter((testimonial) => testimonial?.quote)
  const [activeIndex, setActiveIndex] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (safeTestimonials.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % safeTestimonials.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [safeTestimonials.length])

  const move = (direction) => {
    if (!safeTestimonials.length) return
    setActiveIndex((index) => (index + direction + safeTestimonials.length) % safeTestimonials.length)
  }

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    try {
      const { error: saveError } = await supabase.from('testimonials').insert({
        name: form.name.trim(),
        email: form.email.trim() || null,
        role: form.role.trim() || null,
        quote: form.testimonial.trim(),
        rating: Number(form.rating),
        status: 'pending',
      })
      if (saveError) throw saveError

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: contactEmail || 'admin@soiraoyaconsulting.com.ng',
          replyTo: form.email,
          subject: `New testimonial from ${form.name}`,
          text: [
            `Name: ${form.name}`,
            `Email: ${form.email || 'Not provided'}`,
            `Role or company: ${form.role || 'Not provided'}`,
            `Rating: ${form.rating}/5`,
            `Testimonial: ${form.testimonial}`,
          ].join('\n'),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || 'Testimonial delivery failed.')
      }

      setSent(true)
      setForm(emptyForm)
      showToast('Your testimonial has been sent for review.', 'success')
    } catch (error) {
      setSubmitError(error.message || 'We could not send your testimonial right now. Please try again.')
      showToast(error.message || 'We could not send your testimonial right now. Please try again.', 'error')
    }
  }

  const activeTestimonial = safeTestimonials[activeIndex] || safeTestimonials[0]

  return <section id="testimonials" className="testimonials-section">
    <div className="testimonials-intro">
      <p className="eyebrow">Client perspective</p>
      <h2>Good advice<br /><em>travels well.</em></h2>
      <p className="testimonials-note">The strongest measure of our work is what clients say after the decision has been made.</p>
    </div>

    <div className="testimonial-slider" aria-live="polite">
      {activeTestimonial ? <article className="testimonial-slide" key={`${activeTestimonial.name}-${activeIndex}`}>
        <div className="testimonial-stars" aria-label={`${activeTestimonial.rating || 5} out of 5 stars`}>{'★'.repeat(Number(activeTestimonial.rating) || 5)}</div>
        <blockquote>“{activeTestimonial.quote}”</blockquote>
        <div className="testimonial-author"><span className="testimonial-initials">{activeTestimonial.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{activeTestimonial.name}</strong><span>{activeTestimonial.role}</span></div></div>
      </article> : <p className="testimonial-empty">Client testimonials will appear here soon.</p>}
      {activeTestimonial && <div className="testimonial-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial">←</button>
        <button type="button" onClick={() => move(1)} aria-label="Next testimonial">→</button>
      </div>}
    </div>

    <div className="testimonial-form-panel">
      <p className="eyebrow">Share your experience</p>
      <h3>Worked with us?</h3>
      {sent ? <div className="testimonial-success"><span className="success-icon"><Check /></span><strong>Thank you for sharing your experience.</strong><p>We will review your testimonial before publishing it.</p><button type="button" className="text-link" onClick={() => { setSent(false); setSubmitError('') }}>Submit another <ArrowUpRight size={16} /></button></div> : <form onSubmit={submit}>
        <label>Your name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="e.g. Amaka Okafor" /></label>
        <label>Email <span>(optional)</span><input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="you@company.com" /></label>
        <label>Role or company<input value={form.role} onChange={(event) => updateForm('role', event.target.value)} placeholder="e.g. Property investor" /></label>
        <div className="testimonial-form-row"><label>Rating<SearchableSelect value={form.rating} onChange={(value) => updateForm('rating', value)} ariaLabel="Testimonial rating" options={[{ value: '5', label: '5 stars' }, { value: '4', label: '4 stars' }, { value: '3', label: '3 stars' }, { value: '2', label: '2 stars' }, { value: '1', label: '1 star' }]} /></label><label>Your testimonial<textarea required rows="3" value={form.testimonial} onChange={(event) => updateForm('testimonial', event.target.value)} placeholder="Tell us what the experience was like..." /></label></div>
        {submitError && <div className="login-error">{submitError}</div>}
        <button className="button button-dark" type="submit">Send testimonial <ArrowUpRight size={18} /></button>
      </form>}
    </div>
  </section>
}
