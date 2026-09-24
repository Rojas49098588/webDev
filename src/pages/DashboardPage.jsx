import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ActivityFeedItem from '../components/ui/ActivityFeedItem.jsx'
import Card from '../components/ui/Card.jsx'
import './DashboardPage.css'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good morning'
  }
  if (hour < 18) {
    return 'Good afternoon'
  }
  return 'Good evening'
}

function getTodayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function DashboardPage() {
  const {
    session,
    currentAccount,
    children,
    addChildRequests,
    removeChildRequests,
    users,
    addRequests,
    removeRequests,
    paymentRecords,
    activity,
  } = useApp()

  const role = session.role

  const activeChildrenCount = children.filter((child) => child.active).length
  const activeUsersCount = users.filter((user) => user.active).length

  const myActiveChildren = children.filter(
    (child) => child.active && child.primaryCaretakerId === session.id
  )
  const myPendingRemoveRequests = removeChildRequests.filter((request) => {
    if (request.requestedByUserId !== session.id) {
      return false
    }
    const child = children.find((item) => item.id === request.childId)
    return child?.primaryCaretakerId === session.id
  })
  const myPendingRequestsCount =
    addChildRequests.filter((request) => request.primaryCaretakerId === session.id).length +
    myPendingRemoveRequests.length
  const myOutstandingBalance = paymentRecords
    .filter((record) => record.primaryCaretakerId === session.id)
    .reduce((total, record) => total + record.balance, 0)

  let statCards
  let quickActions

  if (role === 'admin') {
    statCards = [
      { icon: '⚇', value: activeUsersCount, label: 'Active users', variant: 'green' },
      { icon: '+', value: addRequests.length, label: 'Add user requests', variant: 'amber' },
      { icon: '⊟', value: removeRequests.length, label: 'Remove user requests', variant: 'amber' },
    ]
    quickActions = [
      { to: '/admin/users', label: 'Search users', description: 'Find a profile by name, username, email, or phone' },
      {
        to: '/admin/users?tab=add-requests',
        label: 'Review add requests',
        description: `${addRequests.length} new users awaiting approval`,
      },
      {
        to: '/admin/users?tab=remove-requests',
        label: 'Review remove requests',
        description: `${removeRequests.length} archive requests pending`,
      },
    ]
  } else if (role === 'staff') {
    statCards = [
      { icon: '◑', value: activeChildrenCount, label: 'Active children', variant: 'violet' },
      { icon: '+', value: addChildRequests.length, label: 'Add child requests', variant: 'amber' },
      { icon: '⊟', value: removeChildRequests.length, label: 'Remove child requests', variant: 'amber' },
    ]
    quickActions = [
      { to: '/staff/children', label: 'Search children', description: 'Find a profile by name or date of birth' },
      {
        to: '/staff/children?tab=add-requests',
        label: 'Review add requests',
        description: `${addChildRequests.length} new children awaiting approval`,
      },
      {
        to: '/staff/children?tab=remove-requests',
        label: 'Review remove requests',
        description: `${removeChildRequests.length} archive requests pending`,
      },
    ]
  } else {
    statCards = [
      { icon: '◑', value: myActiveChildren.length, label: 'My children', variant: 'violet' },
      { icon: '+', value: myPendingRequestsCount, label: 'Pending requests', variant: 'amber' },
      { icon: '$', value: `$${myOutstandingBalance.toFixed(2)}`, label: 'Outstanding balance', variant: 'amber' },
    ]
    quickActions = [
      {
        to: '/caretaker/children',
        label: 'Search my children',
        description: 'Find a profile by first or last name',
      },
      {
        to: '/caretaker/children',
        label: 'Request to admit a child',
        description: 'Submit a new child for staff review',
      },
      {
        to: '/caretaker/children',
        label: 'Review pending requests',
        description: `${myPendingRequestsCount} requests awaiting staff review`,
      },
    ]
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <span className="dashboard-date">{getTodayLabel()}</span>
        <h1>
          {getGreeting()}, {currentAccount.firstName || currentAccount.username}
        </h1>
        <p>Here's what's happening at your center today.</p>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="dashboard-columns">
        <Card className="dashboard-panel">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to} className="quick-action">
                <div>
                  <strong>{action.label}</strong>
                  <p>{action.description}</p>
                </div>
                <span aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="dashboard-panel">
          <h2>Recent activity</h2>
          {activity.length === 0 ? (
            <p className="no-activity">No recent activity yet.</p>
          ) : (
            <div className="activity-feed">
              {activity.map((entry) => (
                <ActivityFeedItem key={entry.id} message={entry.message} timestamp={entry.timestamp} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
