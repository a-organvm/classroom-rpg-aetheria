/**
 * Feedback Snippets Manager
 *
 * CRUD interface for managing reusable feedback snippets.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, MagnifyingGlass, Sparkle, Tag, Clock, Fire } from '@phosphor-icons/react'
import { useFeedbackSnippets } from '@/hooks/use-feedback-snippets'
import { FeedbackSnippetCard } from './FeedbackSnippetCard'
import { toast } from 'sonner'
import type { FeedbackSnippet, FeedbackCategory, Theme } from '@/lib/types'
import { FEEDBACK_CATEGORIES } from '@/lib/types'

interface FeedbackSnippetsManagerProps {
  theme?: Theme
  onInsertSnippet?: (content: string) => void
}

export function FeedbackSnippetsManager({
  theme = 'fantasy',
  onInsertSnippet
}: FeedbackSnippetsManagerProps) {
  const {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    incrementUsage,
    getSnippetsByCategory,
    searchSnippets,
    getMostUsed,
    getRecent
  } = useFeedbackSnippets()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<FeedbackSnippet | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | 'all'>('all')
  const [activeTab, setActiveTab] = useState('all')

  // Form state
  const [formContent, setFormContent] = useState('')
  const [formCategory, setFormCategory] = useState<FeedbackCategory>('other')

  const filteredSnippets = useMemo(() => {
    let result = snippets

    // Filter by search query
    if (searchQuery) {
      result = searchSnippets(searchQuery)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory)
    }

    return result
  }, [snippets, searchQuery, selectedCategory, searchSnippets])

  const handleOpenAdd = () => {
    setFormContent('')
    setFormCategory('other')
    setEditingSnippet(null)
    setShowAddDialog(true)
  }

  const handleOpenEdit = (snippet: FeedbackSnippet) => {
    setFormContent(snippet.content)
    setFormCategory(snippet.category)
    setEditingSnippet(snippet)
    setShowAddDialog(true)
  }

  const handleSave = () => {
    if (!formContent.trim()) {
      toast.error('Please enter snippet content')
      return
    }

    if (editingSnippet) {
      updateSnippet(editingSnippet.id, {
        content: formContent.trim(),
        category: formCategory
      })
      toast.success('Snippet updated')
    } else {
      addSnippet(formContent.trim(), formCategory)
      toast.success('Snippet created')
    }

    setShowAddDialog(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet(id)
      toast.success('Snippet deleted')
    }
  }

  const handleInsert = (content: string) => {
    const snippet = snippets.find(s => s.content === content)
    if (snippet) {
      incrementUsage(snippet.id)
    }
    onInsertSnippet?.(content)
    toast.success('Snippet inserted')
  }

  const renderSnippetList = (items: FeedbackSnippet[]) => {
    if (items.length === 0) {
      return (
        <Card className="glass-panel p-8 text-center">
          <p className="text-muted-foreground">No snippets found</p>
          <Button
            variant="outline"
            className="mt-4 gap-2"
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            Create your first snippet
          </Button>
        </Card>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((snippet) => (
            <FeedbackSnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onInsert={onInsertSnippet ? handleInsert : undefined}
            />
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feedback Library</h2>
          <p className="text-muted-foreground">
            Create and manage reusable feedback snippets
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus size={18} weight="bold" />
          New Snippet
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="glass-panel p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as FeedbackCategory | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <Tag size={16} className="mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {FEEDBACK_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-panel">
          <TabsTrigger value="all" className="gap-2">
            <Sparkle size={16} weight="fill" />
            All ({snippets.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className="gap-2">
            <Fire size={16} weight="fill" />
            Most Used
          </TabsTrigger>
          <TabsTrigger value="recent" className="gap-2">
            <Clock size={16} weight="fill" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderSnippetList(filteredSnippets)}
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          {renderSnippetList(getMostUsed(10))}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          {renderSnippetList(getRecent(10))}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>
              {editingSnippet ? 'Edit Snippet' : 'New Feedback Snippet'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="snippet-content">Content</Label>
              <Textarea
                id="snippet-content"
                placeholder="Enter your feedback snippet..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet-category">Category</Label>
              <Select
                value={formCategory}
                onValueChange={(value) => setFormCategory(value as FeedbackCategory)}
              >
                <SelectTrigger id="snippet-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSnippet ? 'Save Changes' : 'Create Snippet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
