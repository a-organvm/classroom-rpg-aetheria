/**
 * Feedback Snippets Hook
 *
 * Manages feedback snippet CRUD operations and search functionality.
 */

import { useMemo, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { v4 as uuid } from 'uuid'
import type { FeedbackSnippet, FeedbackCategory } from '@/lib/types'

interface UseFeedbackSnippetsReturn {
  snippets: FeedbackSnippet[]
  addSnippet: (content: string, category: FeedbackCategory, justification?: string) => FeedbackSnippet
  updateSnippet: (id: string, updates: Partial<Omit<FeedbackSnippet, 'id' | 'createdAt'>>) => void
  deleteSnippet: (id: string) => void
  incrementUsage: (id: string) => void
  getSnippetsByCategory: (category: FeedbackCategory) => FeedbackSnippet[]
  searchSnippets: (query: string) => FeedbackSnippet[]
  getMostUsed: (limit?: number) => FeedbackSnippet[]
  getRecent: (limit?: number) => FeedbackSnippet[]
}

export function useFeedbackSnippets(): UseFeedbackSnippetsReturn {
  const [snippets, setSnippets] = useKV<FeedbackSnippet[]>('aetheria-feedback-snippets', [])

  const currentSnippets = snippets || []

  const addSnippet = useCallback((
    content: string,
    category: FeedbackCategory,
    justification?: string
  ): FeedbackSnippet => {
    const newSnippet: FeedbackSnippet = {
      id: uuid(),
      content,
      category,
      justification,
      usageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setSnippets([...currentSnippets, newSnippet])
    return newSnippet
  }, [currentSnippets, setSnippets])

  const updateSnippet = useCallback((
    id: string,
    updates: Partial<Omit<FeedbackSnippet, 'id' | 'createdAt'>>
  ) => {
    setSnippets(
      currentSnippets.map(snippet =>
        snippet.id === id
          ? { ...snippet, ...updates, updatedAt: Date.now() }
          : snippet
      )
    )
  }, [currentSnippets, setSnippets])

  const deleteSnippet = useCallback((id: string) => {
    setSnippets(currentSnippets.filter(snippet => snippet.id !== id))
  }, [currentSnippets, setSnippets])

  const incrementUsage = useCallback((id: string) => {
    setSnippets(
      currentSnippets.map(snippet =>
        snippet.id === id
          ? { ...snippet, usageCount: snippet.usageCount + 1, updatedAt: Date.now() }
          : snippet
      )
    )
  }, [currentSnippets, setSnippets])

  const getSnippetsByCategory = useCallback((category: FeedbackCategory): FeedbackSnippet[] => {
    return currentSnippets.filter(snippet => snippet.category === category)
  }, [currentSnippets])

  const searchSnippets = useCallback((query: string): FeedbackSnippet[] => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return currentSnippets

    return currentSnippets.filter(snippet =>
      snippet.content.toLowerCase().includes(normalizedQuery) ||
      snippet.category.toLowerCase().includes(normalizedQuery)
    )
  }, [currentSnippets])

  const getMostUsed = useCallback((limit = 10): FeedbackSnippet[] => {
    return [...currentSnippets]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
  }, [currentSnippets])

  const getRecent = useCallback((limit = 10): FeedbackSnippet[] => {
    return [...currentSnippets]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  }, [currentSnippets])

  return {
    snippets: currentSnippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    incrementUsage,
    getSnippetsByCategory,
    searchSnippets,
    getMostUsed,
    getRecent
  }
}
