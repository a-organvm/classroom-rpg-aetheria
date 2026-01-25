/**
 * Firebase utilities barrel export
 */

// Config and initialization
export {
  initializeFirebase,
  isFirebaseConfigured,
  getFirebaseAuth,
  getFirestoreDb,
  getFirebaseStorage,
  getAppId
} from './config'

// Authentication
export {
  signInAnonymousUser,
  signInWithToken,
  signOut,
  subscribeToAuthState,
  getCurrentUser,
  getCurrentUserId,
  type AuthState
} from './auth'

// Firestore CRUD
export {
  getUserBasePath,
  getUserCollection,
  getUserDocument,
  addDocument,
  setDocument,
  getDocument,
  getDocuments,
  updateDocument,
  removeDocument,
  subscribeToCollection,
  subscribeToDocument,
  where,
  orderBy,
  limit
} from './firestore'

// Storage
export {
  validateFile,
  getStoragePath,
  uploadFile,
  deleteFile,
  getFileUrl,
  extractPathFromUrl,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  type UploadProgress,
  type UploadResult
} from './storage'
