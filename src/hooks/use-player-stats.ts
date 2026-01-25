import { useMemo } from 'react'
import { UserProfile, Role } from '@/lib/types'
import { calculateLevel, getLevelTitle, getXpForNextLevel } from '@/lib/game-utils'

export interface PlayerStats {
  level: number
  levelTitle: string
  xpProgress: number
  xpInCurrentLevel: number
  xpNeededForLevel: number
  xpToNextLevel: number
}

/**
 * Calculates player progression stats from profile data.
 * Used in HUDSidebar and MobileNav to display XP progress.
 */
export function usePlayerStats(profile: UserProfile, role: Role): PlayerStats {
  return useMemo(() => {
    const level = calculateLevel(profile.xp)
    const levelTitle = getLevelTitle(level, role)
    const nextLevelXp = getXpForNextLevel(profile.xp)
    const currentLevelXp = level > 1 ? getXpForNextLevel(profile.xp - 1) : 0
    const xpInCurrentLevel = profile.xp - currentLevelXp
    const xpNeededForLevel = nextLevelXp - currentLevelXp
    const xpProgress = (xpInCurrentLevel / xpNeededForLevel) * 100
    const xpToNextLevel = xpNeededForLevel - xpInCurrentLevel

    return {
      level,
      levelTitle,
      xpProgress,
      xpInCurrentLevel,
      xpNeededForLevel,
      xpToNextLevel,
    }
  }, [profile.xp, role])
}
