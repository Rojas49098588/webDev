import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import DataRow from '../components/ui/DataRow.jsx'
import Badge from '../components/ui/Badge.jsx'
import AddChildRequestsTab from './AddChildRequestsTab.jsx'
import RemoveChildRequestsTab from './RemoveChildRequestsTab.jsx'
import './ChildManagementPage.css'

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1
  }
  return age
}

const VALID_TABS = ['active', 'add-requests', 'remove-requests']

export default function ChildManagementPage() {
  const { children, addChildRequests, removeChildRequests } = useApp()
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'active'

  function handleTabChange(tabId) {
    setSearchParams(tabId === 'active' ? {} : { tab: tabId })
  }

  const activeChildren = children.filter((child) => child.active)
  const searchText = search.toLowerCase().trim()

  const filteredChildren = activeChildren.filter((child) => {
    if (!searchText) {
      return true
    }
    return (
      child.firstName.toLowerCase().includes(searchText) ||
      child.lastName.toLowerCase().includes(searchText) ||
      child.dateOfBirth.includes(searchText)
    )
  })

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'add-requests', label: 'Add requests', count: addChildRequests.length },
    { id: 'remove-requests', label: 'Remove requests', count: removeChildRequests.length },
  ]

  return (
    <div className="child-management-page">
      <h1>Children</h1>
      <p>Search active profiles, or review pending add and remove requests.</p>

      <Tabs tabs={tabs} activeId={activeTab} onChange={handleTabChange} />

      {activeTab === 'active' && (
        <>
          <div className="child-search">
            <SearchInput
              id="child-search-input"
              value={search}
              onChange={setSearch}
              placeholder="Search by first name, last name, or date of birth"
              label="Search children"
            />
          </div>

          <div className="child-list">
            {filteredChildren.length === 0 ? (
              <p className="no-results">No active children match your search.</p>
            ) : (
              filteredChildren.map((child) => (
                <DataRow
                  key={child.id}
                  to={`/staff/children/${child.id}`}
                  firstName={child.firstName}
                  lastName={child.lastName}
                  secondary={`Age ${calculateAge(child.dateOfBirth)}`}
                  fields={[{ label: 'Date of birth', value: child.dateOfBirth }]}
                  badge={<Badge variant="green">Active</Badge>}
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'add-requests' && <AddChildRequestsTab />}
      {activeTab === 'remove-requests' && <RemoveChildRequestsTab />}
    </div>
  )
}
