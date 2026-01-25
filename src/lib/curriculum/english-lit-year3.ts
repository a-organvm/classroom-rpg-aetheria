/**
 * English Literature Year 3: British Literature
 *
 * Focus: Beowulf to contemporary
 * Core texts: Beowulf, Canterbury Tales, Hamlet, Pride and Prejudice, 1984
 */

import type { Realm, Quest, QuestType } from '@/lib/types'

// ============================================
// Realm Definition
// ============================================

export const YEAR3_REALM: Realm = {
  id: 'realm-english-lit-year3',
  name: "The Crown's Archives",
  description: 'Explore over a thousand years of British literary tradition. From Anglo-Saxon warriors to Victorian wit, trace the evolution of English literature and the themes that connect us across centuries.',
  color: '#8b5cf6', // Violet
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
  id: `quest-y3-${index.toString().padStart(2, '0')}`,
  realmId: YEAR3_REALM.id,
  name: template.name,
  description: template.description,
  type: template.type,
  xpValue: template.xpValue,
  status: index === 0 ? 'available' : 'locked',
  prerequisiteIds: prerequisites,
  createdAt: Date.now()
})

// ============================================
// Unit 1: Old English & Medieval (4 weeks)
// ============================================

const unit1Quests: QuestTemplate[] = [
  {
    name: 'Hero\'s Call',
    description: 'Read Beowulf excerpts (Grendel\'s attack, Beowulf\'s arrival, the battle). Analyze Beowulf as an epic hero. What qualities does he embody? How do these reflect Anglo-Saxon values?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit1',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Monsters and Meaning',
    description: 'Analyze the monsters in Beowulf (Grendel, Grendel\'s mother, the dragon). What do they represent? How does each battle reveal something different about heroism and mortality?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Canterbury Pilgrims',
    description: 'Read the General Prologue to The Canterbury Tales. Create character profiles for 4-5 pilgrims, analyzing how Chaucer uses satire to critique medieval society.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Tales of Social Critique',
    description: 'Read "The Pardoner\'s Tale" and "The Wife of Bath\'s Prologue" (excerpts). How does Chaucer use these characters to comment on religious hypocrisy and gender roles?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Medieval Modernized',
    description: 'Write your own "Canterbury Tale" prologue introducing a modern pilgrim/character type. Use satire to critique a contemporary social issue. Include a reflection on Chaucer\'s influence.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-creative-writing'
  }
]

// ============================================
// Unit 2: Shakespeare - Hamlet (6 weeks)
// ============================================

const unit2Quests: QuestTemplate[] = [
  {
    name: 'Something Rotten',
    description: 'Act I: Analyze how Shakespeare establishes the atmosphere of corruption in Denmark. What is the significance of the ghost? How does Hamlet respond to his charge?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit2',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'To Be or Not To Be',
    description: 'Act II-III: Close reading of Hamlet\'s "To be or not to be" soliloquy. What is Hamlet contemplating? How does the language reveal his mental state? What conclusion does he reach?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'The Play\'s the Thing',
    description: 'Analyze the play-within-a-play scene. Why does Hamlet stage "The Mousetrap"? What does Claudius\'s reaction reveal? How does this scene comment on the nature of theater?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Ophelia\'s Tragedy',
    description: 'Trace Ophelia\'s arc through the play. How is she caught between the men in her life? Analyze her mad scene: what do her songs reveal? How does her fate reflect on Danish society?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Hamlet\'s Delay',
    description: 'One of literature\'s great questions: Why does Hamlet delay? Write an essay exploring possible explanations (moral scruples, psychological issues, circumstance, etc.). Take a position.',
    type: 'standard',
    xpValue: 125,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Performance Analysis',
    description: 'Watch two film versions of a key Hamlet scene. Analyze how different actors/directors interpret the character. How do staging choices affect meaning?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2'
  },
  {
    name: 'Hamlet Mastery',
    description: 'BOSS QUEST: Write a 5-6 paragraph essay on ONE of these themes in Hamlet: appearance vs. reality, corruption and decay, revenge, or madness. Include analysis of at least three scenes.',
    type: 'boss',
    xpValue: 250,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  }
]

// ============================================
// Unit 3: Restoration & 18th Century (3 weeks)
// ============================================

const unit3Quests: QuestTemplate[] = [
  {
    name: 'A Modest Proposal',
    description: 'Read Swift\'s "A Modest Proposal." Analyze his use of satire: How does he maintain the "rational" tone? What is he really criticizing? Why is this approach effective?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-rhetorical-analysis'
  },
  {
    name: 'Satirical Response',
    description: 'Write your own "modest proposal" satirizing a contemporary issue. Maintain an ironic, rational tone while making your critique clear. Include a brief analysis of your techniques.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-creative-writing'
  },
  {
    name: 'Pope\'s Wit',
    description: 'Read excerpts from Alexander Pope\'s "The Rape of the Lock." How does Pope use mock-epic conventions to satirize upper-class society? Identify specific epic elements and their satirical effect.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit3',
    rubricId: 'rubric-close-reading'
  }
]

// ============================================
// Unit 4: Romantic Period (4 weeks)
// ============================================

