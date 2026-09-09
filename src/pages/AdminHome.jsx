import { useApp } from '../context/AppContext.jsx'

export default function AdminHome() {
  const { admin } = useApp()
  return (
    <div>
      <h1>Welcome, {admin.username}</h1>
      <p>The full admin dashboard (user management, add/remove requests) is planned but not yet implemented.</p>
    </div>
  )
}
