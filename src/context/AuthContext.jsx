import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // null = logged out

  function login(userData) {
    setUser({
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
  }

  function logout() {
    setUser(null)
  }

  function updateUser(updates) {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
