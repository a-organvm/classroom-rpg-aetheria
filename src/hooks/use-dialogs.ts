import { useState, useCallback } from 'react'
import type { Role } from '@/lib/types'

export interface DialogState {
  showNameDialog: boolean
  showLevelUp: boolean
  isEditingRealms: boolean
  isCreatingRealm: boolean
  isCreatingQuest: boolean
  selectedQuestId: string | null
  levelUpData: { level: number; role: Role }
  nameInput: string
}

interface UseDialogsResult {
  state: DialogState
  // Name dialog
  openNameDialog: () => void
  closeNameDialog: () => void
  setNameInput: (value: string) => void
  // Level up
  showLevelUpCelebration: (level: number, role: Role) => void
  hideLevelUpCelebration: () => void
  // Realm editing
  openRealmEditor: () => void
  closeRealmEditor: () => void
  // Realm creation
  openRealmCreator: () => void
  closeRealmCreator: () => void
  // Quest creation
  openQuestCreator: () => void
  closeQuestCreator: () => void
  // Quest selection
  selectQuest: (questId: string) => void
  deselectQuest: () => void
}

/**
 * Hook for managing all dialog states in the application.
 * Centralizes dialog open/close logic to reduce prop drilling.
 */
export function useDialogs(): UseDialogsResult {
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isEditingRealms, setIsEditingRealms] = useState(false)
  const [isCreatingRealm, setIsCreatingRealm] = useState(false)
  const [isCreatingQuest, setIsCreatingQuest] = useState(false)
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)
  const [levelUpData, setLevelUpData] = useState<{ level: number; role: Role }>({ level: 1, role: 'student' })
  const [nameInput, setNameInput] = useState('')

  // Name dialog
  const openNameDialog = useCallback(() => setShowNameDialog(true), [])
  const closeNameDialog = useCallback(() => setShowNameDialog(false), [])

  // Level up
  const showLevelUpCelebration = useCallback((level: number, role: Role) => {
    setLevelUpData({ level, role })
    setShowLevelUp(true)
  }, [])
  const hideLevelUpCelebration = useCallback(() => setShowLevelUp(false), [])

  // Realm editing
  const openRealmEditor = useCallback(() => setIsEditingRealms(true), [])
  const closeRealmEditor = useCallback(() => setIsEditingRealms(false), [])

  // Realm creation
  const openRealmCreator = useCallback(() => setIsCreatingRealm(true), [])
  const closeRealmCreator = useCallback(() => setIsCreatingRealm(false), [])

  // Quest creation
  const openQuestCreator = useCallback(() => setIsCreatingQuest(true), [])
  const closeQuestCreator = useCallback(() => setIsCreatingQuest(false), [])

  // Quest selection
  const selectQuest = useCallback((questId: string) => setSelectedQuestId(questId), [])
  const deselectQuest = useCallback(() => setSelectedQuestId(null), [])

  return {
    state: {
      showNameDialog,
      showLevelUp,
      isEditingRealms,
      isCreatingRealm,
      isCreatingQuest,
      selectedQuestId,
      levelUpData,
      nameInput
    },
    openNameDialog,
    closeNameDialog,
    setNameInput,
    showLevelUpCelebration,
    hideLevelUpCelebration,
    openRealmEditor,
    closeRealmEditor,
    openRealmCreator,
    closeRealmCreator,
    openQuestCreator,
    closeQuestCreator,
    selectQuest,
    deselectQuest
  }
}
