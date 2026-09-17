import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Button from '../components/ui/Button.jsx'

export default function RemoveUserRequestsTab() {
  const { users, removeRequests, approveRemoveUserRequest } = useApp()
  const [error, setError] = useState('')

  function handleApprove(requestId) {
    setError('')
    const result = approveRemoveUserRequest(requestId)
    if (!result.ok) {
      setError(result.error)
    }
  }

  return (
    <>
      {error && (
        <div className="request-error" role="alert">
          {error}
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
