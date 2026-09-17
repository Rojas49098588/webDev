import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './StaffHome.css'

export default function StaffHome() {
  const { currentAccount } = useApp()
  return (
    <div className="staff-home">
      <h1>Welcome, {currentAccount.firstName}!</h1>
      <p>Manage children and child requests below.</p>

      <div className="staff-home-actions">
        <Link to="/staff/children" className="staff-home-button">
          Manage Children
        </Link>

        <Link to="/staff/attendance" className="staff-home-button">
          Attendance
        </Link>
      </div>
    </div>
  )
}
