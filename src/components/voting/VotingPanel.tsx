/**
 * Voting Panel Component
 *
 * Main interface for three-way voting between teacher, student, and parent.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { VoteCard } from './VoteCard'
import type { ThreeWayVote, VoteOption } from '@/lib/types'
import { CheckCircle, Clock, Users, Crown } from '@phosphor-icons/react'

interface VotingPanelProps {
  vote: ThreeWayVote
  voterId: 'teacher' | 'student' | 'parent'
  onVote: (optionId: string) => void
  onOverride?: (optionId: string) => void
  showResults?: boolean
}

export function VotingPanel({
  vote,
  voterId,
  onVote,
  onOverride,
  showResults = false
}: VotingPanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(() => {
    if (voterId === 'teacher') return !!vote.teacherVote
    if (voterId === 'student') return !!vote.studentVote
    if (voterId === 'parent') return !!vote.parentVote
    return false
  })

  const getCurrentVote = () => {
    if (voterId === 'teacher') return vote.teacherVote
    if (voterId === 'student') return vote.studentVote
    if (voterId === 'parent') return vote.parentVote
    return undefined
  }

  const getVoteCount = (optionId: string): number => {
    let count = 0
    if (vote.teacherVote === optionId) count++
    if (vote.studentVote === optionId) count++
    if (vote.parentVote === optionId) count++
    return count
  }

  const getTotalVotes = (): number => {
    let count = 0
    if (vote.teacherVote) count++
    if (vote.studentVote) count++
    if (vote.parentVote) count++
    return count
  }

  const handleSubmitVote = () => {
    if (selectedOption) {
      onVote(selectedOption)
      setHasVoted(true)
    }
  }

  const getStatusBadge = () => {
    switch (vote.status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock size={12} /> Voting Open</Badge>
      case 'decided':
        return <Badge variant="default" className="gap-1 bg-accent"><CheckCircle size={12} /> Decided</Badge>
      case 'override':
        return <Badge variant="secondary" className="gap-1"><Crown size={12} /> Teacher Override</Badge>
    }
  }

  const currentVote = getCurrentVote()
  const isDecided = vote.status === 'decided' || vote.status === 'override'

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{vote.topic}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Users size={14} />
              {getTotalVotes()}/3 votes cast
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Voting Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Voting Progress</span>
            <span>{Math.round((getTotalVotes() / 3) * 100)}%</span>
          </div>
          <Progress value={(getTotalVotes() / 3) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={vote.teacherVote ? 'text-accent' : ''}>
              Teacher {vote.teacherVote ? '✓' : '○'}
            </span>
            <span className={vote.studentVote ? 'text-accent' : ''}>
              Student {vote.studentVote ? '✓' : '○'}
            </span>
            <span className={vote.parentVote ? 'text-accent' : ''}>
              Parent {vote.parentVote ? '✓' : '○'}
            </span>
          </div>
        </div>

        {/* Vote Options */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {vote.options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VoteCard
                  option={option}
                  isSelected={selectedOption === option.id || currentVote === option.id}
                  isWinner={isDecided && vote.decidedOption === option.id}
                  voteCount={showResults || isDecided ? getVoteCount(option.id) : undefined}
                  disabled={hasVoted || isDecided}
                  onClick={() => !hasVoted && !isDecided && setSelectedOption(option.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Decided Result */}
        {isDecided && vote.decidedOption && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-accent/10 border border-accent/20"
          >
            <div className="flex items-center gap-2 text-accent font-medium">
              <CheckCircle size={20} weight="fill" />
              Decision: {vote.options.find(o => o.id === vote.decidedOption)?.label}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {vote.status === 'override'
                ? 'This decision was made by the teacher.'
                : 'This decision was made by majority vote.'}
            </p>
          </motion.div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!hasVoted && !isDecided && (
          <>
            <Button
              variant="outline"
              onClick={() => setSelectedOption(null)}
              disabled={!selectedOption}
            >
              Clear
            </Button>
            <Button
              onClick={handleSubmitVote}
              disabled={!selectedOption}
            >
              Submit Vote
            </Button>
          </>
        )}

        {hasVoted && !isDecided && (
          <p className="text-sm text-muted-foreground">
            Your vote has been recorded. Waiting for others...
          </p>
        )}

        {voterId === 'teacher' && !isDecided && onOverride && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => selectedOption && onOverride(selectedOption)}
            disabled={!selectedOption}
          >
            Override & Decide
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
