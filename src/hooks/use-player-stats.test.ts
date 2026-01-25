import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePlayerStats } from './use-player-stats'
import type { UserProfile } from '@/lib/types'

const createProfile = (xp: number): UserProfile => ({
  id: 'test-user',
  name: 'Test User',
  role: 'student',
  xp,
  level: 1,
  artifacts: []
})

describe('usePlayerStats', () => {
  describe('level calculation', () => {
    it('should return level 1 for 0 XP', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(0), 'student'))
      expect(result.current.level).toBe(1)
    })

    it('should return level 2 for 100 XP', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(100), 'student'))
      expect(result.current.level).toBe(2)
    })

    it('should return level 3 for 250 XP', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(250), 'student'))
      expect(result.current.level).toBe(3)
    })
  })

  describe('level title', () => {
    it('should return student title for student role', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(0), 'student'))
      expect(result.current.levelTitle).toContain('Novice')
    })

    it('should return teacher title for teacher role', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(0), 'teacher'))
      // Level 1 teacher title is 'Initiate'
      expect(result.current.levelTitle).toContain('Initiate')
    })
  })

  describe('XP progress', () => {
    it('should calculate xpInCurrentLevel', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(100), 'student'))
      expect(typeof result.current.xpInCurrentLevel).toBe('number')
    })

    it('should calculate xpNeededForLevel', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(100), 'student'))
      expect(typeof result.current.xpNeededForLevel).toBe('number')
    })

    it('should calculate xpProgress as a number', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(50), 'student'))
      // At level 1 with 50 XP, progress should be some percentage toward level 2
      expect(typeof result.current.xpProgress).toBe('number')
      expect(result.current.xpProgress).toBeGreaterThanOrEqual(0)
    })

    it('should return xpToNextLevel as a number', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(50), 'student'))
      expect(typeof result.current.xpToNextLevel).toBe('number')
    })
  })

  describe('edge cases', () => {
    it('should handle very high XP values', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(100000), 'student'))
      expect(result.current.level).toBeGreaterThan(1)
    })

    it('should not return NaN for any values', () => {
      const { result } = renderHook(() => usePlayerStats(createProfile(50), 'student'))
      expect(Number.isNaN(result.current.xpProgress)).toBe(false)
      expect(Number.isNaN(result.current.xpToNextLevel)).toBe(false)
    })
  })
})
