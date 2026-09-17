import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import './ChildProfilePage.css'

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1
  }
  return age
}

export default function ChildProfilePage() {
  const { id } = useParams()
  const { children, users } = useApp()

  const child = children.find((item) => item.id === id)

  if (!child) {
    return (
      <div className="child-profile-page">
        <h1>Child not found</h1>
        <Link to="/staff/children">Back to Children</Link>
      </div>
    )
  }

  const primaryCaretaker = users.find((user) => user.id === child.primaryCaretakerId)

  return (
    <div className="child-profile-page">
      <Link to="/staff/children" className="profile-back">
        ← Back to Children
      </Link>

      <div className="profile-grid">
        <div className="profile-main">
          <Card className="profile-header-card">
            <Avatar firstName={child.firstName} lastName={child.lastName} />
            <div>
              <h1>
                {child.firstName} {child.lastName}
              </h1>
              <span className="profile-meta">
                Born {child.dateOfBirth} · Age {calculateAge(child.dateOfBirth)}
              </span>
            </div>
            <Badge variant={child.active ? 'green' : 'amber'}>{child.active ? 'Active' : 'Archived'}</Badge>
          </Card>

          <Card>
            <h2>Child information</h2>
            <div className="info-row">
              <span>First name</span>
              <strong>{child.firstName}</strong>
            </div>
            <div className="info-row">
              <span>Last name</span>
              <strong>{child.lastName}</strong>
            </div>
            <div className="info-row">
              <span>Date of birth</span>
              <strong>{child.dateOfBirth}</strong>
            </div>
            <div className="info-row">
              <span>Status</span>
              <strong>{child.active ? 'Active' : 'Archived'}</strong>
            </div>
          </Card>
        </div>

        <div className="profile-sidebar">
          <Card>
            <h2>Primary caretaker</h2>
            {primaryCaretaker ? (
              <div className="caretaker-row">
                <Avatar firstName={primaryCaretaker.firstName} lastName={primaryCaretaker.lastName} />
                <div>
                  <strong>
                    {primaryCaretaker.firstName} {primaryCaretaker.lastName}
                  </strong>
                  <span>Caretaker · @{primaryCaretaker.username}</span>
                </div>
              </div>
            ) : (
              <p className="no-results">Not on record.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
