

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/store/auth-context'
import Login from '@/pages/Login/Login'
import Dashboard from '@/pages/Dashboard/Dashboard'
import UserDetails from '@/pages/UserDetails/UserDetails'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/:userId" element={<UserDetails />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

