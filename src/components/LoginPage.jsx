import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './LoginPage.css'

function maskEmail(email) {
  const [local, domain] = email.split('@')
  return `${local[0]}***@${domain}`
}

export default function LoginPage() {
  const { admin, verifyCredentials, beginLogin, verifySecurityCode, pendingLogin } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  async function handleCredentialsSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Username and password are required')
      return
    }
    const valid = await verifyCredentials(username.trim(), password)
    if (!valid) {
      setError('Invalid username or password')
      return
    }
    beginLogin()
    setStep('code')
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    const result = verifySecurityCode(code)
    if (!result.ok) {
      setError(result.reason === 'expired' ? 'Code expired. Request a new one.' : 'Invalid code')
      return
    }
    navigate('/admin')
  }

  function handleResend() {
    beginLogin()
    setCode('')
    setError('')
  }

  if (step === 'code') {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleCodeSubmit} noValidate>
          <h1>Enter security code</h1>
          <p className="success-message">
            Code sent to {maskEmail(admin.email)}: {pendingLogin?.code}
          </p>

          <label htmlFor="code">Security code</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="submit-button">
            Verify
          </button>
          <button type="button" className="link-button" onClick={handleResend}>
            Resend code
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleCredentialsSubmit} noValidate>
        <h1>Sign in</h1>

        <label htmlFor="username">Username</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="field-error">{error}</p>}

        <button type="submit" className="submit-button">
          Log in
        </button>
      </form>
    </div>
  )
}
