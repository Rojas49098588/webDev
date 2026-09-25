import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import { matchesChildSearch } from '../utils/childSearch.js'
import Button from '../components/ui/Button.jsx'
import { formatCardNumber, getCardBrand } from '../utils/validation.js'
import './Payments.css'

export default function CaretakerPaymentsPage() {
  const {
    session,
    children,
    getChildPayments,
    makePayment,
  } = useApp()

  const [search, setSearch] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')

  const [payingRecordId, setPayingRecordId] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [expiration, setExpiration] = useState('')
  const [cvv, setCvv] = useState('')
  const [payError, setPayError] = useState('')
  const [paySuccess, setPaySuccess] = useState('')

  const myChildren = children.filter(
    (child) =>
      child.active &&
      child.primaryCaretakerId === session.id
  )

  const filteredChildren = myChildren.filter((child) => matchesChildSearch(child, search))

  const selectedChild = myChildren.find(
    (child) => child.id === selectedChildId
  )

  const cardBrand = getCardBrand(cardNumber)

  const payments = selectedChildId
    ? getChildPayments(selectedChildId)
    : []

  function startPayment(payment) {
    setPayingRecordId(payment.id)
    setPayAmount(String(payment.balance))
    setCardNumber('')
    setNameOnCard('')
    setExpiration('')
    setCvv('')
    setPayError('')
    setPaySuccess('')
  }

  function cancelPayment() {
    setPayingRecordId(null)
    setPayError('')
  }

  function handlePaySubmit(event, recordId) {
    event.preventDefault()
    setPayError('')
    setPaySuccess('')

    const result = makePayment(
      recordId,
      payAmount,
      {
        cardNumber,
        nameOnCard,
        expiration,
        cvv,
      }
    )

    if (!result.ok) {
      setPayError(result.error)
      return
    }

    setPaySuccess(
      `Payment of $${Number(payAmount).toFixed(2)} was approved. Remaining balance: $${result.record.balance.toFixed(2)}.`
    )
    setPayingRecordId(null)
  }

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Payments</h1>
          <p>View payment history and make payments for your children.</p>
        </div>
      </div>

      <section className="payments-section">
        <div className="caretaker-payments-section-header">
          <div>
            <h2>Search My Children</h2>
            <p>
              Search by first name, last name, or birth year.
            </p>
          </div>
        </div>

        <div className="caretaker-payment-child-search">
          <SearchInput
            id="caretaker-payment-child-search"
            value={search}
            onChange={(value) => {
              setSearch(value)

              if (!value.trim()) {
                setSelectedChildId('')
                setPayingRecordId(null)
                setPayError('')
              }
            }}
            placeholder="Search by name or birth year"
            label="Search my children"
          />
        </div>

        <div className="payment-child-results">
          {filteredChildren.length === 0 ? (
            <p className="no-results">
              No children match your search.
            </p>
          ) : (
            filteredChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                className={`payment-child-result ${
                  selectedChildId === child.id ? 'selected' : ''
                }`}
                onClick={() => {
                  setSelectedChildId(child.id)
                  setPayingRecordId(null)
                  setPayError('')
                  setPaySuccess('')
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
          <div className="payments-section-header">
            <div>
              <h2>
                {selectedChild.firstName} {selectedChild.lastName}
              </h2>
              <p>Payment history</p>
            </div>
          </div>

          {paySuccess && (
            <div className="payments-success" role="status">
              {paySuccess}
            </div>
          )}

          {payments.length === 0 ? (
            <p className="no-results">
              No payment records found for this child.
            </p>
          ) : (
            <div className="payment-records">
              {payments.map((payment) => (
                <div key={payment.id} className="payment-record">
                  <div className="payment-record-header">
                    <strong>
                      Due {payment.dueOn}
                    </strong>

                    <span>
                      ${payment.balance.toFixed(2)} remaining
                    </span>
                  </div>

                  <div className="info-row">
                    <span>Amount due</span>
                    <strong>
                      ${payment.amountDue.toFixed(2)}
                    </strong>
                  </div>

                  <div className="info-row">
                    <span>Amount paid</span>
                    <strong>
                      ${payment.amountPaid.toFixed(2)}
                    </strong>
                  </div>

                  <div className="info-row">
                    <span>Paid on</span>
                    <strong>{payment.paidOn || 'Not paid yet'}</strong>
                  </div>

                  {payment.notes && (
                    <div className="info-row">
                      <span>Notes</span>
                      <strong>{payment.notes}</strong>
                    </div>
                  )}

                  {payment.balance > 0 &&
                    payingRecordId !== payment.id && (
                      <div className="payment-record-footer">
                        <Button
                          size="sm"
                          onClick={() => startPayment(payment)}
                        >
                          Pay now
                        </Button>
                      </div>
                    )}

                  {payingRecordId === payment.id && (
                    <form
                      className="caretaker-payment-form"
                      onSubmit={(event) =>
                        handlePaySubmit(event, payment.id)
                      }
                    >
                      <h3>Make a payment</h3>

                      {payError && (
                        <div className="payment-error" role="alert">
                          {payError}
                        </div>
                      )}

                      <div className="payment-form-field">
                        <label htmlFor={`pay-amount-${payment.id}`}>
                          Amount
                        </label>
                        <input
                          id={`pay-amount-${payment.id}`}
                          type="number"
                          min="0.01"
                          max={payment.balance}
                          step="0.01"
                          value={payAmount}
                          onChange={(event) =>
                            setPayAmount(event.target.value)
                          }
                        />
                      </div>

                      <div className="payment-form-field">
                        <label htmlFor={`pay-name-${payment.id}`}>
                          Name on card
                        </label>
                        <input
                          id={`pay-name-${payment.id}`}
                          type="text"
                          value={nameOnCard}
                          onChange={(event) =>
                            setNameOnCard(event.target.value)
                          }
                        />
                      </div>

                      <div className="payment-form-field">
                        <label htmlFor={`pay-card-${payment.id}`}>
                          Card number
                          {cardBrand && (
                            <span className="card-brand-badge">{cardBrand.name}</span>
                          )}
                        </label>
                        <input
                          id={`pay-card-${payment.id}`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          value={cardNumber}
                          onChange={(event) =>
                            setCardNumber(formatCardNumber(event.target.value))
                          }
                        />
                      </div>

                      <div className="payment-form-row">
                        <div className="payment-form-field">
                          <label htmlFor={`pay-expiration-${payment.id}`}>
                            Expiration
                          </label>
                          <input
                            id={`pay-expiration-${payment.id}`}
                            type="text"
                            placeholder="MM/YY"
                            value={expiration}
                            onChange={(event) => {
                              const value = event.target.value
                                .replace(/\D/g, '')
                                .slice(0, 4)

                              const formatted =
                                value.length > 2
                                  ? `${value.slice(0, 2)}/${value.slice(2)}`
                                  : value

                              setExpiration(formatted)
                            }}
                          />
                        </div>

                        <div className="payment-form-field">
                          <label htmlFor={`pay-cvv-${payment.id}`}>
                            {cardBrand?.codeName ?? 'CVV'}
                          </label>
                          <input
                            id={`pay-cvv-${payment.id}`}
                            type="password"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder={`${cardBrand?.codeSize ?? 3} digits`}
                            maxLength={cardBrand?.codeSize ?? 4}
                            value={cvv}
                            onChange={(event) =>
                              setCvv(event.target.value.replace(/\D/g, ''))
                            }
                          />
                        </div>
                      </div>

                      <div className="payment-form-actions">
                        <Button type="submit">
                          Submit payment
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={cancelPayment}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}