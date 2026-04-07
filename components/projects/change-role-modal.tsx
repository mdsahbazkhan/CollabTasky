"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { changeMemberRole } from "@/src/services/project.service"
import { useProjects } from "@/src/contexts/project-context"

interface ChangeRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberId: string
  memberName: string
  currentRole: string
  projectId: string
  onRoleChanged: () => void
}

export function ChangeRoleModal({
  open,
  onOpenChange,
  memberId,
  memberName,
  currentRole,
  projectId,
  onRoleChanged,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = React.useState(currentRole)
  const [isLoading, setIsLoading] = React.useState(false)
  const { fetchProjects } = useProjects()

  React.useEffect(() => {
    setSelectedRole(currentRole)
  }, [currentRole, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole === currentRole) {
      onOpenChange(false)
      return
    }

    setIsLoading(true)
    try {
      await changeMemberRole(projectId, memberId, selectedRole)
      await fetchProjects()
      onRoleChanged()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to change role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Change the role for {memberName}. This will affect their permissions
            within the project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Select Role
            </label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" disabled={currentRole === "owner"}>
                  Admin
                </SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedRole === currentRole}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}