/**
 * Standards Alignment Component
 *
 * Map quests to learning standards.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { QuestStandardAlignment, CoverageLevel, LearningStandardRef } from '@/lib/types'
import { MagnifyingGlass, Link, LinkBreak, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface StandardsAlignmentProps {
  questId: string
  questName: string
  alignments: QuestStandardAlignment[]
  allStandards: LearningStandardRef[]
  onAddAlignment: (standardId: string, coverage: CoverageLevel) => void
  onRemoveAlignment: (standardId: string) => void
}

const COVERAGE_LABELS: Record<CoverageLevel, { label: string; color: string }> = {
  full: { label: 'Full Coverage', color: 'bg-green-500' },
  partial: { label: 'Partial', color: 'bg-amber-500' },
  introduced: { label: 'Introduced', color: 'bg-blue-500' }
}

export function StandardsAlignment({
  questId,
  questName,
  alignments,
  allStandards,
  onAddAlignment,
  onRemoveAlignment
}: StandardsAlignmentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [frameworkFilter, setFrameworkFilter] = useState<'all' | 'ccss' | 'ap-lit'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'reading' | 'writing' | 'speaking' | 'language'>('all')

  // Get aligned standard IDs
  const alignedIds = new Set(alignments.map(a => a.standardId))

  // Filter standards
  const filteredStandards = useMemo(() => {
    return allStandards.filter(standard => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !standard.code.toLowerCase().includes(query) &&
          !standard.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Framework filter
      if (frameworkFilter !== 'all' && standard.framework !== frameworkFilter) {
        return false
      }

      // Category filter
      if (categoryFilter !== 'all' && standard.category !== categoryFilter) {
        return false
      }

      return true
    })
  }, [allStandards, searchQuery, frameworkFilter, categoryFilter])

  const handleToggleAlignment = (standard: LearningStandardRef) => {
    if (alignedIds.has(standard.id)) {
      onRemoveAlignment(standard.id)
      toast.success(`Removed ${standard.code}`)
    } else {
      onAddAlignment(standard.id, 'partial')
      toast.success(`Aligned to ${standard.code}`)
    }
  }

  const handleChangeCoverage = (standardId: string, coverage: CoverageLevel) => {
    // Remove and re-add with new coverage
    onRemoveAlignment(standardId)
    onAddAlignment(standardId, coverage)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Standards Alignment</h3>
        <p className="text-sm text-muted-foreground">
          Map "{questName}" to learning standards
        </p>
      </div>

      {/* Current Alignments */}
      {alignments.length > 0 && (
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link size={16} />
              Aligned Standards ({alignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {alignments.map(alignment => {
                  const standard = allStandards.find(s => s.id === alignment.standardId)
                  if (!standard) return null

                  return (
                    <motion.div
                      key={alignment.standardId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle size={16} className="text-accent flex-shrink-0" weight="fill" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{standard.code}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {standard.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Select
                          value={alignment.coverage}
                          onValueChange={(v) => handleChangeCoverage(alignment.standardId, v as CoverageLevel)}
                        >
                          <SelectTrigger className="h-7 w-[100px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(COVERAGE_LABELS).map(([value, { label }]) => (
                              <SelectItem key={value} value={value} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onRemoveAlignment(alignment.standardId)}
                        >
                          <LinkBreak size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="glass-panel">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search standards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={frameworkFilter}
              onValueChange={(v) => setFrameworkFilter(v as typeof frameworkFilter)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="ccss">CCSS</SelectItem>
                <SelectItem value="ap-lit">AP Literature</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="speaking">Speaking</SelectItem>
                <SelectItem value="language">Language</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Standards List */}
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Available Standards ({filteredStandards.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredStandards.map(standard => {
                const isAligned = alignedIds.has(standard.id)
                const alignment = alignments.find(a => a.standardId === standard.id)

                return (
                  <motion.div
                    key={standard.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-colors
                      ${isAligned ? 'border-accent bg-accent/5' : 'hover:bg-muted/50'}
                    `}
                    onClick={() => handleToggleAlignment(standard)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isAligned}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{standard.code}</span>
                          <Badge variant="outline" className="text-xs">
                            {standard.framework.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {standard.category}
                          </Badge>
                          {alignment && (
                            <Badge
                              className={`text-xs text-white ${COVERAGE_LABELS[alignment.coverage].color}`}
                            >
                              {COVERAGE_LABELS[alignment.coverage].label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {standard.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {filteredStandards.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">No standards found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
