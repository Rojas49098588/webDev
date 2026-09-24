import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Button from '../components/ui/Button.jsx'

export default function AddUserRequestsTab() {
  const { addRequests, approveAddUserRequest } = useApp()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleApprove(requestId) {
    const confirmed = window.confirm(
      'Are you sure you want to approve this user?'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')
    const result = await approveAddUserRequest(requestId)
  }

  return (
    <>
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

      <div className="user-list">
        {addRequests.length === 0 ? (
          <p className="no-results">No pending add requests.</p>
        ) : (
          addRequests.map((request) => (
            <DataRow
              key={request.id}
              firstName={request.firstName}
              lastName={request.lastName}
              fields={[
                { label: 'Role', value: request.role === 'staff' ? 'Staff' : 'Caretaker' },
                { label: 'Email', value: request.email },
                { label: 'Phone', value: request.phone },
                // ...(request.role === 'staff' ? [{ label: 'Group', value: request.groupNumber }] : []),
              ]}
              actions={
                <Button size="sm" onClick={() => handleApprove(request.id)}>
                  Approve
                </Button>
              }
            />
          ))
        )}
      </div>
    </>
  )
}
