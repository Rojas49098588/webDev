import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './UserProfile.css'

export default function ChildProfile() {
  const { id } = useParams()
  const { children } = useApp()

  const child = children.find((item) => item.id === id)

  if (!child) {
    return (
      <div>
        <h1>Child not found</h1>
        <Link to="/staff/children">Back to Child Management</Link>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <Link to="/staff/children" className="profile-back">
        ← Back to Child Management
      </Link>

      <div className="profile-header">
        <h1>
          {child.firstName} {child.lastName}
        </h1>

        <span className="profile-role">{child.active ? 'Active' : 'Archived'}</span>
      </div>

      <section className="profile-section">
        <h2>Child Information</h2>

        <div className="profile-field">
          <strong>First name</strong>
          <span>{child.firstName}</span>
        </div>

        <div className="profile-field">
          <strong>Last name</strong>
          <span>{child.lastName}</span>
        </div>

        <div className="profile-field">
          <strong>Date of birth</strong>
          <span>{child.dateOfBirth}</span>
        </div>
      </section>
    </div>
  )
}
