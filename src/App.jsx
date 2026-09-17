import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import AppShell from './components/layout/AppShell.jsx'
import LoginPage from './components/LoginPage.jsx'
import AdminHome from './pages/AdminHome.jsx'
import StaffHome from './pages/StaffHome.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import UserManagement from './pages/UserManagement.jsx'
import UserProfile from './pages/UserProfile.jsx'
import AddUserRequests from './pages/AddUserRequests.jsx'
import RemoveUserRequests from './pages/RemoveUserRequests.jsx'
import ChildManagement from './pages/ChildManagement.jsx'
import ChildProfile from './pages/ChildProfile.jsx'
import AddChildRequests from './pages/AddChildRequests.jsx'
import RemoveChildRequests from './pages/RemoveChildRequests.jsx'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/set-password"
            element={
              <ProtectedRoute allowMustChangePassword>
                <SetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/change-password"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <ChangePasswordPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <AdminHome />
                </AppShell>
              </ProtectedRoute>
            }
          />
          {/* USER MANAGEMENT ROUTES ============================ */}

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <UserManagement />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <UserProfile />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <AddUserRequests />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/remove"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <RemoveUserRequests />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* STAFF ROUTES ============================ */}

          <Route
            path="/staff"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <StaffHome />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/change-password"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <ChangePasswordPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/children"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <ChildManagement />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/children/:id"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <ChildProfile />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/children/add"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <AddChildRequests />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/children/remove"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <RemoveChildRequests />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
