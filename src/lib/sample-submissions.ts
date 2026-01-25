/**
 * Sample Submissions - Test Data
 *
 * 100+ sample submissions across students and quests for testing.
 */

import type { Submission, KnowledgeCrystal } from '@/lib/types'
import { TEST_STUDENTS, getRandomScore } from './test-students'
import { ALL_QUESTS } from './curriculum'
import { v4 as uuid } from 'uuid'

// ============================================
// Sample Feedback Templates
// ============================================

const feedbackTemplates = {
  high: [
    'Excellent analysis that demonstrates sophisticated understanding of the text. Your thesis is compelling and well-supported throughout.',
    'Outstanding work! Your close reading skills are impressive, and you\'ve made meaningful connections that show deep engagement with the material.',
    'This is exemplary writing. Your argument is nuanced, evidence is well-integrated, and your prose is polished.',
    'Superb analysis with clear organization and insightful interpretations. This is college-level work.'
  ],
  'mid-high': [
    'Strong analysis with good textual support. Consider pushing your interpretation a bit deeper in places.',
    'Well-organized essay with clear thesis. Some of your analysis could be more specific—dig into the language more.',
    'Good work overall. Your ideas are strong; now focus on more sophisticated integration of quotes.',
    'Solid understanding demonstrated. The argument would be strengthened by addressing potential counterarguments.'
  ],
  mid: [
    'You\'ve shown understanding of the text, but your analysis stays at the surface level. Push deeper—ask "so what?"',
    'Thesis is present but could be more specific. Focus on what the text means, not just what happens.',
    'Good effort. Work on integrating quotes more smoothly and explaining their significance.',
    'You have interesting ideas that need more development. Expand your analysis paragraphs.'
  ],
  'mid-low': [
    'I can see you\'re working hard. Focus on developing a clear thesis statement first, then build evidence around it.',
    'Your summary is accurate, but you need to move beyond plot to interpretation. What does it mean?',
    'More textual evidence needed. Every claim should be supported with specific quotes from the text.',
    'Review the paragraph structure we discussed. Each paragraph needs a clear topic sentence and analysis.'
  ],
  low: [
    'Let\'s work together on understanding the assignment requirements. Please see me during office hours.',
    'This submission doesn\'t meet the minimum requirements. Please review the rubric and resubmit.',
    'I notice you may be struggling with the material. Let\'s set up a time to review the basics.',
    'The assignment asks for analysis, not summary. Please review the examples we discussed in class.'
  ],
  variable: [
    'When you\'re engaged, your work is excellent! This shows what you\'re capable of—bring this energy consistently.',
    'This is stronger than your last submission. Keep building on this momentum.',
    'I know you can do better than this. What happened? Let\'s talk about what support you need.',
    'Inconsistent effort showing. The strong parts are really strong—now apply that to the whole piece.'
  ]
}

// ============================================
// Generate Submissions
// ============================================

function generateSubmission(
  studentId: string,
  questId: string,
  performanceLevel: keyof typeof feedbackTemplates,
  scoreRange: [number, number],
  index: number
): Submission {
  const score = Math.floor(Math.random() * (scoreRange[1] - scoreRange[0] + 1)) + scoreRange[0]
  const feedback = feedbackTemplates[performanceLevel][
    Math.floor(Math.random() * feedbackTemplates[performanceLevel].length)
  ]

  const submittedAt = Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000) // Random within last 30 days
  const evaluatedAt = submittedAt + (Math.random() * 3 * 24 * 60 * 60 * 1000) // 0-3 days after submission

  return {
    id: `submission-${index.toString().padStart(4, '0')}`,
    questId,
    studentId,
    content: `[Student submission content for quest ${questId}]`,
    score,
    feedback,
    submittedAt,
    evaluatedAt,
    rubricScores: {
      'thesis': Math.floor(score * 0.25 / 25 * 4),
      'evidence': Math.floor(score * 0.25 / 25 * 4),
      'analysis': Math.floor(score * 0.30 / 30 * 4),
      'mechanics': Math.floor(score * 0.20 / 20 * 4)
    }
  }
}

// Generate 100+ submissions
export const SAMPLE_SUBMISSIONS: Submission[] = []

let submissionIndex = 1
const questsToUse = ALL_QUESTS.slice(0, 30) // Use first 30 quests

TEST_STUDENTS.forEach(student => {
  // Each student completes 5-8 quests based on performance
  const questCount = student.performanceLevel === 'low' ? 3 :
                     student.performanceLevel === 'mid-low' ? 4 :
                     student.performanceLevel === 'variable' ? 5 :
                     student.performanceLevel === 'mid' ? 5 :
                     student.performanceLevel === 'mid-high' ? 6 : 7

  // Get year-appropriate quests
  const yearQuestPrefix = `quest-y${student.gradeYear}-`
  const yearQuests = ALL_QUESTS.filter(q => q.id.startsWith(yearQuestPrefix)).slice(0, questCount)

  yearQuests.forEach(quest => {
    SAMPLE_SUBMISSIONS.push(
      generateSubmission(
        student.id,
        quest.id,
        student.performanceLevel,
        student.scoreRange,
        submissionIndex++
      )
    )
  })
})

