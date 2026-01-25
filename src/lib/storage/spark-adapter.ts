/**
 * Spark KV Storage Adapter
 *
 * Implements StorageProvider interface using GitHub Spark's useKV.
 * This is the existing storage mechanism and serves as the fallback.
 */

import type { StorageProvider } from './types'

/**
 * In-memory cache for Spark KV values
 * Since useKV is a hook, we use a cache for non-hook access
 */
const sparkCache = new Map<string, unknown>()
const sparkListeners = new Map<string, Set<(value: unknown) => void>>()

/**
 * Spark KV Storage Provider
 *
 * Note: This adapter has limitations because Spark KV is designed
 * as a React hook. For full functionality, use useSandboxKV hook directly.
 * This adapter is primarily for the storage abstraction layer.
 */
export class SparkStorageProvider implements StorageProvider {
  private prefix: string

  constructor(sandboxPrefix?: string) {
    this.prefix = sandboxPrefix || ''
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}${key}` : key
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key)
    const cached = sparkCache.get(fullKey)
    return (cached as T) ?? null
  }

  async set<T>(key: string, value: T): Promise<void> {
    const fullKey = this.getKey(key)
    sparkCache.set(fullKey, value)

    // Notify listeners
    const listeners = sparkListeners.get(fullKey)
    if (listeners) {
      listeners.forEach(callback => callback(value))
    }
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key)
    sparkCache.delete(fullKey)

    // Notify listeners
    const listeners = sparkListeners.get(fullKey)
    if (listeners) {
      listeners.forEach(callback => callback(null))
    }
  }

  subscribe<T>(key: string, callback: (value: T | null) => void): () => void {
    const fullKey = this.getKey(key)

    if (!sparkListeners.has(fullKey)) {
      sparkListeners.set(fullKey, new Set())
    }

    const listeners = sparkListeners.get(fullKey)!
    const wrappedCallback = (value: unknown) => callback(value as T | null)
    listeners.add(wrappedCallback)

    // Emit current value
    const current = sparkCache.get(fullKey)
    if (current !== undefined) {
      callback(current as T)
    }

    return () => {
      listeners.delete(wrappedCallback)
      if (listeners.size === 0) {
        sparkListeners.delete(fullKey)
      }
    }
  }

  isAvailable(): boolean {
    // Spark KV is always available (it's the default)
    return true
  }

  getName(): string {
    return 'spark-kv'
  }
}

/**
 * Update the Spark cache from a hook
 * This is called by useSandboxKV to keep the cache in sync
 */
export const updateSparkCache = <T>(key: string, value: T): void => {
  sparkCache.set(key, value)

  const listeners = sparkListeners.get(key)
  if (listeners) {
    listeners.forEach(callback => callback(value))
  }
}

/**
 * Get value from Spark cache
 */
export const getFromSparkCache = <T>(key: string): T | undefined => {
  return sparkCache.get(key) as T | undefined
}
