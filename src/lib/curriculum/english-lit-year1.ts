/**
 * English Literature Year 1: Foundations of Literature
 *
 * Focus: Reading comprehension, basic analysis, writing mechanics
 * Core texts: Short stories, poetry, To Kill a Mockingbird, Romeo and Juliet excerpts
 */

import type { Realm, Quest, QuestType, QuestStatus } from '@/lib/types'
import { v4 as uuid } from 'uuid'

// ============================================
// Realm Definition
// ============================================

export const YEAR1_REALM: Realm = {
  id: 'realm-english-lit-year1',
  name: "The Apprentice's Library",
  description: 'Begin your journey into the world of literature. Master the fundamentals of reading, analysis, and writing as you explore classic stories, poetry, and your first novel study.',
  color: '#10b981', // Emerald
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
  id: `quest-y1-${index.toString().padStart(2, '0')}`,
  realmId: YEAR1_REALM.id,
  name: template.name,
  description: template.description,
  type: template.type,
  xpValue: template.xpValue,
  status: index === 0 ? 'available' : 'locked',
  prerequisiteIds: prerequisites,
  createdAt: Date.now()
})

// ============================================
// Unit 1: Elements of Fiction (6 weeks)
// ============================================

const unit1Quests: QuestTemplate[] = [
  {
    name: 'The Story Blueprint',
    description: 'Read "The Most Dangerous Game" by Richard Connell. Create a plot diagram identifying exposition, rising action, climax, falling action, and resolution. Include specific events from the story for each stage.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit1',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Character in the Crosshairs',
    description: 'Write a character analysis of either Rainsford or General Zaroff from "The Most Dangerous Game." Identify three character traits and support each with evidence from the text.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit1',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'The Lottery of Fate',
    description: 'Read "The Lottery" by Shirley Jackson. Write a reading response exploring: What surprised you? What questions do you have? What do you think Jackson is saying about tradition and conformity?',
    type: 'standard',
    xpValue: 50,
    unit: 'unit1',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Symbolism Unlocked',
    description: 'Analyze the symbolism in "The Lottery." Choose THREE symbols (the black box, the stones, the slips of paper, etc.) and explain what each represents and how it contributes to the story\'s theme.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'The Tell-Tale Heart Beats',
    description: 'Read "The Tell-Tale Heart" by Edgar Allan Poe. Write a reading response from the perspective of the narrator: Is he mad? What does the beating heart symbolize? Support your ideas with evidence.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit1',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Narrator Under Investigation',
    description: 'Write an essay analyzing the unreliable narrator in "The Tell-Tale Heart." How does Poe use first-person narration to create suspense and reveal the narrator\'s madness? Include at least three quotes.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit1',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Elements Mastery: Fiction Fundamentals',
    description: 'BOSS QUEST: Write a comparative essay analyzing how TWO of the short stories we\'ve read use a literary element (setting, conflict, characterization, or symbolism) to develop theme. 3-4 paragraphs minimum.',
    type: 'boss',
    xpValue: 200,
    unit: 'unit1',
    rubricId: 'rubric-basic-literary-analysis'
  }
]

// ============================================
// Unit 2: Poetry Fundamentals (4 weeks)
// ============================================

const unit2Quests: QuestTemplate[] = [
  {
    name: 'Sonnet Secrets',
    description: 'Read Shakespeare\'s Sonnet 18 ("Shall I compare thee to a summer\'s day?"). Identify the rhyme scheme, meter, and key metaphors. What is Shakespeare saying about love and mortality?',
    type: 'standard',
    xpValue: 50,
    unit: 'unit2',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'The Road Taken',
    description: 'Read "The Road Not Taken" by Robert Frost. This poem is often misunderstood! Write an analysis exploring: What is the tone? Is the speaker truly satisfied? What is Frost really saying about choices?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit2',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Dickinson\'s Dashes',
    description: 'Read three Emily Dickinson poems (assigned in class). For each, identify the main theme and one literary device. How does Dickinson\'s unconventional punctuation affect meaning?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit2',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Harlem Dreams',
    description: 'Read "Harlem" (A Dream Deferred) by Langston Hughes. Analyze the series of similes Hughes uses. What is the effect of ending with a question? Connect to historical context.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit2',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Your Voice in Verse',
    description: 'Write an original poem (minimum 14 lines) using at least THREE of the poetic devices we\'ve studied (metaphor, simile, personification, imagery, alliteration, etc.). Include a brief reflection explaining your choices.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit2',
    rubricId: 'rubric-creative-writing'
  },
  {
    name: 'Poetry Performance',
    description: 'Select a poem from our unit and prepare a 2-3 minute analysis presentation. Explain: What is the poem about? What literary devices does the poet use? Why is this poem significant?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit2'
  }
]

