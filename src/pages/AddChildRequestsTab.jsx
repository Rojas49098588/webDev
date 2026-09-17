import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Button from '../components/ui/Button.jsx'

export default function AddChildRequestsTab() {
  const { addChildRequests, users, approveAddChildRequest } = useApp()
  const [error, setError] = useState('')

  function resolveCaretakerName(userId) {
    const caretaker = users.find((user) => user.id === userId)
    return caretaker ? `${caretaker.firstName} ${caretaker.lastName}` : 'Unknown caretaker'
  }

  function handleApprove(requestId) {
    const confirmed = window.confirm(
      'Are you sure you want to add this child?'
    )

    if (!confirmed) {
      return
    }

    setError('')
    const result = approveAddChildRequest(requestId)
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
        {addChildRequests.length === 0 ? (
          <p className="no-results">No pending add requests.</p>
        ) : (
          addChildRequests.map((request) => (
            <DataRow
              key={request.id}
              firstName={request.firstName}
              lastName={request.lastName}
              fields={[
                { label: 'Date of birth', value: request.dateOfBirth },
                { label: 'Primary caretaker', value: resolveCaretakerName(request.primaryCaretakerId) },
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
