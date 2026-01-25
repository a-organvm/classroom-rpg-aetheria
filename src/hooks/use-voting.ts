/**
 * Voting System Hook
 *
 * Manages three-way voting between teacher, student, and parent.
 */

import { useMemo, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { v4 as uuid } from 'uuid'
import type { ThreeWayVote, VoteOption, VoteStatus } from '@/lib/types'

interface UseVotingReturn {
  votes: ThreeWayVote[]
  createVote: (
    questId: string,
    studentId: string,
    topic: string,
    options: Omit<VoteOption, 'id'>[]
  ) => ThreeWayVote
  castVote: (voteId: string, voterId: 'teacher' | 'student' | 'parent', optionId: string) => void
  getVotesByStudent: (studentId: string) => ThreeWayVote[]
  getVotesByQuest: (questId: string) => ThreeWayVote[]
  getPendingVotes: (voterId: 'teacher' | 'student' | 'parent', userId: string) => ThreeWayVote[]
  resolveVote: (voteId: string) => void
  overrideVote: (voteId: string, optionId: string) => void
  deleteVote: (voteId: string) => void
}

/**
 * Determine the winning option based on votes
 */
function determineWinner(vote: ThreeWayVote): string | null {
  const { teacherVote, studentVote, parentVote, options } = vote

  // Count votes for each option
  const voteCounts: Record<string, number> = {}
  options.forEach(opt => {
    voteCounts[opt.id] = 0
  })

  if (teacherVote) voteCounts[teacherVote]++
  if (studentVote) voteCounts[studentVote]++
  if (parentVote) voteCounts[parentVote]++

  // Find the option with the most votes
  let maxVotes = 0
  let winner: string | null = null
  let tieOptions: string[] = []

  Object.entries(voteCounts).forEach(([optionId, count]) => {
    if (count > maxVotes) {
      maxVotes = count
      winner = optionId
      tieOptions = [optionId]
    } else if (count === maxVotes && count > 0) {
      tieOptions.push(optionId)
    }
  })

  // If there's a tie, teacher's vote wins
  if (tieOptions.length > 1 && teacherVote && tieOptions.includes(teacherVote)) {
    return teacherVote
  }

  // Need at least 2 votes to decide
  const totalVotes = (teacherVote ? 1 : 0) + (studentVote ? 1 : 0) + (parentVote ? 1 : 0)
  if (totalVotes < 2) return null

  return winner
}

export function useVoting(): UseVotingReturn {
  const [votes, setVotes] = useKV<ThreeWayVote[]>('aetheria-votes', [])

  const currentVotes = votes || []

  const createVote = useCallback((
    questId: string,
    studentId: string,
    topic: string,
    options: Omit<VoteOption, 'id'>[]
  ): ThreeWayVote => {
    const newVote: ThreeWayVote = {
      id: uuid(),
      questId,
      studentId,
      topic,
      options: options.map(opt => ({ ...opt, id: uuid() })),
      status: 'pending',
      createdAt: Date.now()
    }

    setVotes([...currentVotes, newVote])
    return newVote
  }, [currentVotes, setVotes])

  const castVote = useCallback((
    voteId: string,
    voterId: 'teacher' | 'student' | 'parent',
    optionId: string
  ) => {
    setVotes(
      currentVotes.map(vote => {
        if (vote.id !== voteId || vote.status !== 'pending') return vote

        const updated = { ...vote }
        if (voterId === 'teacher') updated.teacherVote = optionId
        else if (voterId === 'student') updated.studentVote = optionId
        else if (voterId === 'parent') updated.parentVote = optionId

        // Check if we can resolve the vote
        const winner = determineWinner(updated)
        if (winner) {
          updated.status = 'decided'
          updated.decidedOption = winner
          updated.decidedAt = Date.now()
        }

        return updated
      })
    )
  }, [currentVotes, setVotes])

  const getVotesByStudent = useCallback((studentId: string): ThreeWayVote[] => {
    return currentVotes.filter(v => v.studentId === studentId)
  }, [currentVotes])

  const getVotesByQuest = useCallback((questId: string): ThreeWayVote[] => {
    return currentVotes.filter(v => v.questId === questId)
  }, [currentVotes])

  const getPendingVotes = useCallback((
    voterId: 'teacher' | 'student' | 'parent',
    userId: string
  ): ThreeWayVote[] => {
    return currentVotes.filter(vote => {
      if (vote.status !== 'pending') return false

      // For students, filter by student ID
      if (voterId === 'student') {
        return vote.studentId === userId && !vote.studentVote
      }

      // For teachers, show all pending votes where they haven't voted
      if (voterId === 'teacher') {
        return !vote.teacherVote
      }

      // For parents, would need parent-student linking (simplified here)
      if (voterId === 'parent') {
        return !vote.parentVote
      }

      return false
    })
  }, [currentVotes])

  const resolveVote = useCallback((voteId: string) => {
    setVotes(
      currentVotes.map(vote => {
        if (vote.id !== voteId) return vote

        const winner = determineWinner(vote)
        if (winner) {
          return {
            ...vote,
            status: 'decided' as VoteStatus,
            decidedOption: winner,
            decidedAt: Date.now()
          }
        }
        return vote
      })
    )
  }, [currentVotes, setVotes])

  const overrideVote = useCallback((voteId: string, optionId: string) => {
    setVotes(
      currentVotes.map(vote => {
        if (vote.id !== voteId) return vote
        return {
          ...vote,
          status: 'override' as VoteStatus,
          decidedOption: optionId,
          decidedAt: Date.now()
        }
      })
    )
  }, [currentVotes, setVotes])

  const deleteVote = useCallback((voteId: string) => {
    setVotes(currentVotes.filter(v => v.id !== voteId))
  }, [currentVotes, setVotes])

  return {
    votes: currentVotes,
    createVote,
    castVote,
    getVotesByStudent,
    getVotesByQuest,
    getPendingVotes,
    resolveVote,
    overrideVote,
    deleteVote
  }
}
