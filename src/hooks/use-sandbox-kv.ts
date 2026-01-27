/**
 * Sandbox-aware KV storage hook
 *
 * Wraps the GitHub Spark useKV hook to provide sandbox-aware storage keys.
 * When in sandbox mode, all keys are prefixed with 'sandbox-' to isolate data.
 *
 * In dev mode with sandbox enabled, uses localStorage fallback since the
 * GitHub Spark KV backend requires authentication not available locally.
 *
 * NOTE: Sandbox demo data initialization happens at app startup in main.tsx
 * via initializeLocalStorageSandboxData() - this hook just reads/writes.
 */

import { useKV as useSparkKV } from '@github/spark/hooks'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { getSandboxKey, isSandboxMode } from '@/lib/sandbox-mode'

/**
 * localStorage-based KV hook for dev environment fallback
 * Provides the same interface as useSparkKV but uses localStorage
 */
function useLocalStorageKV<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValueState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback((newValue: T) => {
    setValueState(newValue)
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [key])

  // Sync across tabs via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValueState(JSON.parse(e.newValue))
        } catch {
          // Ignore parse errors
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [value, setValue]
}

/**
 * Sandbox-aware version of useKV hook
 * Automatically handles key prefixing for data isolation.
 *
 * In dev mode with sandbox enabled, uses localStorage fallback since
 * the Spark KV backend requires GitHub authentication.
 *
 * Demo data initialization happens at app startup (see main.tsx).
 */
export function useSandboxKV<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const sandboxKey = getSandboxKey(key)

  // Check once if we should use localStorage fallback (dev + sandbox mode)
  const useLocalFallback = useMemo(() =>
    import.meta.env.DEV && isSandboxMode(), [])

  // ALWAYS call both hooks to satisfy React's rules of hooks
  // (hooks must be called in the same order on every render)
  const [sparkValue, sparkSetValue] = useSparkKV<T>(sandboxKey, defaultValue)
  const [localValue, localSetValue] = useLocalStorageKV<T>(sandboxKey, defaultValue)

  // Select which storage backend to use based on environment
  const value = useLocalFallback ? localValue : sparkValue
  const setValue = useLocalFallback ? localSetValue : sparkSetValue

  // Return value with proper type, fallback to defaultValue if undefined
  const returnValue = value !== undefined ? value : defaultValue
  return [returnValue, setValue]
}
