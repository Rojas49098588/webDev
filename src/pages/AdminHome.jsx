import { useApp } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'
import './AdminHome.css'

export default function AdminHome() {
  const { admin } = useApp()
  return (
    <div>
      <h1>Welcome, {admin.username}</h1>
      <p>Manage users and user requests from the options below.</p>

      <div className="admin-home-actions">
        <Link to="/admin/users" className="admin-home-button">
          Add / Remove User
        </Link>
      </div>
    </div>
  )
}
