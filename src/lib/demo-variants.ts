/**
 * Demo Variants - Thematic Quest Variants Demo Data
 *
 * Generates ThematicVariant arrays for quests.
 * Distribution:
 * - 3 quests with full 8 variants each
 * - 5 quests with partial 3-4 variants
 */

import type { ThematicVariant, ThematicInterest } from './types'

// ============================================
// Types
// ============================================

export interface QuestVariants {
  questId: string
  variants: ThematicVariant[]
}

// ============================================
// Variant Templates
// ============================================

interface VariantTemplate {
  interestArea: ThematicInterest
  titleSuffix: string
  descriptionTemplate: string
  contentTemplate: string
  resourcesTemplate: string[]
}

const VARIANT_TEMPLATES: VariantTemplate[] = [
  {
    interestArea: 'sports',
    titleSuffix: '(Sports Edition)',
    descriptionTemplate: 'Explore this concept through the lens of athletics, competition, and teamwork.',
    contentTemplate: 'Apply your analysis skills to sports narratives, athlete biographies, and game strategies. Consider how competition, teamwork, and perseverance mirror themes in literature.',
    resourcesTemplate: [
      'Sports Illustrated article excerpts',
      'Documentary clips on athlete journeys',
      'Team dynamics case studies'
    ]
  },
  {
    interestArea: 'science',
    titleSuffix: '(Science Edition)',
    descriptionTemplate: 'Discover connections between literature and scientific discovery.',
    contentTemplate: 'Examine how scientific concepts and the spirit of discovery appear in literary works. Analyze the relationship between empirical observation and creative interpretation.',
    resourcesTemplate: [
      'Science journal excerpts',
      'Lab notebook examples',
      'Science communication articles'
    ]
  },
  {
    interestArea: 'arts',
    titleSuffix: '(Arts Edition)',
    descriptionTemplate: 'Connect literary analysis with visual arts, music, and performance.',
    contentTemplate: 'Explore how artistic mediums complement and enhance literary interpretation. Consider the interplay between text and visual/auditory expression.',
    resourcesTemplate: [
      'Museum virtual tours',
      'Artist statement examples',
      'Music composition analysis'
    ]
  },
  {
    interestArea: 'technology',
    titleSuffix: '(Tech Edition)',
    descriptionTemplate: 'Explore how technology shapes narrative and communication.',
    contentTemplate: 'Analyze the intersection of technology and storytelling. Consider how digital tools and innovations transform how we read, write, and share stories.',
    resourcesTemplate: [
      'Tech startup case studies',
      'Digital storytelling platforms',
      'Innovation timeline graphics'
    ]
  },
  {
    interestArea: 'nature',
    titleSuffix: '(Nature Edition)',
    descriptionTemplate: 'Connect literary themes with environmental and ecological perspectives.',
    contentTemplate: 'Examine how nature imagery and environmental themes enrich literary works. Analyze the relationship between humans and the natural world in literature.',
    resourcesTemplate: [
      'Nature documentary clips',
      'Environmental essays',
      'Ecological field guides'
    ]
  },
  {
    interestArea: 'social-justice',
    titleSuffix: '(Social Justice Edition)',
    descriptionTemplate: 'Explore themes of equity, activism, and community through literature.',
    contentTemplate: 'Analyze how literature addresses social issues, advocates for change, and gives voice to marginalized communities. Consider the power of storytelling for social transformation.',
    resourcesTemplate: [
      'Activist speech transcripts',
      'Documentary excerpts on movements',
      'Community organizing guides'
    ]
  },
  {
    interestArea: 'business',
    titleSuffix: '(Business Edition)',
    descriptionTemplate: 'Apply literary analysis skills to business communication and entrepreneurship.',
    contentTemplate: 'Explore how storytelling and narrative techniques apply to business contexts. Analyze persuasive communication, brand narratives, and leadership communication.',
    resourcesTemplate: [
      'Business case studies',
      'TED talks on leadership',
      'Marketing campaign analyses'
    ]
  },
  {
    interestArea: 'general',
    titleSuffix: '(Classic Edition)',
    descriptionTemplate: 'Traditional academic approach to literary analysis.',
    contentTemplate: 'Apply foundational literary analysis techniques to examine themes, characters, and narrative structures. Develop close reading and critical thinking skills.',
    resourcesTemplate: [
      'Literary criticism excerpts',
      'Academic journal articles',
      'Author interviews'
    ]
  }
]

// ============================================
// Quest-Specific Variant Data
// ============================================

interface QuestVariantConfig {
  questId: string
  questTitle: string
  questContext: string
  fullVariants: boolean
}

