import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import StaffLayout from './components/layout/StaffLayout.jsx'
import LoginPage from './components/LoginPage.jsx'
import AdminHome from './pages/AdminHome.jsx'
import StaffHome from './pages/StaffHome.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import UserManagement from './pages/UserManagement.jsx'
import UserProfile from './pages/UserProfile.jsx'
import AddUserRequests from './pages/AddUserRequests.jsx'
import RemoveUserRequests from './pages/RemoveUserRequests.jsx'

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
                <AdminLayout>
                  <ChangePasswordPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminHome />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* USER MANAGEMENT ROUTES ============================ */}

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <UserProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AddUserRequests />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/remove"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <RemoveUserRequests />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* STAFF ROUTES ============================ */}

          <Route
            path="/staff"
            element={
              <ProtectedRoute role="staff">
                <StaffLayout>
                  <StaffHome />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/change-password"
            element={
              <ProtectedRoute role="staff">
                <StaffLayout>
                  <ChangePasswordPage />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
