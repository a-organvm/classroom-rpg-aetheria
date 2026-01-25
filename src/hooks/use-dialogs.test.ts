import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDialogs } from './use-dialogs'

describe('useDialogs', () => {
  describe('initial state', () => {
    it('should have all dialogs closed initially', () => {
      const { result } = renderHook(() => useDialogs())

      expect(result.current.state.showNameDialog).toBe(false)
      expect(result.current.state.showLevelUp).toBe(false)
      expect(result.current.state.isEditingRealms).toBe(false)
      expect(result.current.state.isCreatingRealm).toBe(false)
      expect(result.current.state.isCreatingQuest).toBe(false)
      expect(result.current.state.selectedQuestId).toBe(null)
    })

    it('should have empty name input initially', () => {
      const { result } = renderHook(() => useDialogs())
      expect(result.current.state.nameInput).toBe('')
    })

    it('should have default level up data', () => {
      const { result } = renderHook(() => useDialogs())
      expect(result.current.state.levelUpData.level).toBe(1)
      expect(result.current.state.levelUpData.role).toBe('student')
    })
  })

  describe('name dialog', () => {
    it('should open name dialog', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.openNameDialog()
      })

      expect(result.current.state.showNameDialog).toBe(true)
    })

    it('should close name dialog', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.openNameDialog()
      })
      act(() => {
        result.current.closeNameDialog()
      })

      expect(result.current.state.showNameDialog).toBe(false)
    })

    it('should update name input', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.setNameInput('Test Name')
      })

      expect(result.current.state.nameInput).toBe('Test Name')
    })
  })

  describe('level up celebration', () => {
    it('should show level up with correct data', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.showLevelUpCelebration(5, 'teacher')
      })

      expect(result.current.state.showLevelUp).toBe(true)
      expect(result.current.state.levelUpData.level).toBe(5)
      expect(result.current.state.levelUpData.role).toBe('teacher')
    })

    it('should hide level up celebration', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.showLevelUpCelebration(5, 'teacher')
      })
      act(() => {
        result.current.hideLevelUpCelebration()
      })

      expect(result.current.state.showLevelUp).toBe(false)
    })
  })

  describe('realm editor', () => {
    it('should open and close realm editor', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.openRealmEditor()
      })
      expect(result.current.state.isEditingRealms).toBe(true)

      act(() => {
        result.current.closeRealmEditor()
      })
      expect(result.current.state.isEditingRealms).toBe(false)
    })
  })

  describe('realm creator', () => {
    it('should open and close realm creator', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.openRealmCreator()
      })
      expect(result.current.state.isCreatingRealm).toBe(true)

      act(() => {
        result.current.closeRealmCreator()
      })
      expect(result.current.state.isCreatingRealm).toBe(false)
    })
  })

  describe('quest creator', () => {
    it('should open and close quest creator', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.openQuestCreator()
      })
      expect(result.current.state.isCreatingQuest).toBe(true)

      act(() => {
        result.current.closeQuestCreator()
      })
      expect(result.current.state.isCreatingQuest).toBe(false)
    })
  })

  describe('quest selection', () => {
    it('should select a quest', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.selectQuest('quest-123')
      })

      expect(result.current.state.selectedQuestId).toBe('quest-123')
    })

    it('should deselect a quest', () => {
      const { result } = renderHook(() => useDialogs())

      act(() => {
        result.current.selectQuest('quest-123')
      })
      act(() => {
        result.current.deselectQuest()
      })

      expect(result.current.state.selectedQuestId).toBe(null)
    })
  })
})
