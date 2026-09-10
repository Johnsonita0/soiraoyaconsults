import { useState } from 'react'
import Brand from '../components/Brand'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/ToastProvider'

export default function LoginPage({ goTo }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!email || !password) {
      setError('Enter your email and password to continue.')
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

      if (!data?.user) {
        throw new Error('Login failed. Please try again.')
      }

      showToast('Welcome back. Opening your dashboard.', 'success')
      goTo('/dashboard')
    } catch (submitError) {
      setError(submitError?.message || 'Login failed. Please try again.')
      showToast(submitError?.message || 'Login failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand-wrap">
          <Brand admin goTo={goTo} />
        </div>

        <div className="login-header">
          <p className="eyebrow login-kicker">Private access</p>
          <h1>Admin login</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Enter your email address"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your password"
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
