/**
 * Test Students - 20 Diverse Student Profiles
 *
 * Profiles for testing the platform with varied performance levels and characteristics.
 */

import type { UserProfile, Artifact } from '@/lib/types'
import { v4 as uuid } from 'uuid'

// ============================================
// Student Profile Interface
// ============================================

export interface TestStudent extends UserProfile {
  performanceLevel: 'high' | 'mid-high' | 'mid' | 'mid-low' | 'low' | 'variable'
  scoreRange: [number, number]
  characteristics: string[]
  email: string
  gradeYear: 1 | 2 | 3 | 4
}

// ============================================
// Helper Functions
// ============================================

function calculateLevel(xp: number): number {
  // Level thresholds: 0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return i + 1
  }
  return 1
}

function generateXPForLevel(
  performanceLevel: TestStudent['performanceLevel'],
  gradeYear: number
): number {
  const baseXP: Record<string, number> = {
    'high': 2500,
    'mid-high': 1800,
    'mid': 1200,
    'mid-low': 800,
    'low': 400,
    'variable': 1000
  }
  // Scale by year
  return Math.floor(baseXP[performanceLevel] * (0.5 + gradeYear * 0.25))
}

function generateArtifacts(
  count: number,
  performanceLevel: string
): Artifact[] {
  const rarityByPerformance: Record<string, Artifact['rarity'][]> = {
    'high': ['legendary', 'epic', 'rare', 'common'],
    'mid-high': ['epic', 'rare', 'common'],
    'mid': ['rare', 'common'],
    'mid-low': ['common'],
    'low': [],
    'variable': ['epic', 'rare', 'common']
  }

  const availableRarities = rarityByPerformance[performanceLevel] || ['common']
  if (availableRarities.length === 0) return []

  const artifactNames = [
    'Quill of Clarity', 'Tome of Knowledge', 'Crystal of Insight',
    'Scholar\'s Medallion', 'Pen of Persuasion', 'Book of Wisdom',
    'Inkwell of Inspiration', 'Scroll of Understanding'
  ]

  return Array.from({ length: Math.min(count, artifactNames.length) }, (_, i) => ({
    id: uuid(),
    name: artifactNames[i],
    description: `Earned through academic excellence`,
    rarity: availableRarities[i % availableRarities.length],
    earnedAt: Date.now() - (i * 86400000), // Days apart
    questId: `quest-y${Math.ceil(Math.random() * 4)}-${String(Math.ceil(Math.random() * 30)).padStart(2, '0')}`
  }))
}

// ============================================
// Test Student Profiles
// ============================================

