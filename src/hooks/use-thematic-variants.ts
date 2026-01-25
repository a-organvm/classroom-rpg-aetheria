/**
 * Thematic Variants Hook
 *
 * Manages thematic content variants and student preferences.
 */

import { useMemo, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { v4 as uuid } from 'uuid'
import type {
  ThematicVariant,
  StudentPreferences,
  ThematicInterest,
  LearningStyle
} from '@/lib/types'

interface QuestVariants {
  questId: string
  variants: ThematicVariant[]
}

interface UseThematicVariantsReturn {
  // Quest Variants
  questVariants: QuestVariants[]
  addVariant: (questId: string, variant: Omit<ThematicVariant, 'id'>) => ThematicVariant
  updateVariant: (questId: string, variantId: string, updates: Partial<ThematicVariant>) => void
  deleteVariant: (questId: string, variantId: string) => void
  getVariantsForQuest: (questId: string) => ThematicVariant[]
  getVariantByInterest: (questId: string, interest: ThematicInterest) => ThematicVariant | undefined

  // Student Preferences
  studentPreferences: StudentPreferences[]
  setPreferences: (
    studentId: string,
    primaryInterest: ThematicInterest,
    secondaryInterest?: ThematicInterest,
    learningStyle?: LearningStyle
  ) => void
  getPreferences: (studentId: string) => StudentPreferences | undefined
  getRecommendedVariant: (questId: string, studentId: string) => ThematicVariant | undefined
}

export function useThematicVariants(): UseThematicVariantsReturn {
  const [questVariants, setQuestVariants] = useKV<QuestVariants[]>('aetheria-quest-variants', [])
  const [studentPreferences, setStudentPreferences] = useKV<StudentPreferences[]>('aetheria-student-prefs', [])

  const currentVariants = questVariants || []
  const currentPreferences = studentPreferences || []

  // ============================================
  // Quest Variants
  // ============================================

  const addVariant = useCallback((
    questId: string,
    variant: Omit<ThematicVariant, 'id'>
  ): ThematicVariant => {
    const newVariant: ThematicVariant = {
      ...variant,
      id: uuid()
    }

    const existingQuest = currentVariants.find(qv => qv.questId === questId)

    if (existingQuest) {
      setQuestVariants(
        currentVariants.map(qv =>
          qv.questId === questId
            ? { ...qv, variants: [...qv.variants, newVariant] }
            : qv
        )
      )
    } else {
      setQuestVariants([
        ...currentVariants,
        { questId, variants: [newVariant] }
      ])
    }

    return newVariant
  }, [currentVariants, setQuestVariants])

  const updateVariant = useCallback((
    questId: string,
    variantId: string,
    updates: Partial<ThematicVariant>
  ) => {
    setQuestVariants(
      currentVariants.map(qv =>
        qv.questId === questId
          ? {
              ...qv,
              variants: qv.variants.map(v =>
                v.id === variantId ? { ...v, ...updates } : v
              )
            }
          : qv
      )
    )
  }, [currentVariants, setQuestVariants])

  const deleteVariant = useCallback((questId: string, variantId: string) => {
    setQuestVariants(
      currentVariants.map(qv =>
        qv.questId === questId
          ? {
              ...qv,
              variants: qv.variants.filter(v => v.id !== variantId)
            }
          : qv
      ).filter(qv => qv.variants.length > 0)
    )
  }, [currentVariants, setQuestVariants])

  const getVariantsForQuest = useCallback((questId: string): ThematicVariant[] => {
    const questData = currentVariants.find(qv => qv.questId === questId)
    return questData?.variants || []
  }, [currentVariants])

  const getVariantByInterest = useCallback((
    questId: string,
    interest: ThematicInterest
  ): ThematicVariant | undefined => {
    const variants = getVariantsForQuest(questId)
    return variants.find(v => v.interestArea === interest)
  }, [getVariantsForQuest])

  // ============================================
  // Student Preferences
  // ============================================

  const setPreferences = useCallback((
    studentId: string,
    primaryInterest: ThematicInterest,
    secondaryInterest?: ThematicInterest,
    learningStyle: LearningStyle = 'reading'
  ) => {
    const existing = currentPreferences.find(p => p.studentId === studentId)

    const newPref: StudentPreferences = {
      studentId,
      primaryInterest,
      secondaryInterest,
      learningStyle,
      updatedAt: Date.now()
    }

    if (existing) {
      setStudentPreferences(
        currentPreferences.map(p =>
          p.studentId === studentId ? newPref : p
        )
      )
    } else {
      setStudentPreferences([...currentPreferences, newPref])
    }
  }, [currentPreferences, setStudentPreferences])

  const getPreferences = useCallback((studentId: string): StudentPreferences | undefined => {
    return currentPreferences.find(p => p.studentId === studentId)
  }, [currentPreferences])

  const getRecommendedVariant = useCallback((
    questId: string,
    studentId: string
  ): ThematicVariant | undefined => {
    const prefs = getPreferences(studentId)
    const variants = getVariantsForQuest(questId)

    if (!prefs || variants.length === 0) {
      // Return general variant or first available
      return variants.find(v => v.interestArea === 'general') || variants[0]
    }

    // Try primary interest first
    let variant = variants.find(v => v.interestArea === prefs.primaryInterest)
    if (variant) return variant

    // Try secondary interest
    if (prefs.secondaryInterest) {
      variant = variants.find(v => v.interestArea === prefs.secondaryInterest)
      if (variant) return variant
    }

    // Fall back to general
    return variants.find(v => v.interestArea === 'general') || variants[0]
  }, [getPreferences, getVariantsForQuest])

  return {
    questVariants: currentVariants,
    addVariant,
    updateVariant,
    deleteVariant,
    getVariantsForQuest,
    getVariantByInterest,
    studentPreferences: currentPreferences,
    setPreferences,
    getPreferences,
    getRecommendedVariant
  }
}
