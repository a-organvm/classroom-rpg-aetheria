/**
 * English Literature Rubric Templates
 *
 * 12 rubric templates for different assignment types across Years 1-4.
 */

import type { RubricData, RubricCriterion } from '@/lib/types'
import { v4 as uuid } from 'uuid'

// Helper to create consistent rubric levels
const createLevels = (descriptions: [string, string, string, string]) => [
  { score: 4, label: 'Exemplary', description: descriptions[0] },
  { score: 3, label: 'Proficient', description: descriptions[1] },
  { score: 2, label: 'Developing', description: descriptions[2] },
  { score: 1, label: 'Beginning', description: descriptions[3] }
]

// ============================================
// Year 1: Foundations Rubrics
// ============================================

export const basicLiteraryAnalysisRubric: RubricData = {
  id: 'rubric-basic-literary-analysis',
  name: 'Basic Literary Analysis',
  description: 'For introductory analysis essays on short stories and novels',
  criteria: [
    {
      id: uuid(),
      name: 'Thesis Statement',
      description: 'Clear, arguable claim about the text',
      weight: 25,
      levels: createLevels([
        'Thesis is insightful, specific, and arguable; clearly previews the argument',
        'Thesis is clear and arguable; addresses the prompt directly',
        'Thesis is present but vague or too broad; may be obvious rather than arguable',
        'Thesis is missing, unclear, or merely restates the prompt'
      ])
    },
    {
      id: uuid(),
      name: 'Textual Evidence',
      description: 'Use of quotes and specific details from the text',
      weight: 25,
      levels: createLevels([
        'Evidence is abundant, well-chosen, and seamlessly integrated with proper citations',
        'Evidence is relevant and properly cited; supports main points',
        'Evidence is present but may be insufficient, poorly chosen, or improperly cited',
        'Evidence is missing, irrelevant, or lacks citation'
      ])
    },
    {
      id: uuid(),
      name: 'Analysis & Explanation',
      description: 'Interpretation and connection of evidence to thesis',
      weight: 30,
      levels: createLevels([
        'Analysis is sophisticated; explains how evidence proves thesis with insight',
        'Analysis explains the significance of evidence; connects to thesis',
        'Analysis is superficial; may summarize rather than interpret',
        'Analysis is missing or merely restates evidence without interpretation'
      ])
    },
    {
      id: uuid(),
      name: 'Writing Mechanics',
      description: 'Grammar, spelling, punctuation, and sentence structure',
      weight: 20,
      levels: createLevels([
        'Writing is polished with varied sentence structure; virtually error-free',
        'Writing is clear with minor errors that do not impede understanding',
        'Multiple errors that occasionally impede understanding; limited sentence variety',
        'Frequent errors that significantly impede understanding'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const creativeWritingRubric: RubricData = {
  id: 'rubric-creative-writing',
  name: 'Creative Writing',
  description: 'For original poetry, short fiction, and creative responses',
  criteria: [
    {
      id: uuid(),
      name: 'Originality & Voice',
      description: 'Unique perspective and distinctive authorial voice',
      weight: 25,
      levels: createLevels([
        'Highly original with a compelling, consistent voice throughout',
        'Shows creativity and a clear voice; some fresh ideas or perspectives',
        'Limited originality; voice is inconsistent or generic',
        'Lacks originality; no discernible voice or copied from sources'
      ])
    },
    {
      id: uuid(),
      name: 'Craft & Technique',
      description: 'Use of literary devices, imagery, and stylistic choices',
      weight: 30,
      levels: createLevels([
        'Masterful use of literary devices; imagery is vivid and purposeful',
        'Effective use of literary devices; imagery enhances the piece',
        'Some literary devices present; imagery is basic or cliched',
        'Little to no use of literary devices; imagery is absent or unclear'
      ])
    },
    {
      id: uuid(),
      name: 'Structure & Form',
      description: 'Organization, pacing, and adherence to form requirements',
      weight: 25,
      levels: createLevels([
        'Structure enhances meaning; pacing is expertly controlled',
        'Clear structure with appropriate pacing; form requirements met',
        'Structure is present but may be awkward; pacing issues',
        'No clear structure; form requirements ignored'
      ])
    },
    {
      id: uuid(),
      name: 'Conventions',
      description: 'Grammar, spelling, and intentional stylistic choices',
      weight: 20,
      levels: createLevels([
        'Conventions support meaning; any "errors" are clearly intentional',
        'Follows conventions with minor errors; does not impede reading',
        'Multiple convention errors; unclear if stylistic choices are intentional',
        'Frequent errors that distract from the piece'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const readingResponseRubric: RubricData = {
  id: 'rubric-reading-response',
  name: 'Reading Response',
  description: 'For reading journals, chapter responses, and comprehension checks',
  criteria: [
    {
      id: uuid(),
      name: 'Comprehension',
      description: 'Understanding of plot, characters, and themes',
      weight: 30,
      levels: createLevels([
        'Demonstrates thorough understanding with insightful observations',
        'Demonstrates solid understanding of main elements',
        'Shows basic understanding but may miss key elements',
        'Shows little understanding; major misinterpretations'
      ])
    },
    {
      id: uuid(),
      name: 'Personal Connection',
      description: 'Relating text to personal experience or broader world',
      weight: 25,
      levels: createLevels([
        'Makes meaningful, specific connections that deepen understanding',
        'Makes relevant connections to self, other texts, or world',
        'Connections are present but superficial or forced',
        'No connections made or connections are irrelevant'
      ])
    },
    {
      id: uuid(),
      name: 'Critical Thinking',
      description: 'Questions, predictions, and evaluative thinking',
      weight: 25,
      levels: createLevels([
        'Asks probing questions; makes insightful predictions or evaluations',
        'Poses thoughtful questions; makes reasonable predictions',
        'Questions or predictions are basic or obvious',
        'No evidence of critical engagement with text'
      ])
    },
    {
      id: uuid(),
      name: 'Completeness',
      description: 'Thorough response that meets length and content requirements',
      weight: 20,
      levels: createLevels([
        'Exceeds requirements with thorough, detailed response',
        'Meets all requirements with adequate detail',
        'Partially meets requirements; may lack detail',
        'Does not meet minimum requirements'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

// ============================================
// Year 2: American Literature Rubrics
// ============================================

export const rhetoricalAnalysisRubric: RubricData = {
  id: 'rubric-rhetorical-analysis',
  name: 'Rhetorical Analysis',
  description: 'For analyzing speeches, essays, and persuasive texts',
  criteria: [
    {
      id: uuid(),
      name: 'Rhetorical Awareness',
      description: 'Identification of ethos, pathos, logos and rhetorical strategies',
      weight: 25,
      levels: createLevels([
        'Identifies sophisticated rhetorical strategies with nuanced understanding',
        'Identifies key appeals and strategies accurately',
        'Identifies some strategies but may mislabel or miss important ones',
        'Fails to identify rhetorical strategies or misunderstands concepts'
      ])
    },
    {
      id: uuid(),
      name: 'Audience & Purpose Analysis',
      description: 'Understanding of intended audience and author\'s purpose',
      weight: 25,
      levels: createLevels([
        'Insightful analysis of how text is crafted for specific audience and purpose',
        'Accurately identifies audience and purpose; explains their significance',
        'Basic understanding of audience/purpose; limited analysis',
        'Does not identify or misidentifies audience and purpose'
      ])
    },
    {
      id: uuid(),
      name: 'Evidence & Support',
      description: 'Use of specific examples from the text',
      weight: 25,
      levels: createLevels([
        'Abundant, well-chosen examples that powerfully support analysis',
        'Sufficient relevant examples with clear explanation',
        'Some examples present but may be insufficient or poorly explained',
        'Lacks specific examples or examples are irrelevant'
      ])
    },
    {
      id: uuid(),
      name: 'Organization & Clarity',
      description: 'Logical structure and clear prose',
      weight: 25,
      levels: createLevels([
        'Exceptionally organized; transitions enhance flow; prose is eloquent',
        'Well-organized with clear transitions; prose is clear',
        'Organization is adequate but may be choppy; some unclear passages',
        'Disorganized; difficult to follow; unclear writing'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const researchPaperRubric: RubricData = {
  id: 'rubric-research-paper',
  name: 'Research Paper',
  description: 'For documented research essays with MLA citations',
  criteria: [
    {
      id: uuid(),
      name: 'Thesis & Argument',
      description: 'Clear thesis supported by coherent argument',
      weight: 20,
      levels: createLevels([
        'Thesis is compelling and original; argument is sophisticated and well-developed',
        'Thesis is clear and arguable; argument is logical and supported',
        'Thesis is present but may be weak; argument has gaps',
        'Thesis is missing or unclear; no coherent argument'
      ])
    },
    {
      id: uuid(),
      name: 'Source Integration',
      description: 'Use and synthesis of multiple sources',
      weight: 25,
      levels: createLevels([
        'Sources are expertly synthesized; creates meaningful dialogue between sources',
        'Sources are well-integrated and support argument; proper paraphrasing',
        'Sources are present but may be dropped in; limited synthesis',
        'Sources are missing, misused, or not integrated'
      ])
    },
    {
      id: uuid(),
      name: 'MLA Format & Citations',
      description: 'Correct in-text citations and Works Cited',
      weight: 20,
      levels: createLevels([
        'Perfect or near-perfect MLA format throughout',
        'Minor MLA errors that do not impede documentation',
        'Multiple MLA errors; inconsistent formatting',
        'Major MLA errors or missing documentation'
      ])
    },
    {
      id: uuid(),
      name: 'Source Quality',
      description: 'Credibility and relevance of sources',
      weight: 15,
      levels: createLevels([
        'All sources are scholarly, current, and highly relevant',
        'Sources are credible and relevant; meets quantity requirements',
        'Some sources are questionable or not relevant',
        'Sources are unreliable, irrelevant, or insufficient'
      ])
    },
    {
      id: uuid(),
      name: 'Writing Quality',
      description: 'Organization, style, and mechanics',
      weight: 20,
      levels: createLevels([
        'Exceptionally polished; academic tone; virtually error-free',
        'Well-written with academic tone; minor errors',
        'Adequate writing; tone may be informal; multiple errors',
        'Poor writing quality; many errors impede understanding'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const literaryAnalysisAdvancedRubric: RubricData = {
  id: 'rubric-literary-analysis-advanced',
  name: 'Advanced Literary Analysis',
  description: 'For comparative essays and multi-text analysis',
  criteria: [
    {
      id: uuid(),
      name: 'Thesis & Argument',
      description: 'Original, arguable thesis with sophisticated argument',
      weight: 25,
      levels: createLevels([
        'Thesis offers genuine insight; argument is nuanced and compelling',
        'Thesis is clear and arguable; argument is well-developed',
        'Thesis is present but predictable; argument is underdeveloped',
        'Thesis is missing, obvious, or not arguable'
      ])
    },
    {
      id: uuid(),
      name: 'Textual Analysis',
      description: 'Close reading and interpretation of textual evidence',
      weight: 30,
      levels: createLevels([
        'Analysis reveals deep understanding; interprets language, structure, and technique',
        'Analysis goes beyond surface meaning; addresses how text creates meaning',
        'Analysis is present but may be superficial or plot-focused',
        'No real analysis; summary replaces interpretation'
      ])
    },
    {
      id: uuid(),
      name: 'Synthesis & Comparison',
      description: 'Meaningful connections between texts or ideas',
      weight: 25,
      levels: createLevels([
        'Synthesis creates new understanding; comparison illuminates both texts',
        'Connections are meaningful and well-explained',
        'Some connections made but may be superficial or forced',
        'No synthesis; texts treated separately without connection'
      ])
    },
    {
      id: uuid(),
      name: 'Writing & Style',
      description: 'Sophisticated prose, organization, and mechanics',
      weight: 20,
      levels: createLevels([
        'Prose is elegant and precise; organization enhances argument',
        'Writing is clear and well-organized; appropriate academic style',
        'Writing is adequate; some organizational or style issues',
        'Writing is unclear; poor organization; frequent errors'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

// ============================================
// Year 3: British Literature Rubrics
// ============================================

export const closeReadingRubric: RubricData = {
  id: 'rubric-close-reading',
  name: 'Close Reading',
  description: 'For detailed analysis of short passages and poems',
  criteria: [
    {
      id: uuid(),
      name: 'Attention to Language',
      description: 'Analysis of diction, syntax, and figurative language',
      weight: 30,
      levels: createLevels([
        'Meticulously examines word choice, sentence structure, and figurative language',
        'Addresses key language features with clear analysis',
        'Some attention to language but may miss important features',
        'Ignores language; focuses only on content/meaning'
      ])
    },
    {
      id: uuid(),
      name: 'Interpretation Depth',
      description: 'Moving beyond surface meaning to deeper significance',
      weight: 30,
      levels: createLevels([
        'Interpretation reveals layers of meaning; considers ambiguity',
        'Goes beyond literal meaning to explain significance',
        'Basic interpretation; may state the obvious',
        'No interpretation beyond paraphrase'
      ])
    },
    {
      id: uuid(),
      name: 'Use of Evidence',
      description: 'Specific textual support for claims',
      weight: 25,
      levels: createLevels([
        'Every claim is supported with precise, well-chosen evidence',
        'Claims are supported with relevant evidence',
        'Some claims lack support; evidence may be vague',
        'Claims are unsupported or evidence is irrelevant'
      ])
    },
    {
      id: uuid(),
      name: 'Coherence',
      description: 'Logical flow and unified interpretation',
      weight: 15,
      levels: createLevels([
        'Analysis builds logically to a unified interpretation',
        'Analysis is coherent with clear main idea',
        'Analysis is somewhat disjointed; main idea unclear',
        'No coherent interpretation; random observations'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const comparativeAnalysisRubric: RubricData = {
  id: 'rubric-comparative-analysis',
  name: 'Comparative Analysis',
  description: 'For comparing texts across periods or traditions',
  criteria: [
    {
      id: uuid(),
      name: 'Comparative Framework',
      description: 'Clear basis for comparison with analytical purpose',
      weight: 25,
      levels: createLevels([
        'Framework reveals unexpected connections; comparison is illuminating',
        'Clear, meaningful basis for comparison that serves argument',
        'Comparison exists but basis may be superficial',
        'No clear basis for comparison; random pairing'
      ])
    },
    {
      id: uuid(),
      name: 'Balance & Integration',
      description: 'Equal treatment of texts with integrated analysis',
      weight: 25,
      levels: createLevels([
        'Seamlessly moves between texts; neither dominates; true synthesis',
        'Both texts receive adequate attention; mostly integrated',
        'One text dominates; comparison is unbalanced',
        'Texts treated separately with no integration'
      ])
    },
    {
      id: uuid(),
      name: 'Historical/Cultural Context',
      description: 'Understanding of texts within their periods',
      weight: 25,
      levels: createLevels([
        'Sophisticated understanding of how context shapes meaning',
        'Appropriate context enhances analysis',
        'Some context present but may be superficial',
        'No attention to context; texts treated ahistorically'
      ])
    },
    {
      id: uuid(),
      name: 'Argument & Writing',
      description: 'Coherent argument expressed in polished prose',
      weight: 25,
      levels: createLevels([
        'Compelling argument; elegant, academic prose',
        'Clear argument; well-written with minor errors',
        'Argument is present but underdeveloped; some writing issues',
        'No clear argument; significant writing problems'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const creativeInterpretationRubric: RubricData = {
  id: 'rubric-creative-interpretation',
  name: 'Creative Interpretation',
  description: 'For creative responses to literature (rewrites, adaptations, etc.)',
  criteria: [
    {
      id: uuid(),
      name: 'Understanding of Source',
      description: 'Demonstrates comprehension of original text',
      weight: 25,
      levels: createLevels([
        'Deep understanding evident; creative choices show sophisticated reading',
        'Good understanding of source material',
        'Basic understanding; some misinterpretations',
        'Misunderstands or ignores source text'
      ])
    },
    {
      id: uuid(),
      name: 'Creative Vision',
      description: 'Original perspective or interpretation',
      weight: 30,
      levels: createLevels([
        'Highly original; offers new perspective on source material',
        'Shows creativity and thoughtful interpretation',
        'Some creativity but may be predictable',
        'No discernible creative vision; merely copies'
      ])
    },
    {
      id: uuid(),
      name: 'Craft & Execution',
      description: 'Quality of creative writing and technique',
      weight: 25,
      levels: createLevels([
        'Expertly crafted; demonstrates mastery of chosen form',
        'Well-executed with appropriate attention to craft',
        'Adequate execution; some craft elements present',
        'Poor execution; little attention to craft'
      ])
    },
    {
      id: uuid(),
      name: 'Reflection/Analysis',
      description: 'Explanation of creative choices (if required)',
      weight: 20,
      levels: createLevels([
        'Insightful reflection on choices and connection to source',
        'Clear explanation of creative decisions',
        'Basic reflection; may not connect to source',
        'No reflection or fails to explain choices'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

// ============================================
// Year 4: World Literature & AP Prep Rubrics
// ============================================

export const apLiteratureEssayRubric: RubricData = {
  id: 'rubric-ap-literature',
  name: 'AP Literature Essay',
  description: 'Based on AP Literature scoring guidelines',
  criteria: [
    {
      id: uuid(),
      name: 'Thesis',
      description: 'Defensible interpretation responding to prompt',
      weight: 15,
      levels: createLevels([
        'Thesis is sophisticated, specific, and offers a defensible interpretation',
        'Thesis responds to prompt with a defensible interpretation',
        'Thesis is present but may be oversimplified or vague',
        'No thesis or thesis does not respond to prompt'
      ])
    },
    {
      id: uuid(),
      name: 'Evidence & Commentary',
      description: 'Specific textual evidence with insightful commentary',
      weight: 40,
      levels: createLevels([
        'Evidence is specific and well-chosen; commentary is consistently insightful',
        'Evidence supports thesis; commentary explains significance',
        'Evidence is present; commentary may be uneven or obvious',
        'Evidence is lacking or irrelevant; little meaningful commentary'
      ])
    },
    {
      id: uuid(),
      name: 'Sophistication',
      description: 'Complexity of argument and literary insight',
      weight: 25,
      levels: createLevels([
        'Demonstrates sophisticated understanding; situates argument in broader context',
        'Shows some complexity; explores tensions or alternative readings',
        'Argument is straightforward; limited complexity',
        'Oversimplified reading; no complexity'
      ])
    },
    {
      id: uuid(),
      name: 'Writing',
      description: 'Control of language and organization',
      weight: 20,
      levels: createLevels([
        'Demonstrates consistent control; prose is vivid and precise',
        'Writing is clear and organized; appropriate style',
        'Writing is adequate; some organizational issues',
        'Writing impedes communication; poor organization'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const researchSynthesisRubric: RubricData = {
  id: 'rubric-research-synthesis',
  name: 'Research Synthesis',
  description: 'For extended research essays synthesizing multiple sources',
  criteria: [
    {
      id: uuid(),
      name: 'Research Quality',
      description: 'Depth, breadth, and relevance of research',
      weight: 20,
      levels: createLevels([
        'Research is extensive, scholarly, and highly relevant',
        'Research is adequate and relevant; appropriate sources',
        'Research is limited or some sources are questionable',
        'Research is insufficient or sources are inappropriate'
      ])
    },
    {
      id: uuid(),
      name: 'Synthesis',
      description: 'Integration of sources into coherent argument',
      weight: 25,
      levels: createLevels([
        'Sources are expertly synthesized; creates meaningful scholarly conversation',
        'Sources are integrated effectively; supports argument',
        'Sources are present but not well-integrated',
        'No synthesis; sources are listed rather than used'
      ])
    },
    {
      id: uuid(),
      name: 'Original Contribution',
      description: 'Adds to existing scholarly conversation',
      weight: 25,
      levels: createLevels([
        'Makes genuine contribution; advances understanding',
        'Shows original thinking; engages with scholarship',
        'Some original ideas but mainly summarizes others',
        'No original contribution; merely reports sources'
      ])
    },
    {
      id: uuid(),
      name: 'Documentation',
      description: 'Proper citation format and bibliography',
      weight: 15,
      levels: createLevels([
        'Perfect documentation throughout',
        'Minor documentation errors',
        'Multiple documentation errors',
        'Significant documentation problems or plagiarism concerns'
      ])
    },
    {
      id: uuid(),
      name: 'Writing & Organization',
      description: 'Academic prose and logical structure',
      weight: 15,
      levels: createLevels([
        'Polished academic prose; exemplary organization',
        'Clear writing; well-organized',
        'Adequate writing; some organizational issues',
        'Poor writing; disorganized'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const worldLiteratureAnalysisRubric: RubricData = {
  id: 'rubric-world-literature',
  name: 'World Literature Analysis',
  description: 'For analyzing texts from diverse cultural traditions',
  criteria: [
    {
      id: uuid(),
      name: 'Cultural Understanding',
      description: 'Awareness of cultural context and traditions',
      weight: 25,
      levels: createLevels([
        'Demonstrates nuanced understanding of cultural context without stereotyping',
        'Shows awareness of cultural context; mostly avoids generalizations',
        'Some cultural awareness but may oversimplify',
        'Ignores or misrepresents cultural context'
      ])
    },
    {
      id: uuid(),
      name: 'Literary Analysis',
      description: 'Analysis of literary elements and techniques',
      weight: 30,
      levels: createLevels([
        'Sophisticated analysis of how literary elements convey meaning',
        'Effective analysis of key literary elements',
        'Basic analysis; may focus on plot over technique',
        'No real analysis; summary only'
      ])
    },
    {
      id: uuid(),
      name: 'Universal & Particular',
      description: 'Balance of universal themes and cultural specificity',
      weight: 25,
      levels: createLevels([
        'Skillfully balances universal themes with cultural particulars',
        'Addresses both universal and culturally specific elements',
        'May overemphasize universal or ignore cultural specificity',
        'Fails to address either universal themes or cultural context'
      ])
    },
    {
      id: uuid(),
      name: 'Writing & Argumentation',
      description: 'Clear argument expressed in polished prose',
      weight: 20,
      levels: createLevels([
        'Compelling argument; sophisticated academic prose',
        'Clear argument; well-written',
        'Argument present but weak; adequate writing',
        'No clear argument; poor writing'
      ])
    }
  ],
  totalPoints: 100,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

// ============================================
// Export all rubrics
// ============================================

export const ALL_RUBRICS: RubricData[] = [
  // Year 1
  basicLiteraryAnalysisRubric,
  creativeWritingRubric,
  readingResponseRubric,
  // Year 2
  rhetoricalAnalysisRubric,
  researchPaperRubric,
  literaryAnalysisAdvancedRubric,
  // Year 3
  closeReadingRubric,
  comparativeAnalysisRubric,
  creativeInterpretationRubric,
  // Year 4
  apLiteratureEssayRubric,
  researchSynthesisRubric,
  worldLiteratureAnalysisRubric
]

export const RUBRIC_BY_ID = Object.fromEntries(
  ALL_RUBRICS.map(r => [r.id, r])
)
