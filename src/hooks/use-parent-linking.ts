/**
 * Parent Account Linking Hook
 *
 * Manages parent-student account linking with request/approval workflow.
 */

import { useCallback, useMemo } from 'react'
import { useSandboxKV } from './use-sandbox-kv'
import { v4 as uuid } from 'uuid'
import type { ParentStudentLink } from '@/lib/types'

interface UseParentLinkingReturn {
  linkRequests: ParentStudentLink[]
  linkedStudents: string[]
  linkedParents: string[]
  requestLink: (studentId: string, parentId: string) => void
  approveLink: (requestId: string) => void
  rejectLink: (requestId: string) => void
  removeLink: (parentId: string, studentId: string) => void
  getPendingRequests: (forUserId: string) => ParentStudentLink[]
  getLinkedStudentsForParent: (parentId: string) => string[]
  getLinkedParentsForStudent: (studentId: string) => string[]
}

export function useParentLinking(currentUserId?: string): UseParentLinkingReturn {
  const [linkRequests, setLinkRequests] = useSandboxKV<ParentStudentLink[]>(
    'aetheria-parent-link-requests',
    []
  )

  const currentRequests = linkRequests || []

  // Get all linked students for the current parent user
  const linkedStudents = useMemo(() => {
    if (!currentUserId) return []
    return currentRequests
      .filter(req => req.parentId === currentUserId && req.status === 'approved')
      .map(req => req.studentId)
  }, [currentRequests, currentUserId])

  // Get all linked parents for the current student user
  const linkedParents = useMemo(() => {
    if (!currentUserId) return []
    return currentRequests
      .filter(req => req.studentId === currentUserId && req.status === 'approved')
      .map(req => req.parentId)
  }, [currentRequests, currentUserId])

  // Request a new parent-student link
  const requestLink = useCallback((studentId: string, parentId: string) => {
    // Check if there's already a pending or approved request
    const existingRequest = currentRequests.find(
      req =>
        req.parentId === parentId &&
        req.studentId === studentId &&
        (req.status === 'pending' || req.status === 'approved')
    )

    if (existingRequest) {
      return // Already exists
    }

    const newRequest: ParentStudentLink = {
      id: uuid(),
      parentId,
      studentId,
      status: 'pending',
      requestedAt: Date.now()
    }

    setLinkRequests([...currentRequests, newRequest])
  }, [currentRequests, setLinkRequests])

  // Approve a link request
  const approveLink = useCallback((requestId: string) => {
    setLinkRequests(
      currentRequests.map(req => {
        if (req.id !== requestId) return req
        return {
          ...req,
          status: 'approved' as const,
          resolvedAt: Date.now()
        }
      })
    )
  }, [currentRequests, setLinkRequests])

  // Reject a link request
  const rejectLink = useCallback((requestId: string) => {
    setLinkRequests(
      currentRequests.map(req => {
        if (req.id !== requestId) return req
        return {
          ...req,
          status: 'rejected' as const,
          resolvedAt: Date.now()
        }
      })
    )
  }, [currentRequests, setLinkRequests])

  // Remove an existing link (either party can remove)
  const removeLink = useCallback((parentId: string, studentId: string) => {
    setLinkRequests(
      currentRequests.filter(
        req => !(req.parentId === parentId && req.studentId === studentId)
      )
    )
  }, [currentRequests, setLinkRequests])

  // Get pending requests for a specific user (works for both parents and students)
  const getPendingRequests = useCallback((forUserId: string): ParentStudentLink[] => {
    return currentRequests.filter(
      req =>
        req.status === 'pending' &&
        (req.parentId === forUserId || req.studentId === forUserId)
    )
  }, [currentRequests])

  // Get linked students for a specific parent
  const getLinkedStudentsForParent = useCallback((parentId: string): string[] => {
    return currentRequests
      .filter(req => req.parentId === parentId && req.status === 'approved')
      .map(req => req.studentId)
  }, [currentRequests])

  // Get linked parents for a specific student
  const getLinkedParentsForStudent = useCallback((studentId: string): string[] => {
    return currentRequests
      .filter(req => req.studentId === studentId && req.status === 'approved')
      .map(req => req.parentId)
  }, [currentRequests])

  return {
    linkRequests: currentRequests,
    linkedStudents,
    linkedParents,
    requestLink,
    approveLink,
    rejectLink,
    removeLink,
    getPendingRequests,
    getLinkedStudentsForParent,
    getLinkedParentsForStudent
  }
}
