import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import LoginPage from './components/LoginPage.jsx'
import AdminHome from './pages/AdminHome.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/set-password"
            element={
              <ProtectedRoute allowMustChangePassword>
                <SetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/change-password"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ChangePasswordPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminHome />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
