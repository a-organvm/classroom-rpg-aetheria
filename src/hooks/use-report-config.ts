/**
 * Report Configuration Hook
 *
 * Manages report configuration state with persistence via useSandboxKV.
 * Supports template presets and configuration saving/loading.
 */

import { useMemo, useCallback } from 'react'
import { useSandboxKV } from './use-sandbox-kv'
import { v4 as uuid } from 'uuid'

export interface ReportConfig {
  reportType: 'transcript' | 'mastery' | 'progress' | 'custom'
  dateRange: { start: Date | null; end: Date | null }
  studentIds: string[] | 'all'
  format: 'pdf' | 'csv' | 'json'
  includeGrades: boolean
  includeComments: boolean
  includeStandards: boolean
  templatePreset?: string
}

interface ReportConfigPreset {
  id: string
  name: string
  config: Omit<ReportConfig, 'dateRange' | 'studentIds'> & {
    dateRange: { start: number | null; end: number | null }
    studentIds: string[] | 'all'
  }
  createdAt: number
}

interface StoredReportConfig {
  reportType: ReportConfig['reportType']
  dateRange: { start: number | null; end: number | null }
  studentIds: string[] | 'all'
  format: ReportConfig['format']
  includeGrades: boolean
  includeComments: boolean
  includeStandards: boolean
  templatePreset?: string
}

const DEFAULT_CONFIG: ReportConfig = {
  reportType: 'transcript',
  dateRange: { start: null, end: null },
  studentIds: 'all',
  format: 'pdf',
  includeGrades: true,
  includeComments: true,
  includeStandards: false,
  templatePreset: undefined
}

const DEFAULT_STORED_CONFIG: StoredReportConfig = {
  reportType: 'transcript',
  dateRange: { start: null, end: null },
  studentIds: 'all',
  format: 'pdf',
  includeGrades: true,
  includeComments: true,
  includeStandards: false,
  templatePreset: undefined
}

// Built-in template presets
const BUILTIN_PRESETS: ReportConfigPreset[] = [
  {
    id: 'weekly-summary',
    name: 'Weekly Summary',
    config: {
      reportType: 'progress',
      dateRange: { start: null, end: null }, // Will be calculated dynamically
      studentIds: 'all',
      format: 'pdf',
      includeGrades: true,
      includeComments: true,
      includeStandards: false
    },
    createdAt: 0
  },
  {
    id: 'end-of-term',
    name: 'End of Term',
    config: {
      reportType: 'transcript',
      dateRange: { start: null, end: null },
      studentIds: 'all',
      format: 'pdf',
      includeGrades: true,
      includeComments: true,
      includeStandards: true
    },
    createdAt: 0
  },
  {
    id: 'standards-report',
    name: 'Standards Progress',
    config: {
      reportType: 'mastery',
      dateRange: { start: null, end: null },
      studentIds: 'all',
      format: 'pdf',
      includeGrades: false,
      includeComments: false,
      includeStandards: true
    },
    createdAt: 0
  },
  {
    id: 'grade-export',
    name: 'Grade Export (CSV)',
    config: {
      reportType: 'transcript',
      dateRange: { start: null, end: null },
      studentIds: 'all',
      format: 'csv',
      includeGrades: true,
      includeComments: false,
      includeStandards: false
    },
    createdAt: 0
  }
]

interface UseReportConfigReturn {
  config: ReportConfig
  updateConfig: (partial: Partial<ReportConfig>) => void
  resetConfig: () => void
  loadPreset: (presetName: string) => void
  saveAsPreset: (name: string) => void
  deletePreset: (presetId: string) => void
  presets: ReportConfigPreset[]
  builtinPresets: ReportConfigPreset[]
  customPresets: ReportConfigPreset[]
}

// Helper to convert stored config (with timestamps) to ReportConfig (with Dates)
function storedToConfig(stored: StoredReportConfig): ReportConfig {
  return {
    ...stored,
    dateRange: {
      start: stored.dateRange.start ? new Date(stored.dateRange.start) : null,
      end: stored.dateRange.end ? new Date(stored.dateRange.end) : null
    }
  }
}

// Helper to convert ReportConfig to stored format
function configToStored(config: ReportConfig): StoredReportConfig {
  return {
    ...config,
    dateRange: {
      start: config.dateRange.start ? config.dateRange.start.getTime() : null,
      end: config.dateRange.end ? config.dateRange.end.getTime() : null
    }
  }
}

export function useReportConfig(): UseReportConfigReturn {
  const [storedConfig, setStoredConfig] = useSandboxKV<StoredReportConfig>(
    'aetheria-report-config',
    DEFAULT_STORED_CONFIG
  )
  const [customPresets, setCustomPresets] = useSandboxKV<ReportConfigPreset[]>(
    'aetheria-report-presets',
    []
  )

  // Convert stored config to ReportConfig with Date objects
  const config = useMemo(() => storedToConfig(storedConfig), [storedConfig])

  // Combine builtin and custom presets
  const presets = useMemo(() => {
    return [...BUILTIN_PRESETS, ...(customPresets || [])]
  }, [customPresets])

  const updateConfig = useCallback((partial: Partial<ReportConfig>) => {
    const newConfig = { ...config, ...partial }
    setStoredConfig(configToStored(newConfig))
  }, [config, setStoredConfig])

  const resetConfig = useCallback(() => {
    setStoredConfig(DEFAULT_STORED_CONFIG)
  }, [setStoredConfig])

  const loadPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (!preset) return

    // For weekly summary, calculate last 7 days
    let dateRange = preset.config.dateRange
    if (presetId === 'weekly-summary') {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateRange = { start: weekAgo.getTime(), end: now.getTime() }
    }

    setStoredConfig({
      ...preset.config,
      dateRange,
      templatePreset: presetId
    })
  }, [presets, setStoredConfig])

  const saveAsPreset = useCallback((name: string) => {
    const newPreset: ReportConfigPreset = {
      id: uuid(),
      name,
      config: configToStored(config),
      createdAt: Date.now()
    }

    setCustomPresets([...(customPresets || []), newPreset])
  }, [config, customPresets, setCustomPresets])

  const deletePreset = useCallback((presetId: string) => {
    // Only allow deleting custom presets
    if (BUILTIN_PRESETS.some(p => p.id === presetId)) return

    setCustomPresets((customPresets || []).filter(p => p.id !== presetId))
  }, [customPresets, setCustomPresets])

  return {
    config,
    updateConfig,
    resetConfig,
    loadPreset,
    saveAsPreset,
    deletePreset,
    presets,
    builtinPresets: BUILTIN_PRESETS,
    customPresets: customPresets || []
  }
}
