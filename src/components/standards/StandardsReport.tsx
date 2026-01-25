/**
 * Standards Report Component
 *
 * Generate detailed standards-based progress reports.
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { StandardMastery, MasteryLevel, LearningStandardRef, StandardFramework } from '@/lib/types'
import { Printer, FileCsv, FileJs, Download, ChartPie } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface StandardsReportProps {
  studentName: string
  studentId: string
  masteryRecords: StandardMastery[]
  standards: LearningStandardRef[]
  framework?: StandardFramework
  onExport?: (format: 'csv' | 'json') => void
  onPrint?: () => void
}

const MASTERY_COLORS: Record<MasteryLevel, string> = {
  'not-started': 'bg-gray-200 text-gray-600',
  'beginning': 'bg-red-100 text-red-700',
  'developing': 'bg-amber-100 text-amber-700',
  'proficient': 'bg-blue-100 text-blue-700',
  'mastered': 'bg-green-100 text-green-700'
}

const MASTERY_LABELS: Record<MasteryLevel, string> = {
  'not-started': 'Not Started',
  'beginning': 'Beginning',
  'developing': 'Developing',
  'proficient': 'Proficient',
  'mastered': 'Mastered'
}

export function StandardsReport({
  studentName,
  studentId,
  masteryRecords,
  standards,
  framework,
  onExport,
  onPrint
}: StandardsReportProps) {
  const [showDetails, setShowDetails] = useState(true)

  // Filter standards by framework if specified
  const relevantStandards = useMemo(() => {
    if (!framework) return standards
    return standards.filter(s => s.framework === framework)
  }, [standards, framework])

  // Calculate stats
  const stats = useMemo(() => {
    const byLevel: Record<MasteryLevel, number> = {
      'not-started': 0,
      'beginning': 0,
      'developing': 0,
      'proficient': 0,
      'mastered': 0
    }

    const byCategory: Record<string, { total: number; proficient: number }> = {}

    relevantStandards.forEach(standard => {
      const mastery = masteryRecords.find(r => r.standardId === standard.id)
      const level = mastery?.level || 'not-started'
      byLevel[level]++

      if (!byCategory[standard.category]) {
        byCategory[standard.category] = { total: 0, proficient: 0 }
      }
      byCategory[standard.category].total++
      if (level === 'proficient' || level === 'mastered') {
        byCategory[standard.category].proficient++
      }
    })

    const total = relevantStandards.length
    const proficient = byLevel['proficient'] + byLevel['mastered']
    const overallPercent = total > 0 ? Math.round((proficient / total) * 100) : 0

    return { byLevel, byCategory, total, proficient, overallPercent }
  }, [relevantStandards, masteryRecords])

  // Get detailed records with standard info
  const detailedRecords = useMemo(() => {
    return relevantStandards.map(standard => {
      const mastery = masteryRecords.find(r => r.standardId === standard.id)
      return {
        standard,
        level: mastery?.level || 'not-started' as MasteryLevel,
        lastAssessed: mastery?.lastAssessed,
        evidence: mastery?.evidence || []
      }
    }).sort((a, b) => {
      // Sort by category, then by code
      if (a.standard.category !== b.standard.category) {
        return a.standard.category.localeCompare(b.standard.category)
      }
      return a.standard.code.localeCompare(b.standard.code)
    })
  }, [relevantStandards, masteryRecords])

  return (
    <Card className="glass-panel" id="standards-report">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartPie size={20} />
              Standards-Based Report
            </CardTitle>
            <CardDescription>
              {studentName} | Generated {format(new Date(), 'MMMM d, yyyy')}
            </CardDescription>
          </div>
          {framework && (
            <Badge variant="outline" className="text-sm">
              {framework.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Overall Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{stats.overallPercent}%</p>
              <p className="text-xs text-muted-foreground">Proficiency Rate</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold">{stats.proficient}</p>
              <p className="text-xs text-muted-foreground">Standards Mastered</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold">{stats.byLevel['developing']}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Standards</p>
            </Card>
          </div>
        </div>

        <Separator />

        {/* By Category */}
        <div className="space-y-4">
          <h3 className="font-semibold">Progress by Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).map(([category, data]) => {
              const percent = data.total > 0 ? Math.round((data.proficient / data.total) * 100) : 0
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{category}</span>
                    <span className="text-muted-foreground">
                      {data.proficient}/{data.total} ({percent}%)
                    </span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Mastery Distribution */}
        <div className="space-y-4">
          <h3 className="font-semibold">Mastery Distribution</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MASTERY_LABELS) as MasteryLevel[]).map(level => (
              <Badge
                key={level}
                className={cn('text-sm px-3 py-1', MASTERY_COLORS[level])}
              >
                {MASTERY_LABELS[level]}: {stats.byLevel[level]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        {showDetails && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Detailed Standards</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  Hide Details
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Standard</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Assessed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedRecords.map(({ standard, level, lastAssessed }) => (
                      <TableRow key={standard.id}>
                        <TableCell className="font-medium">{standard.code}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {standard.description}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs', MASTERY_COLORS[level])}>
                            {MASTERY_LABELS[level]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {lastAssessed
                            ? format(lastAssessed, 'MM/dd/yy')
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}

        {!showDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(true)}
          >
            Show Detailed Standards
          </Button>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Report ID: {studentId.slice(0, 8)}-{Date.now().toString(36)}
        </p>
        <div className="flex gap-2">
          {onExport && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
                className="gap-1"
              >
                <FileCsv size={14} />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('json')}
                className="gap-1"
              >
                <FileJs size={14} />
                JSON
              </Button>
            </>
          )}
          {onPrint && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="gap-1"
            >
              <Printer size={14} />
              Print
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
