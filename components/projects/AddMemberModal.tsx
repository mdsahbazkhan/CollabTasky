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

export default function AddMemberModal({
  open,
  onOpenChange,
  projectId,
  users = [],
  refreshProject,
}: any) {
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      await addMember(projectId, selectedUser);

      refreshProject();
      onOpenChange(false);
    } catch (err) {
      console.log(err);
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
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
