/**
 * English Literature Curriculum - Barrel Export
 *
 * Exports all curriculum data for Years 1-4
 */

// Year curricula
export { YEAR1_REALM, YEAR1_QUESTS, YEAR1_CURRICULUM } from './english-lit-year1'
export { YEAR2_REALM, YEAR2_QUESTS, YEAR2_CURRICULUM } from './english-lit-year2'
export { YEAR3_REALM, YEAR3_QUESTS, YEAR3_CURRICULUM } from './english-lit-year3'
export { YEAR4_REALM, YEAR4_QUESTS, YEAR4_CURRICULUM } from './english-lit-year4'

// Rubrics
export * from './rubrics'

// Feedback snippets
export * from './feedback-snippets'

// Import for combined exports
import { YEAR1_CURRICULUM } from './english-lit-year1'
import { YEAR2_CURRICULUM } from './english-lit-year2'
import { YEAR3_CURRICULUM } from './english-lit-year3'
import { YEAR4_CURRICULUM } from './english-lit-year4'
import type { Realm, Quest } from '@/lib/types'

// ============================================
// Combined Curriculum Data
// ============================================

export const ALL_CURRICULUM = {
  year1: YEAR1_CURRICULUM,
  year2: YEAR2_CURRICULUM,
  year3: YEAR3_CURRICULUM,
  year4: YEAR4_CURRICULUM
}

export const ALL_REALMS: Realm[] = [
  YEAR1_CURRICULUM.realm,
  YEAR2_CURRICULUM.realm,
  YEAR3_CURRICULUM.realm,
  YEAR4_CURRICULUM.realm
]

export const ALL_QUESTS: Quest[] = [
  ...YEAR1_CURRICULUM.quests,
  ...YEAR2_CURRICULUM.quests,
  ...YEAR3_CURRICULUM.quests,
  ...YEAR4_CURRICULUM.quests
]

// ============================================
// Curriculum Statistics
// ============================================

export const CURRICULUM_STATS = {
  totalRealms: 4,
  totalQuests: ALL_QUESTS.length,
  totalXP: ALL_QUESTS.reduce((sum, q) => sum + q.xpValue, 0),
  byYear: {
    year1: {
      quests: YEAR1_CURRICULUM.questCount,
      xp: YEAR1_CURRICULUM.totalXP
    },
    year2: {
      quests: YEAR2_CURRICULUM.questCount,
      xp: YEAR2_CURRICULUM.totalXP
    },
    year3: {
      quests: YEAR3_CURRICULUM.questCount,
      xp: YEAR3_CURRICULUM.totalXP
    },
    year4: {
      quests: YEAR4_CURRICULUM.questCount,
      xp: YEAR4_CURRICULUM.totalXP
    }
  },
  byType: {
    standard: ALL_QUESTS.filter(q => q.type === 'standard').length,
    boss: ALL_QUESTS.filter(q => q.type === 'boss').length,
    redemption: ALL_QUESTS.filter(q => q.type === 'redemption').length
  }
}

// ============================================
// Initialization Helper
// ============================================

/**
 * Initialize curriculum data in sandbox mode.
 * Call this to seed the demo environment with curriculum.
 */
export function initializeCurriculum(
  setRealms: (realms: Realm[]) => void,
  setQuests: (quests: Quest[]) => void
): void {
  setRealms(ALL_REALMS)
  setQuests(ALL_QUESTS)
}

/**
 * Get curriculum for a specific year
 */
export function getCurriculumByYear(year: 1 | 2 | 3 | 4) {
  switch (year) {
    case 1:
      return YEAR1_CURRICULUM
    case 2:
      return YEAR2_CURRICULUM
    case 3:
      return YEAR3_CURRICULUM
    case 4:
      return YEAR4_CURRICULUM
  }
}

/**
 * Get quests for a specific realm
 */
export function getQuestsByRealm(realmId: string): Quest[] {
  return ALL_QUESTS.filter(q => q.realmId === realmId)
}