// ============================================
// Unit 3: Novel Study - To Kill a Mockingbird (8 weeks)
// ============================================

const unit3Quests: QuestTemplate[] = [
  {
    name: 'Maycomb Mapping',
    description: 'Chapters 1-3: Create a character map of the main characters introduced so far. For each character, include their relationship to Scout and 2-3 key details. Also describe the setting of Maycomb.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit3',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Boo\'s Mystery',
    description: 'Chapters 4-7: Write about the children\'s fascination with Boo Radley. What do the items in the tree reveal? What do you predict about Boo\'s character? Use evidence from the text.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit3',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Atticus\'s Lessons',
    description: 'Chapters 8-11: Identify THREE lessons Atticus teaches his children. For each, explain the lesson, provide a quote, and explain why this lesson is important for Scout\'s growth.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit3',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'The Trial Begins',
    description: 'Chapters 12-16: Analyze how racial tension in Maycomb affects the characters. How does the black community\'s church scene contrast with Maycomb\'s white community? What does this reveal about 1930s Alabama?',
    type: 'standard',
    xpValue: 75,
    unit: 'unit3',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Courtroom Drama',
    description: 'Chapters 17-21: Write a detailed analysis of the trial. What evidence proves Tom Robinson\'s innocence? Why does the jury still convict him? What does this reveal about the theme of justice?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Aftermath',
    description: 'Chapters 22-25: Explore the community\'s reaction to the trial. How do different characters respond? What do Bob Ewell\'s threats foreshadow? Track Scout\'s changing understanding.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit3',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'Mockingbird\'s Song',
    description: 'Chapters 26-31: Analyze the symbolism of the mockingbird. Who are the "mockingbirds" in the novel? How does the ending connect to the themes of innocence, justice, and moral growth?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Historical Context Research',
    description: 'Research the Jim Crow South and the Scottsboro Boys trial that inspired TKAM. Write a 1-2 page research summary explaining how historical context deepens your understanding of the novel.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit3',
    rubricId: 'rubric-research-paper'
  },
  {
    name: 'Mockingbird Mastery',
    description: 'BOSS QUEST: Write a 4-5 paragraph analytical essay on ONE of the following themes in TKAM: justice, moral courage, innocence and experience, or prejudice. Include a clear thesis, textual evidence, and analysis.',
    type: 'boss',
    xpValue: 250,
    unit: 'unit3',
    rubricId: 'rubric-basic-literary-analysis'
  }
]

// ============================================
// Unit 4: Drama Introduction (4 weeks)
// ============================================

const unit4Quests: QuestTemplate[] = [
  {
    name: 'Stage Directions',
    description: 'Introduction to Drama: Learn the elements of drama (stage directions, dialogue, soliloquy, aside, etc.). Create a visual guide explaining at least 6 drama terms with definitions and examples.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit4'
  },
  {
    name: 'Star-Crossed Meeting',
    description: 'Read Romeo and Juliet Act 1, Scenes 1-5. Write a response: How does Shakespeare establish the conflict? What do we learn about Romeo and Juliet in their first meeting? Analyze their sonnet dialogue.',
    type: 'standard',
    xpValue: 75,
    unit: 'unit4',
    rubricId: 'rubric-reading-response'
  },
  {
    name: 'The Balcony Scene',
    description: 'Read and analyze the famous balcony scene (Act 2, Scene 2). What metaphors does Romeo use? How does Juliet challenge his language? What does this scene reveal about their relationship?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-basic-literary-analysis'
  },
  {
    name: 'Soliloquy Spotlight',
    description: 'Choose ONE soliloquy from Romeo and Juliet. Write an analysis explaining: What is the character revealing? What literary devices are used? How does this speech advance the plot or theme?',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-close-reading'
  },
  {
    name: 'Modern Adaptation',
    description: 'Write a creative adaptation of a scene from Romeo and Juliet set in modern times. Maintain the key conflicts and themes while updating the setting, language, and context. Include a reflection on your choices.',
    type: 'standard',
    xpValue: 100,
    unit: 'unit4',
    rubricId: 'rubric-creative-writing'
  }
]

