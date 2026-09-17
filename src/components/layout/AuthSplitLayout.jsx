import './AuthSplitLayout.css'

export default function AuthSplitLayout({ headline, tagline, children }) {
  return (
    <div className="auth-split">
      <div className="auth-brand">
        <div className="auth-brand-mark">
          <span aria-hidden="true">◈</span>
          <span>Smart Children</span>
        </div>
        <h1>{headline}</h1>
        <p>{tagline}</p>
      </div>

      <div className="auth-form-panel">{children}</div>
    </div>
  )
}
