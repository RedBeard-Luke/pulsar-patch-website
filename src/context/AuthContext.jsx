/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()
const STORAGE_KEY = 'pulsar-user-v1'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser) // null = logged out

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable */
    }
  }, [user])

  const login = useCallback((userData) => {
    setUser({
      accountType: 'personal', // 'personal' | 'business'
      name: userData.name || 'Pulsar User',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '',
      avatar: null,
      addresses: [],
      orders: [],
      subscription: null,
      referralCode: 'PULSAR' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      smsOptIn: true,
      emailOptIn: true,
      ...userData,
    })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
