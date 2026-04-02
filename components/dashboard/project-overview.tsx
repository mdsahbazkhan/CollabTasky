"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTasksByProject } from "@/src/services/task.service";
import { EditProjectModal } from "@/components/projects/edit-project-modal";
import { useEffect, useState } from "react";
function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "archived":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function ProjectOverview({ projects }: { projects: any[] }) {
  const [taskMap, setTaskMap] = useState<{ [key: string]: number }>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  useEffect(() => {
    const fetchTasks = async () => {
      const map: any = {};

      for (const project of projects) {
        const tasks = await getTasksByProject(project._id);

        const total = tasks.length;
        const completed = tasks.filter(
          (task: any) => task.status === "completed",
        ).length;

        const progress =
          total === 0 ? 0 : Math.round((completed / total) * 100);

        map[project._id] = progress;
      }

      setTaskMap(map);
    };

    if (projects.length > 0) {
      fetchTasks();
    }
  }, [projects]);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Overview</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => {
          const progress = taskMap[project._id] || 0;
          return (
            <div
              key={project._id}
              className="flex flex-col gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${project._id}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {project.name}
                    </Link>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(project.status)}
                    >
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project._id}`}>
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedProject(project);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit project
                    </DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex -space-x-2">
                    {project.members
                      .slice(0, 3)
                      .map((member: any, idx: number) => {
                        const initials =
                          typeof member === "object" && member.user.name
                            ? member.user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                            : member.initials || "?";
                        return (
                          <Avatar
                            key={idx}
                            className="h-8 w-8 border-2 border-background"
                          >
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    {project.members.length > 3 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Due {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          );
        })}
      </CardContent>

      <EditProjectModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={selectedProject}
        onSuccess={() => {
          // Optionally trigger a refresh here
          window.location.reload();
        }}
      />
    </Card>
  );
}
