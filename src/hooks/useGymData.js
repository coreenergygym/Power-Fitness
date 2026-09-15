import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useTable(table, select = '*', options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) { setLoading(false); return }
    setLoading(true); setError(null)
    let q = supabase.from(table).select(select)
    if (options.order) q = q.order(options.order, { ascending: options.ascending ?? false })
    const { data: rows, error: e } = await q
    if (e) setError(e); else setData(rows || [])
    setLoading(false)
  }, [table, select, options.order, options.ascending])

  useEffect(() => { load() }, [load])
  return { data, loading, error, reload: load }
}

export function useGymSettings() {
  const { data, loading, error, reload } = useTable('gym_settings', '*', { order: 'created_at' })
  return { settings: data[0] || null, loading, error, reload }
}