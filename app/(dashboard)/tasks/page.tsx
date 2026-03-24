"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { TaskDetailsPanel } from "@/components/tasks/task-details-panel";
import { getAllTask, updateStatus } from "@/src/services/task.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inProgress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  project: string;
  assignee: { name: string; initials: string };
  dueDate: string;
  tags: string[];
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleDragEnd = async (taskId: string, newStatus: string) => {
    try {
      await updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const fetchTasks = async () => {
    try {
      const data = await getAllTask();

      const formatted = data.map((task: any) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority || "Medium",
        project: task.project?.name || "",
        assignee: {
          name: task.assignedTo?.name || "Unassigned",
          initials: task.assignedTo?.name
            ? task.assignedTo.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
            : "?",
        },
        dueDate: task.dueDate || "",
        tags: task.tags || [],
      }));

      setTasks(formatted);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <DashboardLayout title="Tasks">
      <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Low</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            tasks={filteredTasks}
            onDragEnd={handleDragEnd}
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <TaskDetailsPanel
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </DashboardLayout>
  );
}
