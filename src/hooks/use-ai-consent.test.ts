/**
 * Tests for useAIConsent hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAIConsent, AI_FEATURES, type AIFeature } from './use-ai-consent'

// Mock useSandboxKV to use a simple state object
let mockConsentState: {
  hasConsented: boolean
  consentTimestamp?: number
  consentedFeatures: AIFeature[]
} = {
  hasConsented: false,
  consentedFeatures: []
}

const mockSetConsentState = vi.fn((newState) => {
  if (typeof newState === 'function') {
    mockConsentState = newState(mockConsentState)
  } else {
    mockConsentState = newState
  }
})

vi.mock('@/hooks/use-sandbox-kv', () => ({
  useSandboxKV: vi.fn(() => [mockConsentState, mockSetConsentState])
}))

describe('useAIConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConsentState = {
      hasConsented: false,
      consentedFeatures: []
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return hasConsented as false by default', () => {
      const { result } = renderHook(() => useAIConsent())

      expect(result.current.hasConsented).toBe(false)
    })

    it('should return empty consentedFeatures by default', () => {
      const { result } = renderHook(() => useAIConsent())

      expect(result.current.consentedFeatures).toEqual([])
    })

    it('should return undefined consentTimestamp by default', () => {
      const { result } = renderHook(() => useAIConsent())

      expect(result.current.consentTimestamp).toBeUndefined()
    })
  })

  describe('grantConsent', () => {
    it('should grant consent for all features when no features specified', () => {
      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.grantConsent()
      })

      expect(mockSetConsentState).toHaveBeenCalledWith(
        expect.objectContaining({
          hasConsented: true,
          consentedFeatures: AI_FEATURES.map(f => f.value)
        })
      )
    })

    it('should grant consent for specific features when specified', () => {
      const { result } = renderHook(() => useAIConsent())
      const specificFeatures: AIFeature[] = ['quest-evaluation', 'knowledge-crystals']

      act(() => {
        result.current.grantConsent(specificFeatures)
      })

      expect(mockSetConsentState).toHaveBeenCalledWith(
        expect.objectContaining({
          hasConsented: true,
          consentedFeatures: specificFeatures
        })
      )
    })

    it('should set consentTimestamp when granting consent', () => {
      const { result } = renderHook(() => useAIConsent())
      const beforeTime = Date.now()

      act(() => {
        result.current.grantConsent()
      })

      const afterTime = Date.now()
      const calledWith = mockSetConsentState.mock.calls[0][0]
      expect(calledWith.consentTimestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(calledWith.consentTimestamp).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('revokeConsent', () => {
    it('should reset consent state to defaults', () => {
      // Start with consented state
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: Date.now(),
        consentedFeatures: ['quest-evaluation', 'knowledge-crystals']
      }

      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.revokeConsent()
      })

      expect(mockSetConsentState).toHaveBeenCalledWith({
        hasConsented: false,
        consentedFeatures: []
      })
    })
  })

  describe('checkFeatureConsent', () => {
    it('should return false if not consented', () => {
      const { result } = renderHook(() => useAIConsent())

      expect(result.current.checkFeatureConsent('quest-evaluation')).toBe(false)
    })

    it('should return true if feature is in consented list', () => {
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: Date.now(),
        consentedFeatures: ['quest-evaluation', 'knowledge-crystals']
      }

      const { result } = renderHook(() => useAIConsent())

      expect(result.current.checkFeatureConsent('quest-evaluation')).toBe(true)
      expect(result.current.checkFeatureConsent('knowledge-crystals')).toBe(true)
    })

    it('should return false if feature is not in consented list', () => {
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: Date.now(),
        consentedFeatures: ['quest-evaluation']
      }

      const { result } = renderHook(() => useAIConsent())

      expect(result.current.checkFeatureConsent('feedback-generation')).toBe(false)
    })
  })

  describe('addFeatureConsent', () => {
    it('should add new features to existing consented features', () => {
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: 1000,
        consentedFeatures: ['quest-evaluation']
      }

      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.addFeatureConsent(['knowledge-crystals', 'feedback-generation'])
      })

      expect(mockSetConsentState).toHaveBeenCalledWith(
        expect.objectContaining({
          hasConsented: true,
          consentTimestamp: 1000,
          consentedFeatures: expect.arrayContaining([
            'quest-evaluation',
            'knowledge-crystals',
            'feedback-generation'
          ])
        })
      )
    })

    it('should not duplicate existing features', () => {
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: 1000,
        consentedFeatures: ['quest-evaluation']
      }

      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.addFeatureConsent(['quest-evaluation', 'knowledge-crystals'])
      })

      const calledWith = mockSetConsentState.mock.calls[0][0]
      const questEvalCount = calledWith.consentedFeatures.filter(
        (f: AIFeature) => f === 'quest-evaluation'
      ).length
      expect(questEvalCount).toBe(1)
    })

    it('should set hasConsented to true when adding features without prior consent', () => {
      mockConsentState = {
        hasConsented: false,
        consentedFeatures: []
      }

      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.addFeatureConsent(['quest-evaluation'])
      })

      expect(mockSetConsentState).toHaveBeenCalledWith(
        expect.objectContaining({
          hasConsented: true
        })
      )
    })
  })

  describe('removeFeatureConsent', () => {
    it('should remove specified features from consented list', () => {
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: 1000,
        consentedFeatures: ['quest-evaluation', 'knowledge-crystals', 'feedback-generation']
      }

      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.removeFeatureConsent(['knowledge-crystals'])
      })

      expect(mockSetConsentState).toHaveBeenCalledWith(
        expect.objectContaining({
          consentedFeatures: ['quest-evaluation', 'feedback-generation']
        })
      )
    })

    it('should revoke all consent if no features remain', () => {
      mockConsentState = {
        hasConsented: true,
        consentTimestamp: 1000,
        consentedFeatures: ['quest-evaluation']
      }

      const { result } = renderHook(() => useAIConsent())

      act(() => {
        result.current.removeFeatureConsent(['quest-evaluation'])
      })

      expect(mockSetConsentState).toHaveBeenCalledWith({
        hasConsented: false,
        consentedFeatures: []
      })
    })
  })

  describe('AI_FEATURES constant', () => {
    it('should have all expected features', () => {
      const featureValues = AI_FEATURES.map(f => f.value)
      expect(featureValues).toContain('quest-evaluation')
      expect(featureValues).toContain('knowledge-crystals')
      expect(featureValues).toContain('feedback-generation')
      expect(featureValues).toContain('redemption-quests')
      expect(featureValues).toContain('content-suggestions')
    })

    it('should have label and description for each feature', () => {
      AI_FEATURES.forEach(feature => {
        expect(feature.label).toBeTruthy()
        expect(feature.description).toBeTruthy()
      })
    })
  })
})
