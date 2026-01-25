/**
 * Firebase Storage Adapter
 *
 * Implements StorageProvider interface using Firebase Firestore.
 * Handles mapping between Aetheria keys and Firestore collections.
 */

import type { StorageProvider } from './types'
import { getFirebaseCollectionForKey } from './types'
import {
  isFirebaseConfigured,
  getDocuments,
  setDocument,
  removeDocument,
  subscribeToCollection,
  subscribeToDocument,
  getCurrentUserId
} from '../firebase'

/**
 * Firebase Storage Provider
 */
export class FirebaseStorageProvider implements StorageProvider {
  private prefix: string
  private userId: string | null = null

  constructor(sandboxPrefix?: string, userId?: string) {
    this.prefix = sandboxPrefix || ''
    this.userId = userId || null
  }

  /**
   * Set user ID for Firestore operations
   */
  setUserId(userId: string): void {
    this.userId = userId
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}${key}` : key
  }

  private getUserId(): string | null {
    return this.userId || getCurrentUserId()
  }

  async get<T>(key: string): Promise<T | null> {
    if (!isFirebaseConfigured()) {
      return null
    }

    const userId = this.getUserId()
    if (!userId) {
      console.warn('No user ID for Firebase get operation')
      return null
    }

    const fullKey = this.getKey(key)
    const mapping = getFirebaseCollectionForKey(fullKey)

    if (!mapping) {
      console.warn(`No Firebase mapping for key: ${fullKey}`)
      return null
    }

    try {
      if (mapping.isList) {
        const docs = await getDocuments<T>(mapping.firebaseCollection, [], userId)
        return docs as unknown as T
      } else {
        // For single documents, use the key as doc ID
        const docs = await getDocuments<T>(mapping.firebaseCollection, [], userId)
        return docs[0] || null
      }
    } catch (error) {
      console.error(`Firebase get error for ${fullKey}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!isFirebaseConfigured()) {
      return
    }

    const userId = this.getUserId()
    if (!userId) {
      console.warn('No user ID for Firebase set operation')
      return
    }

    const fullKey = this.getKey(key)
    const mapping = getFirebaseCollectionForKey(fullKey)

    if (!mapping) {
      console.warn(`No Firebase mapping for key: ${fullKey}`)
      return
    }

    try {
      if (mapping.isList && Array.isArray(value)) {
        // For lists, we'd need to sync all items
        // This is complex - for now, just store as a single document
        await setDocument(
          mapping.firebaseCollection,
          'data',
          { items: value, updatedAt: Date.now() },
          true,
          userId
        )
      } else {
        // For single documents
        await setDocument(
          mapping.firebaseCollection,
          'data',
          { ...(value as object), updatedAt: Date.now() },
          true,
          userId
        )
      }
    } catch (error) {
      console.error(`Firebase set error for ${fullKey}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      return
    }

    const userId = this.getUserId()
    if (!userId) {
      console.warn('No user ID for Firebase delete operation')
      return
    }

    const fullKey = this.getKey(key)
    const mapping = getFirebaseCollectionForKey(fullKey)

    if (!mapping) {
      console.warn(`No Firebase mapping for key: ${fullKey}`)
      return
    }

    try {
      await removeDocument(mapping.firebaseCollection, 'data', userId)
    } catch (error) {
      console.error(`Firebase delete error for ${fullKey}:`, error)
      throw error
    }
  }

  subscribe<T>(key: string, callback: (value: T | null) => void): () => void {
    if (!isFirebaseConfigured()) {
      callback(null)
      return () => {}
    }

    const userId = this.getUserId()
    if (!userId) {
      console.warn('No user ID for Firebase subscribe operation')
      callback(null)
      return () => {}
    }

    const fullKey = this.getKey(key)
    const mapping = getFirebaseCollectionForKey(fullKey)

    if (!mapping) {
      console.warn(`No Firebase mapping for key: ${fullKey}`)
      callback(null)
      return () => {}
    }

    if (mapping.isList) {
      return subscribeToCollection<{ items: T }>(
        mapping.firebaseCollection,
        (docs) => {
          // Return the items array from the first document
          const doc = docs[0]
          callback(doc ? (doc as unknown as { items: T }).items : null)
        },
        [],
        userId
      )
    } else {
      return subscribeToDocument<T>(
        mapping.firebaseCollection,
        'data',
        callback,
        userId
      )
    }
  }

  isAvailable(): boolean {
    return isFirebaseConfigured() && !!this.getUserId()
  }

  getName(): string {
    return 'firebase'
  }
}
