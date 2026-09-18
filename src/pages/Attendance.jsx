import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './Attendance.css'

export default function Attendance() {
  const {
  children,
  users,
  recordAttendance,
  getAttendanceForDate,
  getChildAttendance,
} = useApp()

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [selectedChildId, setSelectedChildId] = useState('')
  const [historyChildId, setHistoryChildId] = useState('')
  const [attendanceType, setAttendanceType] = useState('drop-off')
  const [selectedCaretakerId, setSelectedCaretakerId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const activeChildren = children.filter((child) => child.active)
  const selectedChild = children.find(
  (child) => child.id === selectedChildId
)

const authorizedCaretakers = selectedChild
  ? [
      selectedChild.primaryCaretakerId,
      ...(selectedChild.otherCaretakerIds ?? []),
    ]
      .map((caretakerId) =>
        users.find((user) => user.id === caretakerId)
      )
      .filter(
        (caretaker) =>
          caretaker &&
          caretaker.role === 'caretaker' &&
          caretaker.active
      )
  : []

  const dailyAttendance = getAttendanceForDate(selectedDate)
  const childAttendance = historyChildId
  ? getChildAttendance(historyChildId)
  : []

  function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!selectedChildId) {
      setError('Please select a child.')
      return
    }

    if (!selectedCaretakerId) {
      setError('Please select the person picking up or dropping off the child.')
      return
    }

    const result = recordAttendance(
      selectedChildId,
      attendanceType,
      selectedCaretakerId
    )

    if (!result.ok) {
      setError(result.error)
      return
    }

    setSuccess(
      `${result.record.childFirstName} ${result.record.childLastName} ${
        attendanceType === 'drop-off' ? 'drop-off' : 'pickup'
      } was recorded successfully.`
    )

    setSelectedCaretakerId('')

    // Keep the selected child and attendance type so staff can
    // quickly record another attendance event if needed.
  }

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>Attendance</h1>
          <p>Record child drop-off and pickup activity.</p>
        </div>

        <Link to="/staff" className="back-button">
          Back to Staff Home
        </Link>
      </div>

      {/* ============================================================
          RECORD ATTENDANCE
          ============================================================ */}

      <section className="attendance-section">
        <h2>Record Attendance</h2>

        {error && (
          <div className="attendance-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="attendance-success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="attendance-field">
            <label htmlFor="attendance-child">
              Child
            </label>

            <select
              id="attendance-child"
              value={selectedChildId}
              onChange={(event) => setSelectedChildId(event.target.value)}
            >
              <option value="">Select a child</option>

              {activeChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="attendance-field">
            <label htmlFor="attendance-type">
              Activity
            </label>

            <select
              id="attendance-type"
              value={attendanceType}
              onChange={(event) => setAttendanceType(event.target.value)}
            >
              <option value="drop-off">Drop-off</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          <div className="attendance-field">
            <label htmlFor="attendance-caretaker">
              Person dropping off / picking up
            </label>

            <select
              id="attendance-caretaker"
              value={selectedCaretakerId}
              onChange={(event) => setSelectedCaretakerId(event.target.value)}
              disabled={!selectedChildId}
            >
              <option value="">
                {selectedChildId
                  ? 'Select an authorized caretaker'
                  : 'Select a child first'}
              </option>

              {authorizedCaretakers.map((caretaker) => (
                <option key={caretaker.id} value={caretaker.id}>
                  {caretaker.firstName} {caretaker.lastName}
                  {caretaker.id === selectedChild.primaryCaretakerId
                    ? ' — Primary caretaker'
                    : ''}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="attendance-submit">
            Record {attendanceType === 'drop-off' ? 'Drop-Off' : 'Pickup'}
          </button>
        </form>
      </section>

      {/* ============================================================
          VIEW ATTENDANCE HISTORY FOR A CHILD
          ============================================================ */}
      <section className="attendance-section">
        <h2>Attendance Record for a Child</h2>

        <div className="attendance-date-picker">
          <label htmlFor="attendance-history-child">
            Select child
          </label>

          <select
            id="attendance-history-child"
            value={historyChildId}
            onChange={(event) => setHistoryChildId(event.target.value)}
          >
            <option value="">Select a child</option>

            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>

        {!historyChildId ? (
          <p className="attendance-empty">
            Select a child to view their attendance history.
          </p>
        ) : childAttendance.length === 0 ? (
          <p className="attendance-empty">
            No attendance records for this child.
          </p>
        ) : (
          <div className="attendance-list">
            {childAttendance.map((record) => (
              <div key={record.id} className="attendance-card">
                <div>
                  <h3>
                    {record.type === 'drop-off' ? 'Drop-off' : 'Pickup'}
                  </h3>

                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(record.dateTime).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Caretaker:</strong>{' '}
                    {record.caretakerFirstName}{' '}
                    {record.caretakerLastName}
                  </p>
                </div>

                <span className="attendance-time">
                  {new Date(record.dateTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================
          VIEW ATTENDANCE FOR A DAY
          ============================================================ */}

      <section className="attendance-section">
        <h2>Attendance for a Given Day</h2>

        <div className="attendance-date-picker">
          <label htmlFor="attendance-date">
            Select date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>

        <div className="attendance-list">
          {dailyAttendance.length === 0 ? (
            <p className="attendance-empty">
              No attendance records for this date.
            </p>
          ) : (
            dailyAttendance.map((record) => (
              <div key={record.id} className="attendance-card">
                <div>
                  <h3>
                    {record.childFirstName} {record.childLastName}
                  </h3>

                  <p>
                    <strong>Activity:</strong>{' '}
                    {record.type === 'drop-off' ? 'Drop-off' : 'Pickup'}
                  </p>

                  <p>
                    <strong>Caretaker:</strong>{' '}
                    {record.caretakerFirstName}{' '}
                    {record.caretakerLastName}
                  </p>
                </div>

                <span className="attendance-time">
                  {new Date(record.dateTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}