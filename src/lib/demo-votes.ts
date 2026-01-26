/**
 * Demo Votes - Three-Way Voting Demo Data
 *
 * Generates sample ThreeWayVote records for sandbox mode testing.
 * Coverage:
 * - 3 pending (no votes)
 * - 4 pending (partial: 1-2 of 3 voted)
 * - 5 decided (majority)
 * - 3 decided (tie-break)
 * - 3 override (teacher override)
 */

import type { ThreeWayVote, VoteOption, ThematicInterest } from './types'

// ============================================
// Vote Options Templates
// ============================================

const VARIANT_OPTIONS: Record<string, VoteOption[]> = {
  sportsVsArts: [
    { id: 'opt-sports', label: 'Sports Theme', description: 'Apply concepts through athletics and competition', thematicInterest: 'sports' },
    { id: 'opt-arts', label: 'Arts Theme', description: 'Explore through visual arts and music', thematicInterest: 'arts' },
    { id: 'opt-general', label: 'General Theme', description: 'Traditional academic approach', thematicInterest: 'general' }
  ],
  techVsNature: [
    { id: 'opt-tech', label: 'Technology Theme', description: 'Modern digital perspective', thematicInterest: 'technology' },
    { id: 'opt-nature', label: 'Nature Theme', description: 'Environmental and ecological lens', thematicInterest: 'nature' },
    { id: 'opt-science', label: 'Science Theme', description: 'Scientific research approach', thematicInterest: 'science' }
  ],
  socialVsBusiness: [
    { id: 'opt-social', label: 'Social Justice Theme', description: 'Equity and activism perspective', thematicInterest: 'social-justice' },
    { id: 'opt-business', label: 'Business Theme', description: 'Entrepreneurial and economic lens', thematicInterest: 'business' },
    { id: 'opt-general', label: 'General Theme', description: 'Traditional academic approach', thematicInterest: 'general' }
  ],
  mixed: [
    { id: 'opt-sports', label: 'Sports Theme', description: 'Apply concepts through athletics', thematicInterest: 'sports' },
    { id: 'opt-tech', label: 'Technology Theme', description: 'Modern digital perspective', thematicInterest: 'technology' },
    { id: 'opt-arts', label: 'Arts Theme', description: 'Creative artistic approach', thematicInterest: 'arts' }
  ]
}

// ============================================
// Vote Topics
// ============================================

const VOTE_TOPICS = [
  'Choose the thematic approach for "The Lottery" analysis',
  'Select the variant for the character study quest',
  'Pick the theme for poetry comparison assignment',
  'Choose approach for Gatsby symbolism analysis',
  'Select variant for argumentative essay',
  'Pick theme for narrative writing project',
  'Choose approach for Hamlet soliloquy analysis',
  'Select variant for research paper topic',
  'Pick theme for creative writing assignment',
  'Choose approach for rhetorical analysis',
  'Select variant for comparative essay',
  'Pick theme for speech presentation',
  'Choose approach for literary criticism essay',
  'Select variant for media analysis project',
  'Pick theme for debate preparation',
  'Choose approach for memoir excerpt analysis',
  'Select variant for satire analysis quest',
  'Pick theme for world literature comparison'
]

// ============================================
// Demo Vote Generation
// ============================================

const baseTime = Date.now()
const DAY = 24 * 60 * 60 * 1000

/**
 * Get demo votes for sandbox mode
 */
