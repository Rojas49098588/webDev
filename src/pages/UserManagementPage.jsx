import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Badge from '../components/ui/Badge.jsx'
import AddUserRequestsTab from './AddUserRequestsTab.jsx'
import RemoveUserRequestsTab from './RemoveUserRequestsTab.jsx'
import './UserManagementPage.css'

const VALID_TABS = ['active', 'add-requests', 'remove-requests']

export default function UserManagementPage() {
  const { users, addRequests, removeRequests } = useApp()
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'active'

  function handleTabChange(tabId) {
    setSearchParams(tabId === 'active' ? {} : { tab: tabId })
  }

  const activeUsers = users.filter((user) => user.active)
  const searchText = search.toLowerCase().trim()

  const filteredUsers = activeUsers.filter((user) => {
    if (!searchText) {
      return true
    }
    return (
      user.firstName.toLowerCase().includes(searchText) ||
      user.lastName.toLowerCase().includes(searchText) ||
      user.username.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.phone.toLowerCase().includes(searchText)
    )
  })

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'add-requests', label: 'Add requests', count: addRequests.length },
    { id: 'remove-requests', label: 'Remove requests', count: removeRequests.length },
  ]

  return (
    <div className="user-management-page">
      <h1>Users</h1>
      <p>Search active users, or review pending add and remove requests.</p>

      <Tabs tabs={tabs} activeId={activeTab} onChange={handleTabChange} />

      {activeTab === 'active' && (
        <>
          <div className="user-search">
            <SearchInput
              id="user-search-input"
              value={search}
              onChange={setSearch}
              placeholder="Search by name, username, email, or phone"
              label="Search users"
            />
          </div>

          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p className="no-results">No active users match your search.</p>
            ) : (
              filteredUsers.map((user) => (
                <DataRow
                  key={user.id}
                  to={`/admin/users/${user.id}`}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  secondary={`@${user.username}`}
                  badge={
                    <Badge variant={user.role === 'staff' ? 'blue' : 'green'}>
                      {user.role === 'staff' ? 'Staff' : 'Caretaker'}
                    </Badge>
                  }
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'add-requests' && <AddUserRequestsTab />}
      {activeTab === 'remove-requests' && <RemoveUserRequestsTab />}
    </div>
  )
}
