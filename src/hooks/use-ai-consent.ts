/**
 * AI Consent Hook
 *
 * Manages AI feature consent state with persistence via useSandboxKV.
 * Tracks which AI features the user has consented to use.
 */

import { useCallback, useMemo } from 'react'
import { useSandboxKV } from '@/hooks/use-sandbox-kv'

/**
 * Available AI features that require consent
 */
export type AIFeature =
  | 'quest-evaluation'
  | 'knowledge-crystals'
  | 'feedback-generation'
  | 'redemption-quests'
  | 'content-suggestions'

export const AI_FEATURES: { value: AIFeature; label: string; description: string }[] = [
  {
    value: 'quest-evaluation',
    label: 'Quest Evaluation',
    description: 'AI-powered scoring and feedback on quest submissions'
  },
  {
    value: 'knowledge-crystals',
    label: 'Knowledge Crystals',
    description: 'AI-generated study guides for failed quests'
  },
  {
    value: 'feedback-generation',
    label: 'Feedback Generation',
    description: 'AI-assisted feedback suggestions for teachers'
  },
  {
    value: 'redemption-quests',
    label: 'Redemption Quests',
    description: 'AI-generated simplified quests for retry attempts'
  },
  {
    value: 'content-suggestions',
    label: 'Content Suggestions',
    description: 'AI recommendations for learning content'
  }
]

/**
 * Persistent state for AI consent
 */
export interface AIConsentState {
  hasConsented: boolean
  consentTimestamp?: number
  consentedFeatures: AIFeature[]
}

/**
 * Default state for users who haven't consented yet
 */
const DEFAULT_CONSENT_STATE: AIConsentState = {
  hasConsented: false,
  consentedFeatures: []
}

/**
 * Return type for the useAIConsent hook
 */
interface UseAIConsentReturn {
  /** Whether the user has given any consent */
  hasConsented: boolean
  /** Timestamp when consent was given */
  consentTimestamp?: number
  /** List of features the user has consented to */
  consentedFeatures: AIFeature[]
  /** Grant consent, optionally for specific features (defaults to all) */
  grantConsent: (features?: AIFeature[]) => void
  /** Revoke all consent */
  revokeConsent: () => void
  /** Check if a specific feature has consent */
  checkFeatureConsent: (feature: AIFeature) => boolean
  /** Add consent for additional features */
  addFeatureConsent: (features: AIFeature[]) => void
  /** Remove consent for specific features */
  removeFeatureConsent: (features: AIFeature[]) => void
}

/**
 * Hook for managing AI feature consent with persistence.
 *
 * @example
 * ```tsx
 * const { hasConsented, grantConsent, checkFeatureConsent } = useAIConsent()
 *
 * if (!checkFeatureConsent('quest-evaluation')) {
 *   // Show consent modal
 * }
 *
 * // After user accepts
 * grantConsent(['quest-evaluation', 'knowledge-crystals'])
 * ```
 */
export function useAIConsent(): UseAIConsentReturn {
  const [consentState, setConsentState] = useSandboxKV<AIConsentState>(
    'aetheria-ai-consent',
    DEFAULT_CONSENT_STATE
  )

  // Ensure we have a valid state object
  const currentState = consentState || DEFAULT_CONSENT_STATE

  /**
   * Grant consent for AI features
   * If no features specified, grants consent for all features
   */
  const grantConsent = useCallback((features?: AIFeature[]) => {
    const featuresToConsent = features || AI_FEATURES.map(f => f.value)

    setConsentState({
      hasConsented: true,
      consentTimestamp: Date.now(),
      consentedFeatures: featuresToConsent
    })
  }, [setConsentState])

  /**
   * Revoke all consent
   */
  const revokeConsent = useCallback(() => {
    setConsentState(DEFAULT_CONSENT_STATE)
  }, [setConsentState])

  /**
   * Check if a specific feature has consent
   */
  const checkFeatureConsent = useCallback((feature: AIFeature): boolean => {
    if (!currentState.hasConsented) return false
    return currentState.consentedFeatures.includes(feature)
  }, [currentState])

  /**
   * Add consent for additional features
   */
  const addFeatureConsent = useCallback((features: AIFeature[]) => {
    const existingFeatures = currentState.consentedFeatures || []
    const newFeatures = [...new Set([...existingFeatures, ...features])]

    setConsentState({
      hasConsented: true,
      consentTimestamp: currentState.consentTimestamp || Date.now(),
      consentedFeatures: newFeatures
    })
  }, [currentState, setConsentState])

  /**
   * Remove consent for specific features
   */
  const removeFeatureConsent = useCallback((features: AIFeature[]) => {
    const existingFeatures = currentState.consentedFeatures || []
    const remainingFeatures = existingFeatures.filter(f => !features.includes(f))

    // If no features remain, revoke all consent
    if (remainingFeatures.length === 0) {
      setConsentState(DEFAULT_CONSENT_STATE)
    } else {
      setConsentState({
        ...currentState,
        consentedFeatures: remainingFeatures
      })
    }
  }, [currentState, setConsentState])

  return useMemo(() => ({
    hasConsented: currentState.hasConsented,
    consentTimestamp: currentState.consentTimestamp,
    consentedFeatures: currentState.consentedFeatures || [],
    grantConsent,
    revokeConsent,
    checkFeatureConsent,
    addFeatureConsent,
    removeFeatureConsent
  }), [
    currentState.hasConsented,
    currentState.consentTimestamp,
    currentState.consentedFeatures,
    grantConsent,
    revokeConsent,
    checkFeatureConsent,
    addFeatureConsent,
    removeFeatureConsent
  ])
}
