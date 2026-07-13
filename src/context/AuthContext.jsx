/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import * as shopifyCustomer from '../lib/shopifyCustomer'

const AuthContext = createContext()
const USER_KEY = 'pulsar-user-v1'         // demo/local user (Shopify off)
const TOKEN_KEY = 'pulsar-customer-v1'    // real Shopify customer token

const shopifyEnabled = shopifyCustomer.isConfigured()

/* ── persistence helpers ── */
function loadDemoUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const t = JSON.parse(raw)
    if (!t?.token) return null
    if (t.expiresAt && new Date(t.expiresAt).getTime() <= Date.now()) return null
    return t
  } catch {
    return null
  }
}

function saveToken(t) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, JSON.stringify(t))
    else localStorage.removeItem(TOKEN_KEY)
  } catch { /* storage unavailable */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(shopifyEnabled ? null : loadDemoUser)
  // While Shopify is on, we verify the saved token before showing the dashboard.
  const [authLoading, setAuthLoading] = useState(shopifyEnabled)
  const tokenRef = useRef(loadToken())

  /* On load with Shopify enabled: validate the saved token and pull the customer. */
  useEffect(() => {
    if (!shopifyEnabled) return
    let cancelled = false
    const t = tokenRef.current
    if (!t) { setAuthLoading(false); return }
    shopifyCustomer.fetchCustomer(t.token)
      .then(mapped => {
        if (cancelled) return
        if (mapped) setUser(mapped)
        else { tokenRef.current = null; saveToken(null) }
      })
      .catch(() => { if (!cancelled) { tokenRef.current = null; saveToken(null) } })
      .finally(() => { if (!cancelled) setAuthLoading(false) })
    return () => { cancelled = true }
  }, [])

  /* Persist the demo user (only used when Shopify is off). */
  useEffect(() => {
    if (shopifyEnabled) return
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
      else localStorage.removeItem(USER_KEY)
    } catch { /* storage unavailable */ }
  }, [user])

  /* ── DEMO auth (Shopify off) ── */
  const login = useCallback((userData) => {
    setUser({
      accountType: 'personal',
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

  /* ── REAL auth (Shopify on) ── */
  const setSession = useCallback((session, mapped) => {
    tokenRef.current = session
    saveToken(session)
    setUser(mapped)
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      const session = await shopifyCustomer.signIn(email, password)
      const mapped = await shopifyCustomer.fetchCustomer(session.token)
      setSession(session, mapped)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not sign in.' }
    }
  }, [setSession])

  const signUp = useCallback(async (fields) => {
    try {
      const { session, needsVerification } = await shopifyCustomer.signUp(fields)
      if (needsVerification || !session) return { ok: true, needsVerification: true }
      const mapped = await shopifyCustomer.fetchCustomer(session.token)
      setSession(session, mapped)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not create your account.' }
    }
  }, [setSession])

  const recover = useCallback(async (email) => {
    try {
      await shopifyCustomer.recover(email)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not send the reset email.' }
    }
  }, [])

  const logout = useCallback(() => {
    const t = tokenRef.current
    if (shopifyEnabled && t) shopifyCustomer.signOut(t.token)
    tokenRef.current = null
    saveToken(null)
    setUser(null)
  }, [])

  /* Local-only patch (prefs, subscription toggles — not Shopify-backed). */
  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  /* Profile save — persists to Shopify when enabled, else local. */
  const saveProfile = useCallback(async (fields) => {
    if (!shopifyEnabled || !tokenRef.current) {
      setUser(prev => prev ? { ...prev, ...fields } : null)
      return { ok: true }
    }
    try {
      const mapped = await shopifyCustomer.updateProfile(tokenRef.current.token, fields)
      if (mapped) setUser(mapped)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not save your profile.' }
    }
  }, [])

  const addAddress = useCallback(async (addr, makeDefault) => {
    if (!shopifyEnabled || !tokenRef.current) {
      setUser(prev => {
        if (!prev) return prev
        const id = Date.now()
        const list = prev.addresses || []
        return { ...prev, addresses: [...list, { ...addr, id, isDefault: makeDefault || list.length === 0 }] }
      })
      return { ok: true }
    }
    try {
      const mapped = await shopifyCustomer.addAddress(tokenRef.current.token, addr, makeDefault)
      if (mapped) setUser(mapped)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not add the address.' }
    }
  }, [])

  const changePassword = useCallback(async (newPassword) => {
    if (!shopifyEnabled || !tokenRef.current) return { ok: true } // demo: no-op success
    try {
      const session = await shopifyCustomer.changePassword(tokenRef.current.token, newPassword)
      if (session) { tokenRef.current = session; saveToken(session) }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not update your password.' }
    }
  }, [])

  const removeAddress = useCallback(async (id) => {
    if (!shopifyEnabled || !tokenRef.current) {
      setUser(prev => prev ? { ...prev, addresses: (prev.addresses || []).filter(a => a.id !== id) } : prev)
      return { ok: true }
    }
    try {
      const mapped = await shopifyCustomer.removeAddress(tokenRef.current.token, id)
      if (mapped) setUser(mapped)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Could not remove the address.' }
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      authLoading,
      shopifyEnabled,
      login,          // demo
      signIn,         // real
      signUp,         // real
      recover,        // real
      logout,
      updateUser,
      saveProfile,
      addAddress,
      removeAddress,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
