import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RateLimiter, RateLimitError } from './rate-limiter'

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    rateLimiter = new RateLimiter({
      maxTokens: 3,
      refillInterval: 1000,
      refillAmount: 1
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should start with max tokens', () => {
      expect(rateLimiter.getAvailableTokens()).toBe(3)
    })

    it('should not be limited initially', () => {
      expect(rateLimiter.isLimited()).toBe(false)
    })
  })

  describe('tryConsume', () => {
    it('should return true when tokens are available', () => {
      expect(rateLimiter.tryConsume()).toBe(true)
    })

    it('should decrease available tokens', () => {
      rateLimiter.tryConsume()
      expect(rateLimiter.getAvailableTokens()).toBe(2)
    })

    it('should return false when no tokens available', () => {
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      expect(rateLimiter.tryConsume()).toBe(false)
    })
  })

  describe('isLimited', () => {
    it('should return true when no tokens available', () => {
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      expect(rateLimiter.isLimited()).toBe(true)
    })
  })

  describe('getWaitTime', () => {
    it('should return 0 when tokens are available', () => {
      expect(rateLimiter.getWaitTime()).toBe(0)
    })

    it('should return positive wait time when limited', () => {
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      expect(rateLimiter.getWaitTime()).toBeGreaterThan(0)
    })
  })

  describe('token refill', () => {
    it('should refill tokens over time', () => {
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()

      expect(rateLimiter.getAvailableTokens()).toBe(0)

      vi.advanceTimersByTime(1000)

      expect(rateLimiter.getAvailableTokens()).toBe(1)
    })

    it('should not exceed max tokens', () => {
      vi.advanceTimersByTime(10000)
      expect(rateLimiter.getAvailableTokens()).toBe(3)
    })
  })

  describe('tryExecute', () => {
    it('should execute function when tokens available', async () => {
      const fn = vi.fn().mockResolvedValue('result')
      const result = await rateLimiter.tryExecute(fn)

      expect(fn).toHaveBeenCalled()
      expect(result).toBe('result')
    })

    it('should throw RateLimitError when limited', async () => {
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()

      const fn = vi.fn().mockResolvedValue('result')
      await expect(rateLimiter.tryExecute(fn)).rejects.toThrow(RateLimitError)
      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should reset to full capacity', () => {
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()
      rateLimiter.tryConsume()

      expect(rateLimiter.getAvailableTokens()).toBe(0)

      rateLimiter.reset()

      expect(rateLimiter.getAvailableTokens()).toBe(3)
    })
  })

  describe('getStats', () => {
    it('should return current stats', () => {
      rateLimiter.tryConsume()

      const stats = rateLimiter.getStats()

      expect(stats).toHaveProperty('availableTokens')
      expect(stats).toHaveProperty('maxTokens')
      expect(stats).toHaveProperty('lastRefillTime')
      expect(stats.availableTokens).toBe(2)
      expect(stats.maxTokens).toBe(3)
    })
  })
})
