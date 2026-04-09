"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/src/services/task.service";

interface TeamMember {
  _id: string;
  name: string;
}

interface ProjectWithMembers {
  _id: string;
  name: string;
  members?: TeamMember[];
}

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects?: ProjectWithMembers[];
  projectId?: string;
  teamMembers?: TeamMember[];
  onSuccess?: () => void;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  projects,
  projectId,
  teamMembers,
  onSuccess,
}: CreateTaskModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("medium");
  const [assignee, setAssignee] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [selectedProjectId, setSelectedProjectId] = React.useState("");

  React.useEffect(() => {
    if (open) {
      if (projectId) {
        setSelectedProjectId(projectId);
      } else {
        setSelectedProjectId("");
      }
    }
  }, [open, projectId]);

  // Get members for the selected project
  const projectList = projects || [];
  const availableMembers = teamMembers || [];
  const projectMembers = selectedProjectId
    ? projectList.find((p) => p._id === selectedProjectId)?.members || availableMembers
    : [];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setDueDate("");
    setTags("");
    setSelectedProjectId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !selectedProjectId) return;

    setIsLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        project: selectedProjectId,
        assignedTo: assignee || undefined,
        priority,
        dueDate: dueDate || undefined,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      };

      await createTask(taskData);

      resetForm();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to this project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the task..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority + Project (only show project dropdown when not pre-selected) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project List - only show if no projectId provided */}
            {!projectId ? (
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>

                  <SelectContent>
                    {projectList.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label>Assignee</Label>
            {(projectMembers.length > 0 || availableMembers.length > 0) ? (
              <Select
                value={assignee || "unassigned"}
                onValueChange={(val) =>
                  setAssignee(val === "unassigned" ? "" : val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {(projectMembers.length > 0 ? projectMembers : availableMembers).map((member: TeamMember) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : selectedProjectId ? (
              <p className="text-sm text-muted-foreground">
                No members in this project
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a project first
              </p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="design, frontend, urgent"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
