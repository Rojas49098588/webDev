import { useApp } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'
import './UserRequests.css'

export default function AddUserRequests() {
  const {
    addRequests,
    approveAddUserRequest,
  } = useApp()

  async function handleApprove(requestId) {
    const result = await approveAddUserRequest(requestId)

    if (!result.ok) {
      alert(result.error)
      return
    }

    alert(
      `User approved!\n\nUsername: ${result.username}\nInitial password: ${result.initialPassword}`
    )
  }

  return (
    <div className="user-requests">
      <Link to="/admin/users" className="request-back">
        ← Back to User Management
      </Link>

      <h1>Add User Requests</h1>

      <p>
        Approve requests to create and activate new user accounts.
      </p>

      <div className="request-list">
        {addRequests.length === 0 ? (
          <p>No pending add requests.</p>
        ) : (
          addRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div>
                <h2>
                  {request.firstName} {request.lastName}
                </h2>

                <p>
                  <strong>Role:</strong>{' '}
                  {request.role === 'staff'
                    ? 'Staff'
                    : 'Caretaker'}
                </p>

                <p>
                  <strong>Email:</strong> {request.email}
                </p>

                <p>
                  <strong>Phone:</strong> {request.phone}
                </p>

                {request.role === 'staff' && (
                  <p>
                    <strong>Group:</strong>{' '}
                    {request.groupNumber}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleApprove(request.id)}
              >
                Approve User
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}