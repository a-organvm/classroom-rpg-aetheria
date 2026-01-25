/**
 * English Literature Feedback Snippets
 *
 * 50+ reusable feedback comments organized by category.
 */

import type { FeedbackSnippet, FeedbackCategory } from '@/lib/types'
import { v4 as uuid } from 'uuid'

interface SnippetTemplate {
  content: string
  category: FeedbackCategory
}

const snippetTemplates: SnippetTemplate[] = [
  // ============================================
  // THESIS (8 snippets)
  // ============================================
  {
    content: 'Your thesis clearly states an arguable claim and previews your main points effectively.',
    category: 'thesis'
  },
  {
    content: 'Consider making your thesis more specific. What exactly are you arguing about this text?',
    category: 'thesis'
  },
  {
    content: 'Your thesis restates the prompt rather than offering an interpretation. What is YOUR argument?',
    category: 'thesis'
  },
  {
    content: 'Strong thesis! This gives your essay a clear direction and sets up an interesting argument.',
    category: 'thesis'
  },
  {
    content: 'Your thesis is too broad. Try narrowing your focus to a specific aspect of the text.',
    category: 'thesis'
  },
  {
    content: 'This reads more like a statement of fact than an arguable thesis. Can someone disagree with this?',
    category: 'thesis'
  },
  {
    content: 'Where is your thesis? Make sure to state your main argument clearly in the introduction.',
    category: 'thesis'
  },
  {
    content: 'Your thesis is hidden. Consider moving it to the end of your introduction for clarity.',
    category: 'thesis'
  },

  // ============================================
  // EVIDENCE (8 snippets)
  // ============================================
  {
    content: 'Excellent use of textual evidence! Your quotes directly support your argument.',
    category: 'evidence'
  },
  {
    content: 'You need more evidence from the text. Add specific quotes to support your claims.',
    category: 'evidence'
  },
  {
    content: 'This quote is too long. Trim it to only the essential words and integrate it into your sentence.',
    category: 'evidence'
  },
  {
    content: 'Your evidence is strong, but you need to explain how it supports your argument.',
    category: 'evidence'
  },
  {
    content: '"Dropped quote" - integrate this quote into your own sentence rather than letting it stand alone.',
    category: 'evidence'
  },
  {
    content: 'This evidence doesn\'t seem relevant to your point. Choose quotes that directly support your claim.',
    category: 'evidence'
  },
  {
    content: 'Good evidence, but cite the page number for all quotes from the text.',
    category: 'evidence'
  },
  {
    content: 'Consider using more variety in your evidence - include details, dialogue, and descriptions.',
    category: 'evidence'
  },

  // ============================================
  // ANALYSIS (8 snippets)
  // ============================================
  {
    content: 'Excellent analysis! You\'ve moved beyond summary to interpret the text\'s deeper meaning.',
    category: 'analysis'
  },
  {
    content: 'This paragraph summarizes the plot. Instead, analyze what this moment reveals about the character/theme.',
    category: 'analysis'
  },
  {
    content: 'Push your analysis deeper. Ask "so what?" and "why does this matter?"',
    category: 'analysis'
  },
  {
    content: 'You\'ve identified the literary device, but explain HOW it creates meaning or effect.',
    category: 'analysis'
  },
  {
    content: 'Strong close reading! Your attention to word choice reveals the author\'s craft.',
    category: 'analysis'
  },
  {
    content: 'Connect this analysis back to your thesis. How does this point support your main argument?',
    category: 'analysis'
  },
  {
    content: 'Consider the author\'s purpose. Why might they have made this particular choice?',
    category: 'analysis'
  },
  {
    content: 'Your analysis is too surface-level. Dig into the specific language and its implications.',
    category: 'analysis'
  },

  // ============================================
  // ORGANIZATION (6 snippets)
  // ============================================
  {
    content: 'Clear organization! Each paragraph focuses on one main idea with a clear topic sentence.',
    category: 'organization'
  },
  {
    content: 'Add topic sentences to clarify the main idea of each paragraph.',
    category: 'organization'
  },
  {
    content: 'Your ideas jump around. Consider reorganizing for a more logical flow.',
    category: 'organization'
  },
  {
    content: 'Strong transitions help your argument flow smoothly from point to point.',
    category: 'organization'
  },
  {
    content: 'This paragraph tries to do too much. Break it into smaller, focused paragraphs.',
    category: 'organization'
  },
  {
    content: 'Your conclusion should do more than summarize. End with insight about the text\'s significance.',
    category: 'organization'
  },

  // ============================================
  // CLARITY (6 snippets)
  // ============================================
  {
    content: 'Clear, precise writing! Your ideas are easy to follow.',
    category: 'clarity'
  },
  {
    content: 'This sentence is confusing. Try breaking it into shorter sentences.',
    category: 'clarity'
  },
  {
    content: 'Avoid vague words like "things," "stuff," or "very." Be specific.',
    category: 'clarity'
  },
  {
    content: 'Who is "they"? Make sure pronoun references are clear.',
    category: 'clarity'
  },
  {
    content: 'This passage is wordy. Cut unnecessary words to sharpen your prose.',
    category: 'clarity'
  },
  {
    content: 'Define this term. Don\'t assume the reader knows specialized vocabulary.',
    category: 'clarity'
  },

  // ============================================
  // CITATIONS (5 snippets)
  // ============================================
  {
    content: 'Perfect MLA format! Your citations are correctly formatted.',
    category: 'citations'
  },
  {
    content: 'Add parenthetical citations after all quotes and paraphrased material.',
    category: 'citations'
  },
  {
    content: 'Your Works Cited page has formatting errors. Review MLA guidelines.',
    category: 'citations'
  },
  {
    content: 'When citing poetry, include line numbers instead of page numbers.',
    category: 'citations'
  },
  {
    content: 'This looks like a paraphrase from a source but lacks citation.',
    category: 'citations'
  },

  // ============================================
  // GRAMMAR (6 snippets)
  // ============================================
  {
    content: 'Watch for comma splices. Use a period, semicolon, or conjunction between complete sentences.',
    category: 'grammar'
  },
  {
    content: 'Subject-verb agreement error. Make sure subjects and verbs match in number.',
    category: 'grammar'
  },
  {
    content: 'Use present tense when discussing literature (e.g., "Hamlet says" not "Hamlet said").',
    category: 'grammar'
  },
  {
    content: 'Run-on sentence. Break this into two sentences or add proper punctuation.',
    category: 'grammar'
  },
  {
    content: 'Sentence fragment. This needs a subject or verb to be complete.',
    category: 'grammar'
  },
  {
    content: 'Careful with apostrophes: "its" (possessive) vs. "it\'s" (it is).',
    category: 'grammar'
  },

  // ============================================
  // MECHANICS (5 snippets)
  // ============================================
  {
    content: 'Titles of novels, plays, and long poems should be italicized, not in quotes.',
    category: 'mechanics'
  },
  {
    content: 'Short story and poem titles go in quotation marks, not italics.',
    category: 'mechanics'
  },
  {
    content: 'Start a new paragraph when you change topics or introduce a new idea.',
    category: 'mechanics'
  },
  {
    content: 'Check your spelling. Several words are misspelled throughout.',
    category: 'mechanics'
  },
  {
    content: 'Remove contractions in formal academic writing (use "do not" instead of "don\'t").',
    category: 'mechanics'
  },

  // ============================================
  // POSITIVE (8 snippets)
  // ============================================
  {
    content: 'Excellent work! This essay demonstrates sophisticated literary analysis.',
    category: 'positive'
  },
  {
    content: 'I can see real growth in your writing. Keep developing these analytical skills.',
    category: 'positive'
  },
  {
    content: 'Your unique voice comes through clearly. This is engaging to read.',
    category: 'positive'
  },
  {
    content: 'Great insight! This interpretation shows deep engagement with the text.',
    category: 'positive'
  },
  {
    content: 'You\'ve clearly done the reading carefully. Your textual knowledge is impressive.',
    category: 'positive'
  },
  {
    content: 'Strong revision! This draft is much stronger than the previous version.',
    category: 'positive'
  },
  {
    content: 'Your creativity and risk-taking in this piece paid off beautifully.',
    category: 'positive'
  },
  {
    content: 'This is exactly the kind of close reading I was looking for. Well done!',
    category: 'positive'
  }
]

