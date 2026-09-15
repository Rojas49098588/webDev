import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'

export default function ProtectedRoute({ children, role, allowMustChangePassword = false }) {
  const { isAuthenticated, session, currentAccount } = useApp()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (role && session.role !== role) {
    return <Navigate to="/login" replace />
  }
  if (currentAccount.mustChangePassword && !allowMustChangePassword) {
    return <Navigate to="/set-password" replace />
  }
  return children
}
