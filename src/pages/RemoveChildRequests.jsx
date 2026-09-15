import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'
import './UserRequests.css'

export default function RemoveChildRequests() {
  const { children, users, removeChildRequests, approveRemoveChildRequest } = useApp()
  const [error, setError] = useState('')

  function resolveUserName(userId) {
    const user = users.find((item) => item.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown user'
  }

  function handleApprove(requestId) {
    setError('')
    const result = approveRemoveChildRequest(requestId)

    if (!result.ok) {
      setError(result.error)
    }
  }

  return (
    <div className="user-requests">
      <Link to="/staff/children" className="request-back">
        ← Back to Child Management
      </Link>

      <h1>Remove Child Requests</h1>

      <p>Children will be archived rather than permanently deleted.</p>

      {error && (
        <div className="request-error" role="alert">
          {error}
        </div>
      )}

      <div className="request-list">
        {removeChildRequests.length === 0 ? (
          <p>No pending remove requests.</p>
        ) : (
          removeChildRequests.map((request) => {
            const child = children.find((item) => item.id === request.childId)

            if (!child) {
              return null
            }

            return (
              <div key={request.id} className="request-card">
                <div>
                  <h2>
                    {child.firstName} {child.lastName}
                  </h2>

                  <p>
                    <strong>Requested by:</strong>{' '}
                    {resolveUserName(request.requestedByUserId)}
                  </p>
                </div>

                <button type="button" onClick={() => handleApprove(request.id)}>
                  Archive Child
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
