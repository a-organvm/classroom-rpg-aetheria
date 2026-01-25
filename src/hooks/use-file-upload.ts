/**
 * File Upload Hook
 *
 * Provides file upload functionality with progress tracking.
 * Works with both Firebase Storage and local fallback.
 */

import { useState, useCallback } from 'react'
import { useFirebase } from '@/contexts'
import {
  uploadFile,
  deleteFile,
  getStoragePath,
  validateFile,
  type UploadProgress,
  type UploadResult
} from '@/lib/firebase/storage'

export type UploadState = 'idle' | 'validating' | 'uploading' | 'success' | 'error'

interface UseFileUploadOptions {
  onSuccess?: (result: UploadResult) => void
  onError?: (error: Error) => void
  onProgress?: (progress: UploadProgress) => void
}

interface UseFileUploadReturn {
  upload: (
    file: File,
    type: 'syllabi' | 'assignments' | 'rubrics' | 'samples',
    entityId: string
  ) => Promise<UploadResult | null>
  remove: (storagePath: string) => Promise<boolean>
  progress: UploadProgress | null
  state: UploadState
  error: Error | null
  reset: () => void
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { isConfigured, userId } = useFirebase()
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setProgress(null)
    setState('idle')
    setError(null)
  }, [])

  const upload = useCallback(async (
    file: File,
    type: 'syllabi' | 'assignments' | 'rubrics' | 'samples',
    entityId: string
  ): Promise<UploadResult | null> => {
    if (!isConfigured) {
      const err = new Error('Firebase Storage not configured')
      setError(err)
      setState('error')
      options.onError?.(err)
      return null
    }

    if (!userId) {
      const err = new Error('User not authenticated')
      setError(err)
      setState('error')
      options.onError?.(err)
      return null
    }

    // Validate file
    setState('validating')
    const validation = validateFile(file)
    if (!validation.valid) {
      const err = new Error(validation.error)
      setError(err)
      setState('error')
      options.onError?.(err)
      return null
    }

    // Get storage path
    const storagePath = getStoragePath(type, entityId, file.name, userId)

    // Upload file
    setState('uploading')
    try {
      const result = await uploadFile(file, storagePath, (prog) => {
        setProgress(prog)
        options.onProgress?.(prog)
      })

      setState('success')
      setError(null)
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const uploadError = err instanceof Error ? err : new Error('Upload failed')
      setError(uploadError)
      setState('error')
      options.onError?.(uploadError)
      return null
    }
  }, [isConfigured, userId, options])

  const remove = useCallback(async (storagePath: string): Promise<boolean> => {
    if (!isConfigured) {
      console.warn('Firebase Storage not configured')
      return false
    }

    try {
      await deleteFile(storagePath)
      return true
    } catch (err) {
      console.error('Failed to delete file:', err)
      return false
    }
  }, [isConfigured])

  return {
    upload,
    remove,
    progress,
    state,
    error,
    reset
  }
}
