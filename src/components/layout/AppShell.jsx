import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import Avatar from '../ui/Avatar.jsx'
import './AppShell.css'

const STAFF_NAV = [
  { to: '/staff', label: 'Home', icon: '⌂', exact: true },
  { to: '/staff/children', label: 'Children', icon: '◑', exact: false },
  { to: '/staff/attendance', label: 'Attendance', icon: '◷', exact: false },
  { to: '/staff/payments', label: 'Payments', icon: '$', exact: false },
  { to: '/staff/change-password', label: 'Change password', icon: '⚿', exact: true },
]

const ADMIN_NAV = [
  { to: '/admin', label: 'Home', icon: '⌂', exact: true },
  { to: '/admin/users', label: 'Users', icon: '⚇', exact: false },
  { to: '/admin/change-password', label: 'Change password', icon: '⚿', exact: true },
]

const CARETAKER_NAV = [
  { to: '/caretaker', label: 'Home', icon: '⌂', exact: true },
  { to: '/caretaker/children', label: 'My Children', icon: '◑', exact: false },
  { to: '/caretaker/add-caretaker', label: 'Manage Caretakers', icon: '+', exact: true },
  { to: '/caretaker/attendance', label: 'My Children\'s Attendance', icon: '◷', exact: false },
  { to: '/caretaker/payments', label: 'My Payments', icon: '$', exact: false },
  { to: '/caretaker/change-password', label: 'Change password', icon: '⚿', exact: true },
]

export default function AppShell({ children }) {
  const { currentAccount, session, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems =
    session.role === 'admin' ? ADMIN_NAV : session.role === 'staff' ? STAFF_NAV : CARETAKER_NAV

  const displayFirstName = currentAccount.firstName || currentAccount.username
  const displayLastName = currentAccount.lastName || ''

  function handleLogout() {
    const confirmed = window.confirm(
      'Are you sure you want to log out?'
    )

    if (!confirmed) {
      return
    }

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
          <div className="footer-account">
            <Avatar firstName={displayFirstName} lastName={displayLastName} />

            <div className="footer-user">
              <strong>
                {displayLastName
                  ? `${displayFirstName} ${displayLastName}`
                  : displayFirstName}
              </strong>
              <span>
                {session.role === 'admin'
                  ? 'Admin'
                  : session.role === 'staff'
                    ? 'Staff'
                    : 'Caretaker'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="footer-logout"
            onClick={handleLogout}
          >
            ⏻ Log out
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  )
}
