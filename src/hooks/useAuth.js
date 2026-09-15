import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      setSession(data.session)
      if (error) setError(error)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [])

  const loginWithEmail = async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    setError(null)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError); throw authError }
    return data
  }

  const logout = async () => {
    if (!supabase) return
    const { error: authError } = await supabase.auth.signOut()
    if (authError) throw authError
  }

  const changePassword = async (password) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error: authError } = await supabase.auth.updateUser({ password })
    if (authError) throw authError
  }

  return { session, user: session?.user ?? null, loading, error, loginWithEmail, logout, changePassword }
}