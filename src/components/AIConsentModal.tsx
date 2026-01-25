/**
 * AI Consent Modal
 *
 * Displays AI feature consent information and collects user acceptance.
 * Required before using AI-powered features like feedback generation.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Brain, ShieldCheck, Eye, Flag } from '@phosphor-icons/react'
import type { Theme } from '@/lib/types'

interface AIConsentModalProps {
  open: boolean
  theme?: Theme
  onAccept: () => void
  onDecline?: () => void
}

export function AIConsentModal({
  open,
  theme = 'fantasy',
  onAccept,
  onDecline
}: AIConsentModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false)

  const handleAccept = () => {
    if (hasReadTerms) {
      onAccept()
    }
  }

  const features = [
    {
      icon: ShieldCheck,
      title: 'Data Anonymization',
      description: 'Your data is always anonymized. Personal information is never used for AI training.'
    },
    {
      icon: Eye,
      title: 'Improved Suggestions',
      description: 'This helps us understand which suggestions are helpful and refine our AI models.'
    },
    {
      icon: Flag,
      title: 'User Control',
      description: 'You are always in control and can flag any inaccurate AI suggestions.'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass-panel max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain size={28} className="text-primary" weight="fill" />
            </div>
            <DialogTitle className="text-2xl">AI Feature Consent</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            To improve our AI-powered features like feedback generation and content
            suggestions, we need your consent to use anonymized data from your
            interactions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <AnimatePresence>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <feature.icon
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                  weight="fill"
                />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="consent-checkbox"
              checked={hasReadTerms}
              onCheckedChange={(checked) => setHasReadTerms(checked === true)}
            />
            <Label
              htmlFor="consent-checkbox"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I have read and understand the above information
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            {onDecline && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onDecline}
              >
                Decline
              </Button>
            )}
            <Button
              className="flex-1"
              disabled={!hasReadTerms}
              onClick={handleAccept}
            >
              Accept and Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
