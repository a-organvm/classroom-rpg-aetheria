/**
 * Standards Progress Component
 *
 * Visualize student progress across learning standards.
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { StandardMastery, MasteryLevel, LearningStandardRef } from '@/lib/types'
import { ChartBar, Target, TrendUp, CheckCircle, Clock, Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface StandardsProgressProps {
  studentName: string
  masteryRecords: StandardMastery[]
  standards: LearningStandardRef[]
}

const MASTERY_CONFIG: Record<MasteryLevel, {
  label: string
  color: string
  bgColor: string
  icon: typeof CheckCircle
}> = {
  'not-started': { label: 'Not Started', color: 'text-gray-400', bgColor: 'bg-gray-200', icon: Clock },
  'beginning': { label: 'Beginning', color: 'text-red-500', bgColor: 'bg-red-500', icon: Warning },
  'developing': { label: 'Developing', color: 'text-amber-500', bgColor: 'bg-amber-500', icon: TrendUp },
  'proficient': { label: 'Proficient', color: 'text-blue-500', bgColor: 'bg-blue-500', icon: Target },
  'mastered': { label: 'Mastered', color: 'text-green-500', bgColor: 'bg-green-500', icon: CheckCircle }
}

const MASTERY_VALUE: Record<MasteryLevel, number> = {
  'not-started': 0,
  'beginning': 25,
  'developing': 50,
  'proficient': 75,
  'mastered': 100
}

export function StandardsProgress({
  studentName,
  masteryRecords,
  standards
}: StandardsProgressProps) {
  // Calculate overall stats
  const stats = useMemo(() => {
    const byLevel: Record<MasteryLevel, number> = {
      'not-started': 0,
      'beginning': 0,
      'developing': 0,
      'proficient': 0,
      'mastered': 0
    }

    // Count assessed standards
    masteryRecords.forEach(record => {
      byLevel[record.level]++
    })

    // Count not-started (standards without records)
    const assessedIds = new Set(masteryRecords.map(r => r.standardId))
    standards.forEach(s => {
      if (!assessedIds.has(s.id)) {
        byLevel['not-started']++
      }
    })

    const total = standards.length
    const proficientOrAbove = byLevel['proficient'] + byLevel['mastered']
    const overallProgress = total > 0 ? Math.round((proficientOrAbove / total) * 100) : 0

    return { byLevel, total, proficientOrAbove, overallProgress }
  }, [masteryRecords, standards])

  // Group standards by category with mastery
  const groupedStandards = useMemo(() => {
    const groups: Record<string, { standard: LearningStandardRef; mastery?: StandardMastery }[]> = {
      reading: [],
      writing: [],
      speaking: [],
      language: []
    }

    standards.forEach(standard => {
      const mastery = masteryRecords.find(r => r.standardId === standard.id)
      groups[standard.category].push({ standard, mastery })
    })

    return groups
  }, [standards, masteryRecords])

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChartBar size={20} />
                Standards Progress
              </CardTitle>
              <CardDescription>{studentName}'s learning standards mastery</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {stats.overallProgress}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Proficient or Above</span>
              <span>{stats.proficientOrAbove} / {stats.total} standards</span>
            </div>
            <Progress value={stats.overallProgress} className="h-3" />
          </div>

          {/* Mastery Distribution */}
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(MASTERY_CONFIG) as MasteryLevel[]).map(level => {
              const config = MASTERY_CONFIG[level]
              const Icon = config.icon
              const count = stats.byLevel[level]
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0

              return (
                <div key={level} className="text-center">
                  <div className={cn('p-2 rounded-lg mb-1', `${config.bgColor}/20`)}>
                    <Icon size={20} className={cn('mx-auto', config.color)} weight="fill" />
                  </div>
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-[10px] text-muted-foreground">{config.label}</p>
                  <p className="text-[10px] text-muted-foreground">{percent}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Standards by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedStandards).map(([category, items]) => (
          <Card key={category} className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm capitalize">{category}</CardTitle>
              <CardDescription>
                {items.filter(i => i.mastery && ['proficient', 'mastered'].includes(i.mastery.level)).length} / {items.length} proficient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {items.map(({ standard, mastery }) => {
                    const level = mastery?.level || 'not-started'
                    const config = MASTERY_CONFIG[level]
                    const Icon = config.icon

                    return (
                      <motion.div
                        key={standard.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                      >
                        <Icon size={14} className={config.color} weight="fill" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{standard.code}</p>
                          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', config.bgColor)}
                              style={{ width: `${MASTERY_VALUE[level]}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant="outline" className={cn('text-[10px]', config.color)}>
                          {config.label}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