// ============================================
// Unit 5: Writing Workshop (Ongoing)
// ============================================

const unit5Quests: QuestTemplate[] = [
  {
    name: 'Grammar Foundations',
    description: 'Complete the grammar diagnostic and three skill-building exercises on: subject-verb agreement, pronoun-antecedent agreement, and comma usage.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit5'
  },
  {
    name: 'Paragraph Power',
    description: 'Learn the TEEL paragraph structure (Topic, Evidence, Explanation, Link). Write three practice paragraphs using this structure on topics of your choice.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit5'
  },
  {
    name: 'Thesis Workshop',
    description: 'Practice writing thesis statements. Given three prompts, write a weak thesis, then revise it into a strong, arguable thesis. Explain what makes the revision better.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit5'
  },
  {
    name: 'Quote Integration',
    description: 'Learn three methods for integrating quotes (introduce, embed, explain). Practice each method with quotes from our current reading. Avoid "dropped quotes"!',
    type: 'standard',
    xpValue: 50,
    unit: 'unit5'
  },
  {
    name: 'Peer Review Workshop',
    description: 'Participate in peer review session. Provide constructive feedback on a classmate\'s draft using the feedback criteria provided. Reflect on feedback received for your own work.',
    type: 'standard',
    xpValue: 50,
    unit: 'unit5'
  },
  {
    name: 'Personal Narrative',
    description: 'BOSS QUEST: Write a 3-5 paragraph personal narrative about a significant moment, experience, or person in your life. Use vivid imagery, reflection, and narrative techniques to engage your reader.',
    type: 'boss',
    xpValue: 200,
    unit: 'unit5',
    rubricId: 'rubric-creative-writing'
  }
]

// ============================================
// Discussion Quests (Throughout Year)
// ============================================

const discussionQuests: QuestTemplate[] = [
  {
    name: 'Socratic Seminar: Justice',
    description: 'Participate in Socratic seminar on the theme of justice in literature. Come prepared with two discussion questions and three quotes from our readings.',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Socratic Seminar: Good vs. Evil',
    description: 'Participate in Socratic seminar exploring how authors portray good and evil. Is anyone purely good or evil? Prepare with examples from multiple texts.',
    type: 'standard',
    xpValue: 50,
    unit: 'discussion'
  },
  {
    name: 'Socratic Seminar: Coming of Age',
    description: 'Discuss how young protagonists grow and change through their experiences. What makes a coming-of-age story? Bring examples from Scout, Jem, and other characters.',
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
  ...discussionQuests
]

// Create quests with proper IDs and prerequisites
export const YEAR1_QUESTS: Quest[] = allTemplates.map((template, index) => {
  // Simple prerequisite logic: first quest of each major unit available, others require previous
  const prerequisites: string[] = []
  if (index > 0 && index !== 7 && index !== 13 && index !== 22 && index !== 27) {
    prerequisites.push(`quest-y1-${(index).toString().padStart(2, '0')}`)
  }
  return createQuest(template, index + 1, prerequisites)
})

// ============================================
// Export
// ============================================

export const YEAR1_CURRICULUM = {
  realm: YEAR1_REALM,
  quests: YEAR1_QUESTS,
  questCount: YEAR1_QUESTS.length,
  totalXP: YEAR1_QUESTS.reduce((sum, q) => sum + q.xpValue, 0)
}
