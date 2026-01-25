/**
 * File Upload Component
 *
 * Drag-and-drop file upload with progress indicator.
 */

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Progress } from './progress'
import { CloudArrowUp, File, X, CheckCircle, Warning } from '@phosphor-icons/react'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/firebase/storage'
import type { UploadProgress } from '@/lib/firebase/storage'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  progress?: UploadProgress | null
  uploadState?: 'idle' | 'validating' | 'uploading' | 'success' | 'error'
  error?: string | null
  className?: string
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif',
  maxSize = MAX_FILE_SIZE,
  disabled = false,
  progress,
  uploadState = 'idle',
  error,
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [disabled, onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const handleClear = useCallback(() => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isUploading = uploadState === 'uploading'
  const isSuccess = uploadState === 'success'
  const isError = uploadState === 'error'

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer',
          'hover:border-primary/50 hover:bg-muted/30',
          isDragging && 'border-primary bg-primary/10',
          disabled && 'opacity-50 cursor-not-allowed',
          isError && 'border-destructive',
          isSuccess && 'border-accent'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <CloudArrowUp
                size={40}
                className={cn(
                  'text-muted-foreground',
                  isDragging && 'text-primary'
                )}
                weight={isDragging ? 'fill' : 'regular'}
              />
              <div>
                <p className="font-medium">
                  {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Max size: {formatFileSize(maxSize)}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-muted">
                <File size={24} weight="fill" className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              {isSuccess && (
                <CheckCircle size={24} className="text-accent" weight="fill" />
              )}
              {isError && (
                <Warning size={24} className="text-destructive" weight="fill" />
              )}
              {!isUploading && !isSuccess && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                >
                  <X size={18} />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      {isUploading && progress && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-1"
        >
          <Progress value={progress.progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(progress.progress)}% • {formatFileSize(progress.bytesTransferred)} / {formatFileSize(progress.totalBytes)}
          </p>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      {/* Allowed types hint */}
      <p className="text-xs text-muted-foreground">
        Supported: PDF, Word, Text, Images
      </p>
    </div>
  )
}
