/**
 * Feedback Snippet Card
 *
 * Displays a single feedback snippet with actions.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, DotsThree, Pencil, Trash, Lightning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { FeedbackSnippet, FeedbackCategory } from '@/lib/types'
import { FEEDBACK_CATEGORIES } from '@/lib/types'

interface FeedbackSnippetCardProps {
  snippet: FeedbackSnippet
  onEdit?: (snippet: FeedbackSnippet) => void
  onDelete?: (id: string) => void
  onInsert?: (content: string) => void
  showActions?: boolean
  compact?: boolean
}

export function FeedbackSnippetCard({
  snippet,
  onEdit,
  onDelete,
  onInsert,
  showActions = true,
  compact = false
}: FeedbackSnippetCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const categoryLabel = FEEDBACK_CATEGORIES.find(
    c => c.value === snippet.category
  )?.label || snippet.category

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content)
    toast.success('Copied to clipboard')
  }

  const handleInsert = () => {
    onInsert?.(snippet.content)
  }

  const getCategoryColor = (category: FeedbackCategory): string => {
    const colors: Record<FeedbackCategory, string> = {
      grammar: 'bg-red-500/20 text-red-600',
      thesis: 'bg-purple-500/20 text-purple-600',
      evidence: 'bg-blue-500/20 text-blue-600',
      organization: 'bg-orange-500/20 text-orange-600',
      clarity: 'bg-cyan-500/20 text-cyan-600',
      citations: 'bg-amber-500/20 text-amber-600',
      analysis: 'bg-indigo-500/20 text-indigo-600',
      mechanics: 'bg-pink-500/20 text-pink-600',
      positive: 'bg-green-500/20 text-green-600',
      other: 'bg-gray-500/20 text-gray-600'
    }
    return colors[category] || colors.other
  }

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
        onClick={handleInsert}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm line-clamp-2">{snippet.content}</p>
          <Badge variant="outline" className={`text-xs flex-shrink-0 ${getCategoryColor(snippet.category)}`}>
            {categoryLabel}
          </Badge>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="glass-panel p-4 hover:scale-[1.01] transition-transform">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Badge className={`${getCategoryColor(snippet.category)}`}>
              {categoryLabel}
            </Badge>

            {showActions && (
              <div className="flex items-center gap-1">
                {onInsert && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleInsert}
                    className="h-8 gap-1"
                  >
                    <Lightning size={14} weight="fill" />
                    Insert
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <DotsThree size={18} weight="bold" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopy}>
                      <Copy size={16} className="mr-2" />
                      Copy
                    </DropdownMenuItem>
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(snippet)}>
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(snippet.id)}
                        className="text-destructive"
                      >
                        <Trash size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <p className="text-sm">{snippet.content}</p>

          {snippet.justification && (
            <p className="text-xs text-muted-foreground italic">
              AI: {snippet.justification}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Used {snippet.usageCount} times</span>
            <span>
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
