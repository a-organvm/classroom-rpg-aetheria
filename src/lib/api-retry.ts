/**
 * Timeout error for request timeouts.
 */
export class TimeoutError extends Error {
  constructor(message: string, public readonly timeout: number) {
    super(message)
    this.name = 'TimeoutError'
  }
}

/**
 * Wrap a promise with a timeout.
 * @param promise - Promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param message - Custom timeout error message
 * @returns Promise that rejects if timeout is exceeded
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message = 'Request timed out'
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(message, timeoutMs))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId)
  })
}

/**
 * Execute a function with a timeout.
 * @param fn - Async function to execute
 * @param timeoutMs - Timeout in milliseconds (default: 30000)
 * @param message - Custom timeout error message
 * @returns Promise that rejects if timeout is exceeded
 */
export async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs = 30000,
  message = 'Request timed out'
): Promise<T> {
  return withTimeout(fn(), timeoutMs, message)
}

/**
 * Retry a function with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise that resolves with the function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}

/**
 * Retry a function with exponential backoff and timeout per attempt.
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @param timeoutMs - Timeout per attempt in milliseconds (default: 30000)
 * @returns Promise that resolves with the function result
 */
export async function retryWithBackoffAndTimeout<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  timeoutMs = 30000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await executeWithTimeout(fn, timeoutMs)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}
