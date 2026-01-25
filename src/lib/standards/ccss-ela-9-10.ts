/**
 * Common Core State Standards for ELA - Grades 9-10
 *
 * Standards for Reading Literature, Reading Informational Text, Writing,
 * Speaking & Listening, and Language.
 */

export interface LearningStandard {
  id: string
  framework: 'ccss' | 'ap-lit'
  code: string
  description: string
  gradeLevel: number[]
  category: 'reading' | 'writing' | 'speaking' | 'language'
  strand?: string
}

// ============================================
// Reading Literature Standards (RL)
// ============================================

export const CCSS_RL_9_10: LearningStandard[] = [
  {
    id: 'ccss-rl-9-10-1',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.1',
    description: 'Cite strong and thorough textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Key Ideas and Details'
  },
  {
    id: 'ccss-rl-9-10-2',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.2',
    description: 'Determine a theme or central idea of a text and analyze in detail its development over the course of the text, including how it emerges and is shaped and refined by specific details; provide an objective summary of the text.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Key Ideas and Details'
  },
  {
    id: 'ccss-rl-9-10-3',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.3',
    description: 'Analyze how complex characters (e.g., those with multiple or conflicting motivations) develop over the course of a text, interact with other characters, and advance the plot or develop the theme.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Key Ideas and Details'
  },
  {
    id: 'ccss-rl-9-10-4',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.4',
    description: 'Determine the meaning of words and phrases as they are used in the text, including figurative and connotative meanings; analyze the cumulative impact of specific word choices on meaning and tone.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Craft and Structure'
  },
  {
    id: 'ccss-rl-9-10-5',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.5',
    description: 'Analyze how an author\'s choices concerning how to structure a text, order events within it, and manipulate time create such effects as mystery, tension, or surprise.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Craft and Structure'
  },
  {
    id: 'ccss-rl-9-10-6',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.6',
    description: 'Analyze a particular point of view or cultural experience reflected in a work of literature from outside the United States, drawing on a wide reading of world literature.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Craft and Structure'
  },
  {
    id: 'ccss-rl-9-10-7',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.7',
    description: 'Analyze the representation of a subject or a key scene in two different artistic mediums, including what is emphasized or absent in each treatment.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Integration of Knowledge and Ideas'
  },
  {
    id: 'ccss-rl-9-10-9',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.9',
    description: 'Analyze how an author draws on and transforms source material in a specific work.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Integration of Knowledge and Ideas'
  },
  {
    id: 'ccss-rl-9-10-10',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RL.9-10.10',
    description: 'By the end of grade 10, read and comprehend literature, including stories, dramas, and poems, at the high end of the grades 9-10 text complexity band independently and proficiently.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Range of Reading and Level of Text Complexity'
  }
]

// ============================================
// Reading Informational Text Standards (RI)
// ============================================

export const CCSS_RI_9_10: LearningStandard[] = [
  {
    id: 'ccss-ri-9-10-1',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RI.9-10.1',
    description: 'Cite strong and thorough textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Key Ideas and Details'
  },
  {
    id: 'ccss-ri-9-10-2',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RI.9-10.2',
    description: 'Determine a central idea of a text and analyze its development over the course of the text, including how it emerges and is shaped and refined by specific details; provide an objective summary of the text.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Key Ideas and Details'
  },
  {
    id: 'ccss-ri-9-10-3',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RI.9-10.3',
    description: 'Analyze how the author unfolds an analysis or series of ideas or events, including the order in which the points are made, how they are introduced and developed, and the connections that are drawn between them.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Key Ideas and Details'
  },
  {
    id: 'ccss-ri-9-10-5',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RI.9-10.5',
    description: 'Analyze in detail how an author\'s ideas or claims are developed and refined by particular sentences, paragraphs, or larger portions of a text.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Craft and Structure'
  },
  {
    id: 'ccss-ri-9-10-6',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RI.9-10.6',
    description: 'Determine an author\'s point of view or purpose in a text and analyze how an author uses rhetoric to advance that point of view or purpose.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Craft and Structure'
  },
  {
    id: 'ccss-ri-9-10-8',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.RI.9-10.8',
    description: 'Delineate and evaluate the argument and specific claims in a text, assessing whether the reasoning is valid and the evidence is relevant and sufficient; identify false statements and fallacious reasoning.',
    gradeLevel: [9, 10],
    category: 'reading',
    strand: 'Integration of Knowledge and Ideas'
  }
]

// ============================================
// Writing Standards (W)
// ============================================

