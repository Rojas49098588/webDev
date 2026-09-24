import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Button from '../components/ui/Button.jsx'

export default function RemoveUserRequestsTab() {
  const { users, removeRequests, approveRemoveUserRequest } = useApp()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleApprove(requestId) {
    const confirmed = window.confirm(
      'Are you sure you want to archive this user? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')

    const result = approveRemoveUserRequest(requestId)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setSuccess('User archived successfully.')
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
        {removeRequests.length === 0 ? (
          <p className="no-results">No pending remove requests.</p>
        ) : (
          removeRequests.map((request) => {
            const user = users.find((item) => item.id === request.userId)
            if (!user) {
              return null
            }
            const hasConnectedChildren = user.connectedChildren && user.connectedChildren.length > 0
            return (
              <DataRow
                key={request.id}
                warn={hasConnectedChildren}
                firstName={user.firstName}
                lastName={user.lastName}
                secondary={`@${user.username}`}
                fields={[
                  { label: 'Role', value: user.role === 'staff' ? 'Staff' : 'Caretaker' },
                  ...(hasConnectedChildren ? [{ label: 'Note', value: 'Still has a connected child' }] : []),
                ]}
                actions={
                  <Button size="sm" variant="ghost" onClick={() => handleApprove(request.id)}>
                    Archive user
                  </Button>
                }
              />
            )
          })
        )}
      </div>
    </>
  )
}
