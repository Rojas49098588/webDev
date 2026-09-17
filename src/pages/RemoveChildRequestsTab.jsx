import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Button from '../components/ui/Button.jsx'

export default function RemoveChildRequestsTab() {
  const { children, users, removeChildRequests, approveRemoveChildRequest } = useApp()
  const [error, setError] = useState('')

  function resolveUserName(userId) {
    const user = users.find((item) => item.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown user'
  }

  function handleApprove(requestId) {
    const confirmed = window.confirm(
    'Are you sure you want to remove this child? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }
    setError('')
    const result = approveRemoveChildRequest(requestId)
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

      <div className="child-list">
        {removeChildRequests.length === 0 ? (
          <p className="no-results">No pending remove requests.</p>
        ) : (
          removeChildRequests.map((request) => {
            const child = children.find((item) => item.id === request.childId)
            if (!child) {
              return null
            }
            return (
              <DataRow
                key={request.id}
                warn
                firstName={child.firstName}
                lastName={child.lastName}
                fields={[{ label: 'Requested by', value: resolveUserName(request.requestedByUserId) }]}
                actions={
                  <Button size="sm" variant="ghost" onClick={() => handleApprove(request.id)}>
                    Archive child
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
