/**
 * English Literature Year 2: American Literature
 *
 * Focus: Colonial to modern American voices
 * Core texts: The Great Gatsby, The Crucible, The Catcher in the Rye, selections from Beloved
 */

import type { Realm, Quest, QuestType } from '@/lib/types'

// ============================================
// Realm Definition
// ============================================

export const YEAR2_REALM: Realm = {
  id: 'realm-english-lit-year2',
  name: 'The American Chronicle',
  description: 'Journey through the American literary tradition from colonial times to the modern era. Explore the American Dream, identity, and the nation\'s complex history through its most powerful voices.',
  color: '#3b82f6', // Blue
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
  id: `quest-y2-${index.toString().padStart(2, '0')}`,
  realmId: YEAR2_REALM.id,
  name: template.name,
  description: template.description,
  type: template.type,
  xpValue: template.xpValue,
  status: index === 0 ? 'available' : 'locked',
  prerequisiteIds: prerequisites,
  createdAt: Date.now()
})

// ============================================
// Unit 1: Colonial & Revolutionary Period (4 weeks)
// ============================================

const unit1Quests: QuestTemplate[] = [
  {
    name: 'Voices of the New World',
    description: 'Read selections from Anne Bradstreet\'s poetry and William Bradford\'s "Of Plymouth Plantation." How do these early writers establish an American identity? What Puritan values do you see?',
    type: 'standard',
    xpValue: 50,
    unit: 'unit1',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Franklin\'s Self-Made Man',
    description: 'Read excerpts from Benjamin Franklin\'s Autobiography. Analyze how Franklin presents himself. What values does he promote? How does this connect to the American Dream?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit1',
    rubricId: 'rubric-rhetorical-analysis'
  },
  {
    name: 'Revolutionary Rhetoric',
    description: 'Analyze Patrick Henry\'s "Speech to the Virginia Convention" OR Thomas Paine\'s "Common Sense" excerpt. Identify the rhetorical strategies (ethos, pathos, logos) and explain their effectiveness.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-rhetorical-analysis'
  },
  {
    name: 'Declaration Deep Dive',
    description: 'Conduct a close reading of the Declaration of Independence\'s preamble. Analyze Jefferson\'s word choice, structure, and rhetorical appeals. How does the document still resonate today?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-close-reading'
  }
]

// ============================================
// Unit 2: American Romanticism & Transcendentalism (5 weeks)
// ============================================

const unit2Quests: QuestTemplate[] = [
  {
    name: 'Nature\'s Classroom',
    description: 'Read Emerson\'s "Nature" (excerpts). What does Emerson mean by "transparent eyeball"? How does nature provide spiritual insight? Connect his ideas to your own experiences in nature.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit2',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Civil Disobedience',
    description: 'Read Thoreau\'s "Civil Disobedience" (excerpts). When is it justified to break the law? Analyze Thoreau\'s argument and connect it to a modern social justice issue.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-rhetorical-analysis'
  },
  {
    name: 'Hawthorne\'s Dark Vision',
    description: 'Read "Young Goodman Brown" by Nathaniel Hawthorne. Analyze the allegory: What do the characters represent? What is Hawthorne saying about human nature and Puritan society?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Poe\'s Gothic World',
    description: 'Read two Edgar Allan Poe stories (assigned). Compare how Poe creates atmosphere and psychological horror. What techniques does he use? How do the stories reflect Romantic ideas?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Transcendentalism Today',
    description: 'Write a creative piece OR analytical essay exploring how Transcendentalist ideas (self-reliance, nature, nonconformity) apply to modern life. Include connections to Emerson or Thoreau.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-creative-writing'
  }
]

// ============================================
// Unit 3: The Great Gatsby (6 weeks)
// ============================================

const unit3Quests: QuestTemplate[] = [
  {
    name: 'West Egg Welcome',
    description: 'Chapters 1-2: Analyze Nick as a narrator. Is he reliable? What do we learn about East Egg vs. West Egg? How does Fitzgerald establish the setting and atmosphere?',
    type: 'standard',
    xpValue: 50,
    unit: 'unit3',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Gatsby\'s Grand Entrance',
    description: 'Chapters 3-4: Analyze Gatsby\'s introduction. What is the effect of the rumors? How does Fitzgerald build mystery around Gatsby? What does his party reveal about 1920s society?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit3',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Green Light, Green Dream',
    description: 'Chapters 4-5: Analyze the symbolism of the green light. What does it represent for Gatsby? How does the reunion with Daisy reveal the American Dream\'s promise and peril?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'The Truth Unveiled',
    description: 'Chapters 6-7: Track the revelation of Gatsby\'s true identity. How does Fitzgerald contrast old money vs. new money? Analyze the confrontation scene at the Plaza Hotel.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Valley of Ashes',
    description: 'Analyze the Valley of Ashes and the eyes of Doctor T.J. Eckleburg. What do these symbols represent? How do they comment on the American Dream and moral decay?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Gatsby\'s Grave',
    description: 'Chapters 8-9: Analyze the ending. What is the significance of who attends Gatsby\'s funeral? How does Nick\'s final meditation on the green light conclude the novel\'s themes?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'American Dream Analysis',
    description: 'BOSS QUEST: Write a 4-5 paragraph essay analyzing how Fitzgerald critiques the American Dream in The Great Gatsby. Consider: What is Gatsby\'s dream? Why does he fail? What is Fitzgerald saying?',
    type: 'boss',
    xpValue: 250,
    unit: 'unit3',
    rubricId: 'rubric-literary-analysis-advanced'
  }
]

