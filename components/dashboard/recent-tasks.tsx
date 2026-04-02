"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getRecentTasks } from "@/src/services/task.service";

interface Task {
  _id: string;
  title: string;
  project: { _id: string; name: string } | null;
  priority: string;
  status: string;
  dueDate: string | null;
  assignedTo: { name: string; email: string; avatar?: string } | null;
}

function getPriorityBadgeVariant(priority: string) {
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

function getStatusBadgeVariant(status: string) {
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

function formatStatus(status: string) {
  switch (status) {
    case "todo":
      return "Todo";
    case "inProgress":
      return "In Progress";
    case "review":
      return "Review";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

function formatPriority(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDueDate(dateStr: string | null) {
  if (!dateStr) return "No date";
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.getTime() === today.getTime()) return "Today";
  if (taskDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const data = await getRecentTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch recent tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTasks();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Tasks</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No recent tasks found.
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <Checkbox id={`task-${task._id}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tasks/${task._id}`}
                      className="font-medium text-foreground hover:text-primary truncate"
                    >
                      {task.title}
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.project?.name || "No project"}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(getPriorityBadgeVariant(task.priority))}
                  >
                    {formatPriority(task.priority)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(getStatusBadgeVariant(task.status))}
                  >
                    {formatStatus(task.status)}
                  </Badge>
                </div>

                <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>

                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task.assignedTo?.avatar}
                    alt={task.assignedTo?.name || "Unassigned"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {task.assignedTo ? getInitials(task.assignedTo.name) : "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
