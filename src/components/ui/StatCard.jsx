import './StatCard.css'

export default function StatCard({ icon, value, label, variant = 'violet' }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon stat-icon-${variant}`}>{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
