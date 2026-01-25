/**
 * Parent Notifications Component
 *
 * Notification center for parent alerts and updates.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import type { Notification } from '@/lib/types'
import {
  Bell,
  CheckCircle,
  Handshake,
  GraduationCap,
  Trophy,
  X,
  Check
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ParentNotificationsProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onDismiss: (id: string) => void
}

const NOTIFICATION_ICONS = {
  'vote-created': Handshake,
  'vote-reminder': Bell,
  'vote-decided': CheckCircle,
  'quest-assigned': GraduationCap,
  'quest-graded': CheckCircle,
  'achievement-earned': Trophy
}

const NOTIFICATION_COLORS = {
  'vote-created': 'text-amber-500',
  'vote-reminder': 'text-orange-500',
  'vote-decided': 'text-green-500',
  'quest-assigned': 'text-blue-500',
  'quest-graded': 'text-purple-500',
  'achievement-earned': 'text-yellow-500'
}

export function ParentNotifications({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss
}: ParentNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={onMarkAllRead}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[350px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notification, index) => {
                    const Icon = NOTIFICATION_ICONS[notification.type]
                    const iconColor = NOTIFICATION_COLORS[notification.type]

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          'p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors',
                          !notification.read && 'bg-primary/5'
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={cn('mt-0.5', iconColor)}>
                            <Icon size={18} weight={notification.read ? 'regular' : 'fill'} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className={cn(
                                  'text-sm',
                                  !notification.read && 'font-medium'
                                )}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => onMarkRead(notification.id)}
                                  >
                                    <Check size={12} />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground"
                                  onClick={() => onDismiss(notification.id)}
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-muted-foreground">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                              </span>
                              {!notification.read && (
                                <Badge variant="secondary" className="h-4 text-[10px] px-1">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
