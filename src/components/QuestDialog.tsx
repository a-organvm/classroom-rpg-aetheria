import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Quest, Theme, THEME_CONFIGS } from '@/lib/types'
import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { LoadingOracle } from '@/components/LoadingOracle'
import { toast } from 'sonner'
import { QUEST_CONTENT_MAX_LENGTH } from '@/lib/constants'
import { getSubmissionErrorMessage } from '@/lib/error-messages'

interface QuestDialogProps {
  quest: Quest | null
  theme: Theme
  open: boolean
  onClose: () => void
  onSubmit: (questId: string, content: string) => Promise<void>
}

export function QuestDialog({ quest, theme, open, onClose, onSubmit }: QuestDialogProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!quest) return null

  const themeConfig = THEME_CONFIGS[theme]

  const handleSubmit = async () => {
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      toast.error('Please enter your submission')
      return
    }

    if (trimmedContent.length > QUEST_CONTENT_MAX_LENGTH) {
      toast.error(`Submission must be no more than ${QUEST_CONTENT_MAX_LENGTH} characters`)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(quest.id, trimmedContent)
      setContent('')
      toast.success('Submission sent to the ' + themeConfig.oracleLabel)
    } catch (error) {
      const errorDetails = getSubmissionErrorMessage(error)
      toast.error(errorDetails.title, {
        description: errorDetails.description
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isContentTooLong = content.length > QUEST_CONTENT_MAX_LENGTH

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
        <DialogHeader>
          <div className="flex items-center gap-2 md:gap-3">
            <Sparkle size={24} weight="fill" className="md:w-8 md:h-8 text-accent flex-shrink-0" />
            <div className="min-w-0">
              <DialogTitle className="text-lg md:text-2xl truncate">{quest.name}</DialogTitle>
              <DialogDescription className="text-sm md:text-base mt-1">
                {quest.type === 'boss' ? 'Boss Battle' : quest.type === 'redemption' ? 'Redemption Quest' : 'Standard Quest'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6 mt-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-xs md:text-sm uppercase tracking-wide text-muted-foreground">Quest Briefing</h4>
            <div className="glass-panel p-3 md:p-4 bg-muted/20">
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{quest.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <Badge variant="secondary" className="text-xs md:text-sm px-3 md:px-4 py-1">
              Reward: {quest.xpValue} {themeConfig.xpLabel}
            </Badge>
            {quest.dueDate && (
              <span className="text-xs md:text-sm text-muted-foreground">
                Due: {new Date(quest.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-xs md:text-sm uppercase tracking-wide text-muted-foreground">Your Response</h4>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your submission here..."
              className="min-h-[150px] md:min-h-[200px] resize-none glass-panel text-sm md:text-base"
              disabled={isSubmitting}
            />
            <p className={`text-xs ${isContentTooLong ? 'text-destructive' : 'text-muted-foreground'}`}>
              {content.length} / {QUEST_CONTENT_MAX_LENGTH} characters
              {isContentTooLong && ' (exceeds limit)'}
            </p>
          </div>

          {isSubmitting && (
            <LoadingOracle theme={theme} />
          )}

          <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              size="lg"
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim() || isContentTooLong}
              className="flex-1 gap-2"
              size="lg"
            >
              <PaperPlaneRight size={20} weight="fill" />
              <span className="hidden md:inline">Submit to {themeConfig.oracleLabel}</span>
              <span className="md:hidden">Submit</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
