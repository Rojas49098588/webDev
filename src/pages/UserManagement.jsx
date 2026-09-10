import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './UserManagement.css'

export default function UserManagement() {
  const { users } = useApp()
  const [search, setSearch] = useState('')

  // ============================================================
  // SEARCH
  // ============================================================

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

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h1>User Management</h1>
          <p>Search for an active user to view their profile.</p>
        </div>

        <Link to="/admin" className="back-button">
          Back to Admin Home
        </Link>
      </div>

      {/* ============================================================
          SEARCH
          ============================================================ */}

      <div className="user-search">
        <label htmlFor="user-search-input">
          Search users
        </label>

        <input
          id="user-search-input"
          type="text"
          placeholder="Name, username, email, or phone number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ============================================================
          USER LIST
          ============================================================ */}

      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <p className="no-users">
            No active users match your search.
          </p>
        ) : (
          filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/admin/users/${user.id}`}
              className="user-list-item"
            >
              <div>
                <strong>
                  {user.firstName} {user.lastName}
                </strong>

                <p>@{user.username}</p>
              </div>

              <span className="user-role">
                {user.role === 'staff' ? 'Staff' : 'Caretaker'}
              </span>
            </Link>
          ))
        )}
      </div>

      {/* ============================================================
          ADD / REMOVE REQUESTS
          ============================================================ */}

      <div className="request-buttons">
        <Link to="/admin/users/add" className="request-button">
          Add User Requests
        </Link>

        <Link to="/admin/users/remove" className="request-button">
          Remove User Requests
        </Link>
      </div>
    </div>
  )
}