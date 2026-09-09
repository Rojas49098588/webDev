import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import './AdminLayout.css'

export default function AdminLayout({ children }) {
  const { admin, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <span className="admin-title">Child-Care Admin</span>
        <nav className="admin-nav">
          <Link to="/admin">Home</Link>
          <Link to="/admin/change-password">Change Password</Link>
          <span className="admin-user">{admin.username}</span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="admin-content">{children}</main>
    </div>
  )
}
