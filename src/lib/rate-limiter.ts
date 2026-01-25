/**
 * Rate Limiter implementation with token bucket algorithm.
 *
 * Prevents API abuse by limiting the number of requests within a time window.
 */

interface RateLimiterConfig {
  /** Maximum number of tokens (requests) allowed */
  maxTokens: number
  /** Interval in ms for refilling one token */
  refillInterval: number
  /** Number of tokens to refill per interval */
  refillAmount: number
}

interface RateLimiterStats {
  availableTokens: number
  maxTokens: number
  lastRefillTime: number
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxTokens: 10,
  refillInterval: 1000, // 1 second
  refillAmount: 1
}

export class RateLimiter {
  private tokens: number
  private lastRefillTime: number
  private config: RateLimiterConfig

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.tokens = this.config.maxTokens
    this.lastRefillTime = Date.now()
  }

  /**
   * Try to consume a token. Returns true if successful, false if rate limited.
   */
  tryConsume(): boolean {
    this.refill()

    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }

    return false
  }

  /**
   * Wait until a token is available, then consume it.
   */
  async waitAndConsume(): Promise<void> {
    this.refill()

    if (this.tokens >= 1) {
      this.tokens -= 1
      return
    }

    // Calculate wait time
    const waitTime = this.getWaitTime()
    await this.sleep(waitTime)

    // Try again after waiting
    return this.waitAndConsume()
  }

  /**
   * Execute a function with rate limiting.
   * Waits if rate limit is exceeded.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitAndConsume()
    return fn()
  }

  /**
   * Execute a function only if rate limit allows.
   * Throws RateLimitError if rate limit is exceeded.
   */
  async tryExecute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.tryConsume()) {
      throw new RateLimitError('Rate limit exceeded')
    }
    return fn()
  }

  /**
   * Get the number of available tokens.
   */
  getAvailableTokens(): number {
    this.refill()
    return this.tokens
  }

  /**
   * Check if the rate limiter is currently limiting.
   */
  isLimited(): boolean {
    this.refill()
    return this.tokens < 1
  }

  /**
   * Get estimated wait time in ms until a token is available.
   */
  getWaitTime(): number {
    this.refill()

    if (this.tokens >= 1) {
      return 0
    }

    const tokensNeeded = 1 - this.tokens
    return Math.ceil(tokensNeeded / this.config.refillAmount) * this.config.refillInterval
  }

  /**
   * Get current rate limiter statistics.
   */
  getStats(): RateLimiterStats {
    this.refill()
    return {
      availableTokens: this.tokens,
      maxTokens: this.config.maxTokens,
      lastRefillTime: this.lastRefillTime
    }
  }

  /**
   * Reset the rate limiter to full capacity.
   */
  reset(): void {
    this.tokens = this.config.maxTokens
    this.lastRefillTime = Date.now()
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = now - this.lastRefillTime
    const intervalsElapsed = Math.floor(timePassed / this.config.refillInterval)

    if (intervalsElapsed > 0) {
      this.tokens = Math.min(
        this.config.maxTokens,
        this.tokens + intervalsElapsed * this.config.refillAmount
      )
      this.lastRefillTime = now - (timePassed % this.config.refillInterval)
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Singleton instance for LLM calls
export const llmRateLimiter = new RateLimiter({
  maxTokens: 5,           // Allow 5 requests
  refillInterval: 1000,   // Refill every second
  refillAmount: 1         // 1 token per second
})

/**
 * Execute a function with rate limiting for LLM calls.
 */
export async function executeWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  return llmRateLimiter.execute(fn)
}
