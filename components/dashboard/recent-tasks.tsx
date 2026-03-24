"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/src/lib/utils";

const tasks = [
  {
    id: "1",
    title: "Review pull request #42",
    project: "Website Redesign",
    priority: "High",
    status: "Todo",
    dueDate: "Today",
    assignee: { name: "John", avatar: "/avatars/01.png", initials: "JD" },
  },
  {
    id: "2",
    title: "Update API documentation",
    project: "Mobile App",
    priority: "Medium",
    status: "In Progress",
    dueDate: "Tomorrow",
    assignee: { name: "Sarah", avatar: "/avatars/02.png", initials: "SC" },
  },
  {
    id: "3",
    title: "Design new onboarding flow",
    project: "Website Redesign",
    priority: "High",
    status: "Todo",
    dueDate: "Mar 15",
    assignee: { name: "Emily", avatar: "/avatars/04.png", initials: "EM" },
  },
  {
    id: "4",
    title: "Fix login page bug",
    project: "Mobile App",
    priority: "High",
    status: "In Progress",
    dueDate: "Today",
    assignee: { name: "Mike", avatar: "/avatars/03.png", initials: "MK" },
  },
  {
    id: "5",
    title: "Create marketing assets",
    project: "Marketing Campaign",
    priority: "Low",
    status: "Todo",
    dueDate: "Mar 20",
    assignee: { name: "Lisa", avatar: "/avatars/06.png", initials: "LS" },
  },
];

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    
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

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Todo":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    case "In Progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Review":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function RecentTasks() {
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
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <Checkbox id={`task-${task.id}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="font-medium text-foreground hover:text-primary truncate"
                  >
                    {task.title}
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">{task.project}</p>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(getPriorityBadgeVariant(task.priority))}
                >
                  {task.priority}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(getStatusBadgeVariant(task.status))}
                >
                  {task.status}
                </Badge>
              </div>

              <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{task.dueDate}</span>
              </div>

              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {task.assignee.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
