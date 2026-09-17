import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import './Payments.css'

export default function Payments() {
  const {
    children,
    getChildPayments,
    addPaymentRecord,
    updatePaymentRecord,
} = useApp()

  const [selectedChildId, setSelectedChildId] = useState('')
  const [editingRecord, setEditingRecord] = useState(null)

  const [dueOn, setDueOn] = useState('')
  const [amountDue, setAmountDue] = useState('')
  const [paidOn, setPaidOn] = useState('')
  const [amountPaid, setAmountPaid] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectedChild = children.find(
    (child) => child.id === selectedChildId
  )

  const childPayments = selectedChildId
    ? getChildPayments(selectedChildId)
    : []

  function clearForm() {
  setEditingRecord(null)
  setDueOn('')
  setAmountDue('')
  setPaidOn('')
  setAmountPaid('')
  setError('')
}

function handleEdit(record) {
  setEditingRecord(record)
  setDueOn(record.dueOn)
  setAmountDue(String(record.amountDue))
  setPaidOn(record.paidOn || '')
  setAmountPaid(String(record.amountPaid))
  setError('')
  setSuccess('')
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
    paidOn: paidOn || null,
    amountPaid: Number(amountPaid || 0),
  }

  const result = editingRecord
  ? updatePaymentRecord({
      ...paymentInformation,
      id: editingRecord.id,
    })
  : addPaymentRecord(paymentInformation)

  if (!result.ok) {
    setError(result.error)
    return
  }

  setSuccess(
    editingRecord
      ? 'Payment record updated successfully.'
      : 'Payment record added successfully.'
  )

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
        <h2>Find a Child</h2>

        <div className="payments-child-picker">
          <label htmlFor="payment-child">
            Child
          </label>

          <select
            id="payment-child"
            value={selectedChildId}
            onChange={(event) => setSelectedChildId(event.target.value)}
          >
            <option value="">Select a child</option>

            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>
      </section>

      {selectedChild && (
        <section className="payments-section">
            <div className="payment-form-header">
                <div>
                    <h2>{editingRecord ? 'Update Payment' : 'Add Payment'}</h2>
                    <p>
                    {editingRecord
                        ? 'Update the selected payment record.'
                        : 'Add a new payment record for this child.'}
                    </p>
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

                <div className="payment-field">
                    <label htmlFor="payment-paid-on">
                    Paid on
                    </label>
                    <input
                    id="payment-paid-on"
                    type="date"
                    value={paidOn}
                    onChange={(event) => setPaidOn(event.target.value)}
                    />
                </div>

                <div className="payment-field">
                    <label htmlFor="payment-amount-paid">
                    Amount paid
                    </label>
                    <input
                    id="payment-amount-paid"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amountPaid}
                    onChange={(event) => setAmountPaid(event.target.value)}
                    />
                </div>

                <div className="payment-form-actions">
                    <button type="submit" className="payment-submit">
                    {editingRecord ? 'Update Payment' : 'Add Payment'}
                    </button>

                    {editingRecord && (
                    <button
                        type="button"
                        className="payment-cancel"
                        onClick={clearForm}
                    >
                        Cancel
                    </button>
                    )}
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
                        Paid on
                      </span>
                      <strong>
                        {record.paidOn || 'Not paid'}
                      </strong>
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
                  </div>

                  <div className="payment-card-actions">
                    <button
                        type="button"
                        className="payment-edit"
                        onClick={() => handleEdit(record)}
                    >
                        Update
                    </button>
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