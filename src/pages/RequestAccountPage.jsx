import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AuthSplitLayout from '../components/layout/AuthSplitLayout.jsx'
import Button from '../components/ui/Button.jsx'

const EMPTY_FORM = {
  role: 'caretaker',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mailingAddress: '',
}

export default function RequestAccountPage() {
  const { submitAccountRequest } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = submitAccountRequest(form)
    if (!result.ok) {
      setError(result.error)
      return
    }

    setSubmitted(true)
  }

  return (
    <AuthSplitLayout
      headline="Join Smart Children."
      tagline="Request a staff or caretaker account. An administrator reviews every request before an account is created."
    >
      {submitted ? (
        <div className="auth-form">
          <h2>Request submitted</h2>
          <p className="success-message" role="status">
            Thanks, {form.firstName}. Your {form.role} account request is now waiting for administrator review. Once
            it's approved, your username and a temporary password will be sent to {form.email}.
          </p>
          <Link to="/login" className="auth-link">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2>Request an account</h2>
          <p className="auth-subtitle">All fields are required.</p>

          <label htmlFor="request-role">Account type</label>
          <select id="request-role" value={form.role} onChange={(e) => updateField('role', e.target.value)}>
            <option value="caretaker">Caretaker (parent or guardian)</option>
            <option value="staff">Staff member</option>
          </select>

          <label htmlFor="request-first-name">First name</label>
          <input
            id="request-first-name"
            type="text"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
          />

          <label htmlFor="request-last-name">Last name</label>
          <input
            id="request-last-name"
            type="text"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
          />

          <label htmlFor="request-email">Email address</label>
          <input
            id="request-email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />

          <label htmlFor="request-phone">Phone number</label>
          <input
            id="request-phone"
            type="tel"
            placeholder="2145550123"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <p className="password-hint">10 digits, cannot start with 0</p>

          {form.role === 'caretaker' && (
            <>
              <label htmlFor="request-address">Mailing address</label>
              <input
                id="request-address"
                type="text"
                value={form.mailingAddress}
                onChange={(e) => updateField('mailingAddress', e.target.value)}
              />
            </>
          )}

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <Button type="submit">Submit request</Button>

          <Link to="/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </form>
      )}
    </AuthSplitLayout>
  )
}
