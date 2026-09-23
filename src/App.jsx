import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import AppShell from './components/layout/AppShell.jsx'
import LoginPage from './components/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import UserManagementPage from './pages/UserManagementPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import ChildManagementPage from './pages/ChildManagementPage.jsx'
import ChildProfilePage from './pages/ChildProfilePage.jsx'
import Attendance from './pages/Attendance.jsx'
import Payments from './pages/Payments.jsx'

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
                  <DashboardPage />
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
                  <UserManagementPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute role="admin">
                <AppShell>
                  <UserProfilePage />
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
                  <DashboardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/attendance"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <Attendance />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/payments"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <Payments />
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
                  <ChildManagementPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/children/:id"
            element={
              <ProtectedRoute role="staff">
                <AppShell>
                  <ChildProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* CARETAKER ROUTES ============================ */}

          <Route
            path="/caretaker"
            element={
              <ProtectedRoute role="caretaker">
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/caretaker/change-password"
            element={
              <ProtectedRoute role="caretaker">
                <AppShell>
                  <ChangePasswordPage />
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
