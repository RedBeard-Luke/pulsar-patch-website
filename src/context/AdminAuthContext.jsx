/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isAdminEmail } from '../lib/supabase'

/**
 * Real admin auth via Supabase. Only the allow-listed emails count as admins,
 * and that's also enforced in the database (RLS), so it can't be faked from the
 * browser. When Supabase isn't configured, `configured` is false and the Admin
 * page falls back to the older demo gate.
 */
const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const email = session?.user?.email || null
  const isAdmin = Boolean(session) && isAdminEmail(email)

  const signIn = useCallback(async (e, password) => {
    if (!supabase) return { error: { message: 'Auth is not configured.' } }
    const { error } = await supabase.auth.signInWithPassword({ email: e.trim(), password })
    if (error) return { error }
    if (!isAdminEmail(e)) {
      await supabase.auth.signOut()
      return { error: { message: 'That account is not an admin.' } }
    }
    return { error: null }
  }, [])

  const signOut = useCallback(() => (supabase ? supabase.auth.signOut() : Promise.resolve()), [])

  return (
    <AdminAuthContext.Provider value={{ configured: Boolean(supabase), ready, isAdmin, email, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
