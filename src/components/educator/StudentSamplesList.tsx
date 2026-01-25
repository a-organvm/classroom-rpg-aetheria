/**
 * Student Samples List
 *
 * Displays and manages student work samples.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { v4 as uuid } from 'uuid'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, MagnifyingGlass, Upload, FolderOpen } from '@phosphor-icons/react'
import { StudentSampleCard } from './StudentSampleCard'
import { FileUpload } from '@/components/ui/file-upload'
import { useFileUpload } from '@/hooks/use-file-upload'
import { toast } from 'sonner'
import type { StudentSample, Quest, Realm, Theme } from '@/lib/types'

interface StudentSamplesListProps {
  quests: Quest[]
  realms: Realm[]
  theme?: Theme
}

export function StudentSamplesList({
  quests,
  realms,
  theme = 'fantasy'
}: StudentSamplesListProps) {
  const [samples, setSamples] = useKV<StudentSample[]>('aetheria-student-samples', [])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingSample, setEditingSample] = useState<StudentSample | null>(null)
  const [viewingSample, setViewingSample] = useState<StudentSample | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterQuestId, setFilterQuestId] = useState<string>('all')

  // Form state
  const [formStudentName, setFormStudentName] = useState('')
  const [formQuestId, setFormQuestId] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formFeedback, setFormFeedback] = useState('')
  const [formGrade, setFormGrade] = useState('')

  const { upload, progress, state: uploadState, error: uploadError, reset: resetUpload } = useFileUpload()

  const currentSamples = samples || []

  const filteredSamples = useMemo(() => {
    let result = currentSamples

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.studentName.toLowerCase().includes(query) ||
        s.content?.toLowerCase().includes(query) ||
        s.feedback?.toLowerCase().includes(query)
      )
    }

    // Filter by quest
    if (filterQuestId !== 'all') {
      result = result.filter(s => s.questId === filterQuestId)
    }

    // Sort by creation date (newest first)
    return result.sort((a, b) => b.createdAt - a.createdAt)
  }, [currentSamples, searchQuery, filterQuestId])

  const handleOpenAdd = () => {
    setFormStudentName('')
    setFormQuestId(quests[0]?.id || '')
    setFormContent('')
    setFormFeedback('')
    setFormGrade('')
    setEditingSample(null)
    resetUpload()
    setShowAddDialog(true)
  }

  const handleOpenEdit = (sample: StudentSample) => {
    setFormStudentName(sample.studentName)
    setFormQuestId(sample.questId)
    setFormContent(sample.content || '')
    setFormFeedback(sample.feedback || '')
    setFormGrade(sample.grade || '')
    setEditingSample(sample)
    resetUpload()
    setShowAddDialog(true)
  }

  const handleSave = () => {
    if (!formStudentName.trim()) {
      toast.error('Please enter a student name')
      return
    }

    if (!formQuestId) {
      toast.error('Please select a quest')
      return
    }

    const quest = quests.find(q => q.id === formQuestId)

    if (editingSample) {
      const updated = currentSamples.map(s =>
        s.id === editingSample.id
          ? {
              ...s,
              studentName: formStudentName.trim(),
              questId: formQuestId,
              realmId: quest?.realmId || s.realmId,
              content: formContent.trim() || undefined,
              feedback: formFeedback.trim() || undefined,
              grade: formGrade.trim() || undefined,
              updatedAt: Date.now()
            }
          : s
      )
      setSamples(updated)
      toast.success('Sample updated')
    } else {
      const newSample: StudentSample = {
        id: uuid(),
        studentName: formStudentName.trim(),
        questId: formQuestId,
        realmId: quest?.realmId || '',
        content: formContent.trim() || undefined,
        feedback: formFeedback.trim() || undefined,
        grade: formGrade.trim() || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      setSamples([...currentSamples, newSample])
      toast.success('Sample added')
    }

    setShowAddDialog(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this sample?')) {
      setSamples(currentSamples.filter(s => s.id !== id))
      toast.success('Sample deleted')
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!formQuestId) {
      toast.error('Please select a quest first')
      return
    }

    const result = await upload(file, 'samples', formQuestId)
    if (result) {
      toast.success('File uploaded successfully')
    }
  }

  const getQuestById = (questId: string): Quest | undefined => {
    return quests.find(q => q.id === questId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Samples</h2>
          <p className="text-muted-foreground">
            Collect and annotate student work samples
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus size={18} weight="bold" />
          Add Sample
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
              placeholder="Search samples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterQuestId}
            onValueChange={setFilterQuestId}
          >
            <SelectTrigger className="w-[200px]">
              <FolderOpen size={16} className="mr-2" />
              <SelectValue placeholder="Filter by quest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quests</SelectItem>
              {quests.map((quest) => (
                <SelectItem key={quest.id} value={quest.id}>
                  {quest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Samples Grid */}
      {filteredSamples.length === 0 ? (
        <Card className="glass-panel p-12 text-center">
          <p className="text-muted-foreground mb-4">No samples found</p>
          <Button variant="outline" onClick={handleOpenAdd} className="gap-2">
            <Plus size={18} />
            Add your first sample
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredSamples.map((sample) => (
              <StudentSampleCard
                key={sample.id}
                sample={sample}
                quest={getQuestById(sample.questId)}
                theme={theme}
                onView={setViewingSample}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="glass-panel max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSample ? 'Edit Sample' : 'Add Student Sample'}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input
                    id="student-name"
                    placeholder="Student A"
                    value={formStudentName}
                    onChange={(e) => setFormStudentName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use pseudonyms for privacy
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quest-select">Quest</Label>
                  <Select value={formQuestId} onValueChange={setFormQuestId}>
                    <SelectTrigger id="quest-select">
                      <SelectValue placeholder="Select quest" />
                    </SelectTrigger>
                    <SelectContent>
                      {quests.map((quest) => (
                        <SelectItem key={quest.id} value={quest.id}>
                          {quest.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-content">Sample Content</Label>
                <Textarea
                  id="sample-content"
                  placeholder="Paste or type the student's work..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Or Upload File</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  progress={progress}
                  uploadState={uploadState}
                  error={uploadError?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-grade">Grade (Optional)</Label>
                <Input
                  id="sample-grade"
                  placeholder="A, B+, 85%, etc."
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-feedback">Feedback (Optional)</Label>
                <Textarea
                  id="sample-feedback"
                  placeholder="Add feedback or annotations..."
                  value={formFeedback}
                  onChange={(e) => setFormFeedback(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSample ? 'Save Changes' : 'Add Sample'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingSample} onOpenChange={() => setViewingSample(null)}>
        <DialogContent className="glass-panel max-w-2xl">
          {viewingSample && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingSample.studentName}</DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 py-4 pr-4">
                  {viewingSample.content && (
                    <div>
                      <Label className="text-muted-foreground">Student Work</Label>
                      <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                        {viewingSample.content}
                      </div>
                    </div>
                  )}

                  {viewingSample.fileUrl && (
                    <div>
                      <Label className="text-muted-foreground">Attached File</Label>
                      <div className="mt-2">
                        <Button variant="outline" asChild>
                          <a
                            href={viewingSample.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download {viewingSample.fileName || 'File'}
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  {viewingSample.grade && (
                    <div>
                      <Label className="text-muted-foreground">Grade</Label>
                      <p className="mt-1 text-lg font-bold">{viewingSample.grade}</p>
                    </div>
                  )}

                  {viewingSample.feedback && (
                    <div>
                      <Label className="text-muted-foreground">Feedback</Label>
                      <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                        {viewingSample.feedback}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleOpenEdit(viewingSample)}
                >
                  Edit Sample
                </Button>
                <Button onClick={() => setViewingSample(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
