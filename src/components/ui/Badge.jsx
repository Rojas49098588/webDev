import './Badge.css'

export default function Badge({ variant = 'violet', children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}
