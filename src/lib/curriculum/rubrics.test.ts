import { describe, it, expect } from 'vitest'
import {
  ALL_RUBRICS,
  RUBRIC_BY_ID,
  basicLiteraryAnalysisRubric,
  apLiteratureEssayRubric
} from './rubrics'

describe('Curriculum Rubrics', () => {
  it('should export exactly 12 rubrics in ALL_RUBRICS', () => {
    expect(ALL_RUBRICS.length).toBe(12)
  })

  it('should have all rubrics accessible via RUBRIC_BY_ID', () => {
    ALL_RUBRICS.forEach((rubric) => {
      expect(RUBRIC_BY_ID[rubric.id]).toBeDefined()
      expect(RUBRIC_BY_ID[rubric.id].name).toBe(rubric.name)
    })
  })

  it('should have a totalPoints of 100 for all rubrics', () => {
    ALL_RUBRICS.forEach((rubric) => {
      expect(rubric.totalPoints).toBe(100)
    })
  })

  it('should have 4 levels (Exemplary, Proficient, Developing, Beginning) for each criterion', () => {
    basicLiteraryAnalysisRubric.criteria.forEach((criterion) => {
      expect(criterion.levels.length).toBe(4)
      expect(criterion.levels[0].score).toBe(4)
      expect(criterion.levels[0].label).toBe('Exemplary')
      expect(criterion.levels[1].score).toBe(3)
      expect(criterion.levels[1].label).toBe('Proficient')
      expect(criterion.levels[2].score).toBe(2)
      expect(criterion.levels[2].label).toBe('Developing')
      expect(criterion.levels[3].score).toBe(1)
      expect(criterion.levels[3].label).toBe('Beginning')
    })
  })

  it('should ensure all criterion IDs are strings (UUIDs)', () => {
    ALL_RUBRICS.forEach((rubric) => {
      rubric.criteria.forEach((criterion) => {
        expect(typeof criterion.id).toBe('string')
        expect(criterion.id.length).toBeGreaterThan(0)
      })
    })
  })

  it('should have correct descriptions for specific rubrics', () => {
    expect(apLiteratureEssayRubric.name).toBe('AP Literature Essay')
    expect(apLiteratureEssayRubric.description).toContain('AP Literature scoring')
  })
})
