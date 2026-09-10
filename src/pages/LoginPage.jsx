import { useState } from 'react'
import Brand from '../components/Brand'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'admin@soiraoyaconsulting.com.ng'

export default function LoginPage({ goTo }) {
  const [form, setForm] = useState({ email: ADMIN_EMAIL, password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!email || !password) {
      setError('Enter the admin email and password to continue.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      const user = data?.user
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || user.id !== '8b4f5926-c6ec-43a0-aa34-7277a2732577') {
        await supabase.auth.signOut()
        throw new Error('Only the configured admin account can access the dashboard.')
      }

      goTo('/dashboard')
    } catch (submitError) {
      setError(submitError?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand-wrap">
          <Brand goTo={goTo} />
        </div>

        <div className="login-header">
          <p className="eyebrow login-kicker">Private access</p>
          <h1>Admin login</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Admin email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="enter admin login email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your admin password"
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="button button-dark" disabled={loading}>
            {loading ? 'Signing in...' : 'Access dashboard'}
          </button>
          <div className="login-info-box">
            This is a secured area only authorized users can access.
          </div>
        </form>
      </div>
    </div>
  )
}
