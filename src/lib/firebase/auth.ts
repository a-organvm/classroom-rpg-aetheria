/**
 * Firebase Authentication utilities
 *
 * Handles anonymous auth and custom token authentication.
 * Anonymous auth is used for sandbox/demo mode.
 */

import {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth'
import { getFirebaseAuth } from './config'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isAnonymous: boolean
  userId: string | null
  isLoading: boolean
  error: Error | null
}

/**
 * Sign in anonymously (for sandbox/demo mode)
 */
export const signInAnonymousUser = async (): Promise<User | null> => {
  const auth = getFirebaseAuth()
  if (!auth) {
    console.warn('Firebase Auth not available')
    return null
  }

  try {
    const result = await signInAnonymously(auth)
    return result.user
  } catch (error) {
    console.error('Anonymous sign-in failed:', error)
    throw error
  }
}

/**
 * Sign in with a custom token (for authenticated users)
 */
export const signInWithToken = async (token: string): Promise<User | null> => { // allow-secret (parameter)
  const auth = getFirebaseAuth()
  if (!auth) {
    console.warn('Firebase Auth not available')
    return null
  }

  try {
    const result = await signInWithCustomToken(auth, token)
    return result.user
  } catch (error) {
    console.error('Custom token sign-in failed:', error)
    throw error
  }
}

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  const auth = getFirebaseAuth()
  if (!auth) return

  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Sign out failed:', error)
    throw error
  }
}

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  const auth = getFirebaseAuth()
  if (!auth) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth()
  return auth?.currentUser ?? null
}

/**
 * Get the current user ID
 */
export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser()
  return user?.uid ?? null
}
