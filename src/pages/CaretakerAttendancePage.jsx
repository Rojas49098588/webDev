import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import './AttendanceRecords.css'

export default function CaretakerAttendancePage() {
  const {
    session,
    children,
    getChildAttendance,
  } = useApp()

  const [search, setSearch] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')

  const myChildren = children.filter(
    (child) =>
      child.active &&
      child.primaryCaretakerId === session.id
  )

  const searchText = search.toLowerCase().trim()

  const filteredChildren = myChildren.filter((child) => {
    if (!searchText) {
      return true
    }

    return (
      child.firstName.toLowerCase().includes(searchText) ||
      child.lastName.toLowerCase().includes(searchText)
      (searchText.length === 4 && birthYear === searchText)
    )
  })

  const selectedChild = myChildren.find(
    (child) => child.id === selectedChildId
  )

  const attendance = selectedChildId
    ? getChildAttendance(selectedChildId)
    : []

  return (
    <div className="attendance-records-page">
      <div className="attendance-records-header">
        <div>
          <h1>Attendance</h1>
          <p>View attendance history for your children.</p>
        </div>
      </div>

      <section className="attendance-records-section">
        <div className="attendance-records-section-header">
          <div>
            <h2>Search My Children</h2>
            <p>
              Search by first name, last name, or birth year.
            </p>
          </div>
        </div>

        <div className="attendance-records-search">
          <SearchInput
            id="caretaker-attendance-child-search"
            value={search}
            onChange={(value) => {
              setSearch(value)

              if (!value.trim()) {
                setSelectedChildId('')
              }
            }}
            placeholder="Search by first or last name"
            label="Search my children"
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

          {attendance.length === 0 ? (
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
                  {attendance.map((record) => {
                    const dateTime = new Date(record.dateTime)

                    return (
                      <tr key={record.id}>
                        <td>{dateTime.toLocaleDateString()}</td>

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