const unit4Quests: QuestTemplate[] = [
  {
    name: 'Songs of Innocence and Experience',
    description: 'Read paired poems from Blake\'s Songs of Innocence and Experience (e.g., "The Lamb"/"The Tyger"). Analyze how Blake contrasts innocence and experience. What vision emerges?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit4',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Wordsworth\'s Nature',
    description: 'Read "Tintern Abbey" and "I Wandered Lonely as a Cloud." Analyze Wordsworth\'s treatment of nature and memory. How does nature provide spiritual restoration?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'The Rime of the Ancient Mariner',
    description: 'Read Coleridge\'s "Rime of the Ancient Mariner." Analyze the supernatural elements, the albatross symbolism, and the moral message. How does this poem exemplify Romantic ideals?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Shelley and Keats',
    description: 'Read "Ozymandias" by Percy Shelley and "Ode on a Grecian Urn" by John Keats. Compare how each poet addresses themes of art, mortality, and permanence.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Romantic Manifesto',
    description: 'Based on the poetry we\'ve read, write your own "Romantic Manifesto" articulating the key values and beliefs of Romanticism. Then write an original poem embodying these principles.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-creative-writing'
  }
]

// ============================================
// Unit 5: Victorian Novel - Pride and Prejudice (5 weeks)
// ============================================

const unit5Quests: QuestTemplate[] = [
  {
    name: 'First Impressions',
    description: 'Chapters 1-12: Analyze Austen\'s famous opening line. How does it set up the novel\'s themes? Track the "first impressions" Elizabeth and Darcy have of each other.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit5',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Austen\'s Irony',
    description: 'Chapters 13-24: Analyze Austen\'s use of irony, particularly in her treatment of Mr. Collins and Lady Catherine. How does irony function as social criticism?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Darcy\'s Letter',
    description: 'Chapters 25-36: Close read Darcy\'s letter to Elizabeth. How does it change Elizabeth\'s (and our) understanding? What does this reveal about the theme of judgment?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Pemberley and Change',
    description: 'Chapters 37-50: Analyze Elizabeth\'s visit to Pemberley. What does she learn about Darcy? How do both characters change? Track the evolution of their relationship.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Marriage Market',
    description: 'Analyze how Austen portrays marriage in the novel. Compare at least three marriages (e.g., Bennets, Collinses, Wickhams, Darcys). What is Austen arguing about love, money, and partnership?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Feminist Reading',
    description: 'BOSS QUEST: Write a feminist analysis of Pride and Prejudice. How does Austen critique the limited options available to women? Is Elizabeth a proto-feminist heroine? Engage with critical perspectives.',
    type: 'boss',
    xpValue: 250,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  }
]

// ============================================
// Unit 6: Modernism & Beyond (5 weeks)
// ============================================

const unit6Quests: QuestTemplate[] = [
  {
    name: 'Yeats\'s Vision',
    description: 'Read "The Second Coming" and "Sailing to Byzantium." Analyze Yeats\'s imagery and symbolism. What is he saying about the modern age and the role of art?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Prufrock\'s Paralysis',
    description: 'Read T.S. Eliot\'s "The Love Song of J. Alfred Prufrock." Analyze the stream-of-consciousness style. What does Prufrock represent about modern alienation and anxiety?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Big Brother Watches',
    description: 'Read 1984 Part One. Analyze Orwell\'s world-building: Newspeak, doublethink, the Party. How does Winston\'s daily life illustrate totalitarian control? What makes this dystopia effective?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Language and Control',
    description: 'Analyze the role of language in 1984. How does Newspeak control thought? What is the significance of Winston\'s job? Connect to real-world examples of political language.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Room 101',
    description: 'Analyze the ending of 1984. Why does Winston ultimately love Big Brother? What is Orwell saying about human nature and resistance? Is the ending hopeless or does it contain warning and hope?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: '1984 in 2024',
    description: 'Write an essay connecting 1984 to contemporary issues (surveillance, propaganda, political polarization, etc.). Is Orwell\'s vision relevant today? Avoid simple comparisons; analyze deeply.',
    type: 'standard',
    xpValue: 125,
    unit: 'unit6',
    rubricId: 'rubric-research-synthesis'
  }
]

// ============================================
// Discussion Quests
// ============================================

const discussionQuests: QuestTemplate[] = [
  {
    name: 'Seminar: The Hero\'s Journey',
    description: 'Trace the hero archetype from Beowulf through Hamlet to modern heroes. How has the concept of heroism evolved? What qualities remain constant?',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Seminar: Power and Corruption',
    description: 'Discuss how British literature portrays power and its corrupting influence. Draw on Hamlet, Pride and Prejudice (social power), and 1984.',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Seminar: Literature as Social Criticism',
    description: 'How do the authors we\'ve studied use literature to critique their societies? Compare Chaucer\'s satire, Austen\'s irony, and Orwell\'s dystopia.',
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

export const YEAR3_QUESTS: Quest[] = allTemplates.map((template, index) => {
  const prerequisites: string[] = []
  if (index > 0) {
    prerequisites.push(`quest-y3-${(index).toString().padStart(2, '0')}`)
  }
  return createQuest(template, index + 1, prerequisites)
})

// ============================================
// Export
// ============================================

export const YEAR3_CURRICULUM = {
  realm: YEAR3_REALM,
  quests: YEAR3_QUESTS,
  questCount: YEAR3_QUESTS.length,
  totalXP: YEAR3_QUESTS.reduce((sum, q) => sum + q.xpValue, 0)
}
