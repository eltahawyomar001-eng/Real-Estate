'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'
import { User } from '@/lib/types'
import { mockUsers, generateMockToken } from '@/lib/mockData'

// Check if we're in demo mode (no backend available)
const isDemoMode = () => {
  // In production without a backend, use demo mode
  if (typeof window !== 'undefined') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    return !apiUrl || apiUrl.includes('localhost')
  }
  return true
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'user' | 'agent'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      // Check if it's a mock token
      if (token.startsWith('mock_token_')) {
        const userId = token.split('_')[2]
        const mockUser = mockUsers.find(u => u._id === userId)
        if (mockUser) {
          const { password, ...userWithoutPassword } = mockUser
          setUser(userWithoutPassword as User)
        }
        setLoading(false)
        return
      }
      
      try {
        const response = await api.get('/auth/me')
        setUser(response.data.data)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    // Try mock login first (for demo mode)
    const mockUser = mockUsers.find(u => u.email === email && u.password === password)
    if (mockUser) {
      const token = generateMockToken(mockUser._id)
      localStorage.setItem('token', token)
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword as User)
      return
    }

    // Try real API
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, data } = response.data
      localStorage.setItem('token', token)
      setUser(data)
    } catch (error: any) {
      // If API fails and credentials don't match mock data, throw error
      throw new Error('Invalid email or password')
    }
  }

  const register = async (data: RegisterData) => {
    // In demo mode, create a mock user
    if (isDemoMode()) {
      const newUser: User = {
        _id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'user',
        isVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const token = generateMockToken(newUser._id)
      localStorage.setItem('token', token)
      setUser(newUser)
      return
    }

    const response = await api.post('/auth/register', data)
    const { token, data: userData } = response.data
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser }}>
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
