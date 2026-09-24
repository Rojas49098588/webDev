import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import './DataRow.css'

export default function DataRow({ firstName, lastName, secondary, fields = [], badge, actions, to, warn = false }) {
  const content = (
    <>
      <Avatar firstName={firstName} lastName={lastName} />

      <div className="row-name">
        <strong>
          {firstName} {lastName}
        </strong>
        {secondary && <span className="row-secondary">{secondary}</span>}
      </div>

      {fields.map((field) => (
        <div key={field.label} className="row-field" style={field.grow ? { flexGrow: field.grow } : undefined}>
          <span className="row-field-label">{field.label}</span>
          <span className="row-field-value">{field.value}</span>
        </div>
      ))}

      {badge}
      {actions}
    </>
  )

  const className = `data-row ${warn ? 'data-row-warn' : ''}`.trim()

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
