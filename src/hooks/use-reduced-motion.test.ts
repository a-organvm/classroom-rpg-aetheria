import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReducedMotion, useMotionConfig } from './use-reduced-motion'

describe('useReducedMotion', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>
  let listeners: Map<string, (event: MediaQueryListEvent) => void>

  beforeEach(() => {
    listeners = new Map()
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
        listeners.set(event, handler)
      }),
      removeEventListener: vi.fn((event: string) => {
        listeners.delete(event)
      }),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
    window.matchMedia = matchMediaMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false when user does not prefer reduced motion', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('should return true when user prefers reduced motion', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('should update when media query changes', () => {
    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)

    // Simulate media query change
    const changeHandler = listeners.get('change')
    if (changeHandler) {
      act(() => {
        changeHandler({ matches: true } as MediaQueryListEvent)
      })
    }

    expect(result.current).toBe(true)
  })
})

describe('useMotionConfig', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return shouldAnimate true when motion is allowed', () => {
    const { result } = renderHook(() => useMotionConfig())
    expect(result.current.shouldAnimate).toBe(true)
  })

  it('should return empty animationProps when motion is allowed', () => {
    const { result } = renderHook(() => useMotionConfig())
    expect(result.current.animationProps).toEqual({})
  })

  it('should return shouldAnimate false when motion is reduced', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    })

    const { result } = renderHook(() => useMotionConfig())
    expect(result.current.shouldAnimate).toBe(false)
  })

  it('should return animation disabling props when motion is reduced', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    })

    const { result } = renderHook(() => useMotionConfig())
    expect(result.current.animationProps).toHaveProperty('initial', false)
    expect(result.current.animationProps).toHaveProperty('animate', false)
    expect(result.current.animationProps).toHaveProperty('exit', false)
    expect(result.current.animationProps.transition?.duration).toBe(0)
  })

  it('should return correct transitionDuration based on preference', () => {
    const { result } = renderHook(() => useMotionConfig())
    expect(result.current.transitionDuration).toBeUndefined()

    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    })

    const { result: result2 } = renderHook(() => useMotionConfig())
    expect(result2.current.transitionDuration).toBe('0s')
  })
})