// ============================================
// Unit 4: African American Voices (5 weeks)
// ============================================

const unit4Quests: QuestTemplate[] = [
  {
    name: 'Narrative of Freedom',
    description: 'Read excerpts from Frederick Douglass\'s Narrative. Analyze how Douglass uses rhetoric to argue against slavery. What makes his testimony so powerful?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-rhetorical-analysis'
  },
  {
    name: 'Harlem Renaissance Poetry',
    description: 'Read 4-5 Langston Hughes poems (assigned). Analyze how Hughes uses jazz rhythms, vernacular, and imagery to express Black identity and experience. How does he capture the Harlem Renaissance spirit?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'I, Too, Sing America',
    description: 'Write an analysis comparing Hughes\'s "I, Too" with Whitman\'s "I Hear America Singing." How does Hughes respond to Whitman? What is he claiming about Black American identity?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-comparative-analysis'
  },
  {
    name: 'Beloved\'s Memory',
    description: 'Read selected passages from Toni Morrison\'s Beloved. Analyze how Morrison represents the trauma of slavery and its lasting effects. How does she use memory and haunting as literary devices?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Voices of Resistance',
    description: 'Research project: Investigate how African American writers have used literature as resistance. Focus on one author and create a presentation on their life, work, and impact.',
    type: 'standard',
    xpValue: 125,
    unit: 'unit4',
    rubricId: 'rubric-research-paper'
  }
]

// ============================================
// Unit 5: The Crucible (5 weeks)
// ============================================

const unit5Quests: QuestTemplate[] = [
  {
    name: 'Salem\'s Secrets',
    description: 'Act I: Analyze the power dynamics in Salem. Who holds power? Who is powerless? How does Miller establish tension? Note Miller\'s commentary in the stage directions.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit5',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'The Crucible of Character',
    description: 'Act II: Write a character analysis of John Proctor. What is his central conflict? How does his relationship with Elizabeth reveal his guilt and integrity? Use textual evidence.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Courtroom Chaos',
    description: 'Act III: Analyze the courtroom scene. How does hysteria overcome reason? What techniques does Miller use to create dramatic tension? What does this reveal about mob mentality?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'Proctor\'s Choice',
    description: 'Act IV: Analyze Proctor\'s final decision. Why does he tear up the confession? What does his name represent? How is his death both tragic and heroic?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'McCarthy Era Research',
    description: 'Research the McCarthy era and the Hollywood blacklist. Write a 2-page analysis explaining how The Crucible is an allegory for McCarthyism. What parallels does Miller draw?',
    type: 'standard',
    xpValue: 125,
    unit: 'unit5',
    rubricId: 'rubric-research-paper'
  },
  {
    name: 'Mass Hysteria Essay',
    description: 'BOSS QUEST: Write a 4-5 paragraph essay analyzing how Miller portrays mass hysteria in The Crucible. How does fear spread? What enables it? Connect to a modern example.',
    type: 'boss',
    xpValue: 250,
    unit: 'unit5',
    rubricId: 'rubric-literary-analysis-advanced'
  }
]

// ============================================
// Unit 6: The Catcher in the Rye (4 weeks)
// ============================================

const unit6Quests: QuestTemplate[] = [
  {
    name: 'Holden\'s Voice',
    description: 'Chapters 1-10: Analyze Holden\'s narrative voice. What makes it distinctive? What does his language reveal about his character? Is he a reliable narrator?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit6',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Phonies and Innocence',
    description: 'Chapters 11-20: Analyze Holden\'s obsession with "phonies" and innocence. What does the title (catcher in the rye) symbolize? What does Holden want to protect and why?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-literary-analysis-advanced'
  },
  {
    name: 'The Red Hunting Hat',
    description: 'Analyze the symbolism of Holden\'s red hunting hat. When does he wear it? What does it represent? How does it connect to his identity and desire for protection?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit6',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Creative Response: Dear Holden',
    description: 'Write a letter to Holden Caulfield OR write a journal entry from Holden\'s perspective 10 years later. Show understanding of his character while demonstrating your own voice.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit6',
    rubricId: 'rubric-creative-writing'
  }
]

// ============================================
// Discussion Quests
// ============================================

const discussionQuests: QuestTemplate[] = [
  {
    name: 'Seminar: The American Dream',
    description: 'Socratic seminar on the American Dream across our readings. Is it achievable? Who has access? How do different authors portray it? Bring quotes from at least three texts.',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Seminar: Individual vs. Society',
    description: 'Discuss how American literature portrays the tension between individual freedom and social conformity. How do characters like Hester Prynne, Gatsby, and Holden challenge society?',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Seminar: American Identity',
    description: 'What does it mean to be American? How do the diverse voices we\'ve studied answer this question differently? Consider race, class, and time period.',
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

export const YEAR2_QUESTS: Quest[] = allTemplates.map((template, index) => {
  const prerequisites: string[] = []
  // Boss quests require completing previous unit quests
  if (index > 0) {
    prerequisites.push(`quest-y2-${(index).toString().padStart(2, '0')}`)
  }
  return createQuest(template, index + 1, prerequisites)
})

// ============================================
// Export
// ============================================

export const YEAR2_CURRICULUM = {
  realm: YEAR2_REALM,
  quests: YEAR2_QUESTS,
  questCount: YEAR2_QUESTS.length,
  totalXP: YEAR2_QUESTS.reduce((sum, q) => sum + q.xpValue, 0)
}
