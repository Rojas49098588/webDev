import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Button from '../components/ui/Button.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import './AddCaretakerPage.css'
import { Link } from 'react-router-dom'

export default function AddCaretakerPage() {
  const {
    session,
    children,
    users,
    addAuthorizedCaretaker,
  } = useApp()

  const myChildren = children.filter(
    (child) =>
      child.active &&
      child.primaryCaretakerId === session.id
  )

  const [selectedChildId, setSelectedChildId] = useState(
    myChildren[0]?.id ?? ''
  )
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ============================================================
  // AUTHORIZED CARETAKERS
  // ============================================================

  const authorizedCaretakers = []

    myChildren.forEach((child) => {
    // New name-only authorized caretakers
    ;(child.authorizedCaretakers ?? []).forEach((caretaker) => {
        authorizedCaretakers.push({
        ...caretaker,
        childName: `${child.firstName} ${child.lastName}`,
        isAccountCaretaker: false,
        })
    })

    // Existing caretakers who already have accounts
    ;(child.otherCaretakerIds ?? []).forEach((caretakerId) => {
        const caretaker = users.find((user) => user.id === caretakerId)

        if (caretaker) {
        authorizedCaretakers.push({
            id: caretaker.id,
            firstName: caretaker.firstName,
            lastName: caretaker.lastName,
            username: caretaker.username,
            childName: `${child.firstName} ${child.lastName}`,
            isAccountCaretaker: true,
        })
        }
    })
    })

  // ============================================================
  // ADD CARETAKER
  // ============================================================

  function handleAddCaretaker(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const result = addAuthorizedCaretaker(
      selectedChildId,
      firstName,
      lastName
    )

    if (!result.ok) {
      setError(result.error)
      return
    }

    setSuccess(
      `${result.caretaker.firstName} ${result.caretaker.lastName} was added as an authorized caretaker.`
    )

    setFirstName('')
    setLastName('')
  }

  return (
    <div className="add-caretaker-page">
      <h1>Caretakers</h1>
      <p>
        View the caretakers authorized for your children or add another caretaker.
      </p>

      {/* ========================================================
          AUTHORIZED CARETAKERS
          ======================================================== */}

      <section className="add-caretaker-section">
        <div className="add-caretaker-section-header">
          <h2>Authorized caretakers</h2>
          <p>
            These caretakers are authorized to pick up your children.
          </p>
        </div>

        {authorizedCaretakers.length === 0 ? (
          <p className="no-results">
            No authorized caretakers have been added yet.
          </p>
        ) : (
          <div className="authorized-caretaker-list">
            {authorizedCaretakers.map((caretaker) => (
              <div
                key={`${caretaker.id}-${caretaker.childName}`}
                className="authorized-caretaker-row"
              >
                <Avatar
                  firstName={caretaker.firstName}
                  lastName={caretaker.lastName}
                />

                <div className="authorized-caretaker-info">
                  {caretaker.isAccountCaretaker ? (
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

                  <span>
                    Authorized for {caretaker.childName}
                  </span>
                </div>
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
            Enter the name of someone you authorize to pick up your child.
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
        >
          <div className="add-caretaker-field">
            <label htmlFor="caretaker-first-name">
              First name
            </label>

            <input
              id="caretaker-first-name"
              type="text"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value)
                setError('')
                setSuccess('')
              }}
            />
          </div>

          <div className="add-caretaker-field">
            <label htmlFor="caretaker-last-name">
              Last name
            </label>

            <input
              id="caretaker-last-name"
              type="text"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value)
                setError('')
                setSuccess('')
              }}
            />
          </div>

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