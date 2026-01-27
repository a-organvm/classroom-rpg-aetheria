/**
 * Sandbox Mode Utilities
 * 
 * Provides a safe sandbox environment for external users (outsiders) to explore
 * the application without affecting real classroom data.
 * 
 * Sandbox mode features:
 * - Pre-populated demo data
 * - Isolated storage (separate from production data)
 * - Reset functionality
 * - Clear indicators that user is in sandbox mode
 */

import type {
  Realm,
  Quest,
  UserProfile,
  Submission,
  KnowledgeCrystal,
  ThreeWayVote,
  StudentPreferences,
  ThematicVariant,
  QuestStandardAlignment,
  StandardMastery,
  ParentAccount,
  ParentStudentLink
} from './types'
import { DEFAULT_AVATAR } from './avatar-options'
import { getDemoVotes } from './demo-votes'
import { getDemoPreferences } from './demo-preferences'
import { getDemoVariants, type QuestVariants } from './demo-variants'
import { getDemoAlignments, getDemoMastery } from './demo-standards-data'

export const SANDBOX_MODE_KEY = 'aetheria-sandbox-mode'
export const SANDBOX_DATA_VERSION = '1.0.0'

/**
 * Check if sandbox mode is currently active
 */
export function isSandboxMode(): boolean {
  // Check URL parameter (only in browser environment)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('sandbox') === 'true' || urlParams.get('demo') === 'true') {
      return true
    }
  }
  
  // Check localStorage (only in browser environment)
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(SANDBOX_MODE_KEY)
    return stored === 'true'
  }
  
  return false
}

/**
 * Enable sandbox mode
 */
export function enableSandboxMode(): void {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage not available - cannot enable sandbox mode')
    return
  }
  localStorage.setItem(SANDBOX_MODE_KEY, 'true')
  console.log('🏖️ Sandbox mode enabled - You are exploring with demo data')
}

/**
 * Disable sandbox mode
 */
export function disableSandboxMode(): void {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage not available - cannot disable sandbox mode')
    return
  }
  localStorage.removeItem(SANDBOX_MODE_KEY)
  console.log('✅ Sandbox mode disabled - Returning to normal mode')
}

/**
 * Toggle sandbox mode
 */
export function toggleSandboxMode(): boolean {
  const current = isSandboxMode()
  if (current) {
    disableSandboxMode()
  } else {
    enableSandboxMode()
  }
  return !current
}

/**
 * Get sandbox-aware storage key
 * In sandbox mode, prepends 'sandbox-' to all keys to isolate data
 */
export function getSandboxKey(key: string): string {
  return isSandboxMode() ? `sandbox-${key}` : key
}

/**
 * Reset sandbox data to default demo state
 */
export function resetSandboxData(): void {
  if (!isSandboxMode()) {
    console.warn('Cannot reset sandbox data when not in sandbox mode')
    return
  }
  
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage not available - cannot reset sandbox data')
    return
  }
  
  // Clear all sandbox keys
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('sandbox-')) {
      keysToRemove.push(key)
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key))
  
  console.log('🔄 Sandbox data reset to defaults')
}

/**
 * Get demo/sample realms for sandbox mode
 */
export function getDemoRealms(): Realm[] {
  return [
    {
      id: 'realm-demo-1',
      name: 'Mathematics Archipelago',
      description: 'A mystical chain of islands where numbers come alive and equations dance in the wind. Master the ancient arts of algebra and geometry.',
      color: '#3b82f6',
      icon: '🏝️',
      questIds: ['quest-demo-1', 'quest-demo-2'],
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000 // 60 days ago
    },
    {
      id: 'realm-demo-2',
      name: 'Science Citadel',
      description: 'A towering fortress of discovery where physics, chemistry, and biology converge. Conduct experiments and unlock the secrets of the natural world.',
      color: '#10b981',
      icon: '🔬',
      questIds: ['quest-demo-3'],
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000 // 45 days ago
    },
    {
      id: 'realm-demo-3',
      name: 'Literature Labyrinth',
      description: 'An ever-shifting maze of stories and poems. Navigate through classic tales and modern narratives to find your way to literary mastery.',
      color: '#8b5cf6',
      icon: '📚',
      questIds: ['quest-demo-4'],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
    }
  ]
}

