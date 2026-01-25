import { useState, useEffect } from 'react'

/**
 * Hook to detect if the user prefers reduced motion.
 * Returns true if the user has enabled reduced motion in their system preferences.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Use addEventListener for modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Returns animation/transition configuration based on user preferences.
 * Use this to conditionally disable animations.
 */
export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion()

  return {
    prefersReducedMotion,
    // Framer Motion variants that respect reduced motion
    animationProps: prefersReducedMotion
      ? {
          initial: false,
          animate: false,
          exit: false,
          transition: { duration: 0 }
        }
      : {},
    // CSS transition duration
    transitionDuration: prefersReducedMotion ? '0s' : undefined,
    // Whether to animate
    shouldAnimate: !prefersReducedMotion
  }
}
