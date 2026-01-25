/**
 * Vote Status Component
 *
 * Compact status indicator for voting progress.
 */

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { ThreeWayVote } from '@/lib/types'
import { CheckCircle, Clock, Crown, Users } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface VoteStatusProps {
  vote: ThreeWayVote
  compact?: boolean
  className?: string
}

export function VoteStatus({ vote, compact = false, className }: VoteStatusProps) {
  const getTotalVotes = (): number => {
    let count = 0
    if (vote.teacherVote) count++
    if (vote.studentVote) count++
    if (vote.parentVote) count++
    return count
  }

  const totalVotes = getTotalVotes()
  const progress = (totalVotes / 3) * 100

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {vote.status === 'pending' && (
          <Badge variant="outline" className="gap-1">
            <Clock size={10} />
            {totalVotes}/3
          </Badge>
        )}
        {vote.status === 'decided' && (
          <Badge variant="default" className="gap-1 bg-accent">
            <CheckCircle size={10} />
            Done
          </Badge>
        )}
        {vote.status === 'override' && (
          <Badge variant="secondary" className="gap-1">
            <Crown size={10} />
            Override
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} />
          <span>{vote.topic}</span>
        </div>
        {vote.status === 'pending' && (
          <Badge variant="outline" className="gap-1">
            <Clock size={10} />
            {totalVotes}/3 votes
          </Badge>
        )}
        {vote.status === 'decided' && (
          <Badge variant="default" className="gap-1 bg-accent">
            <CheckCircle size={10} weight="fill" />
            Decided
          </Badge>
        )}
        {vote.status === 'override' && (
          <Badge variant="secondary" className="gap-1">
            <Crown size={10} weight="fill" />
            Override
          </Badge>
        )}
      </div>

      {vote.status === 'pending' && (
        <Progress value={progress} className="h-1.5" />
      )}

      <div className="flex justify-between text-xs text-muted-foreground">
        <span className={cn(vote.teacherVote && 'text-accent font-medium')}>
          Teacher {vote.teacherVote ? '✓' : '○'}
        </span>
        <span className={cn(vote.studentVote && 'text-accent font-medium')}>
          Student {vote.studentVote ? '✓' : '○'}
        </span>
        <span className={cn(vote.parentVote && 'text-accent font-medium')}>
          Parent {vote.parentVote ? '✓' : '○'}
        </span>
      </div>

      {vote.status !== 'pending' && vote.decidedOption && (
        <div className="text-sm">
          <span className="text-muted-foreground">Result: </span>
          <span className="font-medium">
            {vote.options.find(o => o.id === vote.decidedOption)?.label}
          </span>
        </div>
      )}
    </div>
  )
}
