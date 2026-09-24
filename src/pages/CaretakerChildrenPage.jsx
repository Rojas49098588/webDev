import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import './ChildManagementPage.css'
import './CaretakerChildrenPage.css'

export default function CaretakerChildrenPage() {
  const { session, children, addChildRequests, removeChildRequests, submitAddChildRequest } = useApp()

  const [search, setSearch] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [medicationName, setMedicationName] = useState('')
  const [medicationDosage, setMedicationDosage] = useState('')
  const [medicationFrequency, setMedicationFrequency] = useState('')
  const [medicationInstructions, setMedicationInstructions] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const myChildren = children.filter(
    (child) => child.active && child.primaryCaretakerId === session.id
  )

  const searchText = search.toLowerCase().trim()

  const filteredChildren = myChildren.filter((child) => {
    if (!searchText) {
      return true
    }
    return (
      child.firstName.toLowerCase().includes(searchText) ||
      child.lastName.toLowerCase().includes(searchText)
    )
  })

  const myPendingAddRequests = addChildRequests.filter(
    (request) => request.primaryCaretakerId === session.id
  )
  const myPendingRemoveRequests = removeChildRequests.filter((request) => {
    if (request.requestedByUserId !== session.id) {
      return false
    }
    const child = children.find((item) => item.id === request.childId)
    return child?.primaryCaretakerId === session.id
  })

  function handleSubmitRequest(event) {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')

    const result = submitAddChildRequest({
      firstName,
      lastName,
      dateOfBirth,
      medication: medicationName.trim()
        ? {
            name: medicationName,
            dosage: medicationDosage,
            frequency: medicationFrequency,
            instructions: medicationInstructions,
          }
        : null,
    })

    setFormSuccess('Request submitted. A staff member will review it soon.')
    setFirstName('')
    setLastName('')
    setDateOfBirth('')
    setMedicationName('')
    setMedicationDosage('')
    setMedicationFrequency('')
    setMedicationInstructions('')
  }

  return (
    <div className="child-management-page">
      <h1>My Children</h1>
      <p>Search the children you're the primary caretaker for, or request to admit a new child.</p>

      <div className="child-search">
        <SearchInput
          id="caretaker-child-search-input"
          value={search}
          onChange={setSearch}
          placeholder="Search by first or last name"
          label="Search my children"
        />
      </div>

      <div className="child-list">
        {filteredChildren.length === 0 ? (
          <p className="no-results">No children match your search.</p>
        ) : (
          filteredChildren.map((child) => (
            <DataRow
              key={child.id}
              to={`/caretaker/children/${child.id}`}
              firstName={child.firstName}
              lastName={child.lastName}
              fields={[{ label: 'Date of birth', value: child.dateOfBirth }]}
              badge={<Badge variant="green">Active</Badge>}
            />
          ))
        )}
      </div>

      <section className="caretaker-request-form">
        <h2>Request to admit a child</h2>
        <p>Submit a new child's information for staff to review.</p>

        {formError && (
          <div className="request-error" role="alert">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="request-success" role="status">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleSubmitRequest} className="caretaker-form">
          <div className="caretaker-form-field">
            <label htmlFor="request-first-name">First name</label>
            <input
              id="request-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="caretaker-form-field">
            <label htmlFor="request-last-name">Last name</label>
            <input
              id="request-last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="caretaker-form-field">
            <label htmlFor="request-dob">Date of birth</label>
            <input
              id="request-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          <div className="caretaker-medication-section">
            <h3>Medication</h3>
            <p>Add medication information if the child needs medication while at the center.</p>

            <div className="caretaker-form-field">
              <label htmlFor="request-medication-name">Medication name</label>
              <input
                id="request-medication-name"
                type="text"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
              />
            </div>

            <div className="caretaker-form-field">
              <label htmlFor="request-medication-dosage">Dosage</label>
              <input
                id="request-medication-dosage"
                type="text"
                value={medicationDosage}
                onChange={(e) => setMedicationDosage(e.target.value)}
              />
            </div>

            <div className="caretaker-form-field">
              <label htmlFor="request-medication-frequency">Frequency</label>
              <input
                id="request-medication-frequency"
                type="text"
                value={medicationFrequency}
                onChange={(e) => setMedicationFrequency(e.target.value)}
              />
            </div>

            <div className="caretaker-form-field">
              <label htmlFor="request-medication-instructions">Instructions</label>
              <input
                id="request-medication-instructions"
                type="text"
                value={medicationInstructions}
                onChange={(e) => setMedicationInstructions(e.target.value)}
              />
            </div>
          </div>

          <div className="caretaker-form-actions">
            <Button type="submit">Submit request</Button>
          </div>
        </form>
      </section>

      <section className="caretaker-pending-requests">
        <h2>My pending requests</h2>

        {myPendingAddRequests.length === 0 && myPendingRemoveRequests.length === 0 ? (
          <p className="no-results">You have no pending requests.</p>
        ) : (
          <div className="child-list">
            {myPendingAddRequests.map((request) => (
              <DataRow
                key={request.id}
                firstName={request.firstName}
                lastName={request.lastName}
                fields={[
                  { label: 'Date of birth', value: request.dateOfBirth },
                  { label: 'Status', value: 'Awaiting staff review (add)' },
                ]}
              />
            ))}

            {myPendingRemoveRequests.map((request) => {
              const child = children.find((item) => item.id === request.childId)
              if (!child) {
                return null
              }
              return (
                <DataRow
                  key={request.id}
                  firstName={child.firstName}
                  lastName={child.lastName}
                  fields={[{ label: 'Status', value: 'Awaiting staff review (remove)' }]}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
