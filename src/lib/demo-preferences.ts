/**
 * Demo Preferences - Student Preferences Demo Data
 *
 * Generates StudentPreferences for all 20 test students.
 * Distribution:
 * - 8 interest areas spread across students
 * - 4 learning styles spread evenly
 */

import type { StudentPreferences, ThematicInterest, LearningStyle } from './types'
import { TEST_STUDENTS } from './test-students'

// ============================================
// Interest Distribution
// ============================================

// Map students to interests based on their characteristics and performance
const STUDENT_INTERESTS: Record<string, { primary: ThematicInterest; secondary?: ThematicInterest }> = {
  // High performers - tend toward technology, science, arts
  'student-01': { primary: 'technology', secondary: 'science' },
  'student-02': { primary: 'arts', secondary: 'social-justice' },
  'student-11': { primary: 'science', secondary: 'nature' },

  // Mid-high performers - varied interests
  'student-03': { primary: 'sports', secondary: 'business' },
  'student-12': { primary: 'nature', secondary: 'science' },
  'student-19': { primary: 'social-justice', secondary: 'arts' },

  // Mid performers - mainstream interests
  'student-04': { primary: 'sports', secondary: 'technology' },
  'student-05': { primary: 'business', secondary: 'technology' },
  'student-13': { primary: 'arts', secondary: 'nature' },
  'student-14': { primary: 'general', secondary: 'arts' },
  'student-20': { primary: 'sports', secondary: 'business' },

  // Mid-low performers - varied interests
  'student-06': { primary: 'technology', secondary: 'sports' },
  'student-07': { primary: 'nature', secondary: 'social-justice' },
  'student-15': { primary: 'arts', secondary: 'general' },
  'student-16': { primary: 'sports' }, // No secondary - disengaged

  // Low performers - need engaging content
  'student-08': { primary: 'sports', secondary: 'technology' },
  'student-09': { primary: 'technology' }, // No secondary - attendance issues
  'student-17': { primary: 'arts', secondary: 'sports' },

  // Variable performers - interest-driven learners
  'student-10': { primary: 'science', secondary: 'technology' },
  'student-18': { primary: 'social-justice', secondary: 'nature' }
}

// ============================================
// Learning Style Distribution
// ============================================

// Distribute learning styles evenly (5 of each for 20 students)
const LEARNING_STYLES: Record<string, LearningStyle> = {
  // Visual learners (5)
  'student-01': 'visual',
  'student-04': 'visual',
  'student-08': 'visual',
  'student-13': 'visual',
  'student-18': 'visual',

  // Auditory learners (5)
  'student-02': 'auditory',
  'student-05': 'auditory',
  'student-09': 'auditory',
  'student-14': 'auditory',
  'student-19': 'auditory',

  // Kinesthetic learners (5)
  'student-03': 'kinesthetic',
  'student-06': 'kinesthetic',
  'student-10': 'kinesthetic',
  'student-15': 'kinesthetic',
  'student-20': 'kinesthetic',

  // Reading/writing learners (5)
  'student-07': 'reading',
  'student-11': 'reading',
  'student-12': 'reading',
  'student-16': 'reading',
  'student-17': 'reading'
}

// ============================================
// Demo Preferences Generation
// ============================================

const baseTime = Date.now()
const DAY = 24 * 60 * 60 * 1000

/**
 * Get demo preferences for all test students
 */
export function getDemoPreferences(): StudentPreferences[] {
  return TEST_STUDENTS.map((student, index) => {
    const interests = STUDENT_INTERESTS[student.id] || { primary: 'general' }
    const learningStyle = LEARNING_STYLES[student.id] || 'visual'

    // Vary update times to simulate natural usage
    const daysAgo = Math.floor(index * 3.5) + 1

    return {
      studentId: student.id,
      primaryInterest: interests.primary,
      secondaryInterest: interests.secondary,
      learningStyle,
      updatedAt: baseTime - (daysAgo * DAY)
    }
  })
}

// ============================================
// Statistics
// ============================================

export const DEMO_PREFERENCES_STATS = {
  total: TEST_STUDENTS.length,
  byInterest: {
    sports: 5,
    science: 2,
    arts: 4,
    technology: 3,
    nature: 2,
    'social-justice': 2,
    business: 1,
    general: 1
  },
  byLearningStyle: {
    visual: 5,
    auditory: 5,
    kinesthetic: 5,
    reading: 5
  },
  withSecondaryInterest: 17,
  withoutSecondaryInterest: 3
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get preferences for a specific student
 */
export function getPreferencesForStudent(studentId: string): StudentPreferences | undefined {
  return getDemoPreferences().find(p => p.studentId === studentId)
}

/**
 * Get students by primary interest
 */
export function getStudentsByInterest(interest: ThematicInterest): string[] {
  return getDemoPreferences()
    .filter(p => p.primaryInterest === interest)
    .map(p => p.studentId)
}

/**
 * Get students by learning style
 */
export function getStudentsByLearningStyle(style: LearningStyle): string[] {
  return getDemoPreferences()
    .filter(p => p.learningStyle === style)
    .map(p => p.studentId)
}
