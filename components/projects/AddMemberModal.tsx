"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { addMember } from "@/src/services/project.service";
import { toast } from "sonner";

export default function AddMemberModal({
  open,
  onOpenChange,
  projectId,
  users = [],
  refreshProject,
}: any) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      await addMember(projectId, selectedUser, selectedRole);
      toast.success("Member added");
      refreshProject();
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <Select onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>

          <SelectContent>
            {users.map((user: any) => (
              <SelectItem key={user._id} value={user._id}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedRole} defaultValue="member">
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
