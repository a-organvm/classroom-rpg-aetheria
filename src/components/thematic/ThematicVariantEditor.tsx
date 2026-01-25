/**
 * Thematic Variant Editor Component
 *
 * Create and edit thematic variants for quests.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import type { ThematicVariant, ThematicInterest } from '@/lib/types'
import { THEMATIC_INTERESTS } from '@/lib/types'
import { Plus, Pencil, Trash, Sparkle, FloppyDisk } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ThematicVariantEditorProps {
  questId: string
  questName: string
  variants: ThematicVariant[]
  onAddVariant: (variant: Omit<ThematicVariant, 'id'>) => void
  onUpdateVariant: (variantId: string, updates: Partial<ThematicVariant>) => void
  onDeleteVariant: (variantId: string) => void
  onGenerateWithAI?: (interest: ThematicInterest) => Promise<Partial<ThematicVariant>>
}

const INTEREST_EMOJIS: Record<ThematicInterest, string> = {
  sports: '⚽',
  science: '🔬',
  arts: '🎨',
  technology: '💻',
  nature: '🌿',
  'social-justice': '✊',
  business: '📊',
  general: '📚'
}

export function ThematicVariantEditor({
  questId,
  questName,
  variants,
  onAddVariant,
  onUpdateVariant,
  onDeleteVariant,
  onGenerateWithAI
}: ThematicVariantEditorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ThematicVariant | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Form state for new/editing variant
  const [formState, setFormState] = useState<Partial<ThematicVariant>>({
    interestArea: 'general',
    title: '',
    description: '',
    content: '',
    resources: []
  })

  const resetForm = () => {
    setFormState({
      interestArea: 'general',
      title: '',
      description: '',
      content: '',
      resources: []
    })
  }

  const handleOpenAdd = () => {
    resetForm()
    setEditingVariant(null)
    setIsAddDialogOpen(true)
  }

  const handleOpenEdit = (variant: ThematicVariant) => {
    setFormState({ ...variant })
    setEditingVariant(variant)
    setIsAddDialogOpen(true)
  }

  const handleSave = () => {
    if (!formState.interestArea || !formState.title || !formState.content) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingVariant) {
      onUpdateVariant(editingVariant.id, formState)
      toast.success('Variant updated')
    } else {
      onAddVariant({
        interestArea: formState.interestArea as ThematicInterest,
        title: formState.title,
        description: formState.description || '',
        content: formState.content,
        resources: formState.resources || []
      })
      toast.success('Variant created')
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleGenerateAI = async () => {
    if (!onGenerateWithAI || !formState.interestArea) return

    setIsGenerating(true)
    try {
      const generated = await onGenerateWithAI(formState.interestArea as ThematicInterest)
      setFormState(prev => ({
        ...prev,
        ...generated
      }))
      toast.success('AI content generated')
    } catch (error) {
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = (variantId: string) => {
    if (confirm('Delete this variant?')) {
      onDeleteVariant(variantId)
      toast.success('Variant deleted')
    }
  }

  // Get available interests (those without variants yet)
  const usedInterests = new Set(variants.map(v => v.interestArea))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Thematic Variants</h3>
          <p className="text-sm text-muted-foreground">
            Create different versions of "{questName}" for different interests
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-1">
          <Plus size={16} />
          Add Variant
        </Button>
      </div>

      {/* Existing Variants */}
      <div className="grid gap-3">
        <AnimatePresence>
          {variants.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No variants yet. Add one to personalize this quest.</p>
            </Card>
          ) : (
            variants.map((variant, index) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-panel">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {INTEREST_EMOJIS[variant.interestArea]}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{variant.title}</h4>
                            <Badge variant="outline">
                              {variant.interestArea.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {variant.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(variant)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(variant.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Coverage indicator */}
      <Card className="glass-panel">
        <CardContent className="pt-4">
          <Label className="text-sm text-muted-foreground">Theme Coverage</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {THEMATIC_INTERESTS.map(interest => (
              <Badge
                key={interest.value}
                variant={usedInterests.has(interest.value) ? 'default' : 'outline'}
                className="gap-1"
              >
                {INTEREST_EMOJIS[interest.value]}
                {interest.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? 'Edit Variant' : 'Add Thematic Variant'}
            </DialogTitle>
            <DialogDescription>
              Create content tailored to a specific interest area
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Interest Area */}
            <div className="space-y-2">
              <Label>Interest Area *</Label>
              <Select
                value={formState.interestArea}
                onValueChange={(v) => setFormState(prev => ({ ...prev, interestArea: v as ThematicInterest }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interest..." />
                </SelectTrigger>
                <SelectContent>
                  {THEMATIC_INTERESTS.map(interest => (
                    <SelectItem
                      key={interest.value}
                      value={interest.value}
                      disabled={!editingVariant && usedInterests.has(interest.value)}
                    >
                      <span className="flex items-center gap-2">
                        {INTEREST_EMOJIS[interest.value]}
                        {interest.label}
                        {usedInterests.has(interest.value) && !editingVariant && (
                          <Badge variant="outline" className="ml-2 text-xs">exists</Badge>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formState.title || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Variant title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formState.description || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this variant..."
                rows={2}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Content *</Label>
                {onGenerateWithAI && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !formState.interestArea}
                    className="gap-1"
                  >
                    <Sparkle size={14} className={isGenerating ? 'animate-pulse' : ''} />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                )}
              </div>
              <Textarea
                value={formState.content || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, content: e.target.value }))}
                placeholder="The themed content for this quest variant..."
                rows={8}
              />
            </div>

            {/* Resources */}
            <div className="space-y-2">
              <Label>Resources (one per line)</Label>
              <Textarea
                value={(formState.resources || []).join('\n')}
                onChange={(e) => setFormState(prev => ({
                  ...prev,
                  resources: e.target.value.split('\n').filter(r => r.trim())
                }))}
                placeholder="https://example.com/resource1&#10;https://example.com/resource2"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-1">
              <FloppyDisk size={16} />
              {editingVariant ? 'Update' : 'Create'} Variant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
