import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import './UserProfilePage.css'

export default function CaretakerProfilePage() {
  const { id } = useParams()
  const { session, children, users } = useApp()

  const caretaker = users.find((user) => user.id === id && user.role === 'caretaker')

  const isAuthorized =
    Boolean(caretaker) &&
    children.some(
      (child) =>
        child.primaryCaretakerId === session.id && (child.otherCaretakerIds ?? []).includes(caretaker.id)
    )

  if (!caretaker || !isAuthorized) {
    return (
      <div className="user-profile-page">
        <h1>Not authorized</h1>
        <p>You can only view the profile of a caretaker you've added to one of your children.</p>
        <Link to="/caretaker/children">Back to My Children</Link>
      </div>
    )
  }

  return (
    <div className="user-profile-page">
      <Link to="/caretaker/children" className="profile-back">
        ← Back to My Children
      </Link>

      <div className="profile-main">
        <Card className="profile-header-card">
          <Avatar firstName={caretaker.firstName} lastName={caretaker.lastName} />
          <div>
            <h1>
              {caretaker.firstName} {caretaker.lastName}
            </h1>
            <span className="profile-meta">@{caretaker.username}</span>
          </div>
          <Badge variant="violet">Caretaker</Badge>
        </Card>

        <Card>
          <h2>Contact information</h2>

          <div className="info-row">
            <span>First name</span>
            <strong>{caretaker.firstName}</strong>
          </div>
          <div className="info-row">
            <span>Last name</span>
            <strong>{caretaker.lastName}</strong>
          </div>
          <div className="info-row">
            <span>Email</span>
            <strong>{caretaker.email}</strong>
          </div>
          <div className="info-row">
            <span>Phone</span>
            <strong>{caretaker.phone}</strong>
          </div>
          <div className="info-row info-row-address">
            <span>Mailing address</span>
            <strong>{caretaker.mailingAddress}</strong>
          </div>
        </Card>
      </div>
    </div>
  )
}
