/**
 * Storage Provider Interface
 *
 * Abstract interface that supports both GitHub Spark KV and Firebase Firestore.
 * This enables gradual migration and dual-write capabilities.
 */

export interface StorageProvider {
  /**
   * Get a value by key
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set a value by key
   */
  set<T>(key: string, value: T): Promise<void>

  /**
   * Delete a value by key
   */
  delete(key: string): Promise<void>

  /**
   * Subscribe to changes for a key
   */
  subscribe<T>(key: string, callback: (value: T | null) => void): () => void

  /**
   * Check if the provider is available/connected
   */
  isAvailable(): boolean

  /**
   * Get provider name for debugging
   */
  getName(): string
}

export interface StorageConfig {
  /**
   * Primary storage provider to use
   */
  provider: 'spark' | 'firebase' | 'auto'

  /**
   * Enable dual-write mode (write to both providers)
   */
  dualWrite?: boolean

  /**
   * Sandbox mode prefix
   */
  sandboxPrefix?: string
}

export type StorageProviderFactory = (config?: StorageConfig) => StorageProvider

/**
 * Storage key mapping for migration
 * Maps Aetheria keys to Firebase collection/document paths
 */
export interface StorageKeyMapping {
  aetheraKey: string
  firebaseCollection: string
  isList: boolean
}

export const STORAGE_KEY_MAPPINGS: StorageKeyMapping[] = [
  { aetheraKey: 'aetheria-realms', firebaseCollection: 'realms', isList: true },
  { aetheraKey: 'aetheria-quests', firebaseCollection: 'quests', isList: true },
  { aetheraKey: 'aetheria-submissions', firebaseCollection: 'submissions', isList: true },
  { aetheraKey: 'aetheria-crystals', firebaseCollection: 'crystals', isList: true },
  { aetheraKey: 'aetheria-profile', firebaseCollection: 'profile', isList: false },
  { aetheraKey: 'aetheria-all-profiles', firebaseCollection: 'profiles', isList: true },
  { aetheraKey: 'aetheria-rubrics', firebaseCollection: 'rubrics', isList: true },
  { aetheraKey: 'aetheria-feedback-snippets', firebaseCollection: 'feedbackSnippets', isList: true },
  { aetheraKey: 'aetheria-syllabi', firebaseCollection: 'syllabi', isList: true },
  { aetheraKey: 'aetheria-student-samples', firebaseCollection: 'studentSamples', isList: true }
]

/**
 * Get the Firebase collection name for an Aetheria key
 */
export const getFirebaseCollectionForKey = (key: string): StorageKeyMapping | undefined => {
  // Strip sandbox prefix if present
  const normalizedKey = key.replace(/^sandbox-/, '')
  return STORAGE_KEY_MAPPINGS.find(m => m.aetheraKey === normalizedKey)
}
