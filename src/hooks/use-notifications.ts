/**
 * Notifications Hook
 *
 * Manages user notifications with persistence via sandbox KV storage.
 * Supports various notification types for quests, achievements, voting, and leveling.
 */

import { useCallback, useMemo } from 'react'
import { useSandboxKV } from '@/hooks/use-sandbox-kv'

export type NotificationType =
  | 'quest-graded'
  | 'achievement-earned'
  | 'vote-cast'
  | 'vote-decided'
  | 'level-up'
  | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  questId?: string
  achievementId?: string
}

type NewNotification = Omit<Notification, 'id' | 'timestamp' | 'read'>

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: NewNotification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAll: () => void
}

const STORAGE_KEY = 'aetheria-notifications'

/**
 * Hook for managing user notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useSandboxKV<Notification[]>(STORAGE_KEY, [])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const addNotification = useCallback(
    (newNotification: NewNotification) => {
      const notification: Notification = {
        ...newNotification,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        read: false
      }
      setNotifications([notification, ...notifications])
    },
    [notifications, setNotifications]
  )

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    },
    [notifications, setNotifications]
  )

  const markAllAsRead = useCallback(() => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }, [notifications, setNotifications])

  const dismissNotification = useCallback(
    (id: string) => {
      setNotifications(notifications.filter((n) => n.id !== id))
    },
    [notifications, setNotifications]
  )

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [setNotifications])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll
  }
}
