/**
 * Circuit Breaker pattern implementation for resilient API calls.
 *
 * Prevents cascading failures by temporarily blocking requests after
 * a threshold of failures is reached.
 */

export type CircuitState = 'closed' | 'open' | 'half-open'

interface CircuitBreakerConfig {
  /** Number of failures before opening the circuit */
  failureThreshold: number
  /** Time in ms to wait before testing the circuit again */
  resetTimeout: number
  /** Number of successful calls needed to close the circuit from half-open */
  successThreshold: number
}

interface CircuitBreakerStats {
  state: CircuitState
  failures: number
  successes: number
  lastFailureTime: number | null
  totalRequests: number
  totalFailures: number
  totalSuccesses: number
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  successThreshold: 2
}

export class CircuitBreaker {
  private state: CircuitState = 'closed'
  private failures = 0
  private successes = 0
  private lastFailureTime: number | null = null
  private totalRequests = 0
  private totalFailures = 0
  private totalSuccesses = 0
  private config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Execute a function through the circuit breaker.
   * @throws Error if circuit is open
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalRequests++

    if (this.isOpen()) {
      if (this.shouldAttemptReset()) {
        this.halfOpen()
      } else {
        throw new CircuitOpenError('Circuit breaker is open')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  /**
   * Check if the circuit is currently open.
   */
  isOpen(): boolean {
    return this.state === 'open'
  }

  /**
   * Check if the circuit is currently closed.
   */
  isClosed(): boolean {
    return this.state === 'closed'
  }

  /**
   * Check if the circuit is in half-open state.
   */
  isHalfOpen(): boolean {
    return this.state === 'half-open'
  }

  /**
   * Get the current circuit breaker statistics.
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      totalRequests: this.totalRequests,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses
    }
  }

  /**
   * Reset the circuit breaker to its initial state.
   */
  reset(): void {
    this.state = 'closed'
    this.failures = 0
    this.successes = 0
    this.lastFailureTime = null
  }

  private onSuccess(): void {
    this.totalSuccesses++

    if (this.state === 'half-open') {
      this.successes++
      if (this.successes >= this.config.successThreshold) {
        this.close()
      }
    } else {
      this.failures = 0
    }
  }

  private onFailure(): void {
    this.totalFailures++
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.state === 'half-open') {
      this.open()
    } else if (this.failures >= this.config.failureThreshold) {
      this.open()
    }
  }

  private open(): void {
    this.state = 'open'
    this.successes = 0
  }

  private close(): void {
    this.state = 'closed'
    this.failures = 0
    this.successes = 0
  }

  private halfOpen(): void {
    this.state = 'half-open'
    this.successes = 0
  }

  private shouldAttemptReset(): boolean {
    if (this.lastFailureTime === null) return true
    return Date.now() - this.lastFailureTime >= this.config.resetTimeout
  }
}

export class CircuitOpenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CircuitOpenError'
  }
}

// Singleton instance for LLM calls
export const llmCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 60000, // 1 minute
  successThreshold: 1
})

/**
 * Execute an LLM call through the circuit breaker.
 */
export async function executeWithCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
  return llmCircuitBreaker.execute(fn)
}
