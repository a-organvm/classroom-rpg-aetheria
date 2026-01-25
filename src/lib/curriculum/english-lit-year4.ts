/**
 * English Literature Year 4: World Literature & AP Prep
 *
 * Focus: Global perspectives, college prep
 * Core texts: Oedipus Rex, Kafka, García Márquez, Things Fall Apart, AP exam preparation
 */

import type { Realm, Quest, QuestType } from '@/lib/types'

// ============================================
// Realm Definition
// ============================================

export const YEAR4_REALM: Realm = {
  id: 'realm-english-lit-year4',
  name: 'The Global Codex',
  description: 'Expand your literary horizons to encompass voices from across the world. Engage with universal human themes through diverse cultural lenses while preparing for college-level literary analysis.',
  color: '#f59e0b', // Amber
  createdAt: Date.now()
}

// ============================================
// Quest Definitions
// ============================================

interface QuestTemplate {
  name: string
  description: string
  type: QuestType
  xpValue: number
  unit: string
  rubricId?: string
}

const createQuest = (
  template: QuestTemplate,
  index: number,
  prerequisites: string[] = []
): Quest => ({
  id: `quest-y4-${index.toString().padStart(2, '0')}`,
  realmId: YEAR4_REALM.id,
  name: template.name,
  description: template.description,
  type: template.type,
  xpValue: template.xpValue,
  status: index === 0 ? 'available' : 'locked',
  prerequisiteIds: prerequisites,
  createdAt: Date.now()
})

// ============================================
// Unit 1: Classical Foundations (3 weeks)
// ============================================

const unit1Quests: QuestTemplate[] = [
  {
    name: 'Oedipus and Fate',
    description: 'Read Sophocles\' Oedipus Rex. Analyze the role of fate vs. free will. Could Oedipus have avoided his destiny? What makes him a tragic hero according to Aristotle\'s definition?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'The Tragic Structure',
    description: 'Apply Aristotle\'s concepts (hamartia, peripeteia, anagnorisis, catharsis) to Oedipus Rex. How does Sophocles create the tragic effect? What emotions does the play evoke?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Dante\'s Descent',
    description: 'Read excerpts from Dante\'s Inferno (Cantos 1, 3, 5, 34). Analyze the structure and symbolism of Hell. What does Dante\'s journey represent? How does contrapasso work?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-world-literature'
  },
  {
    name: 'Classical Connections',
    description: 'Write a comparative essay examining how both Sophocles and Dante address justice, fate, or the human condition. How do their cultural contexts shape their visions?',
    type: 'standard',
    xpValue: 125,
    unit: 'unit1',
    rubricId: 'rubric-comparative-analysis'
  }
]

// ============================================
// Unit 2: European Modernism (4 weeks)
// ============================================

