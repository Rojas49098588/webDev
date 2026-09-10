import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './UserProfile.css'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, updateUser } = useApp()

  const user = users.find((item) => item.id === id)

  // ============================================================
  // EDITABLE INFORMATION
  // ============================================================

  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [mailingAddress, setMailingAddress] = useState(
    user?.mailingAddress ?? ''
  )

  if (!user) {
    return (
      <div>
        <h1>User not found</h1>
        <Link to="/admin/users">Back to User Management</Link>
      </div>
    )
  }

  function handleSave() {
    updateUser(user.id, {
      email,
      phone,
      mailingAddress,
    })

    setEditing(false)
  }

  function handleCancel() {
    setEmail(user.email)
    setPhone(user.phone)
    setMailingAddress(user.mailingAddress)
    setEditing(false)
  }

  return (
    <div className="user-profile">
      <Link to="/admin/users" className="profile-back">
        ← Back to User Management
      </Link>

      {/* ============================================================
          BASIC USER INFORMATION
          ============================================================ */}

      <div className="profile-header">
        <h1>
          {user.firstName} {user.lastName}
        </h1>

        <span className="profile-role">
          {user.role === 'staff' ? 'Staff' : 'Caretaker'}
        </span>
      </div>

      <section className="profile-section">
        <h2>Account Information</h2>

        <div className="profile-field">
          <strong>First name</strong>
          <span>{user.firstName}</span>
        </div>

        <div className="profile-field">
          <strong>Last name</strong>
          <span>{user.lastName}</span>
        </div>

        <div className="profile-field">
          <strong>Username</strong>
          <span>{user.username}</span>
        </div>

        {/* ============================================================
            EDITABLE CONTACT INFORMATION
            ============================================================ */}

        <div className="profile-field">
          <strong>Email</strong>

          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>

        <div className="profile-field">
          <strong>Phone</strong>

          {editing ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <span>{user.phone}</span>
          )}
        </div>

        <div className="profile-field">
          <strong>Mailing address</strong>

          {editing ? (
            <textarea
              value={mailingAddress}
              onChange={(e) => setMailingAddress(e.target.value)}
            />
          ) : (
            <span>{user.mailingAddress}</span>
          )}
        </div>

        {editing ? (
          <div className="edit-buttons">
            <button type="button" onClick={handleSave}>
              Save Changes
            </button>

            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="edit-button"
            onClick={() => setEditing(true)}
          >
            Edit Contact Information
          </button>
        )}
      </section>

      {/* ============================================================
          ROLE-SPECIFIC INFORMATION
          ============================================================ */}

      <section className="profile-section">
        <h2>Role Information</h2>

        {user.role === 'staff' && (
          <div className="profile-field">
            <strong>Group number</strong>
            <span>{user.groupNumber ?? 'Not assigned'}</span>
          </div>
        )}

        {/* ============================================================
            CONNECTED CHILDREN
            ============================================================ */}

        <div className="connected-children">
          <h2>Connected Children</h2>

          {user.connectedChildren?.length > 0 ? (
            user.connectedChildren.map((child) => (
              <div key={child.id} className="child-card">
                <strong>{child.name}</strong>
                <span>{child.relationship}</span>
              </div>
            ))
          ) : (
            <p>No children are currently connected to this user.</p>
          )}
        </div>
      </section>

      {/* ============================================================
          USER ACTIONS
          ============================================================ */}

      <div className="profile-actions">
        <button
          type="button"
          className="remove-user-button"
          onClick={() => navigate('/admin/users/remove')}
        >
          Remove User
        </button>

        <button
          type="button"
          className="add-user-button"
          onClick={() => navigate('/admin/users/add')}
        >
          Add User
        </button>
      </div>
    </div>
  )
}