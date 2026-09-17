import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AuthSplitLayout from '../components/layout/AuthSplitLayout.jsx'
import Button from '../components/ui/Button.jsx'

export default function SetPasswordPage() {
  const { setNewPassword, session } = useApp()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    const result = await setNewPassword(password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(session.role === 'admin' ? '/admin' : '/staff')
  }

  return (
    <AuthSplitLayout
      headline="Choose a password you'll remember."
      tagline="You'll use this every time you sign in to manage your center's records."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2>Set a new password</h2>
        <p className="auth-subtitle">Choose a new password before continuing to your dashboard.</p>

        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(error)}
        />
        <p className="password-hint">Use 6+ characters with an uppercase letter, a lowercase letter, and a number</p>

        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={Boolean(error)}
        />

        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit">Save password</Button>
      </form>
    </AuthSplitLayout>
  )
}
