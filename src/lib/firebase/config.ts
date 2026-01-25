/**
 * Firebase configuration and initialization
 *
 * This module handles Firebase app initialization with environment-based configuration.
 * It supports both production Firebase and development/sandbox modes.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Firebase configuration from environment variables
// These should be set in .env files (not committed to git)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '', // allow-secret (env var fallback)
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  )
}

// Singleton instances
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

/**
 * Initialize Firebase app
 * Returns existing app if already initialized
 */
export const initializeFirebase = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Using Spark KV storage instead.')
    return null
  }

  if (app) return app

  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
    return app
  }

  try {
    app = initializeApp(firebaseConfig)
    return app
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
    return null
  }
}

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): Auth | null => {
  if (auth) return auth

  const firebaseApp = initializeFirebase()
  if (!firebaseApp) return null

  try {
    auth = getAuth(firebaseApp)
    return auth
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error)
    return null
  }
}

/**
 * Get Firestore instance
 */
export const getFirestoreDb = (): Firestore | null => {
  if (db) return db

  const firebaseApp = initializeFirebase()
  if (!firebaseApp) return null

  try {
    db = getFirestore(firebaseApp)
    return db
  } catch (error) {
    console.error('Failed to initialize Firestore:', error)
    return null
  }
}

/**
 * Get Firebase Storage instance
 */
export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (storage) return storage

  const firebaseApp = initializeFirebase()
  if (!firebaseApp) return null

  try {
    storage = getStorage(firebaseApp)
    return storage
  } catch (error) {
    console.error('Failed to initialize Firebase Storage:', error)
    return null
  }
}

/**
 * Get app ID for Firestore paths
 * Uses environment variable or falls back to a default
 */
export const getAppId = (): string => {
  return import.meta.env.VITE_FIREBASE_APP_ID || 'aetheria-dev'
}
