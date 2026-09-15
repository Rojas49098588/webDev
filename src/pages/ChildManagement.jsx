import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './UserManagement.css'

export default function ChildManagement() {
  const { children } = useApp()
  const [search, setSearch] = useState('')

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

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h1>Child Management</h1>
          <p>Search for an active child to view their profile.</p>
        </div>

        <Link to="/staff" className="back-button">
          Back to Staff Home
        </Link>
      </div>

      <div className="user-search">
        <label htmlFor="child-search-input">Search children</label>

        <input
          id="child-search-input"
          type="text"
          placeholder="First name, last name, or date of birth (YYYY-MM-DD)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="user-list">
        {filteredChildren.length === 0 ? (
          <p className="no-users">No active children match your search.</p>
        ) : (
          filteredChildren.map((child) => (
            <Link key={child.id} to={`/staff/children/${child.id}`} className="user-list-item">
              <div>
                <strong>
                  {child.firstName} {child.lastName}
                </strong>
                <p>Born {child.dateOfBirth}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="request-buttons">
        <Link to="/staff/children/add" className="request-button">
          Add Child Requests
        </Link>

        <Link to="/staff/children/remove" className="request-button">
          Remove Child Requests
        </Link>
      </div>
    </div>
  )
}
