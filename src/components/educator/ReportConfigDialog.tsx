/**
 * Report Configuration Dialog
 *
 * Modal dialog for configuring report generation options including:
 * - Report type selection
 * - Date range picker
 * - Student selection
 * - Format selection
 * - Include/exclude options
 * - Template presets
 */

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  FileText,
  ChartBar,
  TrendUp,
  Sliders,
  CalendarBlank,
  Users,
  FileArrowDown,
  BookmarkSimple,
  FloppyDisk,
  Trash,
  Play
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useReportConfig, type ReportConfig } from '@/hooks/use-report-config'
import type { Theme, Submission } from '@/lib/types'
import { THEME_CONFIGS } from '@/lib/types'

interface ReportConfigDialogProps {
  open: boolean
  onClose: () => void
  onGenerate: (config: ReportConfig) => void
  submissions: Submission[]
  theme: Theme
}

type ReportType = ReportConfig['reportType']
type FormatType = ReportConfig['format']

const REPORT_TYPES: { value: ReportType; label: string; description: string; icon: typeof FileText }[] = [
  { value: 'transcript', label: 'Transcript', description: 'Traditional grade report', icon: FileText },
  { value: 'mastery', label: 'Mastery', description: 'Standards-based progress', icon: ChartBar },
  { value: 'progress', label: 'Progress', description: 'Activity and growth over time', icon: TrendUp },
  { value: 'custom', label: 'Custom', description: 'Configure all options', icon: Sliders }
]

const FORMAT_OPTIONS: { value: FormatType; label: string }[] = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'csv', label: 'CSV Spreadsheet' },
  { value: 'json', label: 'JSON Data' }
]

