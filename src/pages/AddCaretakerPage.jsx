import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Button from '../components/ui/Button.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import './AddCaretakerPage.css'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mailingAddress: '',
}

export default function AddCaretakerPage() {
  const {
    session,
    children,
    users,
    addAuthorizedCaretaker,
    removeAuthorizedCaretaker,
    removeSecondaryCaretaker,
  } = useApp()

  const myChildren = children.filter(
    (child) =>
      child.active &&
      child.primaryCaretakerId === session.id
  )

  const [selectedChildId, setSelectedChildId] = useState(
    myChildren[0]?.id ?? ''
  )
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [listError, setListError] = useState('')
  const [listSuccess, setListSuccess] = useState('')

  // ============================================================
  // AUTHORIZED CARETAKERS
  // ============================================================

  const authorizedCaretakers = []

  myChildren.forEach((child) => {
    const childName = `${child.firstName} ${child.lastName}`

    // Caretakers who already have accounts
    ;(child.otherCaretakerIds ?? []).forEach((caretakerId) => {
      const caretaker = users.find((user) => user.id === caretakerId)

      if (caretaker && caretaker.active) {
        authorizedCaretakers.push({
          id: caretaker.id,
          firstName: caretaker.firstName,
          lastName: caretaker.lastName,
          username: caretaker.username,
          childId: child.id,
          childName,
          hasAccount: true,
        })
      }
    })

    // Caretakers added from this page
    ;(child.authorizedCaretakers ?? []).forEach((caretaker) => {
      authorizedCaretakers.push({
        ...caretaker,
        childId: child.id,
        childName,
        hasAccount: false,
      })
    })
  })

  // ============================================================
  // ADD / REMOVE CARETAKER
  // ============================================================

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
    setSuccess('')
  }

  function handleAddCaretaker(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const result = addAuthorizedCaretaker(selectedChildId, form)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setSuccess(
      `${result.caretaker.firstName} ${result.caretaker.lastName} was added as an authorized caretaker.`
    )

    setForm(EMPTY_FORM)
  }

  function handleRemoveCaretaker(caretaker) {
    setListError('')
    setListSuccess('')

    const confirmed = window.confirm(
      `Are you sure you want to remove ${caretaker.firstName} ${caretaker.lastName} as a caretaker for ${caretaker.childName}?`
    )
    if (!confirmed) {
      return
    }

    const result = caretaker.hasAccount
      ? removeSecondaryCaretaker(caretaker.childId, caretaker.id)
      : removeAuthorizedCaretaker(caretaker.childId, caretaker.id)

    if (!result.ok) {
      setListError(result.error)
      return
    }

    setListSuccess(
      `${caretaker.firstName} ${caretaker.lastName} was removed as a caretaker for ${caretaker.childName}.`
    )
  }

  return (
    <div className="add-caretaker-page">
      <h1>Caretakers</h1>
      <p>
        View the caretakers authorized for your children, add another caretaker, or remove one.
      </p>

      {/* ========================================================
          AUTHORIZED CARETAKERS
          ======================================================== */}

      <section className="add-caretaker-section">
        <div className="add-caretaker-section-header">
          <h2>Authorized caretakers</h2>
          <p>
            These caretakers are authorized to drop off and pick up your children.
          </p>
        </div>

        {listError && (
          <div className="request-error" role="alert">
            {listError}
          </div>
        )}

        {listSuccess && (
          <div className="request-success" role="status">
            {listSuccess}
          </div>
        )}

        {authorizedCaretakers.length === 0 ? (
          <p className="no-results">
            No authorized caretakers have been added yet.
          </p>
        ) : (
          <div className="authorized-caretaker-list">
            {authorizedCaretakers.map((caretaker) => (
              <div
                key={`${caretaker.id}-${caretaker.childId}`}
                className="authorized-caretaker-row"
              >
                <Avatar
                  firstName={caretaker.firstName}
                  lastName={caretaker.lastName}
                />

                <div className="authorized-caretaker-info">
                  <Link to={`/caretaker/caretakers/${caretaker.id}`}>
                    <strong>
                      {caretaker.firstName} {caretaker.lastName}
                    </strong>
                  </Link>

                  <span>
                    Authorized for {caretaker.childName}
                    {caretaker.hasAccount ? ` · @${caretaker.username}` : ''}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="authorized-caretaker-remove"
                  onClick={() => handleRemoveCaretaker(caretaker)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          ADD CARETAKER
          ======================================================== */}

      <section className="add-caretaker-section">
        <div className="add-caretaker-section-header">
          <h2>Add a caretaker</h2>
          <p>
            Enter the details of someone you authorize to drop off and pick up your child. All fields are required.
          </p>
        </div>

        {error && (
          <div className="request-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="request-success" role="status">
            {success}
          </div>
        )}

        <form
          onSubmit={handleAddCaretaker}
          className="add-caretaker-form"
          noValidate
        >
          <div className="add-caretaker-field">
            <label htmlFor="caretaker-child">
              Child
            </label>

            <select
              id="caretaker-child"
              value={selectedChildId}
              onChange={(event) => {
                setSelectedChildId(event.target.value)
                setError('')
                setSuccess('')
              }}
            >
              {myChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="add-caretaker-field">
            <label htmlFor="caretaker-first-name">
              First name
            </label>

            <input
              id="caretaker-first-name"
              type="text"
              value={form.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
            />
          </div>

          <div className="add-caretaker-field">
            <label htmlFor="caretaker-last-name">
              Last name
            </label>

            <input
              id="caretaker-last-name"
              type="text"
              value={form.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
            />
          </div>

          <div className="add-caretaker-field">
            <label htmlFor="caretaker-email">
              Email address
            </label>

            <input
              id="caretaker-email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </div>

          <div className="add-caretaker-field">
            <label htmlFor="caretaker-phone">
              Phone number
            </label>

            <input
              id="caretaker-phone"
              type="tel"
              placeholder="2145550123"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </div>

          <div className="add-caretaker-field">
            <label htmlFor="caretaker-address">
              Mailing address
            </label>

            <input
              id="caretaker-address"
              type="text"
              value={form.mailingAddress}
              onChange={(event) => updateField('mailingAddress', event.target.value)}
            />
          </div>

          <div className="add-caretaker-form-actions">
            <Button type="submit">
              Add caretaker
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
