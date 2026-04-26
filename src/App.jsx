import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ui/ProtectedRoute';

import SignUpPage from './pages/auth/SignUp';
import LoginPage from './pages/auth/Login';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import HomePage from './pages/Home';
import EmployeeDetailPage from './pages/EmployeeDetail';
import ProfilePage from './pages/Profile';

function AppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth */}
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ForgotPasswordPage />} />

          {/* Protected */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1c2030' : '#ffffff',
            color: isDark ? '#f1f3f9' : '#0f1117',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.5)'
              : '0 8px 32px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: isDark ? '#1c2030' : '#ffffff' } },
          error:   { iconTheme: { primary: '#ff4d6d', secondary: isDark ? '#1c2030' : '#ffffff' } },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