const unit2Quests: QuestTemplate[] = [
  {
    name: 'Kafka\'s Nightmare',
    description: 'Read "The Metamorphosis" by Franz Kafka. Analyze how Kafka creates alienation. What does Gregor\'s transformation represent? How does the family\'s reaction reflect on modern life?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'The Absurd Condition',
    description: 'Research existentialism and the absurd (Camus, Sartre). Write an analysis of how "The Metamorphosis" embodies existentialist themes: meaninglessness, alienation, authenticity.',
    type: 'standard',
    xpValue: 125,
    unit: 'unit2',
    rubricId: 'rubric-research-synthesis'
  },
  {
    name: 'Kafkaesque Today',
    description: 'The term "Kafkaesque" has entered our vocabulary. Write a creative piece or analytical essay exploring what makes something Kafkaesque and how this applies to contemporary life.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-creative-interpretation'
  },
  {
    name: 'The Stranger Analysis',
    description: 'Read excerpts from Camus\' The Stranger. Analyze Meursault as an absurd hero. How does his indifference challenge social conventions? What is Camus saying about meaning and morality?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  }
]

// ============================================
// Unit 3: Latin American Literature (5 weeks)
// ============================================

const unit3Quests: QuestTemplate[] = [
  {
    name: 'Magical Realism Introduction',
    description: 'Read "A Very Old Man with Enormous Wings" by García Márquez. What is magical realism? Analyze how the ordinary and extraordinary coexist. What is García Márquez critiquing?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit3',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'García Márquez\'s World',
    description: 'Read "The Handsomest Drowned Man in the World" and one additional story. Analyze García Márquez\'s use of community voice, transformation, and myth. What universal themes emerge?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Borges\'s Labyrinths',
    description: 'Read "The Garden of Forking Paths" by Jorge Luis Borges. Analyze the structure and themes: time, infinity, choice. How does form mirror content? What is Borges exploring about reality?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Latin American Voices Research',
    description: 'Research the historical and cultural context of the Latin American "Boom." How did political circumstances shape the literature? Present on one author\'s biography and significance.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-research-synthesis'
  },
  {
    name: 'Magical Realism Mastery',
    description: 'BOSS QUEST: Write a 5-6 paragraph essay analyzing how García Márquez OR Borges uses narrative technique to explore philosophical themes. Discuss the relationship between form and meaning.',
    type: 'boss',
    xpValue: 250,
    unit: 'unit3',
    rubricId: 'rubric-ap-literature'
  }
]

// ============================================
// Unit 4: African Literature (4 weeks)
// ============================================

const unit4Quests: QuestTemplate[] = [
  {
    name: 'Things Fall Apart: Okonkwo\'s World',
    description: 'Part One: Analyze Igbo society as Achebe presents it. What are its values, rituals, and social structures? How does Achebe counter stereotypes about "primitive" Africa?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit4',
    rubricId: 'rubric-world-literature'
  },
  {
    name: 'Okonkwo\'s Tragedy',
    description: 'Analyze Okonkwo as a tragic figure. What is his hamartia? How does his relationship with masculinity and his father shape his fate? Is he sympathetic?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Colonialism\'s Arrival',
    description: 'Parts Two and Three: Analyze the arrival of missionaries and colonial government. How does Achebe show the gradual erosion of Igbo culture? What techniques does he use?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Things Fall Apart: The Title',
    description: 'The title comes from Yeats\'s "The Second Coming." Analyze the connection. How does the poem illuminate the novel\'s themes? What is "falling apart" and why?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Postcolonial Perspectives',
    description: 'Research postcolonial literary theory. Write an essay analyzing Things Fall Apart as a response to colonial literature (especially Heart of Darkness). How does Achebe "write back"?',
    type: 'standard',
    xpValue: 125,
    unit: 'unit4',
    rubricId: 'rubric-research-synthesis'
  }
]

// ============================================
// Unit 5: Asian Literature (4 weeks)
// ============================================

const unit5Quests: QuestTemplate[] = [
  {
    name: 'Eastern Poetry',
    description: 'Read selected poetry from Li Bai, Du Fu, and Basho. Analyze how these poets use nature, brevity, and indirection. Compare with Western Romantic poetry.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Murakami\'s Worlds',
    description: 'Read a Haruki Murakami short story (assigned). Analyze how Murakami blends realism with surrealism. What Western and Japanese influences do you detect? What themes emerge?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'East-West Synthesis',
    description: 'Write an essay exploring how contemporary Asian writers (like Murakami) blend Eastern and Western traditions. What does this say about globalization and cultural identity?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-world-literature'
  },
  {
    name: 'World Literature Reflection',
    description: 'Write a reflective essay: How has studying world literature changed your perspective? Which text resonated most? What universal themes transcend cultural boundaries?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit5',
    rubricId: 'rubric-reading-response'
  }
]

// ============================================
// Unit 6: AP Exam Preparation (6 weeks)
// ============================================

const unit6Quests: QuestTemplate[] = [
  {
    name: 'AP Poetry Analysis: Form',
    description: 'Practice AP poetry analysis focusing on form and structure. Timed writing: 40 minutes to analyze an unseen poem. Focus on how form contributes to meaning.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  },
  {
    name: 'AP Poetry Analysis: Imagery',
    description: 'Practice AP poetry analysis focusing on imagery and figurative language. Timed writing: 40 minutes. Focus on how the poet creates meaning through language.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  },
  {
    name: 'AP Prose Analysis: Character',
    description: 'Practice AP prose analysis focusing on characterization. Timed writing: 40 minutes to analyze an unseen passage. Focus on how the author develops character.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  },
  {
    name: 'AP Prose Analysis: Narrative',
    description: 'Practice AP prose analysis focusing on narrative technique. Timed writing: 40 minutes. Focus on point of view, voice, and structural choices.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  },
  {
    name: 'AP Literary Argument: Theme',
    description: 'Practice AP literary argument essay. Choose a work from the course and write on an assigned theme. 40 minutes. Focus on sophisticated argumentation.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  },
  {
    name: 'AP Literary Argument: Technique',
    description: 'Practice AP literary argument focusing on author\'s technique. How does the author\'s craft contribute to the work\'s meaning? 40 minutes.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  },
  {
    name: 'Multiple Choice Strategies',
    description: 'Complete multiple choice practice sets. Review answers and analyze why certain choices are correct. Develop strategies for poetry and prose questions.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit6'
  },
  {
    name: 'Full Practice Exam',
    description: 'BOSS QUEST: Complete a full-length AP Literature practice exam under timed conditions: 1 hour for multiple choice, 2 hours for 3 essays. Receive detailed feedback.',
    type: 'boss',
    xpValue: 300,
    unit: 'unit6',
    rubricId: 'rubric-ap-literature'
  }
]

// ============================================
// Discussion Quests
// ============================================

const discussionQuests: QuestTemplate[] = [
  {
    name: 'Seminar: Universal Themes',
    description: 'Discuss what themes appear across all the world literature we\'ve studied. What human experiences transcend culture? What differs based on cultural context?',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Seminar: Translation and Loss',
    description: 'Discuss the challenges of reading literature in translation. What is lost? What is gained? How do translators make choices? Compare different translations of the same passage.',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Seminar: Literature\'s Purpose',
    description: 'Final seminar: What is literature for? Drawing on all four years of study, discuss the role of literature in society, personal growth, and human understanding.',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  }
]

// ============================================
// Combine All Quests
// ============================================

const allTemplates = [
  ...unit1Quests,
  ...unit2Quests,
  ...unit3Quests,
  ...unit4Quests,
  ...unit5Quests,
  ...unit6Quests,
  ...discussionQuests
]

export const YEAR4_QUESTS: Quest[] = allTemplates.map((template, index) => {
  const prerequisites: string[] = []
  if (index > 0) {
    prerequisites.push(`quest-y4-${(index).toString().padStart(2, '0')}`)
  }
  return createQuest(template, index + 1, prerequisites)
})

// ============================================
// Export
// ============================================

export const YEAR4_CURRICULUM = {
  realm: YEAR4_REALM,
  quests: YEAR4_QUESTS,
  questCount: YEAR4_QUESTS.length,
  totalXP: YEAR4_QUESTS.reduce((sum, q) => sum + q.xpValue, 0)
}