/**
 * Get demo/sample quests for sandbox mode
 */
export function getDemoQuests(): Quest[] {
  return [
    {
      id: 'quest-demo-1',
      realmId: 'realm-demo-1',
      name: 'The Equation Enigma',
      description: 'Ancient scrolls have been discovered containing mysterious equations. Solve them to unlock the first portal of the Mathematics Archipelago.',
      difficulty: 'beginner',
      xpValue: 50,
      objectives: [
        'Solve the quadratic equation: x² - 5x + 6 = 0',
        'Find the slope of the line passing through (2,3) and (4,7)',
        'Calculate the area of a circle with radius 5'
      ],
      status: 'available',
      type: 'learning',
      unlockConditions: [],
      createdAt: Date.now() - 55 * 24 * 60 * 60 * 1000 // 55 days ago
    },
    {
      id: 'quest-demo-2',
      realmId: 'realm-demo-1',
      name: 'Geometric Guardians',
      description: 'Three geometric guardians block your path. Answer their riddles about shapes, angles, and transformations to proceed.',
      difficulty: 'beginner',
      xpValue: 75,
      objectives: [
        'Calculate the sum of interior angles in a pentagon',
        'Identify the transformation: reflecting over the x-axis',
        'Find the volume of a cube with side length 4'
      ],
      status: 'locked',
      type: 'challenge',
      unlockConditions: ['quest-demo-1'],
      createdAt: Date.now() - 50 * 24 * 60 * 60 * 1000 // 50 days ago
    },
    {
      id: 'quest-demo-3',
      realmId: 'realm-demo-2',
      name: 'Chemistry Conundrum',
      description: 'The Citadel\'s laboratory needs your help! Balance chemical equations and identify compounds to restore order to the Science Citadel.',
      difficulty: 'intermediate',
      xpValue: 100,
      objectives: [
        'Balance the equation: H₂ + O₂ → H₂O',
        'Identify the compound with formula NaCl',
        'Explain the process of photosynthesis'
      ],
      status: 'available',
      type: 'learning',
      unlockConditions: [],
      createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000 // 40 days ago
    },
    {
      id: 'quest-demo-4',
      realmId: 'realm-demo-3',
      name: 'Tale of Two Poets',
      description: 'Compare and contrast two famous poems from different eras. Analyze their themes, structures, and historical contexts.',
      difficulty: 'advanced',
      xpValue: 150,
      objectives: [
        'Identify the rhyme scheme of a Shakespearean sonnet',
        'Analyze the use of metaphor in "The Road Not Taken"',
        'Compare themes between classical and modern poetry'
      ],
      status: 'available',
      type: 'essay',
      unlockConditions: [],
      createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000 // 25 days ago
    }
  ]
}

/**
 * Get demo user profile for sandbox mode
 */
export function getDemoProfile(): UserProfile {
  return {
    id: 'demo-user-1',
    name: 'Explorer',
    role: 'student',
    xp: 125,
    level: 2,
    artifacts: [
      {
        id: 'artifact-demo-1',
        name: 'Beginner\'s Compass',
        description: 'A mystical compass that guides new adventurers through their first quests.',
        rarity: 'common',
        questId: 'quest-demo-1',
        earnedAt: Date.now() - 24 * 60 * 60 * 1000 // 1 day ago
      }
    ],
    avatar: DEFAULT_AVATAR
  }
}

/**
 * Get demo submissions for sandbox mode
 */
export function getDemoSubmissions(): Submission[] {
  return [
    {
      id: 'submission-demo-1',
      questId: 'quest-demo-1',
      studentId: 'demo-user-1',
      content: 'Solutions:\n1. x = 2 or x = 3\n2. slope = 2\n3. area ≈ 78.54 square units',
      submittedAt: Date.now() - 24 * 60 * 60 * 1000,
      status: 'evaluated',
      score: 95,
      feedback: 'Excellent work! All solutions are correct and well-explained.',
      evaluatedAt: Date.now() - 23 * 60 * 60 * 1000
    }
  ]
}

/**
 * Get demo knowledge crystals for sandbox mode
 */