export function getDemoVotes(): ThreeWayVote[] {
  const votes: ThreeWayVote[] = []

  // ============================================
  // Pending - No Votes (3)
  // ============================================
  votes.push({
    id: 'vote-pending-01',
    questId: 'quest-y1-03',
    studentId: 'student-01',
    topic: VOTE_TOPICS[0],
    options: VARIANT_OPTIONS.sportsVsArts,
    status: 'pending',
    createdAt: baseTime - (2 * DAY),
    deadline: baseTime + (5 * DAY)
  })

  votes.push({
    id: 'vote-pending-02',
    questId: 'quest-y2-05',
    studentId: 'student-03',
    topic: VOTE_TOPICS[1],
    options: VARIANT_OPTIONS.techVsNature,
    status: 'pending',
    createdAt: baseTime - DAY,
    deadline: baseTime + (7 * DAY)
  })

  votes.push({
    id: 'vote-pending-03',
    questId: 'quest-y3-02',
    studentId: 'student-05',
    topic: VOTE_TOPICS[2],
    options: VARIANT_OPTIONS.socialVsBusiness,
    status: 'pending',
    createdAt: baseTime - (3 * DAY),
    deadline: baseTime + (4 * DAY)
  })

  // ============================================
  // Pending - Partial Votes (4)
  // ============================================

  // Only teacher voted
  votes.push({
    id: 'vote-partial-01',
    questId: 'quest-y1-06',
    studentId: 'student-02',
    topic: VOTE_TOPICS[3],
    options: VARIANT_OPTIONS.mixed,
    teacherVote: 'opt-tech',
    status: 'pending',
    createdAt: baseTime - (4 * DAY),
    deadline: baseTime + (3 * DAY)
  })

  // Only student voted
  votes.push({
    id: 'vote-partial-02',
    questId: 'quest-y2-08',
    studentId: 'student-04',
    topic: VOTE_TOPICS[4],
    options: VARIANT_OPTIONS.sportsVsArts,
    studentVote: 'opt-sports',
    status: 'pending',
    createdAt: baseTime - (2 * DAY),
    deadline: baseTime + (5 * DAY)
  })

  // Teacher and parent voted
  votes.push({
    id: 'vote-partial-03',
    questId: 'quest-y3-10',
    studentId: 'student-06',
    topic: VOTE_TOPICS[5],
    options: VARIANT_OPTIONS.techVsNature,
    teacherVote: 'opt-nature',
    parentVote: 'opt-science',
    status: 'pending',
    createdAt: baseTime - (5 * DAY),
    deadline: baseTime + (2 * DAY)
  })

  // Student and parent voted
  votes.push({
    id: 'vote-partial-04',
    questId: 'quest-y4-03',
    studentId: 'student-08',
    topic: VOTE_TOPICS[6],
    options: VARIANT_OPTIONS.socialVsBusiness,
    studentVote: 'opt-social',
    parentVote: 'opt-social',
    status: 'pending',
    createdAt: baseTime - (3 * DAY),
    deadline: baseTime + (4 * DAY)
  })

  // ============================================
  // Decided - Majority (5)
  // ============================================

  // All three agree
  votes.push({
    id: 'vote-majority-01',
    questId: 'quest-y1-10',
    studentId: 'student-01',
    topic: VOTE_TOPICS[7],
    options: VARIANT_OPTIONS.sportsVsArts,
    teacherVote: 'opt-sports',
    studentVote: 'opt-sports',
    parentVote: 'opt-sports',
    status: 'decided',
    decidedOption: 'opt-sports',
    createdAt: baseTime - (10 * DAY),
    decidedAt: baseTime - (7 * DAY)
  })

  // Two of three agree (teacher + student)
  votes.push({
    id: 'vote-majority-02',
    questId: 'quest-y2-12',
    studentId: 'student-02',
    topic: VOTE_TOPICS[8],
    options: VARIANT_OPTIONS.techVsNature,
    teacherVote: 'opt-tech',
    studentVote: 'opt-tech',
    parentVote: 'opt-nature',
    status: 'decided',
    decidedOption: 'opt-tech',
    createdAt: baseTime - (12 * DAY),
    decidedAt: baseTime - (9 * DAY)
  })

  // Two of three agree (student + parent)
  votes.push({
    id: 'vote-majority-03',
    questId: 'quest-y3-15',
    studentId: 'student-07',
    topic: VOTE_TOPICS[9],
    options: VARIANT_OPTIONS.socialVsBusiness,
    teacherVote: 'opt-business',
    studentVote: 'opt-social',
    parentVote: 'opt-social',
    status: 'decided',
    decidedOption: 'opt-social',
    createdAt: baseTime - (8 * DAY),
    decidedAt: baseTime - (5 * DAY)
  })

  // Two of three agree (teacher + parent)
  votes.push({
    id: 'vote-majority-04',
    questId: 'quest-y4-08',
    studentId: 'student-09',
    topic: VOTE_TOPICS[10],
    options: VARIANT_OPTIONS.mixed,
    teacherVote: 'opt-arts',
    studentVote: 'opt-sports',
    parentVote: 'opt-arts',
    status: 'decided',
    decidedOption: 'opt-arts',
    createdAt: baseTime - (15 * DAY),
    decidedAt: baseTime - (12 * DAY)
  })

  // All three agree on different option
  votes.push({
    id: 'vote-majority-05',
    questId: 'quest-y1-15',
    studentId: 'student-10',
    topic: VOTE_TOPICS[11],
    options: VARIANT_OPTIONS.techVsNature,
    teacherVote: 'opt-science',
    studentVote: 'opt-science',
    parentVote: 'opt-science',
    status: 'decided',
    decidedOption: 'opt-science',
    createdAt: baseTime - (20 * DAY),
    decidedAt: baseTime - (17 * DAY)
  })

  // ============================================
  // Decided - Tie-Break (3)
  // ============================================

  // Three-way tie resolved by teacher preference
  votes.push({
    id: 'vote-tiebreak-01',
    questId: 'quest-y2-18',
    studentId: 'student-03',
    topic: VOTE_TOPICS[12],
    options: VARIANT_OPTIONS.sportsVsArts,
    teacherVote: 'opt-arts',
    studentVote: 'opt-sports',
    parentVote: 'opt-general',
    status: 'decided',
    decidedOption: 'opt-arts', // Teacher breaks tie
    createdAt: baseTime - (18 * DAY),
    decidedAt: baseTime - (14 * DAY)
  })

  // Tie between two options, teacher breaks
  votes.push({
    id: 'vote-tiebreak-02',
    questId: 'quest-y3-20',
    studentId: 'student-04',
    topic: VOTE_TOPICS[13],
    options: VARIANT_OPTIONS.techVsNature,
    teacherVote: 'opt-tech',
    studentVote: 'opt-nature',
    parentVote: 'opt-tech',
    status: 'decided',
    decidedOption: 'opt-tech',
    createdAt: baseTime - (22 * DAY),
    decidedAt: baseTime - (19 * DAY)
  })

  // Complex tie scenario
  votes.push({
    id: 'vote-tiebreak-03',
    questId: 'quest-y4-12',
    studentId: 'student-05',
    topic: VOTE_TOPICS[14],
    options: VARIANT_OPTIONS.socialVsBusiness,
    teacherVote: 'opt-general',
    studentVote: 'opt-social',
    parentVote: 'opt-business',
    status: 'decided',
    decidedOption: 'opt-general', // Teacher preference on tie
    createdAt: baseTime - (25 * DAY),
    decidedAt: baseTime - (21 * DAY)
  })

  // ============================================
  // Override - Teacher Override (3)
  // ============================================

  votes.push({
    id: 'vote-override-01',
    questId: 'quest-y1-20',
    studentId: 'student-06',
    topic: VOTE_TOPICS[15],
    options: VARIANT_OPTIONS.mixed,
    teacherVote: 'opt-arts',
    studentVote: 'opt-sports',
    parentVote: 'opt-sports',
    status: 'override',
    decidedOption: 'opt-arts', // Teacher overrode majority
    createdAt: baseTime - (30 * DAY),
    decidedAt: baseTime - (28 * DAY)
  })

  votes.push({
    id: 'vote-override-02',
    questId: 'quest-y2-22',
    studentId: 'student-07',
    topic: VOTE_TOPICS[16],
    options: VARIANT_OPTIONS.techVsNature,
    teacherVote: 'opt-science',
    studentVote: 'opt-tech',
    parentVote: 'opt-tech',
    status: 'override',
    decidedOption: 'opt-science',
    createdAt: baseTime - (35 * DAY),
    decidedAt: baseTime - (32 * DAY)
  })

  votes.push({
    id: 'vote-override-03',
    questId: 'quest-y3-25',
    studentId: 'student-10',
    topic: VOTE_TOPICS[17],
    options: VARIANT_OPTIONS.socialVsBusiness,
    teacherVote: 'opt-business',
    studentVote: 'opt-social',
    parentVote: 'opt-social',
    status: 'override',
    decidedOption: 'opt-business',
    createdAt: baseTime - (40 * DAY),
    decidedAt: baseTime - (37 * DAY)
  })

  return votes
}

// ============================================
// Statistics
// ============================================

export const DEMO_VOTES_STATS = {
  total: 18,
  byStatus: {
    pending: 7,
    decided: 8,
    override: 3
  },
  pendingNoVotes: 3,
  pendingPartial: 4,
  decidedMajority: 5,
  decidedTiebreak: 3
}
