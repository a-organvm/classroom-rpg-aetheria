/**
 * Demo Standards Data - Alignments and Mastery Demo Data
 *
 * Generates QuestStandardAlignment and StandardMastery records.
 * - 100+ alignments (first 30 quests x 2-4 standards each)
 * - 200+ mastery records (20 students x 10+ standards each)
 * - Mastery levels match student performance levels
 */

import type {
  QuestStandardAlignment,
  StandardMastery,
  CoverageLevel,
  MasteryLevel
} from './types'
import { TEST_STUDENTS, type TestStudent } from './test-students'
import { ALL_STANDARDS } from './standards'

// ============================================
// Quest-Standard Alignments
// ============================================

interface AlignmentConfig {
  questId: string
  standards: { standardId: string; coverage: CoverageLevel }[]
}

// First 30 quests with 2-4 standards each
const ALIGNMENT_CONFIGS: AlignmentConfig[] = [
  // Year 1 Quests (quest-y1-01 through quest-y1-10)
  {
    questId: 'quest-y1-01',
    standards: [
      { standardId: 'ccss-rl-9-10-2', coverage: 'full' },
      { standardId: 'ccss-rl-9-10-3', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y1-02',
    standards: [
      { standardId: 'ccss-rl-9-10-3', coverage: 'full' },
      { standardId: 'ccss-w-9-10-1', coverage: 'partial' },
      { standardId: 'ccss-l-9-10-1', coverage: 'introduced' }
    ]
  },
  {
    questId: 'quest-y1-03',
    standards: [
      { standardId: 'ccss-rl-9-10-1', coverage: 'full' },
      { standardId: 'ccss-rl-9-10-2', coverage: 'full' },
      { standardId: 'ccss-w-9-10-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y1-04',
    standards: [
      { standardId: 'ccss-rl-9-10-4', coverage: 'full' },
      { standardId: 'ccss-l-9-10-5', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y1-05',
    standards: [
      { standardId: 'ccss-rl-9-10-1', coverage: 'partial' },
      { standardId: 'ccss-rl-9-10-5', coverage: 'full' },
      { standardId: 'ccss-w-9-10-3', coverage: 'introduced' }
    ]
  },
  {
    questId: 'quest-y1-06',
    standards: [
      { standardId: 'ccss-rl-9-10-6', coverage: 'full' },
      { standardId: 'ccss-w-9-10-1', coverage: 'full' },
      { standardId: 'ccss-l-9-10-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y1-07',
    standards: [
      { standardId: 'ccss-rl-9-10-2', coverage: 'partial' },
      { standardId: 'ccss-sl-9-10-1', coverage: 'full' }
    ]
  },
  {
    questId: 'quest-y1-08',
    standards: [
      { standardId: 'ccss-rl-9-10-3', coverage: 'full' },
      { standardId: 'ccss-w-9-10-2', coverage: 'full' },
      { standardId: 'ccss-l-9-10-3', coverage: 'partial' },
      { standardId: 'ccss-l-9-10-1', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y1-09',
    standards: [
      { standardId: 'ccss-rl-9-10-4', coverage: 'partial' },
      { standardId: 'ccss-rl-9-10-5', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y1-10',
    standards: [
      { standardId: 'ccss-w-9-10-1', coverage: 'full' },
      { standardId: 'ccss-w-9-10-4', coverage: 'partial' },
      { standardId: 'ccss-l-9-10-1', coverage: 'full' }
    ]
  },

  // Year 2 Quests (quest-y2-01 through quest-y2-10)
  {
    questId: 'quest-y2-01',
    standards: [
      { standardId: 'ccss-rl-9-10-1', coverage: 'full' },
      { standardId: 'ccss-rl-9-10-7', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-02',
    standards: [
      { standardId: 'ccss-rl-9-10-2', coverage: 'full' },
      { standardId: 'ccss-rl-9-10-4', coverage: 'full' },
      { standardId: 'ccss-w-9-10-1', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-03',
    standards: [
      { standardId: 'ccss-rl-9-10-3', coverage: 'full' },
      { standardId: 'ccss-w-9-10-2', coverage: 'partial' },
      { standardId: 'ccss-l-9-10-4', coverage: 'introduced' }
    ]
  },
  {
    questId: 'quest-y2-04',
    standards: [
      { standardId: 'ccss-ri-9-10-1', coverage: 'full' },
      { standardId: 'ccss-ri-9-10-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-05',
    standards: [
      { standardId: 'ccss-rl-9-10-5', coverage: 'full' },
      { standardId: 'ccss-rl-9-10-6', coverage: 'partial' },
      { standardId: 'ccss-w-9-10-3', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-06',
    standards: [
      { standardId: 'ccss-w-9-10-1', coverage: 'full' },
      { standardId: 'ccss-w-9-10-5', coverage: 'partial' },
      { standardId: 'ccss-l-9-10-1', coverage: 'full' },
      { standardId: 'ccss-l-9-10-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-07',
    standards: [
      { standardId: 'ccss-sl-9-10-1', coverage: 'full' },
      { standardId: 'ccss-sl-9-10-3', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-08',
    standards: [
      { standardId: 'ccss-rl-9-10-2', coverage: 'full' },
      { standardId: 'ccss-rl-9-10-4', coverage: 'full' },
      { standardId: 'ccss-w-9-10-2', coverage: 'full' }
    ]
  },
  {
    questId: 'quest-y2-09',
    standards: [
      { standardId: 'ccss-ri-9-10-3', coverage: 'full' },
      { standardId: 'ccss-ri-9-10-6', coverage: 'partial' },
      { standardId: 'ccss-w-9-10-1', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y2-10',
    standards: [
      { standardId: 'ccss-rl-9-10-9', coverage: 'full' },
      { standardId: 'ccss-w-9-10-7', coverage: 'partial' }
    ]
  },

  // Year 3 Quests (quest-y3-01 through quest-y3-10)
  {
    questId: 'quest-y3-01',
    standards: [
      { standardId: 'ccss-rl-11-12-1', coverage: 'full' },
      { standardId: 'ccss-rl-11-12-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-02',
    standards: [
      { standardId: 'ccss-rl-11-12-3', coverage: 'full' },
      { standardId: 'ccss-rl-11-12-4', coverage: 'partial' },
      { standardId: 'ap-lit-chr-1', coverage: 'introduced' }
    ]
  },
  {
    questId: 'quest-y3-03',
    standards: [
      { standardId: 'ccss-rl-11-12-5', coverage: 'full' },
      { standardId: 'ap-lit-str-1', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-04',
    standards: [
      { standardId: 'ccss-w-11-12-1', coverage: 'full' },
      { standardId: 'ccss-w-11-12-4', coverage: 'partial' },
      { standardId: 'ccss-l-11-12-1', coverage: 'full' }
    ]
  },
  {
    questId: 'quest-y3-05',
    standards: [
      { standardId: 'ccss-rl-11-12-6', coverage: 'full' },
      { standardId: 'ap-lit-nar-1', coverage: 'partial' },
      { standardId: 'ccss-w-11-12-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-06',
    standards: [
      { standardId: 'ccss-sl-11-12-1', coverage: 'full' },
      { standardId: 'ccss-sl-11-12-3', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-07',
    standards: [
      { standardId: 'ap-lit-fig-1', coverage: 'full' },
      { standardId: 'ccss-rl-11-12-4', coverage: 'full' },
      { standardId: 'ccss-l-11-12-5', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-08',
    standards: [
      { standardId: 'ccss-w-11-12-1', coverage: 'full' },
      { standardId: 'ccss-w-11-12-5', coverage: 'partial' },
      { standardId: 'ap-lit-arg-1', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-09',
    standards: [
      { standardId: 'ccss-rl-11-12-2', coverage: 'full' },
      { standardId: 'ap-lit-chr-2', coverage: 'partial' }
    ]
  },
  {
    questId: 'quest-y3-10',
    standards: [
      { standardId: 'ccss-w-11-12-2', coverage: 'full' },
      { standardId: 'ccss-w-11-12-7', coverage: 'partial' },
      { standardId: 'ccss-w-11-12-8', coverage: 'partial' },
      { standardId: 'ap-lit-int-1', coverage: 'introduced' }
    ]
  }
]

/**
 * Get demo alignments for sandbox mode
 */
export function getDemoAlignments(): QuestStandardAlignment[] {
  const alignments: QuestStandardAlignment[] = []

  for (const config of ALIGNMENT_CONFIGS) {
    for (const standard of config.standards) {
      alignments.push({
        questId: config.questId,
        standardId: standard.standardId,
        coverage: standard.coverage
      })
    }
  }

  return alignments
}

// ============================================
// Student Standard Mastery
// ============================================

// Map performance level to typical mastery distribution
const MASTERY_DISTRIBUTIONS: Record<TestStudent['performanceLevel'], MasteryLevel[]> = {
  high: ['mastered', 'mastered', 'proficient', 'proficient', 'proficient', 'developing'],
  'mid-high': ['proficient', 'proficient', 'proficient', 'developing', 'developing', 'developing'],
  mid: ['proficient', 'developing', 'developing', 'developing', 'beginning', 'beginning'],
  'mid-low': ['developing', 'developing', 'beginning', 'beginning', 'beginning', 'not-started'],
  low: ['beginning', 'beginning', 'beginning', 'not-started', 'not-started', 'not-started'],
  variable: ['mastered', 'proficient', 'developing', 'developing', 'beginning', 'not-started']
}

// Select a subset of standards for each student based on their year
function getStandardsForStudent(student: TestStudent): string[] {
  const allStandardIds = ALL_STANDARDS.map(s => s.id)

  // Students get standards based on their grade year
  // Year 1-2: CCSS 9-10 standards
  // Year 3-4: CCSS 11-12 and AP Lit standards
  const relevantStandards = ALL_STANDARDS.filter(s => {
    if (student.gradeYear <= 2) {
      return s.gradeLevel.includes(9) || s.gradeLevel.includes(10)
    } else {
      return s.gradeLevel.includes(11) || s.gradeLevel.includes(12)
    }
  }).map(s => s.id)

  // Each student gets 10-15 standards assessed
  const count = 10 + Math.floor(Math.random() * 6)

  // Shuffle and take first N
  const shuffled = [...relevantStandards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

function getMasteryLevel(student: TestStudent, index: number): MasteryLevel {
  const distribution = MASTERY_DISTRIBUTIONS[student.performanceLevel]
  return distribution[index % distribution.length]
}

function generateEvidence(level: MasteryLevel, standardId: string): string[] {
  const evidenceByLevel: Record<MasteryLevel, string[]> = {
    mastered: [
      `Demonstrated excellence on ${standardId} assessment`,
      'Consistent performance across multiple assignments',
      'Successfully applied skill in novel contexts'
    ],
    proficient: [
      `Met expectations on ${standardId} assessment`,
      'Showed solid understanding in class work'
    ],
    developing: [
      `Improving on ${standardId} skills`,
      'Needs additional practice with complex applications'
    ],
    beginning: [
      `Starting to develop ${standardId} understanding`,
      'Requires scaffolded support'
    ],
    'not-started': []
  }

  return evidenceByLevel[level]
}

const baseTime = Date.now()
const DAY = 24 * 60 * 60 * 1000

/**
 * Get demo mastery records for sandbox mode
 */
export function getDemoMastery(): StandardMastery[] {
  const masteryRecords: StandardMastery[] = []

  for (const student of TEST_STUDENTS) {
    const standards = getStandardsForStudent(student)

    standards.forEach((standardId, index) => {
      const level = getMasteryLevel(student, index)

      // Skip not-started with 50% probability to reduce record count
      if (level === 'not-started' && Math.random() > 0.5) {
        return
      }

      // Vary assessment dates
      const daysAgo = Math.floor(Math.random() * 60) + 1

      masteryRecords.push({
        studentId: student.id,
        standardId,
        level,
        evidence: generateEvidence(level, standardId),
        lastAssessed: baseTime - (daysAgo * DAY)
      })
    })
  }

  return masteryRecords
}

// ============================================
// Statistics
// ============================================

const alignments = getDemoAlignments()
const mastery = getDemoMastery()

export const DEMO_STANDARDS_STATS = {
  alignments: {
    total: alignments.length,
    byQuest: ALIGNMENT_CONFIGS.length,
    byCoverage: {
      full: alignments.filter(a => a.coverage === 'full').length,
      partial: alignments.filter(a => a.coverage === 'partial').length,
      introduced: alignments.filter(a => a.coverage === 'introduced').length
    }
  },
  mastery: {
    total: mastery.length,
    byStudent: TEST_STUDENTS.length,
    byLevel: {
      mastered: mastery.filter(m => m.level === 'mastered').length,
      proficient: mastery.filter(m => m.level === 'proficient').length,
      developing: mastery.filter(m => m.level === 'developing').length,
      beginning: mastery.filter(m => m.level === 'beginning').length,
      'not-started': mastery.filter(m => m.level === 'not-started').length
    }
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get alignments for a specific quest
 */
export function getAlignmentsForQuest(questId: string): QuestStandardAlignment[] {
  return getDemoAlignments().filter(a => a.questId === questId)
}

/**
 * Get mastery records for a specific student
 */
export function getMasteryForStudent(studentId: string): StandardMastery[] {
  return getDemoMastery().filter(m => m.studentId === studentId)
}

/**
 * Get mastery records for a specific standard
 */
export function getMasteryForStandard(standardId: string): StandardMastery[] {
  return getDemoMastery().filter(m => m.standardId === standardId)
}
