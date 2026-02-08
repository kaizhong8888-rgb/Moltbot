import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { authService, User, LoginParams, RegisterParams } from '@/services/auth'
import { useAppStore } from '@/stores'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (params: LoginParams) => Promise<void>
  register: (params: RegisterParams) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { setCurrentUser } = useAppStore()

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getMe()
        .then((userData) => {
          setUser(userData)
          setCurrentUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [setCurrentUser])

  const login = useCallback(async (params: LoginParams) => {
    const response = await authService.login(params)
    localStorage.setItem('token', response.token)
    setUser(response.user)
    setCurrentUser(response.user)
    window.location.href = '/dashboard'
  }, [setCurrentUser])

  const register = useCallback(async (params: RegisterParams) => {
    const response = await authService.register(params)
    localStorage.setItem('token', response.token)
    setUser(response.user)
    setCurrentUser(response.user)
    window.location.href = '/dashboard'
  }, [setCurrentUser])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setCurrentUser(null)
    localStorage.removeItem('token')
    window.location.href = '/login'
  }, [setCurrentUser])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
