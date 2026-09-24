import { Link, useLocation, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import './UserProfilePage.css'

export default function CaretakerProfilePage() {
  const { id } = useParams()
  const location = useLocation()
  const { session, children, users } = useApp()

  const myChildren = children.filter((child) => child.primaryCaretakerId === session.id)

  const accountCaretaker = myChildren.some((child) => (child.otherCaretakerIds ?? []).includes(id))
    ? users.find((user) => user.id === id && user.role === 'caretaker')
    : null
  const addedCaretaker = myChildren
    .flatMap((child) => child.authorizedCaretakers ?? [])
    .find((item) => item.id === id)
  const caretaker = accountCaretaker ?? addedCaretaker

  if (!caretaker) {
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
      <Link
        to={location.state?.from || '/caretaker/children'}
        className="profile-back"
      >
        ← {location.state?.from === '/caretaker/add-caretaker'
          ? 'Back to Caretakers'
          : 'Back to My Children'}
      </Link>

      <div className="profile-main">
        <Card className="profile-header-card">
          <Avatar firstName={caretaker.firstName} lastName={caretaker.lastName} />
          <div>
            <h1>
              {caretaker.firstName} {caretaker.lastName}
            </h1>
            {caretaker.username && <span className="profile-meta">@{caretaker.username}</span>}
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
