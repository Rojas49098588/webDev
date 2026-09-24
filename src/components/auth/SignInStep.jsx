import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'

export default function SignInStep({ username, setUsername, password, setPassword, error, onSubmit }) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Sign In</h2>
      <p className="auth-subtitle">Sign in with your account to continue.</p>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-invalid={Boolean(error)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={Boolean(error)}
      />

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit">Sign in</Button>

      <Link to="/request-account" className="auth-link">
        New here? Request an account
      </Link>
    </form>
  )
}
