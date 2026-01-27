/**
 * Tests for Parent Linking Hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useParentLinking } from './use-parent-linking'

// Mock useSandboxKV
const mockSetValue = vi.fn()
let mockValue: unknown[] = []

vi.mock('./use-sandbox-kv', () => ({
  useSandboxKV: <T,>(_key: string, defaultValue: T) => {
    return [mockValue.length > 0 ? mockValue : defaultValue, mockSetValue]
  }
}))

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}))

describe('useParentLinking', () => {
  beforeEach(() => {
    mockValue = []
    mockSetValue.mockClear()
  })

  describe('initial state', () => {
    it('should return empty arrays when no requests exist', () => {
      const { result } = renderHook(() => useParentLinking('parent-01'))

      expect(result.current.linkRequests).toEqual([])
      expect(result.current.linkedStudents).toEqual([])
      expect(result.current.linkedParents).toEqual([])
    })
  })

  describe('requestLink', () => {
    it('should create a new pending link request', () => {
      const { result } = renderHook(() => useParentLinking('parent-01'))

      act(() => {
        result.current.requestLink('student-01', 'parent-01')
      })

      expect(mockSetValue).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'test-uuid-123',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'pending'
        })
      ])
    })

    it('should not create duplicate requests for pending links', () => {
      mockValue = [
        {
          id: 'existing-req',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'pending',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('parent-01'))

      act(() => {
        result.current.requestLink('student-01', 'parent-01')
      })

      expect(mockSetValue).not.toHaveBeenCalled()
    })

    it('should not create duplicate requests for approved links', () => {
      mockValue = [
        {
          id: 'existing-req',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('parent-01'))

      act(() => {
        result.current.requestLink('student-01', 'parent-01')
      })

      expect(mockSetValue).not.toHaveBeenCalled()
    })
  })

  describe('approveLink', () => {
    it('should update request status to approved', () => {
      const timestamp = Date.now()
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'pending',
          requestedAt: timestamp
        }
      ]

      const { result } = renderHook(() => useParentLinking('student-01'))

      act(() => {
        result.current.approveLink('req-01')
      })

      expect(mockSetValue).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'req-01',
          status: 'approved',
          resolvedAt: expect.any(Number)
        })
      ])
    })
  })

  describe('rejectLink', () => {
    it('should update request status to rejected', () => {
      const timestamp = Date.now()
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'pending',
          requestedAt: timestamp
        }
      ]

      const { result } = renderHook(() => useParentLinking('student-01'))

      act(() => {
        result.current.rejectLink('req-01')
      })

      expect(mockSetValue).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'req-01',
          status: 'rejected',
          resolvedAt: expect.any(Number)
        })
      ])
    })
  })

  describe('removeLink', () => {
    it('should remove the link request', () => {
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        },
        {
          id: 'req-02',
          parentId: 'parent-02',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('student-01'))

      act(() => {
        result.current.removeLink('parent-01', 'student-01')
      })

      expect(mockSetValue).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'req-02',
          parentId: 'parent-02'
        })
      ])
    })
  })

  describe('getPendingRequests', () => {
    it('should return pending requests for a user', () => {
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'pending',
          requestedAt: Date.now()
        },
        {
          id: 'req-02',
          parentId: 'parent-02',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('student-01'))

      const pending = result.current.getPendingRequests('student-01')

      expect(pending).toHaveLength(1)
      expect(pending[0].id).toBe('req-01')
    })
  })

  describe('linkedStudents', () => {
    it('should return approved student IDs for a parent', () => {
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        },
        {
          id: 'req-02',
          parentId: 'parent-01',
          studentId: 'student-02',
          status: 'pending',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('parent-01'))

      expect(result.current.linkedStudents).toEqual(['student-01'])
    })
  })

  describe('linkedParents', () => {
    it('should return approved parent IDs for a student', () => {
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        },
        {
          id: 'req-02',
          parentId: 'parent-02',
          studentId: 'student-01',
          status: 'rejected',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('student-01'))

      expect(result.current.linkedParents).toEqual(['parent-01'])
    })
  })

  describe('getLinkedStudentsForParent', () => {
    it('should return all linked students for a given parent', () => {
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        },
        {
          id: 'req-02',
          parentId: 'parent-01',
          studentId: 'student-02',
          status: 'approved',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('parent-01'))

      expect(result.current.getLinkedStudentsForParent('parent-01')).toEqual([
        'student-01',
        'student-02'
      ])
    })
  })

  describe('getLinkedParentsForStudent', () => {
    it('should return all linked parents for a given student', () => {
      mockValue = [
        {
          id: 'req-01',
          parentId: 'parent-01',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        },
        {
          id: 'req-02',
          parentId: 'parent-02',
          studentId: 'student-01',
          status: 'approved',
          requestedAt: Date.now()
        }
      ]

      const { result } = renderHook(() => useParentLinking('student-01'))

      expect(result.current.getLinkedParentsForStudent('student-01')).toEqual([
        'parent-01',
        'parent-02'
      ])
    })
  })
})
