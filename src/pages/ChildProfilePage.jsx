import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Button from '../components/ui/Button.jsx'
import './ChildProfilePage.css'
import './Payments.css'

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
  const {
    session,
    children,
    users,
    getChildPayments,
    getChildAttendance,
    addSecondaryCaretaker,
    removeSecondaryCaretaker,
    submitRemoveChildRequest,
    makePayment,
  } = useApp()

  const [caretakerSearch, setCaretakerSearch] = useState('')
  const [caretakerError, setCaretakerError] = useState('')
  const [caretakerSuccess, setCaretakerSuccess] = useState('')
  const [removeChildError, setRemoveChildError] = useState('')
  const [removeChildSuccess, setRemoveChildSuccess] = useState('')

  const [payingRecordId, setPayingRecordId] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [expiration, setExpiration] = useState('')
  const [cvv, setCvv] = useState('')
  const [payError, setPayError] = useState('')
  const [paySuccess, setPaySuccess] = useState('')

  const child = children.find((item) => item.id === id)
  const childrenListPath = session.role === 'caretaker' ? '/caretaker/children' : '/staff/children'
  const childrenListLabel = session.role === 'caretaker' ? 'My Children' : 'Children'

  const isCaretakerOwner = session.role === 'caretaker' && child?.primaryCaretakerId === session.id

  if (!child || (session.role === 'caretaker' && !isCaretakerOwner)) {
    return (
      <div className="child-profile-page">
        <h1>{child ? 'Not authorized' : 'Child not found'}</h1>
        <Link to={childrenListPath}>Back to {childrenListLabel}</Link>
      </div>
    )
  }

  const primaryCaretaker = users.find((user) => user.id === child.primaryCaretakerId)
  const otherCaretakers = (child.otherCaretakerIds ?? [])
    .map((caretakerId) => users.find((user) => user.id === caretakerId))
    .filter((caretaker) => caretaker && caretaker.role === 'caretaker' && caretaker.active)

  const payments = getChildPayments(child.id)
  const attendance = getChildAttendance(child.id)

  const excludedCaretakerIds = new Set([child.primaryCaretakerId, ...(child.otherCaretakerIds ?? [])])
  const caretakerSearchText = caretakerSearch.toLowerCase().trim()
  const caretakerCandidates = caretakerSearchText
    ? users.filter(
        (user) =>
          user.role === 'caretaker' &&
          user.active &&
          !excludedCaretakerIds.has(user.id) &&
          (user.firstName.toLowerCase().includes(caretakerSearchText) ||
            user.lastName.toLowerCase().includes(caretakerSearchText) ||
            user.username.toLowerCase().includes(caretakerSearchText) ||
            user.email.toLowerCase().includes(caretakerSearchText))
      )
    : []

  function handleAddCaretaker(caretakerId) {
    setCaretakerError('')
    setCaretakerSuccess('')
    const result = addSecondaryCaretaker(child.id, caretakerId)
    if (!result.ok) {
      setCaretakerError(result.error)
      return
    }
    setCaretakerSuccess('Caretaker added.')
    setCaretakerSearch('')
  }

  function handleRemoveCaretaker(caretakerId) {
    const confirmed = window.confirm('Remove this caretaker from this child?')
    if (!confirmed) {
      return
    }
    setCaretakerError('')
    setCaretakerSuccess('')
    const result = removeSecondaryCaretaker(child.id, caretakerId)
    if (!result.ok) {
      setCaretakerError(result.error)
    }
  }

  function handleRequestRemoveChild() {
    const confirmed = window.confirm(
      'Request to remove this child? A staff member will review this request.'
    )
    if (!confirmed) {
      return
    }
    setRemoveChildError('')
    setRemoveChildSuccess('')
    const result = submitRemoveChildRequest(child.id)
    if (!result.ok) {
      setRemoveChildError(result.error)
      return
    }
    setRemoveChildSuccess('Removal request submitted.')
  }

  function startPayment(payment) {
    setPayingRecordId(payment.id)
    setPayAmount(String(payment.balance))
    setCardNumber('')
    setNameOnCard('')
    setExpiration('')
    setCvv('')
    setPayError('')
  }

  function cancelPayment() {
    setPayingRecordId(null)
  }

  function handlePaySubmit(event, recordId) {
    event.preventDefault()
    setPayError('')

    const result = makePayment(recordId, payAmount, { cardNumber, nameOnCard, expiration, cvv })
    if (!result.ok) {
      setPayError(result.error)
      return
    }

    setPaySuccess('Payment submitted.')
    setPayingRecordId(null)
  }

  return (
    <div className="child-profile-page">
      <Link to={childrenListPath} className="profile-back">
        ← Back to {childrenListLabel}
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
          </Card>

          <Card>
            <h2>Medications</h2>

            {!child.medications || child.medications.length === 0 ? (
              <p className="no-results">No medications on record.</p>
            ) : (
              <div className="medication-list">
                {child.medications.map((medication) => (
                  <div key={medication.id} className="medication-card">
                    <div className="medication-header">
                      <strong>{medication.name}</strong>
                      <span>{medication.dosage}</span>
                    </div>

                    <div className="info-row">
                      <span>Frequency</span>
                      <strong>{medication.frequency}</strong>
                    </div>

                    <div className="info-row">
                      <span>Instructions</span>
                      <strong>{medication.instructions}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        
        {session.role !== 'staff' && (
          <Card>
            <div className="section-heading">
              <div>
                <h2>Attendance history</h2>
                <p className="section-description">Drop-off and pickup records for this child.</p>
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
                        <strong>{record.type === 'drop-off' ? 'Drop-off' : 'Pickup'}</strong>

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
          )}

        {session.role !== 'staff' && (
          <Card>
            <div className="section-heading">
              <div>
                <h2>Payment records</h2>
                <p className="section-description">Payment history for this child.</p>
              </div>

              {session.role === 'staff' && (
                <Link to={`/staff/payments?child=${child.id}`} className="profile-action">
                  + Add payment
                </Link>
              )}
            </div>

            {paySuccess && (
              <div className="payments-success" role="status">
                {paySuccess}
              </div>
            )}

            {payments.length === 0 ? (
              <p className="no-results">No payment records yet.</p>
            ) : (
              <div className="payment-records">
                {payments.map((payment) => (
                  <div key={payment.id} className="payment-record">
                    <div className="payment-record-header">
                      <strong>Due {payment.dueOn}</strong>

                      <span>{payment.balance === 0 ? 'Paid' : `$${payment.balance.toFixed(2)} remaining`}</span>
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

                    {session.role === 'staff' && (
                      <div className="payment-record-footer">
                        <Link to={`/staff/payments?child=${child.id}`} className="profile-action-secondary">
                          Edit
                        </Link>
                      </div>
                    )}

                    {isCaretakerOwner && payment.balance > 0 && payingRecordId !== payment.id && (
                      <div className="payment-record-footer">
                        <Button size="sm" onClick={() => startPayment(payment)}>
                          Pay now
                        </Button>
                      </div>
                    )}

                    {isCaretakerOwner && payingRecordId === payment.id && (
                      <form className="payment-form" onSubmit={(event) => handlePaySubmit(event, payment.id)}>
                        {payError && (
                          <div className="payments-error" role="alert">
                            {payError}
                          </div>
                        )}

                        <div className="payment-field">
                          <label htmlFor={`pay-amount-${payment.id}`}>Payment amount</label>
                          <input
                            id={`pay-amount-${payment.id}`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            max={payment.balance}
                            value={payAmount}
                            onChange={(event) => setPayAmount(event.target.value)}
                          />
                        </div>

                        <div className="payment-field">
                          <label htmlFor={`pay-name-${payment.id}`}>Name on card</label>
                          <input
                            id={`pay-name-${payment.id}`}
                            type="text"
                            value={nameOnCard}
                            onChange={(event) => setNameOnCard(event.target.value)}
                          />
                        </div>

                        <div className="payment-field">
                          <label htmlFor={`pay-card-${payment.id}`}>Card number</label>
                          <input
                            id={`pay-card-${payment.id}`}
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                          />
                        </div>

                        <div className="payment-field">
                          <label htmlFor={`pay-exp-${payment.id}`}>Expiration (MM/YY)</label>
                          <input
                            id={`pay-exp-${payment.id}`}
                            type="text"
                            placeholder="MM/YY"
                            value={expiration}
                            onChange={(event) => setExpiration(event.target.value)}
                          />
                        </div>

                        <div className="payment-field">
                          <label htmlFor={`pay-cvv-${payment.id}`}>CVV</label>
                          <input
                            id={`pay-cvv-${payment.id}`}
                            type="text"
                            inputMode="numeric"
                            value={cvv}
                            onChange={(event) => setCvv(event.target.value)}
                          />
                        </div>

                        <div className="payment-form-actions">
                          <button type="submit" className="payment-submit">
                            Submit payment
                          </button>
                          <button type="button" className="payment-cancel" onClick={cancelPayment}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        </div>

        <div className="profile-sidebar">
        <Card>
          <h2>Authorized caretakers</h2>

          {caretakerError && (
            <div className="request-error" role="alert">
              {caretakerError}
            </div>
          )}
          {caretakerSuccess && (
            <div className="request-success" role="status">
              {caretakerSuccess}
            </div>
          )}

          {primaryCaretaker ? (
            <div className="caretaker-list">
              <div className="caretaker-row">
                <Avatar firstName={primaryCaretaker.firstName} lastName={primaryCaretaker.lastName} />

                <div>
                  <strong>
                    {primaryCaretaker.firstName} {primaryCaretaker.lastName}
                  </strong>
                  <span>Primary caretaker · @{primaryCaretaker.username}</span>
                </div>
              </div>

              {otherCaretakers.map((caretaker) => (
                <div key={caretaker.id} className="caretaker-row">
                  <Avatar firstName={caretaker.firstName} lastName={caretaker.lastName} />

                  <div>
                    {isCaretakerOwner ? (
                      <Link to={`/caretaker/caretakers/${caretaker.id}`}>
                        <strong>
                          {caretaker.firstName} {caretaker.lastName}
                        </strong>
                      </Link>
                    ) : (
                      <strong>
                        {caretaker.firstName} {caretaker.lastName}
                      </strong>
                    )}
                    <span>Authorized caretaker · @{caretaker.username}</span>
                  </div>

                  {isCaretakerOwner && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="caretaker-row-remove"
                      onClick={() => handleRemoveCaretaker(caretaker.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">Not on record.</p>
          )}

          {isCaretakerOwner && (
            <div className="add-caretaker">
              <h3>Add a caretaker</h3>

              <input
                type="text"
                value={caretakerSearch}
                onChange={(event) => setCaretakerSearch(event.target.value)}
                placeholder="Search by name, username, or email"
                aria-label="Search for a caretaker to add"
              />

              {caretakerSearchText && (
                <div className="add-caretaker-results">
                  {caretakerCandidates.length === 0 ? (
                    <p className="no-results">No matching caretaker found.</p>
                  ) : (
                    caretakerCandidates.map((candidate) => (
                      <div key={candidate.id} className="add-caretaker-result">
                        <span>
                          {candidate.firstName} {candidate.lastName} · @{candidate.username}
                        </span>
                        <Button size="sm" onClick={() => handleAddCaretaker(candidate.id)}>
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        {isCaretakerOwner && (
          <Card>
            <h2>Actions</h2>

            {removeChildError && (
              <div className="request-error" role="alert">
                {removeChildError}
              </div>
            )}
            {removeChildSuccess && (
              <div className="request-success" role="status">
                {removeChildSuccess}
              </div>
            )}

            <p className="section-description">
              Request to remove this child from the center. A staff member will review your request.
            </p>

            <Button variant="danger" onClick={handleRequestRemoveChild} disabled={Boolean(removeChildSuccess)}>
              Request to remove this child
            </Button>
          </Card>
        )}
        </div>
      </div>
    </div>
  )
}
