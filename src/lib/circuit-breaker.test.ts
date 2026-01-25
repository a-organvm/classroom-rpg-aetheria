import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CircuitBreaker, CircuitOpenError } from './circuit-breaker'

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 1000,
      successThreshold: 2
    })
  })

  describe('initial state', () => {
    it('should start in closed state', () => {
      expect(circuitBreaker.isClosed()).toBe(true)
      expect(circuitBreaker.isOpen()).toBe(false)
      expect(circuitBreaker.isHalfOpen()).toBe(false)
    })

    it('should have zero failures initially', () => {
      const stats = circuitBreaker.getStats()
      expect(stats.failures).toBe(0)
      expect(stats.successes).toBe(0)
    })
  })

  describe('successful calls', () => {
    it('should execute successful functions', async () => {
      const result = await circuitBreaker.execute(() => Promise.resolve('success'))
      expect(result).toBe('success')
    })

    it('should track total requests', async () => {
      await circuitBreaker.execute(() => Promise.resolve('success'))
      await circuitBreaker.execute(() => Promise.resolve('success'))

      const stats = circuitBreaker.getStats()
      expect(stats.totalRequests).toBe(2)
      expect(stats.totalSuccesses).toBe(2)
    })

    it('should reset failure count after success', async () => {
      // Cause some failures (but not enough to open)
      try {
        await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
      } catch {}
      try {
        await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
      } catch {}

      // Success should reset failures
      await circuitBreaker.execute(() => Promise.resolve('success'))

      const stats = circuitBreaker.getStats()
      expect(stats.failures).toBe(0)
    })
  })

  describe('failed calls', () => {
    it('should re-throw errors from failed functions', async () => {
      const error = new Error('test error')
      await expect(circuitBreaker.execute(() => Promise.reject(error))).rejects.toThrow('test error')
    })

    it('should track failures', async () => {
      try {
        await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
      } catch {}

      const stats = circuitBreaker.getStats()
      expect(stats.failures).toBe(1)
      expect(stats.totalFailures).toBe(1)
    })

    it('should open circuit after threshold failures', async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
        } catch {}
      }

      expect(circuitBreaker.isOpen()).toBe(true)
    })
  })

  describe('open state', () => {
    beforeEach(async () => {
      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
        } catch {}
      }
    })

    it('should reject calls immediately when open', async () => {
      await expect(circuitBreaker.execute(() => Promise.resolve('success'))).rejects.toThrow(CircuitOpenError)
    })

    it('should include appropriate error message', async () => {
      await expect(circuitBreaker.execute(() => Promise.resolve('success'))).rejects.toThrow('Circuit breaker is open')
    })
  })

  describe('half-open state', () => {
    it('should transition to half-open after reset timeout', async () => {
      const fastCircuitBreaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeout: 50,
        successThreshold: 1
      })

      // Open the circuit
      try {
        await fastCircuitBreaker.execute(() => Promise.reject(new Error('fail')))
      } catch {}

      expect(fastCircuitBreaker.isOpen()).toBe(true)

      // Wait for reset timeout
      await new Promise(resolve => setTimeout(resolve, 60))

      // Next call should attempt (half-open)
      await fastCircuitBreaker.execute(() => Promise.resolve('success'))
      expect(fastCircuitBreaker.isClosed()).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      // Cause some failures
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
        } catch {}
      }

      expect(circuitBreaker.isOpen()).toBe(true)

      circuitBreaker.reset()

      expect(circuitBreaker.isClosed()).toBe(true)
      const stats = circuitBreaker.getStats()
      expect(stats.failures).toBe(0)
      expect(stats.successes).toBe(0)
    })
  })

  describe('getStats', () => {
    it('should return complete statistics', async () => {
      await circuitBreaker.execute(() => Promise.resolve('success'))
      try {
        await circuitBreaker.execute(() => Promise.reject(new Error('fail')))
      } catch {}

      const stats = circuitBreaker.getStats()

      expect(stats).toHaveProperty('state')
      expect(stats).toHaveProperty('failures')
      expect(stats).toHaveProperty('successes')
      expect(stats).toHaveProperty('lastFailureTime')
      expect(stats).toHaveProperty('totalRequests')
      expect(stats).toHaveProperty('totalFailures')
      expect(stats).toHaveProperty('totalSuccesses')

      expect(stats.totalRequests).toBe(2)
      expect(stats.totalSuccesses).toBe(1)
      expect(stats.totalFailures).toBe(1)
    })
  })
})
