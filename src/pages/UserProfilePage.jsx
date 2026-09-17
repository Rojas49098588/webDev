import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import './UserProfilePage.css'

export default function UserProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, updateUser } = useApp()

  const user = users.find((item) => item.id === id)

  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [mailingAddress, setMailingAddress] = useState(user?.mailingAddress ?? '')

  if (!user) {
    return (
      <div className="user-profile-page">
        <h1>User not found</h1>
        <Link to="/admin/users">Back to Users</Link>
      </div>
    )
  }

  function handleSave() {
    updateUser(user.id, { email, phone, mailingAddress })
    setEditing(false)
  }

  function handleCancel() {
    setEmail(user.email)
    setPhone(user.phone)
    setMailingAddress(user.mailingAddress)
    setEditing(false)
  }

  return (
    <div className="user-profile-page">
      <Link to="/admin/users" className="profile-back">
        ← Back to Users
      </Link>

      <div className="profile-grid">
        <div className="profile-main">
          <Card className="profile-header-card">
            <Avatar firstName={user.firstName} lastName={user.lastName} />
            <div>
              <h1>
                {user.firstName} {user.lastName}
              </h1>
              <span className="profile-meta">@{user.username}</span>
            </div>
            <Badge variant={user.role === 'staff' ? 'amber' : 'violet'}>
              {user.role === 'staff' ? 'Staff' : 'Caretaker'}
            </Badge>
          </Card>

          <Card>
            <h2>Account information</h2>

            <div className="info-row">
              <span>First name</span>
              <strong>{user.firstName}</strong>
            </div>
            <div className="info-row">
              <span>Last name</span>
              <strong>{user.lastName}</strong>
            </div>
            <div className="info-row">
              <span>Username</span>
              <strong>{user.username}</strong>
            </div>

            <div className="info-row">
              <span>Email</span>
              {editing ? (
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              ) : (
                <strong>{user.email}</strong>
              )}
            </div>
            <div className="info-row">
              <span>Phone</span>
              {editing ? (
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              ) : (
                <strong>{user.phone}</strong>
              )}
            </div>
            <div className="info-row info-row-address">
              <span>Mailing address</span>
              {editing ? (
                <textarea value={mailingAddress} onChange={(e) => setMailingAddress(e.target.value)} />
              ) : (
                <strong>{user.mailingAddress}</strong>
              )}
            </div>

            {editing ? (
              <div className="edit-actions">
                <Button onClick={handleSave}>Save changes</Button>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="ghost" onClick={() => setEditing(true)}>
                Edit contact information
              </Button>
            )}
          </Card>
        </div>

        <div className="profile-sidebar">
          <Card>
            <h2>Quick facts</h2>
            <div className="info-row">
              <span>Role</span>
              <strong>{user.role === 'staff' ? 'Staff' : 'Caretaker'}</strong>
            </div>
            <div className="info-row">
              <span>Username</span>
              <strong>{user.username}</strong>
            </div>
            <div className="info-row">
              <span>Status</span>
              <strong>{user.active ? 'Active' : 'Archived'}</strong>
            </div>
          </Card>

          <Card>
            <h2>Actions</h2>
            <Button variant="danger" onClick={() => navigate('/admin/users/remove')}>
              Remove user
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
