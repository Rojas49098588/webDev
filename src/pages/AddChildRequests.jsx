import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'
import './UserRequests.css'

export default function AddChildRequests() {
  const { addChildRequests, users, approveAddChildRequest } = useApp()
  const [error, setError] = useState('')

  function resolveCaretakerName(userId) {
    const caretaker = users.find((user) => user.id === userId)
    return caretaker ? `${caretaker.firstName} ${caretaker.lastName}` : 'Unknown caretaker'
  }

  function handleApprove(requestId) {
    setError('')
    const result = approveAddChildRequest(requestId)

    if (!result.ok) {
      setError(result.error)
    }
  }

  return (
    <div className="user-requests">
      <Link to="/staff/children" className="request-back">
        ← Back to Child Management
      </Link>

      <h1>Add Child Requests</h1>

      <p>Approve requests to admit a new child.</p>

      {error && (
        <div className="request-error" role="alert">
          {error}
        </div>
      )}

      <div className="request-list">
        {addChildRequests.length === 0 ? (
          <p>No pending add requests.</p>
        ) : (
          addChildRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div>
                <h2>
                  {request.firstName} {request.lastName}
                </h2>

                <p>
                  <strong>Date of birth:</strong> {request.dateOfBirth}
                </p>

                <p>
                  <strong>Primary caretaker:</strong>{' '}
                  {resolveCaretakerName(request.primaryCaretakerId)}
                </p>
              </div>

              <button type="button" onClick={() => handleApprove(request.id)}>
                Approve Child
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
