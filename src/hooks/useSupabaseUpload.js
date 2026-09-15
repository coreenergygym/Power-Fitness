import { useState } from 'react'
import { requireSupabase } from '@/lib/supabase'

export function useSupabaseUpload(bucket = 'member-photos') {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadFile = async (file, folder = '') => {
    if (!file) return null
    setIsUploading(true); setError(null)
    try {
      const sb = requireSupabase()
      const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'bin'
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80)
      const path = `${folder ? folder.replace(/\/+$/,'') + '/' : ''}${crypto.randomUUID()}-${safe}.${ext}`
      const { error: uploadError } = await sb.storage.from(bucket).upload(path, file, { upsert: false, cacheControl: '3600' })
      if (uploadError) throw uploadError
      const { data } = sb.storage.from(bucket).getPublicUrl(path)
      return { path, publicUrl: data.publicUrl }
    } catch (err) {
      setError(err); throw err
    } finally { setIsUploading(false) }
  }

  return { uploadFile, isUploading, error }
}