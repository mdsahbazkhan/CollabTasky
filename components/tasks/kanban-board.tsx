"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, GripVertical } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Task } from "@/app/(dashboard)/tasks/page";

interface KanbanBoardProps {
  tasks: Task[];
  onDragEnd: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick: (task: Task) => void;
}

const columns: { id: Task["status"]; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Urgent":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "High":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Low":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function KanbanBoard({
  tasks,
  onDragEnd,
  onTaskClick,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<
    Task["status"] | null
  >(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: Task["status"]) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: Task["status"]) => {
    e.preventDefault();
    if (draggedTask) {
      onDragEnd(draggedTask, columnId);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        const isOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex w-80 shrink-0 flex-col"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card
              className={cn(
                "flex h-full flex-col transition-colors",
                isOver && "ring-2 ring-primary",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("h-3 w-3 rounded-full", column.color)} />
                  <CardTitle className="text-sm font-medium">
                    {column.title}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-auto">
                    {columnTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-2">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-2 p-1">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => onTaskClick(task)}
                        className={cn(
                          "group cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md",
                          draggedTask === task.id && "opacity-50",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="flex-1 space-y-2">
                            <p className="font-medium text-foreground line-clamp-2">
                              {task.title}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  getPriorityColor(task.priority),
                                )}
                              >
                                {task.priority}
                              </Badge>
                              {task.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{task.dueDate}</span>
                              </div>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {task.assignee.initials}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border">
                        <p className="text-sm text-muted-foreground">
                          No tasks
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