// Convert templates to full FeedbackSnippet objects
export const FEEDBACK_SNIPPETS: FeedbackSnippet[] = snippetTemplates.map((template, index) => ({
  id: `snippet-curriculum-${index + 1}`,
  content: template.content,
  category: template.category,
  usageCount: 0,
  createdAt: Date.now(),
  updatedAt: Date.now()
}))

// Group snippets by category for easy access
export const SNIPPETS_BY_CATEGORY: Record<FeedbackCategory, FeedbackSnippet[]> = {
  grammar: FEEDBACK_SNIPPETS.filter(s => s.category === 'grammar'),
  thesis: FEEDBACK_SNIPPETS.filter(s => s.category === 'thesis'),
  evidence: FEEDBACK_SNIPPETS.filter(s => s.category === 'evidence'),
  organization: FEEDBACK_SNIPPETS.filter(s => s.category === 'organization'),
  clarity: FEEDBACK_SNIPPETS.filter(s => s.category === 'clarity'),
  citations: FEEDBACK_SNIPPETS.filter(s => s.category === 'citations'),
  analysis: FEEDBACK_SNIPPETS.filter(s => s.category === 'analysis'),
  mechanics: FEEDBACK_SNIPPETS.filter(s => s.category === 'mechanics'),
  positive: FEEDBACK_SNIPPETS.filter(s => s.category === 'positive'),
  other: FEEDBACK_SNIPPETS.filter(s => s.category === 'other')
}

// Get count by category
export const SNIPPET_COUNTS: Record<FeedbackCategory, number> = Object.fromEntries(
  Object.entries(SNIPPETS_BY_CATEGORY).map(([cat, snippets]) => [cat, snippets.length])
) as Record<FeedbackCategory, number>
