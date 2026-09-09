import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'

export default function ProtectedRoute({ children, allowMustChangePassword = false }) {
  const { isAuthenticated, admin } = useApp()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (admin.mustChangePassword && !allowMustChangePassword) {
    return <Navigate to="/admin/set-password" replace />
  }
  return children
}
