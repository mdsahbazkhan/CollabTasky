"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Edit,
  FolderKanban,
  MessageSquare,
  Save,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Task } from "@/app/(dashboard)/tasks/page";
import { updateTask, deleteTask } from "@/src/services/task.service";
import { toast } from "sonner";

interface TaskDetailsPanelProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (taskId: string, updates: any) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  projects?: {
    _id: string;
    name: string;
    members?: { _id: string; name: string }[];
  }[];
  onSuccess?: () => Promise<void>;
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "low":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "todo":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    case "inProgress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "review":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

const statusLabels: Record<string, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  review: "Review",
  completed: "Completed",
};

const comments = [
  {
    id: "1",
    user: { name: "Sarah Chen", initials: "SC" },
    content:
      "I've started working on the initial designs. Should have something ready for review by tomorrow.",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: { name: "John Doe", initials: "JD" },
    content:
      "Great! Let me know if you need any clarification on the requirements.",
    time: "1 hour ago",
  },
];

export function TaskDetailsPanel({
  task,
  open,
  onOpenChange,
  projects = [],
  onSuccess,
}: TaskDetailsPanelProps) {
  const [comment, setComment] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Initialize editedTask when task changes
  React.useEffect(() => {
    if (task) {
      setEditedTask(task);
      setIsEditing(false);
    }
  }, [task]);

  // Get members from the task's project
  const projectMembers = task?.projectId
    ? projects.find((p) => p._id === task.projectId)?.members || []
    : [];

  const handleUpdate = async () => {
    if (!editedTask || !task) return;
    setIsSaving(true);
    try {
      // Only send the fields that the API expects
      const updateData = {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        priority: editedTask.priority,
        assignedTo:
          editedTask.assignedTo === "unassigned" ? null : editedTask.assignedTo,
        dueDate: editedTask.dueDate,
        tags: editedTask.tags,
      };
      await updateTask(task.id, updateData as any);
      setIsEditing(false);
      await onSuccess?.();
      toast.success("Task updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!task) return;
    setIsLoading(true);
    setShowDeleteDialog(false);
    try {
      await deleteTask(task.id);
      onOpenChange(false);
      await onSuccess?.();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">{task.title}</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Task details and actions
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status & Priority */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getStatusColor(task.status)}>
              {statusLabels[task.status]}
            </Badge>
            <Select
              defaultValue={editedTask?.priority || task.priority}
              onValueChange={(value) =>
                setEditedTask({ ...editedTask, priority: value })
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Description</h4>
            <Textarea
              value={editedTask?.description || task.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Assignee</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {task.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Select
                    defaultValue="unassigned"
                    onValueChange={(value) =>
                      setEditedTask({ ...editedTask, assignedTo: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue placeholder="Assign user" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {projectMembers.map((m: any) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Project</p>
                <span className="text-sm font-medium text-foreground">
                  {task.project}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Due Date</p>
                <input
                  type="date"
                  value={editedTask?.dueDate?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, dueDate: e.target.value })
                  }
                  disabled={!isEditing}
                  className="text-sm bg-transparent border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Tag className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <Select
                  defaultValue={editedTask?.status || task.status}
                  onValueChange={(value) =>
                    setEditedTask({ ...editedTask, status: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-8 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>{" "}
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">Comments</h4>
            </div>

            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {c.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {c.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <Button size="sm" disabled={!comment.trim()}>
                Add Comment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={handleUpdate}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete task</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-medium">{task?.title}</p>
              <p className="text-muted-foreground">{task?.description}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
