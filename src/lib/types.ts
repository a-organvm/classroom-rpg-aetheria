export type Theme = 'fantasy' | 'scifi' | 'medieval' | 'modern'
export type Role = 'teacher' | 'student'

export interface ThemeConfig {
  name: string
  teacherTitle: string
  studentTitle: string
  realmLabel: string
  questLabel: string
  archiveLabel: string
  oracleLabel: string
  xpLabel: string
  geometry: 'octahedron' | 'icosahedron' | 'dodecahedron' | 'sphere'
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  fantasy: {
    name: 'High Fantasy',
    teacherTitle: 'Game Master',
    studentTitle: 'Adventurer',
    realmLabel: 'Realm',
    questLabel: 'Quest',
    archiveLabel: 'Archives',
    oracleLabel: 'Oracle',
    xpLabel: 'Glory',
    geometry: 'octahedron'
  },
  scifi: {
    name: 'Cyberpunk',
    teacherTitle: 'Admin',
    studentTitle: 'Operative',
    realmLabel: 'Sector',
    questLabel: 'Mission',
    archiveLabel: 'Database',
    oracleLabel: 'AI Core',
    xpLabel: 'Data',
    geometry: 'icosahedron'
  },
  medieval: {
    name: 'Royal Court',
    teacherTitle: 'Lord',
    studentTitle: 'Vassal',
    realmLabel: 'Domain',
    questLabel: 'Decree',
    archiveLabel: 'Library',
    oracleLabel: 'Council',
    xpLabel: 'Honor',
    geometry: 'dodecahedron'
  },
  modern: {
    name: 'Glass Classroom',
    teacherTitle: 'Teacher',
    studentTitle: 'Student',
    realmLabel: 'Course',
    questLabel: 'Assignment',
    archiveLabel: 'Resources',
    oracleLabel: 'Evaluator',
    xpLabel: 'Points',
    geometry: 'sphere'
  }
}

export interface Realm {
  id: string
  name: string
  description: string
  color: string
  position?: { x: number; y: number; z: number }
  createdAt: number
}

export type QuestType = 'standard' | 'boss' | 'redemption'
export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed'

export interface Quest {
  id: string
  realmId: string
  name: string
  description: string
  type: QuestType
  xpValue: number
  dueDate?: number
  status: QuestStatus
  prerequisiteIds?: string[]
  createdAt: number
}

export interface Submission {
  id: string
  questId: string
  studentId: string
  content: string
  score?: number
  feedback?: string
  submittedAt: number
  evaluatedAt?: number
  rubricScores?: Record<string, number>
}

export interface KnowledgeCrystal {
  id: string
  questId: string
  studentId: string
  title: string
  content: string
  isAttuned: boolean
  createdAt: number
}

export interface Artifact {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: number
  questId: string
}

export interface AvatarCustomization {
  skinTone: string
  hairStyle: string
  hairColor: string
  eyeColor: string
  bodyType: string
  outfit: string
  outfitColor: string
  accessories: string[]
}

export interface UserProfile {
  id: string
  name: string
  avatarUrl?: string
  avatar?: AvatarCustomization
  role: Role
  xp: number
  level: number
  artifacts: Artifact[]
}

export interface ConstellationNode {
  id: string
  questId: string
  x: number
  y: number
  status: 'unlit' | 'lit'
  connections: string[]
}

// ============================================
// Educator Dashboard Extended Types
// ============================================

/**
 * Feedback snippet - reusable feedback comment
 */
export interface FeedbackSnippet {
  id: string
  content: string
  category: FeedbackCategory
  justification?: string  // AI explanation for category
  usageCount: number
  createdAt: number
  updatedAt: number
}

export type FeedbackCategory =
  | 'grammar'
  | 'thesis'
  | 'evidence'
  | 'organization'
  | 'clarity'
  | 'citations'
  | 'analysis'
  | 'mechanics'
  | 'positive'
  | 'other'

export const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: 'grammar', label: 'Grammar' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'evidence', label: 'Evidence' },
  { value: 'organization', label: 'Organization' },
  { value: 'clarity', label: 'Clarity' },
  { value: 'citations', label: 'Citations' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'mechanics', label: 'Mechanics' },
  { value: 'positive', label: 'Positive Feedback' },
  { value: 'other', label: 'Other' }
]

/**
 * Syllabus document for a realm/course
 */
export interface Syllabus {
  id: string
  realmId: string
  title: string
  content?: string  // Text content if uploaded as text
  fileUrl?: string  // Firebase Storage URL
  storagePath?: string  // Path for deletion
  fileName?: string
  fileSize?: number
  createdAt: number
  updatedAt: number
}

/**
 * Student work sample with feedback
 */
export interface StudentSample {
  id: string
  questId: string
  realmId: string
  studentName: string  // Anonymous/pseudonymous
  content?: string  // Text content
  fileUrl?: string  // Firebase Storage URL
  storagePath?: string
  fileName?: string
  fileSize?: number
  feedback?: string
  grade?: string
  snippetIds?: string[]  // Feedback snippets used
  createdAt: number
  updatedAt: number
}

/**
 * Structured rubric data
 */
export interface RubricCriterion {
  id: string
  name: string
  description: string
  weight: number  // Percentage weight
  levels: RubricLevel[]
}

export interface RubricLevel {
  score: number
  label: string
  description: string
}

export interface RubricData {
  id: string
  name: string
  description?: string
  criteria: RubricCriterion[]
  totalPoints: number
  createdAt: number
  updatedAt: number
}

/**
 * Grading scale for a realm/course
 */
export interface GradeLevel {
  grade: string
  minScore: number
  maxScore: number
}

/**
 * Extended Realm with educator features
 */
export interface RealmExtended extends Realm {
  syllabi?: string[]  // Syllabus IDs
  gradingScale?: GradeLevel[]
  defaultRubricId?: string
}

/**
 * Extended Quest with file attachments and structured rubric
 */
export interface QuestExtended extends Quest {
  instructionsFileUrl?: string
  instructionsStoragePath?: string
  rubricFileUrl?: string
  rubricStoragePath?: string
  rubricData?: RubricData
  maxScore?: number
}

/**
 * Extended Submission with snippet tracking
 */
export interface SubmissionExtended extends Submission {
  snippetIds?: string[]  // Feedback snippets used
  fileUrl?: string
  storagePath?: string
}

/**
 * AI Consent state
 */
export interface AIConsentState {
  hasConsented: boolean
  consentedAt?: number
  version: string
}

/**
 * Feedback insights/analytics
 */
export interface FeedbackInsight {
  id: string
  type: 'trend' | 'suggestion' | 'pattern'
  title: string
  description: string
  category?: FeedbackCategory
  snippetId?: string
  createdAt: number
}

/**
 * Report configuration
 */
export interface ReportConfig {
  type: 'transcript' | 'mastery' | 'progress'
  realmId?: string
  studentId?: string
  dateRange?: {
    start: number
    end: number
  }
  includeComments: boolean
  format: 'pdf' | 'csv' | 'json'
}
