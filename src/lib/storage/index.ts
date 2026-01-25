/**
 * Storage Abstraction Layer
 *
 * Factory for creating storage providers based on configuration.
 * Supports Spark KV, Firebase, and dual-write modes.
 */

import type { StorageProvider, StorageConfig } from './types'
import { SparkStorageProvider, updateSparkCache, getFromSparkCache } from './spark-adapter'
import { FirebaseStorageProvider } from './firebase-adapter'
import { isFirebaseConfigured } from '../firebase'
import { isSandboxMode, getSandboxKey } from '../sandbox-mode'

// Singleton instances
let sparkProvider: SparkStorageProvider | null = null
let firebaseProvider: FirebaseStorageProvider | null = null

/**
 * Get or create Spark storage provider
 */
const getSparkProvider = (): SparkStorageProvider => {
  if (!sparkProvider) {
    const prefix = isSandboxMode() ? 'sandbox-' : ''
    sparkProvider = new SparkStorageProvider(prefix)
  }
  return sparkProvider
}

/**
 * Get or create Firebase storage provider
 */
const getFirebaseProvider = (): FirebaseStorageProvider => {
  if (!firebaseProvider) {
    const prefix = isSandboxMode() ? 'sandbox-' : ''
    firebaseProvider = new FirebaseStorageProvider(prefix)
  }
  return firebaseProvider
}

/**
 * Dual-write storage provider
 * Writes to both Spark and Firebase, reads from primary
 */
class DualWriteStorageProvider implements StorageProvider {
  private primary: StorageProvider
  private secondary: StorageProvider

  constructor(primary: StorageProvider, secondary: StorageProvider) {
    this.primary = primary
    this.secondary = secondary
  }

  async get<T>(key: string): Promise<T | null> {
    // Always read from primary
    return this.primary.get<T>(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    // Write to both
    await Promise.all([
      this.primary.set(key, value),
      this.secondary.set(key, value).catch(err => {
        console.warn('Secondary storage write failed:', err)
      })
    ])
  }

  async delete(key: string): Promise<void> {
    await Promise.all([
      this.primary.delete(key),
      this.secondary.delete(key).catch(err => {
        console.warn('Secondary storage delete failed:', err)
      })
    ])
  }

  subscribe<T>(key: string, callback: (value: T | null) => void): () => void {
    // Subscribe to primary only
    return this.primary.subscribe(key, callback)
  }

  isAvailable(): boolean {
    return this.primary.isAvailable()
  }

  getName(): string {
    return `dual-write(${this.primary.getName()}+${this.secondary.getName()})`
  }
}

/**
 * Create a storage provider based on configuration
 */
export const createStorageProvider = (config?: StorageConfig): StorageProvider => {
  const providerType = config?.provider || 'auto'

  // Auto-detect best provider
  if (providerType === 'auto') {
    if (isFirebaseConfigured()) {
      // Use dual-write during migration
      if (config?.dualWrite !== false) {
        return new DualWriteStorageProvider(
          getSparkProvider(),
          getFirebaseProvider()
        )
      }
      return getFirebaseProvider()
    }
    return getSparkProvider()
  }

  if (providerType === 'firebase') {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured, falling back to Spark KV')
      return getSparkProvider()
    }
    return getFirebaseProvider()
  }

  return getSparkProvider()
}

/**
 * Get the default storage provider
 */
export const getStorageProvider = (): StorageProvider => {
  return createStorageProvider({ provider: 'auto', dualWrite: true })
}

/**
 * Set Firebase user ID for the provider
 */
export const setStorageUserId = (userId: string): void => {
  const provider = getFirebaseProvider()
  provider.setUserId(userId)
}

// Re-export types and utilities
export type { StorageProvider, StorageConfig, StorageKeyMapping } from './types'
export { STORAGE_KEY_MAPPINGS, getFirebaseCollectionForKey } from './types'
export { updateSparkCache, getFromSparkCache } from './spark-adapter'