export function getDemoCrystals(): KnowledgeCrystal[] {
  return [
    {
      id: 'crystal-demo-1',
      title: 'Quadratic Mastery',
      content: 'You have mastered the art of solving quadratic equations! Remember: use the quadratic formula x = (-b ± √(b²-4ac)) / 2a',
      questId: 'quest-demo-1',
      studentId: 'demo-user-1',
      isAttuned: true,
      createdAt: Date.now() - 23 * 60 * 60 * 1000,
      rarity: 'rare'
    }
  ]
}

/**
 * Get demo parent accounts for sandbox mode
 */
export function getDemoParentAccounts(): ParentAccount[] {
  return [
    {
      id: 'parent-01',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      linkedStudentIds: ['demo-user-1'],
      notificationPreferences: {
        email: true,
        inApp: true,
        voteReminders: true
      },
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
    },
    {
      id: 'parent-02',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      linkedStudentIds: [],
      notificationPreferences: {
        email: true,
        inApp: true,
        voteReminders: false
      },
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000 // 14 days ago
    },
    {
      id: 'parent-03',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      linkedStudentIds: ['student-emma-01'],
      notificationPreferences: {
        email: false,
        inApp: true,
        voteReminders: true
      },
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000 // 45 days ago
    }
  ]
}

/**
 * Get demo parent-student link requests for sandbox mode
 */
