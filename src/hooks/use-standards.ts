/**
 * Standards Tracking Hook
 *
 * Manages standards alignment and student mastery tracking.
 */

import { useMemo, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type {
  QuestStandardAlignment,
  StandardMastery,
  MasteryLevel,
  CoverageLevel,
  StandardFramework
} from '@/lib/types'

interface UseStandardsReturn {
  // Quest-Standard Alignments
  alignments: QuestStandardAlignment[]
  addAlignment: (questId: string, standardId: string, coverage: CoverageLevel) => void
  removeAlignment: (questId: string, standardId: string) => void
  getAlignmentsByQuest: (questId: string) => QuestStandardAlignment[]
  getAlignmentsByStandard: (standardId: string) => QuestStandardAlignment[]

  // Student Mastery
  masteryRecords: StandardMastery[]
  updateMastery: (studentId: string, standardId: string, level: MasteryLevel, evidence?: string) => void
  getMasteryByStudent: (studentId: string) => StandardMastery[]
  getMasteryByStandard: (standardId: string) => StandardMastery[]
  getStudentMasteryLevel: (studentId: string, standardId: string) => MasteryLevel

  // Analytics
  getStudentProgress: (studentId: string, framework?: StandardFramework) => {
    total: number
    byLevel: Record<MasteryLevel, number>
    percentage: number
  }
  getClassMasteryForStandard: (standardId: string) => {
    total: number
    byLevel: Record<MasteryLevel, number>
  }
}

const DEFAULT_MASTERY: MasteryLevel = 'not-started'

export function useStandards(): UseStandardsReturn {
  const [alignments, setAlignments] = useKV<QuestStandardAlignment[]>('aetheria-standard-alignments', [])
  const [masteryRecords, setMasteryRecords] = useKV<StandardMastery[]>('aetheria-standard-mastery', [])

  const currentAlignments = alignments || []
  const currentMastery = masteryRecords || []

  // ============================================
  // Quest-Standard Alignments
  // ============================================

  const addAlignment = useCallback((
    questId: string,
    standardId: string,
    coverage: CoverageLevel
  ) => {
    // Check if alignment already exists
    const exists = currentAlignments.some(
      a => a.questId === questId && a.standardId === standardId
    )
    if (exists) {
      // Update existing
      setAlignments(
        currentAlignments.map(a =>
          a.questId === questId && a.standardId === standardId
            ? { ...a, coverage }
            : a
        )
      )
    } else {
      // Add new
      setAlignments([...currentAlignments, { questId, standardId, coverage }])
    }
  }, [currentAlignments, setAlignments])

  const removeAlignment = useCallback((questId: string, standardId: string) => {
    setAlignments(
      currentAlignments.filter(
        a => !(a.questId === questId && a.standardId === standardId)
      )
    )
  }, [currentAlignments, setAlignments])

  const getAlignmentsByQuest = useCallback((questId: string): QuestStandardAlignment[] => {
    return currentAlignments.filter(a => a.questId === questId)
  }, [currentAlignments])

  const getAlignmentsByStandard = useCallback((standardId: string): QuestStandardAlignment[] => {
    return currentAlignments.filter(a => a.standardId === standardId)
  }, [currentAlignments])

  // ============================================
  // Student Mastery
  // ============================================

  const updateMastery = useCallback((
    studentId: string,
    standardId: string,
    level: MasteryLevel,
    evidence?: string
  ) => {
    const existing = currentMastery.find(
      m => m.studentId === studentId && m.standardId === standardId
    )

    if (existing) {
      setMasteryRecords(
        currentMastery.map(m =>
          m.studentId === studentId && m.standardId === standardId
            ? {
                ...m,
                level,
                evidence: evidence ? [...m.evidence, evidence] : m.evidence,
                lastAssessed: Date.now()
              }
            : m
        )
      )
    } else {
      setMasteryRecords([
        ...currentMastery,
        {
          studentId,
          standardId,
          level,
          evidence: evidence ? [evidence] : [],
          lastAssessed: Date.now()
        }
      ])
    }
  }, [currentMastery, setMasteryRecords])

  const getMasteryByStudent = useCallback((studentId: string): StandardMastery[] => {
    return currentMastery.filter(m => m.studentId === studentId)
  }, [currentMastery])

  const getMasteryByStandard = useCallback((standardId: string): StandardMastery[] => {
    return currentMastery.filter(m => m.standardId === standardId)
  }, [currentMastery])

  const getStudentMasteryLevel = useCallback((
    studentId: string,
    standardId: string
  ): MasteryLevel => {
    const record = currentMastery.find(
      m => m.studentId === studentId && m.standardId === standardId
    )
    return record?.level || DEFAULT_MASTERY
  }, [currentMastery])

  // ============================================
  // Analytics
  // ============================================

  const getStudentProgress = useCallback((
    studentId: string,
    framework?: StandardFramework
  ) => {
    let records = getMasteryByStudent(studentId)

    // Filter by framework if specified (would need standard metadata)
    // For now, use all records
    const byLevel: Record<MasteryLevel, number> = {
      'not-started': 0,
      'beginning': 0,
      'developing': 0,
      'proficient': 0,
      'mastered': 0
    }

    records.forEach(r => {
      byLevel[r.level]++
    })

    const total = records.length
    const proficientOrAbove = byLevel['proficient'] + byLevel['mastered']
    const percentage = total > 0 ? Math.round((proficientOrAbove / total) * 100) : 0

    return { total, byLevel, percentage }
  }, [getMasteryByStudent])

  const getClassMasteryForStandard = useCallback((standardId: string) => {
    const records = getMasteryByStandard(standardId)

    const byLevel: Record<MasteryLevel, number> = {
      'not-started': 0,
      'beginning': 0,
      'developing': 0,
      'proficient': 0,
      'mastered': 0
    }

    records.forEach(r => {
      byLevel[r.level]++
    })

    return { total: records.length, byLevel }
  }, [getMasteryByStandard])

  return {
    alignments: currentAlignments,
    addAlignment,
    removeAlignment,
    getAlignmentsByQuest,
    getAlignmentsByStandard,
    masteryRecords: currentMastery,
    updateMastery,
    getMasteryByStudent,
    getMasteryByStandard,
    getStudentMasteryLevel,
    getStudentProgress,
    getClassMasteryForStandard
  }
}
