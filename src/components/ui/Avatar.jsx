import './Avatar.css'

export default function Avatar({ firstName = '', lastName = '' }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  return <span className="avatar">{initials}</span>
}
