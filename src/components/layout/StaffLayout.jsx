import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import './StaffLayout.css'

export default function StaffLayout({ children }) {
  const { currentAccount, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="staff-layout">
      <header className="staff-header">
        <span className="staff-title">Smart Children</span>
        <nav className="staff-nav">
          <Link to="/staff">Home</Link>
          <Link to="/staff/change-password">Change Password</Link>
          <span className="staff-user">{currentAccount.username}</span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="staff-content">{children}</main>
    </div>
  )
}
