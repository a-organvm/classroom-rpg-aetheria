/**
 * Parent Portal Component
 *
 * Simplified dashboard for parent access to student progress and voting.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VotingPanel } from '@/components/voting/VotingPanel'
import { VotingHistory } from '@/components/voting/VotingHistory'
import type { UserProfile, ThreeWayVote, Submission } from '@/lib/types'
import {
  GraduationCap,
  ChartLine,
  Handshake,
  Bell,
  Trophy,
  BookOpen
} from '@phosphor-icons/react'

interface ParentPortalProps {
  student: UserProfile
  pendingVotes: ThreeWayVote[]
  voteHistory: ThreeWayVote[]
  recentSubmissions: Submission[]
  onCastVote: (voteId: string, optionId: string) => void
}

export function ParentPortal({
  student,
  pendingVotes,
  voteHistory,
  recentSubmissions,
  onCastVote
}: ParentPortalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedVote, setSelectedVote] = useState<ThreeWayVote | null>(null)

  // Calculate progress stats
  const averageScore = recentSubmissions.length > 0
    ? Math.round(
        recentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSubmissions.length
      )
    : 0

  const completedCount = recentSubmissions.filter(s => s.score !== undefined).length
  const pendingCount = recentSubmissions.filter(s => s.score === undefined).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap size={28} />
            Parent Portal
          </h1>
          <p className="text-muted-foreground">
            Viewing progress for {student.name}
          </p>
        </div>
        {pendingVotes.length > 0 && (
          <Badge variant="destructive" className="gap-1">
            <Bell size={14} />
            {pendingVotes.length} vote{pendingVotes.length > 1 ? 's' : ''} needed
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/20">
                <Trophy size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{student.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <ChartLine size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-xs text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <BookOpen size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/20">
                <Handshake size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingVotes.length}</p>
                <p className="text-xs text-muted-foreground">Pending Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voting" className="relative">
            Voting
            {pendingVotes.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground">
                {pendingVotes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {pendingVotes.length > 0 && (
            <Card className="glass-panel border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell size={18} className="text-amber-500" />
                  Action Needed
                </CardTitle>
                <CardDescription>
                  You have {pendingVotes.length} vote{pendingVotes.length > 1 ? 's' : ''} waiting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab('voting')}>
                  Go to Voting
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {recentSubmissions.slice(0, 10).map((submission, i) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">Quest Submission</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {submission.score !== undefined ? (
                        <Badge
                          variant={
                            submission.score >= 90 ? 'default' :
                            submission.score >= 70 ? 'secondary' : 'outline'
                          }
                        >
                          {submission.score}%
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting Tab */}
        <TabsContent value="voting" className="space-y-4">
          {selectedVote ? (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedVote(null)}
              >
                ← Back to list
              </Button>
              <VotingPanel
                vote={selectedVote}
                voterId="parent"
                onVote={(optionId) => onCastVote(selectedVote.id, optionId)}
              />
            </div>
          ) : (
            <>
              {pendingVotes.length > 0 && (
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-base">Pending Votes</CardTitle>
                    <CardDescription>
                      Your input helps personalize {student.name}'s learning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingVotes.map(vote => (
                        <Card
                          key={vote.id}
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedVote(vote)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{vote.topic}</p>
                              <p className="text-sm text-muted-foreground">
                                {vote.options.length} options
                              </p>
                            </div>
                            <Button size="sm">Vote</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <VotingHistory
                votes={voteHistory}
                onSelectVote={setSelectedVote}
              />
            </>
          )}
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base">XP Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Level {student.level}</span>
                <span className="text-muted-foreground">{student.xp} XP</span>
              </div>
              <Progress value={65} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Keep up the great work! {student.name} is making excellent progress.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base">Artifacts Earned</CardTitle>
            </CardHeader>
            <CardContent>
              {student.artifacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No artifacts earned yet. Artifacts are rewards for high achievement!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {student.artifacts.map(artifact => (
                    <div
                      key={artifact.id}
                      className="p-3 rounded-lg bg-muted/50 text-center"
                    >
                      <Trophy
                        size={24}
                        className={
                          artifact.rarity === 'legendary' ? 'text-amber-500' :
                          artifact.rarity === 'epic' ? 'text-purple-500' :
                          artifact.rarity === 'rare' ? 'text-blue-500' :
                          'text-gray-500'
                        }
                      />
                      <p className="text-sm font-medium mt-1">{artifact.name}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {artifact.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
