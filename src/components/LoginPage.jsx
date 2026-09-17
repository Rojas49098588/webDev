import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AuthSplitLayout from './layout/AuthSplitLayout.jsx'
import SignInStep from './auth/SignInStep.jsx'
import SecurityCodeStep from './auth/SecurityCodeStep.jsx'

function maskEmail(email) {
  const [local, domain] = email.split('@')
  return `${local[0]}***@${domain}`
}

export default function LoginPage() {
  const { admin, users, isAuthenticated, session, verifyCredentials, beginLogin, verifySecurityCode, pendingLogin } =
    useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={session.role === 'admin' ? '/admin' : '/staff'} replace />
  }

  const pendingEmail =
    pendingLogin?.role === 'admin' ? admin.email : users.find((user) => user.id === pendingLogin?.id)?.email

  async function handleCredentialsSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Username and password are required')
      return
    }
    const result = await verifyCredentials(username.trim(), password)
    if (!result.ok) {
      setError('Invalid username or password')
      return
    }
    beginLogin(result.role, result.id)
    setStep('code')
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    const result = verifySecurityCode(code)
    if (!result.ok) {
      setError(result.reason === 'expired' ? 'Code expired. Request a new one.' : 'Invalid code')
      return
    }
    navigate(result.role === 'admin' ? '/admin' : '/staff')
  }

  function handleResend() {
    beginLogin(pendingLogin.role, pendingLogin.id)
    setCode('')
    setError('')
  }

  if (step === 'code') {
    return (
      <AuthSplitLayout
        headline="One more step to keep records safe."
        tagline="Two-factor sign-in helps protect the children and families in your center's care."
      >
        <SecurityCodeStep
          maskedEmail={pendingEmail ? maskEmail(pendingEmail) : 'your email'}
          pendingCode={pendingLogin?.code}
          code={code}
          setCode={setCode}
          error={error}
          onSubmit={handleCodeSubmit}
          onResend={handleResend}
        />
      </AuthSplitLayout>
    )
  }

  return (
    <AuthSplitLayout
      headline="Every child accounted for, every day."
      tagline="Sign in to manage enrollment, caretakers, and daily records for your center."
    >
      <SignInStep
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={error}
        onSubmit={handleCredentialsSubmit}
      />
    </AuthSplitLayout>
  )
}
