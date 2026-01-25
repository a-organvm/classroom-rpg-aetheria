/**
 * Firebase Context Provider
 *
 * Provides Firebase services (auth, firestore, storage) throughout the app.
 * Handles anonymous auth for sandbox mode and manages auth state.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode
} from 'react'
import {
  initializeFirebase,
  isFirebaseConfigured,
  signInAnonymousUser,
  subscribeToAuthState,
  signOut,
  getFirestoreDb,
  getFirebaseStorage
} from '@/lib/firebase'
import { setStorageUserId } from '@/lib/storage'
import { isSandboxMode } from '@/lib/sandbox-mode'
import type { User } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

interface FirebaseContextValue {
  // Auth state
  user: User | null
  userId: string | null
  isAuthenticated: boolean
  isAnonymous: boolean
  isAuthReady: boolean
  isLoading: boolean
  error: Error | null

  // Services
  db: Firestore | null
  storage: FirebaseStorage | null

  // Actions
  signOutUser: () => Promise<void>

  // Configuration
  isConfigured: boolean
  isSandbox: boolean
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null)

interface FirebaseProviderProps {
  children: ReactNode
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isConfigured = useMemo(() => isFirebaseConfigured(), [])
  const isSandbox = useMemo(() => isSandboxMode(), [])

  // Initialize Firebase on mount
  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false)
      setIsAuthReady(true)
      return
    }

    initializeFirebase()
  }, [isConfigured])

  // Subscribe to auth state changes
  useEffect(() => {
    if (!isConfigured) {
      return
    }

    const unsubscribe = subscribeToAuthState((authUser) => {
      setUser(authUser)
      setIsAuthReady(true)
      setIsLoading(false)

      // Update storage provider with user ID
      if (authUser) {
        setStorageUserId(authUser.uid)
      }
    })

    return () => unsubscribe()
  }, [isConfigured])

  // Auto sign-in anonymously in sandbox mode
  useEffect(() => {
    if (!isConfigured || !isAuthReady || user) {
      return
    }

    // Only auto sign-in for sandbox mode
    if (isSandbox) {
      setIsLoading(true)
      signInAnonymousUser()
        .then((authUser) => {
          if (authUser) {
            console.log('Signed in anonymously for sandbox mode')
          }
        })
        .catch((err) => {
          console.error('Anonymous sign-in failed:', err)
          setError(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isConfigured, isAuthReady, user, isSandbox])

  const signOutUser = useCallback(async () => {
    try {
      await signOut()
      setUser(null)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const db = useMemo(() => {
    if (!isConfigured) return null
    return getFirestoreDb()
  }, [isConfigured])

  const storage = useMemo(() => {
    if (!isConfigured) return null
    return getFirebaseStorage()
  }, [isConfigured])

  const value = useMemo<FirebaseContextValue>(
    () => ({
      user,
      userId: user?.uid ?? null,
      isAuthenticated: !!user,
      isAnonymous: user?.isAnonymous ?? false,
      isAuthReady,
      isLoading,
      error,
      db,
      storage,
      signOutUser,
      isConfigured,
      isSandbox
    }),
    [user, isAuthReady, isLoading, error, db, storage, signOutUser, isConfigured, isSandbox]
  )

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

/**
 * Hook to access Firebase context
 */
export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

/**
 * Hook to check if Firebase is ready for use
 */
export function useFirebaseReady(): boolean {
  const { isConfigured, isAuthReady, isLoading } = useFirebase()

  // If not configured, we're "ready" (will use fallback)
  if (!isConfigured) return true

  return isAuthReady && !isLoading
}
