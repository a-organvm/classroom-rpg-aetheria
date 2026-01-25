/**
 * Student Sample Card
 *
 * Displays a single student work sample with feedback.
 */

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
import {
  User,
  File,
  DotsThree,
  Eye,
  Pencil,
  Trash,
  Download
} from '@phosphor-icons/react'
import type { StudentSample, Quest, Theme } from '@/lib/types'

interface StudentSampleCardProps {
  sample: StudentSample
  quest?: Quest | null
  theme?: Theme
  onView?: (sample: StudentSample) => void
  onEdit?: (sample: StudentSample) => void
  onDelete?: (id: string) => void
}

export function StudentSampleCard({
  sample,
  quest,
  theme = 'fantasy',
  onView,
  onEdit,
  onDelete
}: StudentSampleCardProps) {
  const hasFile = !!sample.fileUrl
  const hasContent = !!sample.content

  const getGradeColor = (grade: string | undefined): string => {
    if (!grade) return 'bg-muted text-muted-foreground'
    const upper = grade.toUpperCase()
    if (upper.startsWith('A')) return 'bg-green-500/20 text-green-600'
    if (upper.startsWith('B')) return 'bg-blue-500/20 text-blue-600'
    if (upper.startsWith('C')) return 'bg-yellow-500/20 text-yellow-600'
    if (upper.startsWith('D')) return 'bg-orange-500/20 text-orange-600'
    return 'bg-red-500/20 text-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="glass-panel p-4 hover:shadow-lg transition-all">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{sample.studentName}</p>
                {quest && (
                  <p className="text-sm text-muted-foreground">{quest.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sample.grade && (
                <Badge className={getGradeColor(sample.grade)}>
                  {sample.grade}
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <DotsThree size={18} weight="bold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(sample)}>
                      <Eye size={16} className="mr-2" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {hasFile && (
                    <DropdownMenuItem asChild>
                      <a
                        href={sample.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Download File
                      </a>
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(sample)}>
                      <Pencil size={16} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(sample.id)}
                      className="text-destructive"
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content preview */}
          {hasContent && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {sample.content}
            </p>
          )}

          {/* File indicator */}
          {hasFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <File size={16} />
              <span>{sample.fileName || 'Attached file'}</span>
            </div>
          )}

          {/* Feedback preview */}
          {sample.feedback && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Feedback:
              </p>
              <p className="text-sm line-clamp-2">{sample.feedback}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>
              Added {new Date(sample.createdAt).toLocaleDateString()}
            </span>
            {sample.snippetIds && sample.snippetIds.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {sample.snippetIds.length} snippets used
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