export function ReportConfigDialog({
  open,
  onClose,
  onGenerate,
  submissions,
  theme
}: ReportConfigDialogProps) {
  const themeConfig = THEME_CONFIGS[theme]
  const {
    config,
    updateConfig,
    resetConfig,
    loadPreset,
    saveAsPreset,
    deletePreset,
    presets,
    builtinPresets,
    customPresets
  } = useReportConfig()

  const [savePresetName, setSavePresetName] = useState('')
  const [showSavePreset, setShowSavePreset] = useState(false)

  // Get unique students from submissions
  const students = useMemo(() => {
    const studentMap = new Map<string, string>()
    submissions.forEach(s => {
      if (!studentMap.has(s.studentId)) {
        studentMap.set(s.studentId, `Student ${s.studentId.slice(0, 8)}`)
      }
    })
    return Array.from(studentMap.entries()).map(([id, name]) => ({ id, name }))
  }, [submissions])

  const handleStudentToggle = (studentId: string) => {
    if (config.studentIds === 'all') {
      // Switch from all to just this student
      updateConfig({ studentIds: [studentId] })
    } else {
      const currentIds = config.studentIds as string[]
      if (currentIds.includes(studentId)) {
        // Remove student
        const newIds = currentIds.filter(id => id !== studentId)
        updateConfig({ studentIds: newIds.length > 0 ? newIds : 'all' })
      } else {
        // Add student
        updateConfig({ studentIds: [...currentIds, studentId] })
      }
    }
  }

  const handleSelectAllStudents = () => {
    updateConfig({ studentIds: 'all' })
  }

  const handleSavePreset = () => {
    if (!savePresetName.trim()) {
      toast.error('Please enter a preset name')
      return
    }

    saveAsPreset(savePresetName.trim())
    setSavePresetName('')
    setShowSavePreset(false)
    toast.success('Preset saved successfully')
  }

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId)
    toast.success('Preset deleted')
  }

  const handleGenerate = () => {
    // Validate configuration
    if (config.studentIds !== 'all' && (config.studentIds as string[]).length === 0) {
      toast.error('Please select at least one student')
      return
    }

    onGenerate(config)
    onClose()
  }

  const isStudentSelected = (studentId: string): boolean => {
    if (config.studentIds === 'all') return true
    return (config.studentIds as string[]).includes(studentId)
  }

  const selectedStudentCount = config.studentIds === 'all'
    ? students.length
    : (config.studentIds as string[]).length

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileArrowDown size={24} className="text-primary" />
            Configure Report
          </DialogTitle>
          <DialogDescription>
            Set up report options before generating
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Template Presets */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <BookmarkSimple size={16} />
                Template Presets
              </Label>
              <div className="flex flex-wrap gap-2">
                {builtinPresets.map(preset => (
                  <Button
                    key={preset.id}
                    variant={config.templatePreset === preset.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => loadPreset(preset.id)}
                  >
                    {preset.name}
                  </Button>
                ))}
                {customPresets.map(preset => (
                  <div key={preset.id} className="flex items-center gap-1">
                    <Button
                      variant={config.templatePreset === preset.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => loadPreset(preset.id)}
                    >
                      {preset.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeletePreset(preset.id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Report Type Selection */}
            <div className="space-y-3">
              <Label>Report Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_TYPES.map(type => {
                  const Icon = type.icon
                  return (
                    <Card
                      key={type.value}
                      className={`p-3 cursor-pointer transition-all ${
                        config.reportType === type.value
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateConfig({ reportType: type.value })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{type.label}</h4>
                          <p className="text-xs text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Date Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CalendarBlank size={16} />
                Date Range
              </Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {config.dateRange.start
                          ? config.dateRange.start.toLocaleDateString()
                          : 'Select start...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={config.dateRange.start || undefined}
                        onSelect={(date) => updateConfig({
                          dateRange: { ...config.dateRange, start: date || null }
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {config.dateRange.end
                          ? config.dateRange.end.toLocaleDateString()
                          : 'Select end...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={config.dateRange.end || undefined}
                        onSelect={(date) => updateConfig({
                          dateRange: { ...config.dateRange, end: date || null }
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {(config.dateRange.start || config.dateRange.end) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateConfig({ dateRange: { start: null, end: null } })}
                  className="text-muted-foreground"
                >
                  Clear dates
                </Button>
              )}
            </div>

            <Separator />

            {/* Student Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users size={16} />
                  Students
                </Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedStudentCount} selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllStudents}
                    className="text-xs"
                  >
                    Select All
                  </Button>
                </div>
              </div>
              <Card className="p-3 max-h-40 overflow-auto">
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No students with submissions
                  </p>
                ) : (
                  <div className="space-y-2">
                    {students.map(student => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleStudentToggle(student.id)}
                      >
                        <Checkbox
                          checked={isStudentSelected(student.id)}
                          onCheckedChange={() => handleStudentToggle(student.id)}
                        />
                        <span className="text-sm">{student.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <Separator />

            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FileArrowDown size={16} />
                Output Format
              </Label>
              <Select
                value={config.format}
                onValueChange={(value: FormatType) => updateConfig({ format: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format..." />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Include/Exclude Options */}
            <div className="space-y-3">
              <Label>Include in Report</Label>
              <div className="space-y-3">
                <div
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => updateConfig({ includeGrades: !config.includeGrades })}
                >
                  <Checkbox
                    checked={config.includeGrades}
                    onCheckedChange={(checked) => updateConfig({ includeGrades: !!checked })}
                  />
                  <div>
                    <span className="text-sm font-medium">Grades & Scores</span>
                    <p className="text-xs text-muted-foreground">
                      Include numeric grades and percentage scores
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => updateConfig({ includeComments: !config.includeComments })}
                >
                  <Checkbox
                    checked={config.includeComments}
                    onCheckedChange={(checked) => updateConfig({ includeComments: !!checked })}
                  />
                  <div>
                    <span className="text-sm font-medium">Feedback Comments</span>
                    <p className="text-xs text-muted-foreground">
                      Include instructor feedback and notes
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => updateConfig({ includeStandards: !config.includeStandards })}
                >
                  <Checkbox
                    checked={config.includeStandards}
                    onCheckedChange={(checked) => updateConfig({ includeStandards: !!checked })}
                  />
                  <div>
                    <span className="text-sm font-medium">Learning Standards</span>
                    <p className="text-xs text-muted-foreground">
                      Include standards alignment and mastery levels
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Save as Preset */}
            <div className="space-y-3">
              {showSavePreset ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Preset name..."
                    value={savePresetName}
                    onChange={(e) => setSavePresetName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSavePreset}>
                    <FloppyDisk size={16} className="mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowSavePreset(false)
                      setSavePresetName('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavePreset(true)}
                  className="gap-2"
                >
                  <FloppyDisk size={16} />
                  Save as Preset
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" onClick={resetConfig} className="text-muted-foreground">
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} className="gap-2">
              <Play size={18} weight="fill" />
              Generate Report
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
