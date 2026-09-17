import { formatRelativeTime } from '../../utils/formatRelativeTime.js'
import './ActivityFeedItem.css'

export default function ActivityFeedItem({ message, timestamp }) {
  return (
    <div className="activity-item">
      <span className="activity-dot" aria-hidden="true" />
      <span className="activity-message">{message}</span>
      <span className="activity-time">{formatRelativeTime(timestamp)}</span>
    </div>
  )
}
