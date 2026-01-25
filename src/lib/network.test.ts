import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isOnline, isOffline, onNetworkChange, networkMonitor } from './network'

describe('network utilities', () => {
  let originalNavigator: Navigator

  beforeEach(() => {
    originalNavigator = window.navigator
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('isOnline', () => {
    it('should return true when navigator.onLine is true', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: true,
        configurable: true
      })
      expect(isOnline()).toBe(true)
    })

    it('should return false when navigator.onLine is false', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        configurable: true
      })
      expect(isOffline()).toBe(true)
    })
  })

  describe('isOffline', () => {
    it('should be opposite of isOnline', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: true,
        configurable: true
      })
      expect(isOffline()).toBe(!isOnline())
    })
  })

  describe('onNetworkChange', () => {
    it('should return an unsubscribe function', () => {
      const listener = vi.fn()
      const unsubscribe = onNetworkChange(listener)
      expect(typeof unsubscribe).toBe('function')
      unsubscribe()
    })

    it('should allow subscribing to network changes', () => {
      const listener = vi.fn()
      const unsubscribe = onNetworkChange(listener)

      // Clean up
      unsubscribe()
    })
  })

  describe('networkMonitor', () => {
    it('should have getStatus method', () => {
      expect(typeof networkMonitor.getStatus).toBe('function')
    })

    it('should have isOnline method', () => {
      expect(typeof networkMonitor.isOnline).toBe('function')
    })

    it('should have isOffline method', () => {
      expect(typeof networkMonitor.isOffline).toBe('function')
    })

    it('should have subscribe method', () => {
      expect(typeof networkMonitor.subscribe).toBe('function')
    })
  })
})
