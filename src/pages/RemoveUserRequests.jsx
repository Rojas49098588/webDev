import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'
import './UserRequests.css'

export default function RemoveUserRequests() {
  const {
    users,
    removeRequests,
    approveRemoveUserRequest,
  } = useApp()

  const [error, setError] = useState('')

  function handleApprove(requestId) {
    setError('')

    const result = approveRemoveUserRequest(requestId)

    if (!result.ok) {
      setError(result.error)
    }
  }

  return (
    <div className="user-requests">
      <Link to="/admin/users" className="request-back">
        ← Back to User Management
      </Link>

      <h1>Remove User Requests</h1>

      <p>
        Users will be archived rather than permanently deleted.
      </p>

      {/* ============================================================
          REMOVAL ERROR
          ============================================================ */}

      {error && (
        <div className="request-error" role="alert">
          {error}
        </div>
      )}

      {/* ============================================================
          REQUEST LIST
          ============================================================ */}

      <div className="request-list">
        {removeRequests.length === 0 ? (
          <p>No pending remove requests.</p>
        ) : (
          removeRequests.map((request) => {
            const user = users.find(
              (item) => item.id === request.userId
            )

            if (!user) {
              return null
            }

            const hasConnectedChildren =
              user.connectedChildren &&
              user.connectedChildren.length > 0

            return (
              <div key={request.id} className="request-card">
                <div>
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>

                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>

                  <p>
                    <strong>Role:</strong>{' '}
                    {user.role === 'staff'
                      ? 'Staff'
                      : 'Caretaker'}
                  </p>

                  {hasConnectedChildren && (
                    <p className="connected-warning">
                      This user still has a connected child.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleApprove(request.id)}
                >
                  Archive User
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}