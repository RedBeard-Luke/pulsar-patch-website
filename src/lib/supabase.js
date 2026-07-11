// Build marker: forces a fresh Vercel build so env keys are re-read (v1).
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client — real backend for admin auth + the reviews database.
 *
 * The URL and the ANON key are safe to expose in the client bundle (like the
 * Shopify Storefront token): the anon key can only do what Row Level Security
 * policies allow. The service_role key must NEVER be used here — it bypasses
 * RLS and belongs only on a server.
 *
 * Set these in Vercel (and a local .env for dev):
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJ...
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => Boolean(url && anonKey)

// Only these accounts are treated as admins. Real enforcement also lives in the
// database (RLS policies); this list gates the UI and must match the policies.
export const ADMIN_EMAILS = ['lclark0684@gmail.com', 'pulsarpatch@gmail.com']

export const isAdminEmail = (email) =>
  ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase())

// A single shared client. When env vars are absent (local without config), this
// is null and callers fall back to the existing demo behavior.
export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