export const CCSS_W_9_10: LearningStandard[] = [
  {
    id: 'ccss-w-9-10-1',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.1',
    description: 'Write arguments to support claims in an analysis of substantive topics or texts, using valid reasoning and relevant and sufficient evidence.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Text Types and Purposes'
  },
  {
    id: 'ccss-w-9-10-2',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.2',
    description: 'Write informative/explanatory texts to examine and convey complex ideas, concepts, and information clearly and accurately through the effective selection, organization, and analysis of content.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Text Types and Purposes'
  },
  {
    id: 'ccss-w-9-10-3',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.3',
    description: 'Write narratives to develop real or imagined experiences or events using effective technique, well-chosen details, and well-structured event sequences.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Text Types and Purposes'
  },
  {
    id: 'ccss-w-9-10-4',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.4',
    description: 'Produce clear and coherent writing in which the development, organization, and style are appropriate to task, purpose, and audience.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Production and Distribution of Writing'
  },
  {
    id: 'ccss-w-9-10-5',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.5',
    description: 'Develop and strengthen writing as needed by planning, revising, editing, rewriting, or trying a new approach, focusing on addressing what is most significant for a specific purpose and audience.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Production and Distribution of Writing'
  },
  {
    id: 'ccss-w-9-10-7',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.7',
    description: 'Conduct short as well as more sustained research projects to answer a question or solve a problem; narrow or broaden the inquiry when appropriate; synthesize multiple sources on the subject.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Research to Build and Present Knowledge'
  },
  {
    id: 'ccss-w-9-10-8',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.8',
    description: 'Gather relevant information from multiple authoritative print and digital sources, using advanced searches effectively; assess the usefulness of each source in answering the research question.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Research to Build and Present Knowledge'
  },
  {
    id: 'ccss-w-9-10-9',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.W.9-10.9',
    description: 'Draw evidence from literary or informational texts to support analysis, reflection, and research.',
    gradeLevel: [9, 10],
    category: 'writing',
    strand: 'Research to Build and Present Knowledge'
  }
]

// ============================================
// Speaking and Listening Standards (SL)
// ============================================

export const CCSS_SL_9_10: LearningStandard[] = [
  {
    id: 'ccss-sl-9-10-1',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.SL.9-10.1',
    description: 'Initiate and participate effectively in a range of collaborative discussions with diverse partners on grades 9-10 topics, texts, and issues, building on others\' ideas and expressing their own clearly and persuasively.',
    gradeLevel: [9, 10],
    category: 'speaking',
    strand: 'Comprehension and Collaboration'
  },
  {
    id: 'ccss-sl-9-10-3',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.SL.9-10.3',
    description: 'Evaluate a speaker\'s point of view, reasoning, and use of evidence and rhetoric, identifying any fallacious reasoning or exaggerated or distorted evidence.',
    gradeLevel: [9, 10],
    category: 'speaking',
    strand: 'Comprehension and Collaboration'
  },
  {
    id: 'ccss-sl-9-10-4',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.SL.9-10.4',
    description: 'Present information, findings, and supporting evidence clearly, concisely, and logically such that listeners can follow the line of reasoning.',
    gradeLevel: [9, 10],
    category: 'speaking',
    strand: 'Presentation of Knowledge and Ideas'
  }
]

// ============================================
// Language Standards (L)
// ============================================

export const CCSS_L_9_10: LearningStandard[] = [
  {
    id: 'ccss-l-9-10-1',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.L.9-10.1',
    description: 'Demonstrate command of the conventions of standard English grammar and usage when writing or speaking.',
    gradeLevel: [9, 10],
    category: 'language',
    strand: 'Conventions of Standard English'
  },
  {
    id: 'ccss-l-9-10-2',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.L.9-10.2',
    description: 'Demonstrate command of the conventions of standard English capitalization, punctuation, and spelling when writing.',
    gradeLevel: [9, 10],
    category: 'language',
    strand: 'Conventions of Standard English'
  },
  {
    id: 'ccss-l-9-10-3',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.L.9-10.3',
    description: 'Apply knowledge of language to understand how language functions in different contexts, to make effective choices for meaning or style, and to comprehend more fully when reading or listening.',
    gradeLevel: [9, 10],
    category: 'language',
    strand: 'Knowledge of Language'
  },
  {
    id: 'ccss-l-9-10-5',
    framework: 'ccss',
    code: 'CCSS.ELA-LITERACY.L.9-10.5',
    description: 'Demonstrate understanding of figurative language, word relationships, and nuances in word meanings.',
    gradeLevel: [9, 10],
    category: 'language',
    strand: 'Vocabulary Acquisition and Use'
  }
]

// ============================================
// Combined Export
// ============================================

export const ALL_CCSS_9_10: LearningStandard[] = [
  ...CCSS_RL_9_10,
  ...CCSS_RI_9_10,
  ...CCSS_W_9_10,
  ...CCSS_SL_9_10,
  ...CCSS_L_9_10
]

export const CCSS_9_10_BY_CATEGORY = {
  reading: [...CCSS_RL_9_10, ...CCSS_RI_9_10],
  writing: CCSS_W_9_10,
  speaking: CCSS_SL_9_10,
  language: CCSS_L_9_10
}