export function getDemoLinkRequests(): ParentStudentLink[] {
  return [
    // Approved link: parent-01 linked to demo-user-1
    {
      id: 'link-req-01',
      parentId: 'parent-01',
      studentId: 'demo-user-1',
      status: 'approved',
      requestedAt: Date.now() - 29 * 24 * 60 * 60 * 1000,
      resolvedAt: Date.now() - 28 * 24 * 60 * 60 * 1000
    },
    // Pending link: parent-02 wants to link to demo-user-1
    {
      id: 'link-req-02',
      parentId: 'parent-02',
      studentId: 'demo-user-1',
      status: 'pending',
      requestedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    // Approved link: parent-03 linked to student-emma-01
    {
      id: 'link-req-03',
      parentId: 'parent-03',
      studentId: 'student-emma-01',
      status: 'approved',
      requestedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
      resolvedAt: Date.now() - 39 * 24 * 60 * 60 * 1000
    },
    // Rejected link example
    {
      id: 'link-req-04',
      parentId: 'parent-02',
      studentId: 'student-emma-01',
      status: 'rejected',
      requestedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      resolvedAt: Date.now() - 9 * 24 * 60 * 60 * 1000
    }
  ]
}

/**
 * Get demo student profiles for parent linking
 */
export function getDemoStudentProfiles(): UserProfile[] {
  return [
    {
      id: 'demo-user-1',
      name: 'Explorer',
      role: 'student',
      xp: 125,
      level: 2,
      artifacts: [
        {
          id: 'artifact-demo-1',
          name: 'Beginner\'s Compass',
          description: 'A mystical compass that guides new adventurers.',
          rarity: 'common',
          questId: 'quest-demo-1',
          earnedAt: Date.now() - 24 * 60 * 60 * 1000
        }
      ],
      avatar: DEFAULT_AVATAR
    },
    {
      id: 'student-emma-01',
      name: 'Emma Rodriguez',
      role: 'student',
      xp: 450,
      level: 5,
      artifacts: [
        {
          id: 'artifact-emma-1',
          name: 'Scholar\'s Quill',
          description: 'A magical quill that enhances writing abilities.',
          rarity: 'rare',
          questId: 'quest-demo-3',
          earnedAt: Date.now() - 14 * 24 * 60 * 60 * 1000
        }
      ],
      avatar: DEFAULT_AVATAR
    },
    {
      id: 'student-alex-01',
      name: 'Alex Thompson',
      role: 'student',
      xp: 275,
      level: 3,
      artifacts: [],
      avatar: DEFAULT_AVATAR
    }
  ]
}

/**
 * Initialize sandbox data if needed
 */
export function initializeSandboxData(): {
  realms: Realm[]
  quests: Quest[]
  profile: UserProfile
  submissions: Submission[]
  crystals: KnowledgeCrystal[]
  votes: ThreeWayVote[]
  studentPrefs: StudentPreferences[]
  variants: QuestVariants[]
  alignments: QuestStandardAlignment[]
  mastery: StandardMastery[]
  parentAccounts: ParentAccount[]
  linkRequests: ParentStudentLink[]
  studentProfiles: UserProfile[]
} {
  if (!isSandboxMode()) {
    throw new Error('Cannot initialize sandbox data when not in sandbox mode')
  }

  return {
    realms: getDemoRealms(),
    quests: getDemoQuests(),
    profile: getDemoProfile(),
    submissions: getDemoSubmissions(),
    crystals: getDemoCrystals(),
    votes: getDemoVotes(),
    studentPrefs: getDemoPreferences(),
    variants: getDemoVariants(),
    alignments: getDemoAlignments(),
    mastery: getDemoMastery(),
    parentAccounts: getDemoParentAccounts(),
    linkRequests: getDemoLinkRequests(),
    studentProfiles: getDemoStudentProfiles()
  }
}

// ============================================
// Sandbox Storage Keys
// ============================================

export const SANDBOX_STORAGE_KEYS = {
  realms: 'aetheria-realms',
  quests: 'aetheria-quests',
  profile: 'aetheria-profile',
  submissions: 'aetheria-submissions',
  crystals: 'aetheria-crystals',
  votes: 'aetheria-votes',
  studentPrefs: 'aetheria-student-prefs',
  variants: 'aetheria-variants',
  alignments: 'aetheria-alignments',
  mastery: 'aetheria-mastery',
  parentAccounts: 'aetheria-parent-accounts',
  linkRequests: 'aetheria-parent-link-requests',
  studentProfiles: 'aetheria-student-profiles'
} as const

/**
 * Get sandbox banner message
 */
export function getSandboxBanner(): string {
  return '🏖️ SANDBOX MODE: You are exploring with demo data. Changes will not affect real classrooms.'
}

/**
 * Check if data needs initialization in sandbox mode
 */
export function needsSandboxInitialization(): boolean {
  if (!isSandboxMode()) {
    return false
  }

  if (typeof localStorage === 'undefined') {
    return false
  }

  // Check if sandbox data exists
  const hasRealms = localStorage.getItem(getSandboxKey('aetheria-realms'))
  const hasQuests = localStorage.getItem(getSandboxKey('aetheria-quests'))

  return !hasRealms || !hasQuests
}

// ============================================
// Re-export Demo Data Functions
// ============================================

export { getDemoVotes } from './demo-votes'
export { getDemoPreferences } from './demo-preferences'
export { getDemoVariants, type QuestVariants } from './demo-variants'
export { getDemoAlignments, getDemoMastery } from './demo-standards-data'

/**
 * Initialize all sandbox demo data to localStorage (for dev mode)
 * Call this ONCE at app startup before any hooks mount
 */
export function initializeLocalStorageSandboxData(): void {
  if (!isSandboxMode() || typeof localStorage === 'undefined') {
    return
  }

  // Check if already initialized
  const hasRealms = localStorage.getItem(getSandboxKey('aetheria-realms'))
  const hasQuests = localStorage.getItem(getSandboxKey('aetheria-quests'))
  if (hasRealms && hasQuests) {
    return // Already initialized
  }

  // Get all demo data
  const demoData = initializeSandboxData()

  // Write ALL keys to localStorage at once
  const keyDataPairs = [
    ['aetheria-realms', demoData.realms],
    ['aetheria-quests', demoData.quests],
    ['aetheria-profile', demoData.profile],
    ['aetheria-submissions', demoData.submissions],
    ['aetheria-crystals', demoData.crystals],
    ['aetheria-all-profiles', [demoData.profile]],
    ['aetheria-votes', demoData.votes],
    ['aetheria-student-prefs', demoData.studentPrefs],
    ['aetheria-variants', demoData.variants],
    ['aetheria-alignments', demoData.alignments],
    ['aetheria-mastery', demoData.mastery],
    ['aetheria-parent-accounts', demoData.parentAccounts],
    ['aetheria-parent-link-requests', demoData.linkRequests],
    ['aetheria-student-profiles', demoData.studentProfiles],
  ] as const

  for (const [key, data] of keyDataPairs) {
    const sandboxKey = getSandboxKey(key)
    localStorage.setItem(sandboxKey, JSON.stringify(data))
  }

  console.log('🏖️ Sandbox demo data initialized to localStorage')
}
