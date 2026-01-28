

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authStorage } from '@/services/auth-storage.service'

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authStorage.isValid())
  const [userEmail, setUserEmail] = useState<string | null>(() => authStorage.getEmail())

  const logout = useCallback(() => {
    authStorage.clear()
    setIsAuthenticated(false)
    setUserEmail(null)
  }, [])

  // Auto-logout when token expires
  useEffect(() => {
    if (!isAuthenticated) return

    const remainingTime = authStorage.getRemainingTime()
    if (remainingTime <= 0) {
      logout()
      return
    }

    const timeoutId = setTimeout(logout, remainingTime)
    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, logout])


  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simple validation for demo purposes
    // In production, this would validate against backend
    if (email && password.length >= 6) {
      authStorage.save(email)
      setIsAuthenticated(true)
      setUserEmail(email)
      return true
    }

    return false
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

