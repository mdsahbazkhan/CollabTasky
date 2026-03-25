"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    members: { name: string; initials: string }[];
    tasksCompleted: number;
    totalTasks: number;
    endDate: string;
    color: string;
  };
  viewMode: "grid" | "list";
  isAdmin?: boolean;
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "archived":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function ProjectCard({
  project,
  viewMode,
  isAdmin = false,
}: ProjectCardProps) {
  const router = useRouter();

  if (viewMode === "list") {
    return (
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className={cn("h-12 w-1 rounded-full", project.color)} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${project._id}`}
                className="font-semibold text-foreground hover:text-primary truncate"
              >
                {project.name}
              </Link>
              <Badge
                variant="secondary"
                className={getStatusColor(project.status)}
              >
                {project.status?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.description}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">
              {project.tasksCompleted}
            </span>
            <span className="text-sm text-muted-foreground">
              / {project.totalTasks}
            </span>
          </div>

          <div className="hidden sm:flex -space-x-2">
            {project.members.slice(0, 3).map((member, idx) => (
              <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          </div>

          <div className="hidden xl:block w-32">
            <Progress value={project.progress} className="h-2" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                View details
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem>Edit project</DropdownMenuItem>
                  <DropdownMenuItem>Manage members</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Archive
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-colors hover:bg-muted/50">
      <div className={cn("h-1", project.color)} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link
              href={`/projects/${project._id}`}
              className="font-semibold text-foreground hover:text-primary line-clamp-1"
            >
              {project.name}
            </Link>
            <Badge
              variant="secondary"
              className={getStatusColor(project.status)}
            >
              {project.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                View details
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem>Edit project</DropdownMenuItem>
                  <DropdownMenuItem>Manage members</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Archive
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="font-medium text-foreground">
              {project.tasksCompleted}
            </span>
            <span>of {project.totalTasks} tasks completed</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member, idx) => (
              <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 4 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{project.members.length - 4}
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${project._id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
