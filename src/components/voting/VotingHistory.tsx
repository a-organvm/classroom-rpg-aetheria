/**
 * Voting History Component
 *
 * Displays history of past voting decisions.
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ThreeWayVote } from '@/lib/types'
import { CheckCircle, Crown, Clock, Calendar } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'

interface VotingHistoryProps {
  votes: ThreeWayVote[]
  onSelectVote?: (vote: ThreeWayVote) => void
}

export function VotingHistory({ votes, onSelectVote }: VotingHistoryProps) {
  const sortedVotes = useMemo(() => {
    return [...votes].sort((a, b) => {
      // Pending first, then by date
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return (b.decidedAt || b.createdAt) - (a.decidedAt || a.createdAt)
    })
  }, [votes])

  const pendingCount = votes.filter(v => v.status === 'pending').length
  const decidedCount = votes.filter(v => v.status !== 'pending').length

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Voting History</CardTitle>
          <div className="flex gap-2">
            {pendingCount > 0 && (
              <Badge variant="outline" className="gap-1">
                <Clock size={12} />
                {pendingCount} pending
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <CheckCircle size={12} />
              {decidedCount} decided
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sortedVotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                <p>No voting history yet</p>
              </div>
            ) : (
              sortedVotes.map((vote, index) => (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectVote?.(vote)}
                  className="cursor-pointer"
                >
                  <Card className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {vote.status === 'pending' && (
                            <Clock size={14} className="text-amber-500" />
                          )}
                          {vote.status === 'decided' && (
                            <CheckCircle size={14} className="text-accent" weight="fill" />
                          )}
                          {vote.status === 'override' && (
                            <Crown size={14} className="text-purple-500" weight="fill" />
                          )}
                          <span className="font-medium truncate">{vote.topic}</span>
                        </div>

                        {vote.status !== 'pending' && vote.decidedOption && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Decision: {vote.options.find(o => o.id === vote.decidedOption)?.label}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>
                            {vote.teacherVote ? '✓' : '○'} Teacher
                          </span>
                          <span>
                            {vote.studentVote ? '✓' : '○'} Student
                          </span>
                          <span>
                            {vote.parentVote ? '✓' : '○'} Parent
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(vote.decidedAt || vote.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
