/**
 * Parent Linking Modal Component
 *
 * Modal for parents to request links to student accounts and manage existing links.
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { UserProfile, ParentStudentLink } from '@/lib/types'
import {
  Link,
  PaperPlaneTilt,
  Trash,
  Clock,
  Check,
  X,
  Users
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ParentLinkingModalProps {
  open: boolean
  onClose: () => void
  parentId: string
  linkedStudents: UserProfile[]
  pendingRequests: ParentStudentLink[]
  allStudents: UserProfile[]
  onRequestLink: (studentId: string) => void
  onRemoveLink: (studentId: string) => void
}

export function ParentLinkingModal({
  open,
  onClose,
  parentId,
  linkedStudents,
  pendingRequests,
  allStudents,
  onRequestLink,
  onRemoveLink
}: ParentLinkingModalProps) {
  const [studentCode, setStudentCode] = useState('')

  const handleRequestLink = () => {
    if (!studentCode.trim()) {
      toast.error('Please enter a student ID or code')
      return
    }

    // Check if student exists
    const student = allStudents.find(
      s => s.id === studentCode.trim() || s.name.toLowerCase() === studentCode.toLowerCase()
    )

    if (!student) {
      toast.error('Student not found. Please check the ID.')
      return
    }

    // Check if already linked
    if (linkedStudents.some(s => s.id === student.id)) {
      toast.error('You are already linked to this student')
      return
    }

    // Check if there's a pending request
    if (pendingRequests.some(r => r.studentId === student.id)) {
      toast.error('You already have a pending request for this student')
      return
    }

    onRequestLink(student.id)
    setStudentCode('')
    toast.success(`Link request sent to ${student.name}`)
  }

  const handleRemoveLink = (student: UserProfile) => {
    onRemoveLink(student.id)
    toast.success(`Link to ${student.name} removed`)
  }

  // Get pending requests for this parent
  const myPendingRequests = pendingRequests.filter(r => r.parentId === parentId)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Link size={24} weight="fill" className="text-accent" />
            Manage Student Links
          </DialogTitle>
          <DialogDescription>
            Link your account to your child's student account to view their progress and participate in voting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Request New Link */}
          <div className="space-y-3">
            <Label htmlFor="student-code">Link to a Student</Label>
            <div className="flex gap-2">
              <Input
                id="student-code"
                placeholder="Enter student ID or name..."
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestLink()}
                className="flex-1"
              />
              <Button onClick={handleRequestLink} className="gap-2">
                <PaperPlaneTilt size={18} />
                Request
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The student will need to approve your request before the link is active.
            </p>
          </div>

          <Separator />

          {/* Pending Requests */}
          {myPendingRequests.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock size={16} />
                Pending Requests ({myPendingRequests.length})
              </Label>
              <ScrollArea className="max-h-32">
                <div className="space-y-2">
                  {myPendingRequests.map(request => {
                    const student = allStudents.find(s => s.id === request.studentId)
                    return (
                      <Card key={request.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-muted-foreground" />
                            <span className="font-medium">
                              {student?.name || request.studentId}
                            </span>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Clock size={12} />
                            Pending
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Linked Students */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              Linked Students ({linkedStudents.length})
            </Label>
            {linkedStudents.length === 0 ? (
              <Card className="p-4">
                <CardContent className="p-0 text-center text-muted-foreground">
                  <Users size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No linked students yet</p>
                  <p className="text-xs mt-1">
                    Request a link using the student's ID above
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {linkedStudents.map(student => (
                    <Card key={student.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Level {student.level} - {student.xp} XP
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLink(student)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
