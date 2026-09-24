import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import './AttendanceRecords.css'

export default function AttendanceRecords() {
  const {
    children,
    getChildAttendance,
  } = useApp()

  const [childSearch, setChildSearch] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')

  const selectedChild = children.find(
    (child) => child.id === selectedChildId
  )

  const searchText = childSearch.toLowerCase().trim()

  const filteredChildren = children.filter((child) => {
    if (!searchText) {
      return true
    }

    return (
      child.firstName.toLowerCase().includes(searchText) ||
      child.lastName.toLowerCase().includes(searchText) ||
      child.dateOfBirth.includes(searchText)
    )
  })

  const childAttendance = selectedChildId
    ? getChildAttendance(selectedChildId)
    : []

  return (
    <div className="attendance-records-page">
      <div className="attendance-records-header">
        <div>
          <h1>Attendance Records</h1>
          <p>View attendance history for an individual child.</p>
        </div>

        <Link to="/staff/attendance" className="back-button">
          ← Back to Attendance
        </Link>
      </div>

      <section className="attendance-records-section">
        <div className="attendance-records-section-header">
          <div>
            <h2>Find a Child</h2>
            <p>
              Search by first name, last name, or date of birth.
            </p>
          </div>
        </div>

        <div className="attendance-records-search">
          <SearchInput
            id="attendance-child-search"
            value={childSearch}
            onChange={(value) => {
                setChildSearch(value)

                if (!value.trim()) {
                    setSelectedChildId('')
                }
            }}
            placeholder="Search by first name, last name, or date of birth"
            label="Search children"
          />
        </div>

        <div className="attendance-child-results">
          {filteredChildren.length === 0 ? (
            <p className="attendance-records-empty">
              No children match your search.
            </p>
          ) : (
            filteredChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                className={`attendance-child-result ${
                  selectedChildId === child.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedChildId(child.id)}
              >
                <strong>
                  {child.firstName} {child.lastName}
                </strong>

                <span>
                  Date of birth: {child.dateOfBirth}
                </span>
              </button>
            ))
          )}
        </div>
      </section>

      {selectedChild && (
        <section className="attendance-records-section">
          <div className="attendance-records-section-header">
            <div>
              <h2>
                {selectedChild.firstName} {selectedChild.lastName}
              </h2>
              <p>Attendance history</p>
            </div>
          </div>

          {childAttendance.length === 0 ? (
            <p className="attendance-records-empty">
              No attendance records found for this child.
            </p>
          ) : (
            <div className="attendance-records-table-wrapper">
              <table className="attendance-records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Caretaker</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {childAttendance.map((record) => {
                    const dateTime = new Date(record.dateTime)

                    return (
                      <tr key={record.id}>
                        <td>
                          {dateTime.toLocaleDateString()}
                        </td>

                        <td>
                          {record.type === 'drop-off'
                            ? 'Drop-off'
                            : 'Pickup'}
                        </td>

                        <td>
                          {record.caretakerFirstName}{' '}
                          {record.caretakerLastName}
                        </td>

                        <td>
                          {dateTime.toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}