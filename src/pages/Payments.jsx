import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import './Payments.css'

export default function Payments() {
  const {children, getChildPayments, addPaymentRecord,} = useApp()

  const [selectedChildId, setSelectedChildId] = useState('')
  const [childSearch, setChildSearch] = useState('')

  const [notes, setNotes] = useState('')

  const [dueOn, setDueOn] = useState('')
  const [amountDue, setAmountDue] = useState('')
  const [amountPaid, setAmountPaid] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectedChild = children.find(
    (child) => child.id === selectedChildId
  )

  const searchText = childSearch.toLowerCase().trim()

  const filteredChildren = children.filter((child) => {
    if (!searchText) {
      return true
    }

    return (
      child.firstName.toLowerCase().includes(searchText) ||
      child.lastName.toLowerCase().includes(searchText) ||
      child.dateOfBirth.includes(searchText)
    )
  })

  const childPayments = selectedChildId
    ? getChildPayments(selectedChildId)
    : []

  function clearForm() {
  setDueOn('')
  setAmountDue('')
  setAmountPaid('')
  setNotes('')
  setError('')
}

function handleSubmit(event) {
  event.preventDefault()

  setError('')
  setSuccess('')

  if (!selectedChildId) {
    setError('Please select a child.')
    return
  }

  if (!dueOn || !amountDue) {
    setError('Please enter the payment due date and amount due.')
    return
  }

  const paymentInformation = {
    childId: selectedChildId,
    dueOn,
    amountDue: Number(amountDue),
    amountPaid: Number(amountPaid || 0),
    notes: notes.trim(),
  }

  const result = addPaymentRecord(paymentInformation)

  if (!result.ok) {
    setError(result.error)
    return
  }

  setSuccess('Payment record added successfully.')
  clearForm()
}

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Payments</h1>
          <p>View and manage payment records for children.</p>
        </div>
      </div>

        <section className="payments-section">
          <div className="payments-section-header">
            <div>
              <h2>Find a Child</h2>
              <p>Search for a child to view their payment records.</p>
            </div>
          </div>

          <div className="payments-child-search">
            <SearchInput
              id="payment-child-search"
              value={childSearch}
              onChange={setChildSearch}
              placeholder="Search by first name, last name, or date of birth"
              label="Search children"
            />
          </div>

          <div className="payment-child-results">
            {filteredChildren.length === 0 ? (
              <p className="payments-empty">
                No children match your search.
              </p>
            ) : (
              filteredChildren.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className={`payment-child-result ${
                    selectedChildId === child.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedChildId(child.id)
                    setError('')
                    setSuccess('')
                  }}
                >
                  <strong>
                    {child.firstName} {child.lastName}
                  </strong>

                  <span>
                    Date of birth: {child.dateOfBirth}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

      {selectedChild && (
        <section className="payments-section">
            <div className="payment-form-header">
                <div>
                    <h2>Add Payment</h2>
                    <p>Add a new payment record for this child.</p>
                </div>
            </div>

                {error && (
                <div className="payments-error" role="alert">
                    {error}
                </div>
                )}

                {success && (
                <div className="payments-success" role="status">
                    {success}
                </div>
                )}

                <form onSubmit={handleSubmit} className="payment-form">
                <div className="payment-field">
                    <label htmlFor="payment-due-on">
                    Payment due on
                    </label>
                    <input
                    id="payment-due-on"
                    type="date"
                    value={dueOn}
                    onChange={(event) => setDueOn(event.target.value)}
                    />
                </div>

                <div className="payment-field">
                  <label htmlFor="payment-amount-due">
                    Amount due
                  </label>
                  <input
                    id="payment-amount-due"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amountDue}
                    onChange={(event) => setAmountDue(event.target.value)}
                  />
                </div>

                <div className="payment-field payment-notes-field">
                  <label htmlFor="payment-notes">
                    Notes
                  </label>
                  <textarea
                    id="payment-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Add any notes about this payment"
                    rows="3"
                  />
                </div>

                <div className="payment-form-actions">
                    <button type="submit" className="payment-submit">
                    Add Payment
                    </button>

                </div>
                </form>
          <div className="payments-section-header">
            <div>
              <h2>
                {selectedChild.firstName} {selectedChild.lastName}
              </h2>

              <p>
                Payment history
              </p>
            </div>
          </div>

          {childPayments.length === 0 ? (
            <p className="payments-empty">
              No payment records found for this child.
            </p>
          ) : (
            <div className="payments-list">
              {childPayments.map((record) => (
                <div key={record.id} className="payment-card">
                  <div className="payment-card-main">
                    <div>
                      <span className="payment-label">
                        Payment due
                      </span>
                      <strong>{record.dueOn}</strong>
                    </div>

                    <div>
                      <span className="payment-label">
                        Amount due
                      </span>
                      <strong>${record.amountDue.toFixed(2)}</strong>
                    </div>

                    <div>
                      <span className="payment-label">
                        Amount paid
                      </span>
                      <strong>${record.amountPaid.toFixed(2)}</strong>
                    </div>

                    <div>
                      <span className="payment-label">
                        Balance
                      </span>
                      <strong>
                        ${record.balance.toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span className="payment-label">
                        Notes
                      </span>
                      <strong>
                        {record.notes || 'No notes'}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}