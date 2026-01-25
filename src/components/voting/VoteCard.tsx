/**
 * Vote Card Component
 *
 * Individual voting option card.
 */

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { VoteOption, ThematicInterest } from '@/lib/types'
import { CheckCircle, Trophy } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface VoteCardProps {
  option: VoteOption
  isSelected: boolean
  isWinner?: boolean
  voteCount?: number
  disabled?: boolean
  onClick: () => void
}

const INTEREST_COLORS: Record<ThematicInterest, string> = {
  sports: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  science: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  arts: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  technology: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  nature: 'bg-green-500/10 text-green-500 border-green-500/20',
  'social-justice': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  business: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  general: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
}

const INTEREST_ICONS: Record<ThematicInterest, string> = {
  sports: '⚽',
  science: '🔬',
  arts: '🎨',
  technology: '💻',
  nature: '🌿',
  'social-justice': '✊',
  business: '📊',
  general: '📚'
}

export function VoteCard({
  option,
  isSelected,
  isWinner = false,
  voteCount,
  disabled = false,
  onClick
}: VoteCardProps) {
  const interestColor = option.thematicInterest
    ? INTEREST_COLORS[option.thematicInterest]
    : ''
  const interestIcon = option.thematicInterest
    ? INTEREST_ICONS[option.thematicInterest]
    : ''

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <Card
        onClick={() => !disabled && onClick()}
        className={cn(
          'p-4 cursor-pointer transition-all duration-200',
          'hover:border-primary/50',
          isSelected && 'border-primary bg-primary/5 ring-2 ring-primary/20',
          isWinner && 'border-accent bg-accent/10 ring-2 ring-accent/30',
          disabled && 'cursor-not-allowed opacity-60',
          !disabled && !isSelected && 'hover:bg-muted/50'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {option.thematicInterest && (
                <span className="text-lg">{interestIcon}</span>
              )}
              <h4 className="font-medium">{option.label}</h4>
              {isWinner && (
                <Trophy size={16} className="text-accent" weight="fill" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {option.description}
            </p>
            {option.thematicInterest && (
              <Badge
                variant="outline"
                className={cn('mt-2', interestColor)}
              >
                {option.thematicInterest.replace('-', ' ')}
              </Badge>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {isSelected && !isWinner && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1 rounded-full bg-primary text-primary-foreground"
              >
                <CheckCircle size={16} weight="fill" />
              </motion.div>
            )}
            {isWinner && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1 rounded-full bg-accent text-accent-foreground"
              >
                <Trophy size={16} weight="fill" />
              </motion.div>
            )}
            {voteCount !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {voteCount} vote{voteCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
