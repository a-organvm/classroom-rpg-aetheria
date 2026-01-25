/**
 * Firebase Storage utilities
 *
 * Handles file uploads, downloads, and deletion.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
  UploadTaskSnapshot
} from 'firebase/storage'
import { getFirebaseStorage, getAppId } from './config'
import { getCurrentUserId } from './auth'

export interface UploadProgress {
  progress: number // 0-100
  bytesTransferred: number
  totalBytes: number
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error'
}

export interface UploadResult {
  downloadUrl: string
  storagePath: string
  fileName: string
  size: number
}

// File size limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

/**
 * Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: PDF, images, text, Word documents`
    }
  }

  return { valid: true }
}

/**
 * Get storage path for different content types
 */
export const getStoragePath = (
  type: 'syllabi' | 'assignments' | 'rubrics' | 'samples',
  entityId: string,
  fileName: string,
  userId?: string
): string => {
  const uid = userId || getCurrentUserId()
  if (!uid) {
    throw new Error('No user ID available')
  }

  const appId = getAppId()
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')

  switch (type) {
    case 'syllabi':
      return `${appId}/${uid}/syllabi/${entityId}/${sanitizedFileName}_${timestamp}`
    case 'assignments':
      return `${appId}/${uid}/assignments/${entityId}/instructions/${sanitizedFileName}_${timestamp}`
    case 'rubrics':
      return `${appId}/${uid}/assignments/${entityId}/rubrics/${sanitizedFileName}_${timestamp}`
    case 'samples':
      return `${appId}/${uid}/samples/${entityId}/${sanitizedFileName}_${timestamp}`
    default:
      return `${appId}/${uid}/uploads/${sanitizedFileName}_${timestamp}`
  }
}

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  file: File,
  storagePath: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  const storage = getFirebaseStorage()
  if (!storage) {
    throw new Error('Firebase Storage not available')
  }

  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const storageRef = ref(storage, storagePath)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        const state = snapshot.state as UploadProgress['state']

        onProgress?.({
          progress,
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          state
        })
      },
      (error) => {
        console.error('Upload failed:', error)
        reject(error)
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({
            downloadUrl,
            storagePath,
            fileName: file.name,
            size: file.size
          })
        } catch (error) {
          console.error('Error getting download URL:', error)
          reject(error)
        }
      }
    )
  })
}

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (storagePath: string): Promise<void> => {
  const storage = getFirebaseStorage()
  if (!storage) {
    throw new Error('Firebase Storage not available')
  }

  try {
    const storageRef = ref(storage, storagePath)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

/**
 * Get download URL for a file
 */
export const getFileUrl = async (storagePath: string): Promise<string> => {
  const storage = getFirebaseStorage()
  if (!storage) {
    throw new Error('Firebase Storage not available')
  }

  try {
    const storageRef = ref(storage, storagePath)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Error getting file URL:', error)
    throw error
  }
}

/**
 * Extract storage path from download URL
 * Firebase download URLs contain the encoded path
 */
export const extractPathFromUrl = (downloadUrl: string): string | null => {
  try {
    const url = new URL(downloadUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)$/)
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch {
    return null
  }
}
