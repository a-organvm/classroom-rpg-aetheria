/**
 * Feedback Insights
 *
 * Displays analytics and AI-generated insights about feedback patterns.
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ChartBar,
  TrendUp,
  TrendDown,
  Lightbulb,
  Tag,
  Fire,
  Clock
} from '@phosphor-icons/react'
import { useFeedbackSnippets } from '@/hooks/use-feedback-snippets'
import type { FeedbackCategory, Theme } from '@/lib/types'
import { FEEDBACK_CATEGORIES } from '@/lib/types'

interface FeedbackInsightsProps {
  theme?: Theme
}

interface CategoryStats {
  category: FeedbackCategory
  label: string
  count: number
  totalUsage: number
  percentage: number
}

export function FeedbackInsights({ theme = 'fantasy' }: FeedbackInsightsProps) {
  const { snippets, getMostUsed, getRecent } = useFeedbackSnippets()

  const stats = useMemo(() => {
    const totalSnippets = snippets.length
    const totalUsage = snippets.reduce((sum, s) => sum + s.usageCount, 0)

    // Calculate category stats
    const categoryMap = new Map<FeedbackCategory, { count: number; usage: number }>()
    FEEDBACK_CATEGORIES.forEach(cat => {
      categoryMap.set(cat.value, { count: 0, usage: 0 })
    })

    snippets.forEach(snippet => {
      const current = categoryMap.get(snippet.category)!
      categoryMap.set(snippet.category, {
        count: current.count + 1,
        usage: current.usage + snippet.usageCount
      })
    })

    const categoryStats: CategoryStats[] = FEEDBACK_CATEGORIES.map(cat => ({
      category: cat.value,
      label: cat.label,
      count: categoryMap.get(cat.value)?.count || 0,
      totalUsage: categoryMap.get(cat.value)?.usage || 0,
      percentage: totalSnippets > 0
        ? ((categoryMap.get(cat.value)?.count || 0) / totalSnippets) * 100
        : 0
    })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)

    // Average usage per snippet
    const avgUsage = totalSnippets > 0 ? totalUsage / totalSnippets : 0

    // Most used snippets
    const topUsed = getMostUsed(5)

    // Recently added
    const recentlyAdded = getRecent(5)

    return {
      totalSnippets,
      totalUsage,
      avgUsage,
      categoryStats,
      topUsed,
      recentlyAdded
    }
  }, [snippets, getMostUsed, getRecent])

  const getCategoryColor = (category: FeedbackCategory): string => {
    const colors: Record<FeedbackCategory, string> = {
      grammar: 'bg-red-500',
      thesis: 'bg-purple-500',
      evidence: 'bg-blue-500',
      organization: 'bg-orange-500',
      clarity: 'bg-cyan-500',
      citations: 'bg-amber-500',
      analysis: 'bg-indigo-500',
      mechanics: 'bg-pink-500',
      positive: 'bg-green-500',
      other: 'bg-gray-500'
    }
    return colors[category] || colors.other
  }

  if (snippets.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Feedback Insights</h2>
          <p className="text-muted-foreground">
            Analytics and patterns from your feedback library
          </p>
        </div>

        <Card className="glass-panel p-12 text-center">
          <ChartBar size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Add some feedback snippets to see insights
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Feedback Insights</h2>
        <p className="text-muted-foreground">
          Analytics and patterns from your feedback library
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Tag size={24} className="text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Snippets</p>
                <p className="text-3xl font-bold">{stats.totalSnippets}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Fire size={24} className="text-accent" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Uses</p>
                <p className="text-3xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendUp size={24} className="text-blue-500" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Usage</p>
                <p className="text-3xl font-bold">{stats.avgUsage.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="space-y-4">
            {stats.categoryStats.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(cat.category)}`} />
                    <span className="font-medium">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{cat.count} snippets</span>
                    <span>{cat.totalUsage} uses</span>
                  </div>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top Snippets */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Fire size={20} className="text-orange-500" weight="fill" />
              <h3 className="text-lg font-semibold">Most Used</h3>
            </div>
            <div className="space-y-3">
              {stats.topUsed.map((snippet, index) => (
                <div
                  key={snippet.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{snippet.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {snippet.usageCount} uses
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-blue-500" weight="fill" />
              <h3 className="text-lg font-semibold">Recently Added</h3>
            </div>
            <div className="space-y-3">
              {stats.recentlyAdded.map((snippet) => (
                <div
                  key={snippet.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{snippet.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-panel p-6 border-dashed border-2">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Lightbulb size={24} className="text-yellow-500" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Insights</h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered analysis of your feedback patterns will appear here.
                This feature uses your feedback library to suggest improvements
                and identify common student challenges.
              </p>
              <Badge variant="outline" className="mt-3">Coming Soon</Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
