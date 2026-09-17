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
  const { children, users, getChildPayments, getChildAttendance } = useApp()

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

  const payments = getChildPayments(child.id)
  const attendance = getChildAttendance(child.id)

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

          <Card>
            <div className="section-heading">
              <div>
                <h2>Attendance history</h2>
                <p className="section-description">
                  Drop-off and pickup records for this child.
                </p>
              </div>
            </div>

            {attendance.length === 0 ? (
              <p className="no-results">No attendance records yet.</p>
            ) : (
              <div className="attendance-records">
                {attendance.map((record) => {
                  const dateTime = new Date(record.dateTime)

                  return (
                    <div key={record.id} className="attendance-record">
                      <div>
                        <strong>
                          {record.type === 'drop-off' ? 'Drop-off' : 'Pickup'}
                        </strong>

                        <span>
                          {dateTime.toLocaleDateString()} ·{' '}
                          {dateTime.toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <span className="attendance-caretaker">
                        {record.caretakerFirstName} {record.caretakerLastName}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <div className="section-heading">
              <div>
                <h2>Payment records</h2>
                <p className="section-description">
                  Payment history for this child.
                </p>
              </div>

              <button type="button" className="profile-action">
                + Add payment
              </button>
            </div>

            {payments.length === 0 ? (
              <p className="no-results">No payment records yet.</p>
            ) : (
              <div className="payment-records">
                {payments.map((payment) => (
                  <div key={payment.id} className="payment-record">
                    <div className="payment-record-header">
                      <strong>Due {payment.dueOn}</strong>

                      <span>
                        {payment.balance === 0
                          ? 'Paid'
                          : `$${payment.balance.toFixed(2)} remaining`}
                      </span>
                    </div>

                    <div className="info-row">
                      <span>Amount due</span>
                      <strong>${payment.amountDue.toFixed(2)}</strong>
                    </div>

                    <div className="info-row">
                      <span>Amount paid</span>
                      <strong>${payment.amountPaid.toFixed(2)}</strong>
                    </div>

                    <div className="info-row">
                      <span>Paid on</span>
                      <strong>{payment.paidOn || 'Not paid'}</strong>
                    </div>

                    <div className="payment-record-footer">
                      <button type="button" className="profile-action-secondary">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
