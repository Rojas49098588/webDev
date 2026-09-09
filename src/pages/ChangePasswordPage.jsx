import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import '../components/LoginPage.css'

export default function ChangePasswordPage() {
  const { changePassword } = useApp()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSuccess(false)
    if (next !== confirm) {
      setError('New passwords do not match')
      return
    }
    const result = await changePassword(current, next)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError('')
    setSuccess(true)
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <div>
      <h1>Change password</h1>
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <label htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />

        <label htmlFor="new-password">New password</label>
        <input id="new-password" type="password" value={next} onChange={(e) => setNext(e.target.value)} />

        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="field-error">{error}</p>}
        {success && <p className="success-message">Password updated.</p>}

        <button type="submit" className="submit-button">
          Update password
        </button>
      </form>
    </div>
  )
}
