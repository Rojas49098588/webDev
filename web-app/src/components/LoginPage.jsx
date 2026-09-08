import { useState } from 'react'
import './LoginPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const next = {}
    if (!email.trim()) {
      next.email = 'Email is required'
    } else if (!EMAIL_PATTERN.test(email)) {
      next.email = 'Enter a valid email address'
    }
    if (!password) {
      next.password = 'Password is required'
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Welcome back</h1>
          <p className="success-message">You're logged in as {email}.</p>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setSubmitted(false)
              setEmail('')
              setPassword('')
            }}
          >
            Log out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1>Sign in</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p className="field-error" id="email-error">
            {errors.email}
          </p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p className="field-error" id="password-error">
            {errors.password}
          </p>
        )}

        <button type="submit" className="submit-button">
          Log in
        </button>

        <div className="login-links">
          <a href="#">Forgot password?</a>
          <a href="#">Sign up</a>
        </div>
      </form>
    </div>
  )
}
