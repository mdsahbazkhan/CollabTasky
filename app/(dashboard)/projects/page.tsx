"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid, List } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { cn } from "@/src/lib/utils";
import { useUser } from "@/src/contexts/user-context";
import { getProjects } from "@/src/services/project.service";
import { getTasksByProject } from "@/src/services/task.service";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [taskProgressMap, setTaskProgressMap] = React.useState<
    Record<
      string,
      { progress: number; tasksCompleted: number; totalTasks: number }
    >
  >({});
  const { isAdmin } = useUser();
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  React.useEffect(() => {
    const fetchTasks = async () => {
      const map: Record<
        string,
        { progress: number; tasksCompleted: number; totalTasks: number }
      > = {};

      for (const project of projects) {
        try {
          const tasks = await getTasksByProject(project._id);

          const total = tasks.length;
          const completed = tasks.filter(
            (task: any) => task.status === "completed",
          ).length;

          const progress =
            total === 0 ? 0 : Math.round((completed / total) * 100);

          map[project._id] = {
            progress,
            tasksCompleted: completed,
            totalTasks: total,
          };
        } catch (error) {
          console.error(
            `Failed to fetch tasks for project ${project._id}:`,
            error,
          );
          map[project._id] = {
            progress: project.progress || 0,
            tasksCompleted: project.tasksCompleted || 0,
            totalTasks: project.totalTasks || 0,
          };
        }
      }

      setTaskProgressMap(map);
    };

    if (projects.length > 0) {
      fetchTasks();
    }
  }, [projects]);
  const filteredProjects = projects.filter((project: any) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout title="Projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div
          className={cn(
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-4",
          )}
        >
          {filteredProjects.map((project: any) => {
            const taskData = taskProgressMap[project._id] || {};
            const projectWithTaskProgress = {
              ...project,
              // Handle members - could be populated with name or just IDs
              members: (project.members || []).map((m: any) => {
                if (m.user && m.user.name) {
                  return {
                    _id: m.user._id,
                    name: m.user.name,
                    initials: m.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase(),
                    role: m.role,
                  };
                }

                return {
                  _id: m._id || "unknown",
                  name: "Member",
                  initials: "?",
                  role: "member",
                };
              }),
              progress: taskData.progress ?? project.progress ?? 0,
              tasksCompleted:
                taskData.tasksCompleted ?? project.tasksCompleted ?? 0,
              totalTasks: taskData.totalTasks ?? project.totalTasks ?? 0,
            };
            return (
              <ProjectCard
                key={project._id}
                project={projectWithTaskProgress}
                viewMode={viewMode}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-foreground">
              No projects found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or create a new project
            </p>
          </div>
        )}
      </div>

      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchProjects}
      />
    </DashboardLayout>
  );
}