// ============================================
// Knowledge Crystals for Failed Quests
// ============================================

export const SAMPLE_KNOWLEDGE_CRYSTALS: KnowledgeCrystal[] = []

// Generate knowledge crystals for low-scoring submissions
const failedSubmissions = SAMPLE_SUBMISSIONS.filter(s => s.score && s.score < 60)

failedSubmissions.slice(0, 15).forEach((submission, index) => {
  const quest = ALL_QUESTS.find(q => q.id === submission.questId)
  if (!quest) return

  SAMPLE_KNOWLEDGE_CRYSTALS.push({
    id: `crystal-${(index + 1).toString().padStart(3, '0')}`,
    questId: submission.questId,
    studentId: submission.studentId,
    title: `Mastering ${quest.name}`,
    content: `
<h2>Key Concepts</h2>
<p>This quest focused on ${quest.description.split('.')[0].toLowerCase()}. Here's what you need to understand:</p>

<h3>1. Main Concept</h3>
<p>The core idea is understanding how literary elements work together to create meaning. Remember:</p>
<ul>
  <li>Always start with the text itself</li>
  <li>Look for patterns in language, imagery, and structure</li>
  <li>Connect your observations to larger themes</li>
</ul>

<h3>2. Common Pitfalls</h3>
<p>Many students struggle with:</p>
<ul>
  <li>Summarizing instead of analyzing</li>
  <li>Making claims without textual evidence</li>
  <li>Forgetting to explain how evidence supports the thesis</li>
</ul>

<h3>3. Success Strategies</h3>
<p>To improve:</p>
<ul>
  <li>Ask "so what?" after every claim</li>
  <li>Use the TEEL paragraph structure</li>
  <li>Practice close reading of small passages</li>
</ul>

<h3>Practice Questions</h3>
<ol>
  <li>What is the difference between summary and analysis?</li>
  <li>How do you integrate a quote smoothly into your writing?</li>
  <li>What makes a thesis arguable vs. obvious?</li>
</ol>
    `.trim(),
    isAttuned: Math.random() > 0.5,
    createdAt: Date.now() - (Math.random() * 14 * 24 * 60 * 60 * 1000)
  })
})

// ============================================
// Utility Functions
// ============================================

/**
 * Get submissions for a specific student
 */
export function getSubmissionsByStudent(studentId: string): Submission[] {
  return SAMPLE_SUBMISSIONS.filter(s => s.studentId === studentId)
}

/**
 * Get submissions for a specific quest
 */
export function getSubmissionsByQuest(questId: string): Submission[] {
  return SAMPLE_SUBMISSIONS.filter(s => s.questId === questId)
}

/**
 * Get knowledge crystals for a student
 */
export function getCrystalsByStudent(studentId: string): KnowledgeCrystal[] {
  return SAMPLE_KNOWLEDGE_CRYSTALS.filter(c => c.studentId === studentId)
}

/**
 * Get average score for a student
 */
export function getStudentAverageScore(studentId: string): number {
  const submissions = getSubmissionsByStudent(studentId)
  if (submissions.length === 0) return 0
  const total = submissions.reduce((sum, s) => sum + (s.score || 0), 0)
  return Math.round(total / submissions.length)
}

/**
 * Get class average for a quest
 */
export function getQuestAverageScore(questId: string): number {
  const submissions = getSubmissionsByQuest(questId)
  if (submissions.length === 0) return 0
  const total = submissions.reduce((sum, s) => sum + (s.score || 0), 0)
  return Math.round(total / submissions.length)
}

// ============================================
// Statistics
// ============================================

export const SUBMISSION_STATS = {
  total: SAMPLE_SUBMISSIONS.length,
  averageScore: Math.round(
    SAMPLE_SUBMISSIONS.reduce((sum, s) => sum + (s.score || 0), 0) / SAMPLE_SUBMISSIONS.length
  ),
  scoreDistribution: {
    'A (90-100)': SAMPLE_SUBMISSIONS.filter(s => s.score && s.score >= 90).length,
    'B (80-89)': SAMPLE_SUBMISSIONS.filter(s => s.score && s.score >= 80 && s.score < 90).length,
    'C (70-79)': SAMPLE_SUBMISSIONS.filter(s => s.score && s.score >= 70 && s.score < 80).length,
    'D (60-69)': SAMPLE_SUBMISSIONS.filter(s => s.score && s.score >= 60 && s.score < 70).length,
    'F (0-59)': SAMPLE_SUBMISSIONS.filter(s => s.score && s.score < 60).length
  },
  knowledgeCrystals: SAMPLE_KNOWLEDGE_CRYSTALS.length,
  attunedCrystals: SAMPLE_KNOWLEDGE_CRYSTALS.filter(c => c.isAttuned).length
}
