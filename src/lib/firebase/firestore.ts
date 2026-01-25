/**
 * Firestore CRUD helpers
 *
 * Provides typed utilities for common Firestore operations.
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore'
import { getFirestoreDb, getAppId } from './config'
import { getCurrentUserId } from './auth'

/**
 * Get the base path for user data
 */
export const getUserBasePath = (userId?: string): string => {
  const uid = userId || getCurrentUserId()
  if (!uid) {
    throw new Error('No user ID available')
  }
  return `artifacts/${getAppId()}/users/${uid}`
}

/**
 * Get a collection reference for a user's data
 */
export const getUserCollection = <T = DocumentData>(
  collectionName: string,
  userId?: string
): CollectionReference<T> | null => {
  const db = getFirestoreDb()
  if (!db) return null

  try {
    const basePath = getUserBasePath(userId)
    return collection(db, `${basePath}/${collectionName}`) as CollectionReference<T>
  } catch {
    return null
  }
}

/**
 * Get a document reference
 */
export const getUserDocument = <T = DocumentData>(
  collectionName: string,
  docId: string,
  userId?: string
): DocumentReference<T> | null => {
  const db = getFirestoreDb()
  if (!db) return null

  try {
    const basePath = getUserBasePath(userId)
    return doc(db, `${basePath}/${collectionName}`, docId) as DocumentReference<T>
  } catch {
    return null
  }
}

/**
 * Add a document to a collection
 */
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  userId?: string
): Promise<string | null> => {
  const collectionRef = getUserCollection(collectionName, userId)
  if (!collectionRef) return null

  try {
    const docRef = await addDoc(collectionRef, data as DocumentData)
    return docRef.id
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw error
  }
}

/**
 * Set a document with a specific ID
 */
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge = false,
  userId?: string
): Promise<void> => {
  const docRef = getUserDocument(collectionName, docId, userId)
  if (!docRef) return

  try {
    await setDoc(docRef, data as DocumentData, { merge })
  } catch (error) {
    console.error(`Error setting document ${docId} in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Get a single document
 */
export const getDocument = async <T>(
  collectionName: string,
  docId: string,
  userId?: string
): Promise<(T & { id: string }) | null> => {
  const docRef = getUserDocument(collectionName, docId, userId)
  if (!docRef) return null

  try {
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...snapshot.data() } as T & { id: string }
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Get all documents in a collection
 */
export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  userId?: string
): Promise<(T & { id: string })[]> => {
  const collectionRef = getUserCollection(collectionName, userId)
  if (!collectionRef) return []

  try {
    const q = constraints.length > 0
      ? query(collectionRef, ...constraints)
      : collectionRef
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }))
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Update a document
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
  userId?: string
): Promise<void> => {
  const docRef = getUserDocument(collectionName, docId, userId)
  if (!docRef) return

  try {
    await updateDoc(docRef, data as DocumentData)
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Delete a document
 */
export const removeDocument = async (
  collectionName: string,
  docId: string,
  userId?: string
): Promise<void> => {
  const docRef = getUserDocument(collectionName, docId, userId)
  if (!docRef) return

  try {
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Subscribe to a collection with real-time updates
 */
export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (docs: (T & { id: string })[]) => void,
  constraints: QueryConstraint[] = [],
  userId?: string
): Unsubscribe => {
  const collectionRef = getUserCollection(collectionName, userId)
  if (!collectionRef) {
    callback([])
    return () => {}
  }

  const q = constraints.length > 0
    ? query(collectionRef, ...constraints)
    : collectionRef

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }))
    callback(docs)
  }, (error) => {
    console.error(`Error subscribing to ${collectionName}:`, error)
    callback([])
  })
}

/**
 * Subscribe to a single document with real-time updates
 */
export const subscribeToDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (doc: (T & { id: string }) | null) => void,
  userId?: string
): Unsubscribe => {
  const docRef = getUserDocument(collectionName, docId, userId)
  if (!docRef) {
    callback(null)
    return () => {}
  }

  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }
    callback({ id: snapshot.id, ...snapshot.data() } as T & { id: string })
  }, (error) => {
    console.error(`Error subscribing to ${collectionName}/${docId}:`, error)
    callback(null)
  })
}

// Re-export query helpers for convenience
export { where, orderBy, limit } from 'firebase/firestore'