const QUEST_CONFIGS: QuestVariantConfig[] = [
  // Full variants (8 each) - 3 quests
  {
    questId: 'quest-y1-03',
    questTitle: 'The Lottery of Fate',
    questContext: 'Shirley Jackson\'s "The Lottery" analysis focusing on tradition and conformity',
    fullVariants: true
  },
  {
    questId: 'quest-y2-08',
    questTitle: 'Gatsby\'s Green Light',
    questContext: 'F. Scott Fitzgerald\'s symbolism and the American Dream',
    fullVariants: true
  },
  {
    questId: 'quest-y3-12',
    questTitle: 'Hamlet\'s Dilemma',
    questContext: 'Shakespeare\'s exploration of action, inaction, and moral complexity',
    fullVariants: true
  },

  // Partial variants (3-4 each) - 5 quests
  {
    questId: 'quest-y1-06',
    questTitle: 'Narrator Under Investigation',
    questContext: 'Analyzing unreliable narration in Poe\'s "The Tell-Tale Heart"',
    fullVariants: false
  },
  {
    questId: 'quest-y2-15',
    questTitle: 'Salem\'s Shadow',
    questContext: 'Arthur Miller\'s "The Crucible" and historical allegory',
    fullVariants: false
  },
  {
    questId: 'quest-y3-20',
    questTitle: 'Pride and Prejudice Unpacked',
    questContext: 'Jane Austen\'s social commentary and character development',
    fullVariants: false
  },
  {
    questId: 'quest-y4-05',
    questTitle: 'Metamorphosis Meaning',
    questContext: 'Kafka\'s existential themes and alienation',
    fullVariants: false
  },
  {
    questId: 'quest-y4-18',
    questTitle: 'Postcolonial Perspectives',
    questContext: 'Achebe\'s "Things Fall Apart" and cultural identity',
    fullVariants: false
  }
]

// ============================================
// Variant Generation
// ============================================

function generateVariantId(questId: string, interest: ThematicInterest): string {
  return `${questId}-variant-${interest}`
}

function generateVariant(
  questConfig: QuestVariantConfig,
  template: VariantTemplate
): ThematicVariant {
  return {
    id: generateVariantId(questConfig.questId, template.interestArea),
    interestArea: template.interestArea,
    title: `${questConfig.questTitle} ${template.titleSuffix}`,
    description: `${template.descriptionTemplate} ${questConfig.questContext}.`,
    content: template.contentTemplate,
    resources: template.resourcesTemplate
  }
}

function generateVariantsForQuest(config: QuestVariantConfig): ThematicVariant[] {
  if (config.fullVariants) {
    // Generate all 8 variants
    return VARIANT_TEMPLATES.map(template => generateVariant(config, template))
  } else {
    // Generate 3-4 variants based on quest context
    const selectedTemplates = selectPartialVariants(config.questId)
    return selectedTemplates.map(template => generateVariant(config, template))
  }
}

function selectPartialVariants(questId: string): VariantTemplate[] {
  // Select appropriate subset based on quest ID for variety
  const variantSets: Record<string, ThematicInterest[]> = {
    'quest-y1-06': ['arts', 'technology', 'general'],
    'quest-y2-15': ['social-justice', 'arts', 'general', 'business'],
    'quest-y3-20': ['arts', 'social-justice', 'business'],
    'quest-y4-05': ['science', 'technology', 'arts', 'general'],
    'quest-y4-18': ['social-justice', 'nature', 'arts', 'general']
  }

  const interests = variantSets[questId] || ['general', 'arts', 'technology']
  return VARIANT_TEMPLATES.filter(t => interests.includes(t.interestArea))
}

// ============================================
// Demo Variants Generation
// ============================================

/**
 * Get demo variants for sandbox mode
 */
export function getDemoVariants(): QuestVariants[] {
  return QUEST_CONFIGS.map(config => ({
    questId: config.questId,
    variants: generateVariantsForQuest(config)
  }))
}

// ============================================
// Statistics
// ============================================

export const DEMO_VARIANTS_STATS = {
  totalQuests: QUEST_CONFIGS.length,
  fullVariantQuests: QUEST_CONFIGS.filter(c => c.fullVariants).length,
  partialVariantQuests: QUEST_CONFIGS.filter(c => !c.fullVariants).length,
  totalVariants: QUEST_CONFIGS.reduce((sum, config) => {
    return sum + (config.fullVariants ? 8 : selectPartialVariants(config.questId).length)
  }, 0)
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get variants for a specific quest
 */
export function getVariantsForQuest(questId: string): ThematicVariant[] {
  const questVariants = getDemoVariants().find(qv => qv.questId === questId)
  return questVariants?.variants || []
}

/**
 * Get variant by interest for a quest
 */
export function getVariantByInterest(
  questId: string,
  interest: ThematicInterest
): ThematicVariant | undefined {
  const variants = getVariantsForQuest(questId)
  return variants.find(v => v.interestArea === interest)
}

/**
 * Check if quest has variants
 */
export function questHasVariants(questId: string): boolean {
  return getDemoVariants().some(qv => qv.questId === questId)
}
