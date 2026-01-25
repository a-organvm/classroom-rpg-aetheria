/**
 * Learning Standards - Barrel Export
 *
 * Exports CCSS ELA and AP Literature standards.
 */

// Types
export type { LearningStandard } from './ccss-ela-9-10'

// CCSS Grades 9-10
export {
  CCSS_RL_9_10,
  CCSS_RI_9_10,
  CCSS_W_9_10,
  CCSS_SL_9_10,
  CCSS_L_9_10,
  ALL_CCSS_9_10,
  CCSS_9_10_BY_CATEGORY
} from './ccss-ela-9-10'

// CCSS Grades 11-12
export {
  CCSS_RL_11_12,
  CCSS_W_11_12,
  CCSS_SL_11_12,
  CCSS_L_11_12,
  ALL_CCSS_11_12,
  CCSS_11_12_BY_CATEGORY
} from './ccss-ela-11-12'

// AP Literature
export {
  AP_LIT_CHARACTER,
  AP_LIT_SETTING,
  AP_LIT_STRUCTURE,
  AP_LIT_NARRATION,
  AP_LIT_FIGURATIVE,
  AP_LIT_ARGUMENTATION,
  AP_LIT_INTERPRETATION,
  ALL_AP_LIT,
  AP_LIT_BY_BIG_IDEA,
  AP_LIT_BIG_IDEAS
} from './ap-literature'

// Import for combined exports
import { ALL_CCSS_9_10 } from './ccss-ela-9-10'
import { ALL_CCSS_11_12 } from './ccss-ela-11-12'
import { ALL_AP_LIT } from './ap-literature'
import type { LearningStandard } from './ccss-ela-9-10'

// ============================================
// Combined Standards
// ============================================

export const ALL_STANDARDS: LearningStandard[] = [
  ...ALL_CCSS_9_10,
  ...ALL_CCSS_11_12,
  ...ALL_AP_LIT
]

export const STANDARDS_BY_FRAMEWORK = {
  ccss: [...ALL_CCSS_9_10, ...ALL_CCSS_11_12],
  'ap-lit': ALL_AP_LIT
}

export const STANDARDS_BY_GRADE = {
  '9-10': ALL_CCSS_9_10,
  '11-12': [...ALL_CCSS_11_12, ...ALL_AP_LIT]
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get standard by ID
 */
export function getStandardById(id: string): LearningStandard | undefined {
  return ALL_STANDARDS.find(s => s.id === id)
}

/**
 * Get standards by category
 */
export function getStandardsByCategory(
  category: 'reading' | 'writing' | 'speaking' | 'language'
): LearningStandard[] {
  return ALL_STANDARDS.filter(s => s.category === category)
}

/**
 * Get standards by grade level
 */
export function getStandardsByGrade(grade: number): LearningStandard[] {
  return ALL_STANDARDS.filter(s => s.gradeLevel.includes(grade))
}

/**
 * Search standards by keyword
 */
export function searchStandards(query: string): LearningStandard[] {
  const normalizedQuery = query.toLowerCase()
  return ALL_STANDARDS.filter(
    s =>
      s.description.toLowerCase().includes(normalizedQuery) ||
      s.code.toLowerCase().includes(normalizedQuery) ||
      (s.strand && s.strand.toLowerCase().includes(normalizedQuery))
  )
}

// ============================================
// Statistics
// ============================================

export const STANDARDS_STATS = {
  total: ALL_STANDARDS.length,
  ccss910: ALL_CCSS_9_10.length,
  ccss1112: ALL_CCSS_11_12.length,
  apLit: ALL_AP_LIT.length,
  byCategory: {
    reading: ALL_STANDARDS.filter(s => s.category === 'reading').length,
    writing: ALL_STANDARDS.filter(s => s.category === 'writing').length,
    speaking: ALL_STANDARDS.filter(s => s.category === 'speaking').length,
    language: ALL_STANDARDS.filter(s => s.category === 'language').length
  }
}
