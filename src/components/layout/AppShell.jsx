import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import Avatar from '../ui/Avatar.jsx'
import './AppShell.css'

const STAFF_NAV = [
  { to: '/staff', label: 'Home', icon: '⌂', exact: true },
  { to: '/staff/children', label: 'Children', icon: '◑', exact: false },
  { to: '/staff/change-password', label: 'Change password', icon: '⚿', exact: true },
]

const ADMIN_NAV = [
  { to: '/admin', label: 'Home', icon: '⌂', exact: true },
  { to: '/admin/users', label: 'Users', icon: '⚇', exact: false },
  { to: '/admin/change-password', label: 'Change password', icon: '⚿', exact: true },
]

export default function AppShell({ children }) {
  const { currentAccount, session, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = session.role === 'admin' ? ADMIN_NAV : STAFF_NAV

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function isActive(item) {
    return item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  }

  return (
    <div className="app-shell" data-theme={session.role}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">◈</span>
          <span className="brand-name">Smart Children</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={`nav-item ${isActive(item) ? 'nav-item-active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Avatar firstName={currentAccount.firstName} lastName={currentAccount.lastName} />
          <div className="footer-user">
            <strong>
              {currentAccount.firstName} {currentAccount.lastName}
            </strong>
            <span>{session.role === 'admin' ? 'Admin' : 'Staff'}</span>
          </div>
          <button
            type="button"
            className="footer-logout"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            ⏻
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  )
}