export const TEST_STUDENTS: TestStudent[] = [
  // High Performers (90-100)
  {
    id: 'student-01',
    name: 'Alex Chen',
    role: 'student',
    xp: 0, // Will be calculated
    level: 1,
    artifacts: [],
    performanceLevel: 'high',
    scoreRange: [90, 100],
    characteristics: ['Consistent excellence', 'Detailed work', 'Strong analytical skills'],
    email: 'alex.chen@school.edu',
    gradeYear: 3
  },
  {
    id: 'student-02',
    name: 'Jordan Smith',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'high',
    scoreRange: [85, 95],
    characteristics: ['Strong analysis', 'Occasional grammar issues', 'Creative thinker'],
    email: 'jordan.smith@school.edu',
    gradeYear: 4
  },
  {
    id: 'student-11',
    name: 'Parker Lee',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'high',
    scoreRange: [88, 98],
    characteristics: ['Creative writer', 'Analytical thinker', 'Participates actively'],
    email: 'parker.lee@school.edu',
    gradeYear: 2
  },

  // Mid-High Performers (78-90)
  {
    id: 'student-03',
    name: 'Taylor Williams',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-high',
    scoreRange: [80, 90],
    characteristics: ['Good effort', 'Improving steadily', 'Responds well to feedback'],
    email: 'taylor.williams@school.edu',
    gradeYear: 1
  },
  {
    id: 'student-12',
    name: 'Drew Wilson',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-high',
    scoreRange: [78, 88],
    characteristics: ['Strong reader', 'Developing writer', 'Good class participation'],
    email: 'drew.wilson@school.edu',
    gradeYear: 3
  },
  {
    id: 'student-19',
    name: 'Finley Lewis',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-high',
    scoreRange: [82, 92],
    characteristics: ['Detail-oriented', 'Thorough', 'Excellent research skills'],
    email: 'finley.lewis@school.edu',
    gradeYear: 4
  },

  // Mid Performers (68-85)
  {
    id: 'student-04',
    name: 'Morgan Davis',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid',
    scoreRange: [75, 85],
    characteristics: ['Solid but inconsistent', 'Better in discussion than writing', 'Engaged'],
    email: 'morgan.davis@school.edu',
    gradeYear: 2
  },
  {
    id: 'student-05',
    name: 'Casey Brown',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid',
    scoreRange: [70, 80],
    characteristics: ['Meets standards', 'Minimal elaboration', 'Could push harder'],
    email: 'casey.brown@school.edu',
    gradeYear: 1
  },
  {
    id: 'student-13',
    name: 'Cameron Moore',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid',
    scoreRange: [72, 82],
    characteristics: ['Participates well', 'Average written work', 'Good collaboration'],
    email: 'cameron.moore@school.edu',
    gradeYear: 3
  },
  {
    id: 'student-14',
    name: 'Skyler Taylor',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid',
    scoreRange: [68, 78],
    characteristics: ['ESL background', 'Improving rapidly', 'Strong verbal skills'],
    email: 'skyler.taylor@school.edu',
    gradeYear: 2
  },
  {
    id: 'student-20',
    name: 'Sage Robinson',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid',
    scoreRange: [74, 84],
    characteristics: ['Good peer collaborator', 'Consistent effort', 'Helpful in groups'],
    email: 'sage.robinson@school.edu',
    gradeYear: 1
  },

  // Mid-Low Performers (58-75)
  {
    id: 'student-06',
    name: 'Riley Johnson',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-low',
    scoreRange: [65, 75],
    characteristics: ['Struggling with thesis development', 'Good ideas, weak execution'],
    email: 'riley.johnson@school.edu',
    gradeYear: 1
  },
  {
    id: 'student-07',
    name: 'Jamie Garcia',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-low',
    scoreRange: [60, 70],
    characteristics: ['Good ideas', 'Weak execution', 'Needs structure support'],
    email: 'jamie.garcia@school.edu',
    gradeYear: 2
  },
  {
    id: 'student-15',
    name: 'Dakota Jackson',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-low',
    scoreRange: [62, 72],
    characteristics: ['Learning differences', 'Uses accommodations', 'Hard worker'],
    email: 'dakota.jackson@school.edu',
    gradeYear: 3
  },
  {
    id: 'student-16',
    name: 'Blake White',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'mid-low',
    scoreRange: [58, 68],
    characteristics: ['Disengaged', 'Needs motivation', 'Capable when interested'],
    email: 'blake.white@school.edu',
    gradeYear: 2
  },

  // Low Performers (45-65)
  {
    id: 'student-08',
    name: 'Avery Martinez',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'low',
    scoreRange: [50, 65],
    characteristics: ['Needs significant support', 'Attendance issues', 'Working on basics'],
    email: 'avery.martinez@school.edu',
    gradeYear: 1
  },
  {
    id: 'student-09',
    name: 'Quinn Anderson',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'low',
    scoreRange: [45, 60],
    characteristics: ['Attendance/engagement issues', 'Potential but struggling'],
    email: 'quinn.anderson@school.edu',
    gradeYear: 2
  },
  {
    id: 'student-17',
    name: 'Hayden Harris',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'low',
    scoreRange: [52, 62],
    characteristics: ['Significant skill gaps', 'Benefits from 1:1 attention'],
    email: 'hayden.harris@school.edu',
    gradeYear: 1
  },

  // Variable Performers (50-95)
  {
    id: 'student-10',
    name: 'Reese Thomas',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'variable',
    scoreRange: [50, 95],
    characteristics: ['Inconsistent', 'High potential', 'Interest-driven'],
    email: 'reese.thomas@school.edu',
    gradeYear: 3
  },
  {
    id: 'student-18',
    name: 'Emerson Clark',
    role: 'student',
    xp: 0,
    level: 1,
    artifacts: [],
    performanceLevel: 'variable',
    scoreRange: [60, 90],
    characteristics: ['Gifted but inconsistent effort', '2e (twice exceptional)'],
    email: 'emerson.clark@school.edu',
    gradeYear: 4
  }
]

// Calculate XP and levels for each student
TEST_STUDENTS.forEach(student => {
  student.xp = generateXPForLevel(student.performanceLevel, student.gradeYear)
  student.level = calculateLevel(student.xp)

  // Generate artifacts based on performance
  const artifactCount = {
    'high': 4,
    'mid-high': 3,
    'mid': 2,
    'mid-low': 1,
    'low': 0,
    'variable': 2
  }[student.performanceLevel]

  student.artifacts = generateArtifacts(artifactCount, student.performanceLevel)
})

// ============================================
// Utility Functions
// ============================================

/**
 * Get a random score within a student's performance range
 */
export function getRandomScore(student: TestStudent): number {
  const [min, max] = student.scoreRange
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Get students by performance level
 */
export function getStudentsByPerformance(
  level: TestStudent['performanceLevel']
): TestStudent[] {
  return TEST_STUDENTS.filter(s => s.performanceLevel === level)
}

/**
 * Get students by grade year
 */
export function getStudentsByYear(year: 1 | 2 | 3 | 4): TestStudent[] {
  return TEST_STUDENTS.filter(s => s.gradeYear === year)
}

/**
 * Get student by ID
 */
export function getStudentById(id: string): TestStudent | undefined {
  return TEST_STUDENTS.find(s => s.id === id)
}

// ============================================
// Statistics
// ============================================

export const STUDENT_STATS = {
  total: TEST_STUDENTS.length,
  byPerformance: {
    high: TEST_STUDENTS.filter(s => s.performanceLevel === 'high').length,
    'mid-high': TEST_STUDENTS.filter(s => s.performanceLevel === 'mid-high').length,
    mid: TEST_STUDENTS.filter(s => s.performanceLevel === 'mid').length,
    'mid-low': TEST_STUDENTS.filter(s => s.performanceLevel === 'mid-low').length,
    low: TEST_STUDENTS.filter(s => s.performanceLevel === 'low').length,
    variable: TEST_STUDENTS.filter(s => s.performanceLevel === 'variable').length
  },
  byYear: {
    1: TEST_STUDENTS.filter(s => s.gradeYear === 1).length,
    2: TEST_STUDENTS.filter(s => s.gradeYear === 2).length,
    3: TEST_STUDENTS.filter(s => s.gradeYear === 3).length,
    4: TEST_STUDENTS.filter(s => s.gradeYear === 4).length
  }
}
