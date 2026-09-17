import Button from '../ui/Button.jsx'

export default function SecurityCodeStep({ maskedEmail, pendingCode, code, setCode, error, onSubmit, onResend }) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Enter your code</h2>
      <p className="auth-subtitle">We sent a 4-digit code to your email to confirm it's you.</p>

      <p className="success-message">
        Sent to {maskedEmail}: {pendingCode}
      </p>

      <label htmlFor="code">Security code</label>
      <input
        id="code"
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        aria-invalid={Boolean(error)}
      />

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit">Verify and continue</Button>
      <Button type="button" variant="quiet" onClick={onResend}>
        Resend code
      </Button>
    </form>
  )
}
