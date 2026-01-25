/**
 * Network utilities for offline detection and connection status monitoring.
 */

type ConnectionStatus = 'online' | 'offline' | 'slow'
type NetworkListener = (status: ConnectionStatus) => void

class NetworkMonitor {
  private listeners: Set<NetworkListener> = new Set()
  private currentStatus: ConnectionStatus = 'online'
  private slowConnectionThreshold = 2000 // ms

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentStatus = navigator.onLine ? 'online' : 'offline'
      window.addEventListener('online', this.handleOnline)
      window.addEventListener('offline', this.handleOffline)
    }
  }

  private handleOnline = () => {
    this.updateStatus('online')
  }

  private handleOffline = () => {
    this.updateStatus('offline')
  }

  private updateStatus(status: ConnectionStatus) {
    if (this.currentStatus !== status) {
      this.currentStatus = status
      this.notifyListeners()
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentStatus))
  }

  /**
   * Check if the browser is currently online.
   */
  isOnline(): boolean {
    if (typeof window === 'undefined') return true
    return navigator.onLine
  }

  /**
   * Check if the browser is currently offline.
   */
  isOffline(): boolean {
    return !this.isOnline()
  }

  /**
   * Get the current connection status.
   */
  getStatus(): ConnectionStatus {
    return this.currentStatus
  }

  /**
   * Subscribe to connection status changes.
   */
  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Test connection speed by measuring a simple fetch.
   * Returns true if connection is slow (above threshold).
   */
  async isConnectionSlow(): Promise<boolean> {
    if (this.isOffline()) return true

    try {
      const start = performance.now()
      // Use a small, fast resource to test
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' })
      const duration = performance.now() - start

      if (duration > this.slowConnectionThreshold) {
        this.updateStatus('slow')
        return true
      }
      return false
    } catch {
      return true
    }
  }

  /**
   * Clean up event listeners.
   */
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline)
      window.removeEventListener('offline', this.handleOffline)
    }
    this.listeners.clear()
  }
}

// Singleton instance
export const networkMonitor = new NetworkMonitor()

/**
 * Check if the browser is currently online.
 */
export function isOnline(): boolean {
  return networkMonitor.isOnline()
}

/**
 * Check if the browser is currently offline.
 */
export function isOffline(): boolean {
  return networkMonitor.isOffline()
}

/**
 * Subscribe to network status changes.
 */
export function onNetworkChange(listener: NetworkListener): () => void {
  return networkMonitor.subscribe(listener)
}
