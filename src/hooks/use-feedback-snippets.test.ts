/**
 * Tests for Feedback Snippets Hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFeedbackSnippets } from './use-feedback-snippets'
import type { FeedbackSnippet } from '@/lib/types'

// Mock useKV from Spark
vi.mock('@github/spark/hooks', () => ({
  useKV: vi.fn()
}))

import { useKV } from '@github/spark/hooks'

const mockUseKV = useKV as ReturnType<typeof vi.fn>

describe('useFeedbackSnippets', () => {
  let mockSnippets: FeedbackSnippet[]
  let mockSetSnippets: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSnippets = []
    mockSetSnippets = vi.fn((updater) => {
      if (typeof updater === 'function') {
        mockSnippets = updater(mockSnippets)
      } else {
        mockSnippets = updater
      }
    })
    mockUseKV.mockReturnValue([mockSnippets, mockSetSnippets])
  })

  describe('addSnippet', () => {
    it('should add a new snippet with generated id', () => {
      const { result } = renderHook(() => useFeedbackSnippets())

      act(() => {
        result.current.addSnippet('Great thesis statement!', 'thesis')
      })

      expect(mockSetSnippets).toHaveBeenCalled()
      const callArg = mockSetSnippets.mock.calls[0][0]
      expect(callArg).toHaveLength(1)
      expect(callArg[0].content).toBe('Great thesis statement!')
      expect(callArg[0].category).toBe('thesis')
      expect(callArg[0].usageCount).toBe(0)
      expect(callArg[0].id).toBeDefined()
    })

    it('should add snippet with justification', () => {
      const { result } = renderHook(() => useFeedbackSnippets())

      act(() => {
        result.current.addSnippet(
          'Consider using more evidence',
          'evidence',
          'AI: This comment addresses lack of supporting details'
        )
      })

      const callArg = mockSetSnippets.mock.calls[0][0]
      expect(callArg[0].justification).toBe('AI: This comment addresses lack of supporting details')
    })

    it('should return the created snippet', () => {
      const { result } = renderHook(() => useFeedbackSnippets())

      let newSnippet: FeedbackSnippet | undefined
      act(() => {
        newSnippet = result.current.addSnippet('Test content', 'grammar')
      })

      expect(newSnippet).toBeDefined()
      expect(newSnippet?.content).toBe('Test content')
    })
  })

  describe('updateSnippet', () => {
    it('should update an existing snippet', () => {
      const existingSnippet: FeedbackSnippet = {
        id: 'snippet-1',
        content: 'Original content',
        category: 'grammar',
        usageCount: 5,
        createdAt: 1000,
        updatedAt: 1000
      }
      mockSnippets = [existingSnippet]
      mockUseKV.mockReturnValue([mockSnippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())

      act(() => {
        result.current.updateSnippet('snippet-1', {
          content: 'Updated content',
          category: 'thesis'
        })
      })

      expect(mockSetSnippets).toHaveBeenCalled()
    })

    it('should preserve fields not being updated', () => {
      const existingSnippet: FeedbackSnippet = {
        id: 'snippet-1',
        content: 'Original',
        category: 'grammar',
        usageCount: 10,
        createdAt: 1000,
        updatedAt: 1000
      }
      mockSnippets = [existingSnippet]
      mockUseKV.mockReturnValue([mockSnippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())

      act(() => {
        result.current.updateSnippet('snippet-1', { content: 'New content' })
      })

      const updater = mockSetSnippets.mock.calls[0][0]
      const updated = typeof updater === 'function' ? updater([existingSnippet]) : updater
      expect(updated[0].usageCount).toBe(10)
      expect(updated[0].category).toBe('grammar')
    })
  })

  describe('deleteSnippet', () => {
    it('should remove a snippet by id', () => {
      const snippets: FeedbackSnippet[] = [
        { id: 'keep-me', content: 'Keep', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: 'delete-me', content: 'Delete', category: 'thesis', usageCount: 0, createdAt: 1000, updatedAt: 1000 }
      ]
      mockSnippets = snippets
      mockUseKV.mockReturnValue([mockSnippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())

      act(() => {
        result.current.deleteSnippet('delete-me')
      })

      const updater = mockSetSnippets.mock.calls[0][0]
      expect(updater).toHaveLength(1)
      expect(updater[0].id).toBe('keep-me')
    })
  })

  describe('incrementUsage', () => {
    it('should increment usage count for a snippet', () => {
      const snippet: FeedbackSnippet = {
        id: 'snippet-1',
        content: 'Test',
        category: 'grammar',
        usageCount: 5,
        createdAt: 1000,
        updatedAt: 1000
      }
      mockSnippets = [snippet]
      mockUseKV.mockReturnValue([mockSnippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())

      act(() => {
        result.current.incrementUsage('snippet-1')
      })

      const updater = mockSetSnippets.mock.calls[0][0]
      const updated = typeof updater === 'function' ? updater([snippet]) : updater
      expect(updated[0].usageCount).toBe(6)
    })
  })

  describe('getSnippetsByCategory', () => {
    it('should filter snippets by category', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'Grammar 1', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: '2', content: 'Thesis 1', category: 'thesis', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: '3', content: 'Grammar 2', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const grammarSnippets = result.current.getSnippetsByCategory('grammar')

      expect(grammarSnippets).toHaveLength(2)
      expect(grammarSnippets.every(s => s.category === 'grammar')).toBe(true)
    })

    it('should return empty array for category with no snippets', () => {
      mockUseKV.mockReturnValue([[], mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const snippets = result.current.getSnippetsByCategory('citations')

      expect(snippets).toHaveLength(0)
    })
  })

  describe('searchSnippets', () => {
    it('should search snippets by content', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'Great thesis statement', category: 'thesis', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: '2', content: 'Check your grammar', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: '3', content: 'Your thesis needs work', category: 'thesis', usageCount: 0, createdAt: 1000, updatedAt: 1000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const found = result.current.searchSnippets('thesis')

      expect(found).toHaveLength(2)
    })

    it('should search case-insensitively', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'UPPERCASE content', category: 'other', usageCount: 0, createdAt: 1000, updatedAt: 1000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const found = result.current.searchSnippets('uppercase')

      expect(found).toHaveLength(1)
    })

    it('should return all snippets for empty query', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'A', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: '2', content: 'B', category: 'thesis', usageCount: 0, createdAt: 1000, updatedAt: 1000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const found = result.current.searchSnippets('')

      expect(found).toHaveLength(2)
    })

    it('should search by category name', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'Some feedback', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const found = result.current.searchSnippets('grammar')

      expect(found).toHaveLength(1)
    })
  })

  describe('getMostUsed', () => {
    it('should return snippets sorted by usage count', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'Low usage', category: 'grammar', usageCount: 2, createdAt: 1000, updatedAt: 1000 },
        { id: '2', content: 'High usage', category: 'thesis', usageCount: 100, createdAt: 1000, updatedAt: 1000 },
        { id: '3', content: 'Medium usage', category: 'evidence', usageCount: 50, createdAt: 1000, updatedAt: 1000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const mostUsed = result.current.getMostUsed()

      expect(mostUsed[0].id).toBe('2')
      expect(mostUsed[1].id).toBe('3')
      expect(mostUsed[2].id).toBe('1')
    })

    it('should respect the limit parameter', () => {
      const snippets: FeedbackSnippet[] = Array.from({ length: 20 }, (_, i) => ({
        id: `snippet-${i}`,
        content: `Content ${i}`,
        category: 'grammar' as const,
        usageCount: i,
        createdAt: 1000,
        updatedAt: 1000
      }))
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const mostUsed = result.current.getMostUsed(5)

      expect(mostUsed).toHaveLength(5)
    })
  })

  describe('getRecent', () => {
    it('should return snippets sorted by creation date', () => {
      const snippets: FeedbackSnippet[] = [
        { id: '1', content: 'Old', category: 'grammar', usageCount: 0, createdAt: 1000, updatedAt: 1000 },
        { id: '2', content: 'New', category: 'thesis', usageCount: 0, createdAt: 3000, updatedAt: 3000 },
        { id: '3', content: 'Middle', category: 'evidence', usageCount: 0, createdAt: 2000, updatedAt: 2000 }
      ]
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const recent = result.current.getRecent()

      expect(recent[0].id).toBe('2')
      expect(recent[1].id).toBe('3')
      expect(recent[2].id).toBe('1')
    })

    it('should respect the limit parameter', () => {
      const snippets: FeedbackSnippet[] = Array.from({ length: 20 }, (_, i) => ({
        id: `snippet-${i}`,
        content: `Content ${i}`,
        category: 'grammar' as const,
        usageCount: 0,
        createdAt: i * 1000,
        updatedAt: i * 1000
      }))
      mockUseKV.mockReturnValue([snippets, mockSetSnippets])

      const { result } = renderHook(() => useFeedbackSnippets())
      const recent = result.current.getRecent(3)

      expect(recent).toHaveLength(3)
    })
  })
})
