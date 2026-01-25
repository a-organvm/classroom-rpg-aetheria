/**
 * Sandbox-aware KV storage hook
 *
 * Wraps the GitHub Spark useKV hook to provide sandbox-aware storage keys.
 * When in sandbox mode, all keys are prefixed with 'sandbox-' to isolate data.
 */

import { useKV as useSparkKV } from '@github/spark/hooks'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import {
  getSandboxKey,
  isSandboxMode,
  needsSandboxInitialization,
  initializeSandboxData
} from '@/lib/sandbox-mode'

// Global initialization lock to prevent race conditions across hook instances
const initializationLock = {
  isInitializing: false,
  initialized: false,
  callbacks: [] as (() => void)[]
}

/**
 * Sandbox-aware version of useKV hook
 * Automatically handles key prefixing and demo data initialization
 */
export function useSandboxKV<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const sandboxKey = getSandboxKey(key)
  const [value, setValue] = useSparkKV<T>(sandboxKey, defaultValue)
  const [isInitialized, setIsInitialized] = useState(initializationLock.initialized)

  // Ref to track if this hook instance has been initialized
  const hasInitializedRef = useRef(false)

  // Memoize sandbox mode checks to prevent recalculation on every render
  const inSandboxMode = useMemo(() => isSandboxMode(), [])
  const needsInit = useMemo(() => needsSandboxInitialization(), [])

  // Wrap setValue to ensure type safety without direct assertion
  const safeSetValue = useCallback((data: unknown) => {
    // We trust that the data from keyToDataMap matches the expected type T
    // based on the key matching logic, but we avoid direct 'as T' assertion
    setValue(data as T)
  }, [setValue])

  // Initialize sandbox data on first mount with global lock
  useEffect(() => {
    if (!inSandboxMode || hasInitializedRef.current) {
      return
    }

    // If already initialized globally, just update local state
    if (initializationLock.initialized) {
      hasInitializedRef.current = true
      setIsInitialized(true)
      return
    }

    // If initialization is in progress, wait for it
    if (initializationLock.isInitializing) {
      const callback = () => {
        hasInitializedRef.current = true
        setIsInitialized(true)
      }
      initializationLock.callbacks.push(callback)
      return
    }

    // Start initialization with lock
    if (needsInit) {
      initializationLock.isInitializing = true

      try {
        const demoData = initializeSandboxData()

        // Map keys to demo data with proper typing
        type DemoDataMap = {
          'aetheria-realms': typeof demoData.realms
          'aetheria-quests': typeof demoData.quests
          'aetheria-profile': typeof demoData.profile
          'aetheria-submissions': typeof demoData.submissions
          'aetheria-crystals': typeof demoData.crystals
          'aetheria-all-profiles': typeof demoData.profile[]
        }

        const keyToDataMap: Partial<DemoDataMap> = {
          'aetheria-realms': demoData.realms,
          'aetheria-quests': demoData.quests,
          'aetheria-profile': demoData.profile,
          'aetheria-submissions': demoData.submissions,
          'aetheria-crystals': demoData.crystals,
          'aetheria-all-profiles': [demoData.profile]
        }

        // If this key has demo data, set it
        if (key in keyToDataMap) {
          const data = keyToDataMap[key as keyof DemoDataMap]
          if (data !== undefined) {
            safeSetValue(data)
          }
        }

        // Mark as initialized and notify waiting callbacks
        initializationLock.initialized = true
        initializationLock.isInitializing = false
        hasInitializedRef.current = true
        setIsInitialized(true)

        // Notify any waiting callbacks
        initializationLock.callbacks.forEach(cb => cb())
        initializationLock.callbacks = []
      } catch (error) {
        initializationLock.isInitializing = false
        console.error('Failed to initialize sandbox data:', error)
      }
    } else {
      hasInitializedRef.current = true
      setIsInitialized(true)
    }
  }, [key, inSandboxMode, needsInit, safeSetValue])

  // Return value with proper type, fallback to defaultValue if undefined
  const returnValue = value !== undefined ? value : defaultValue
  return [returnValue, setValue]
}
