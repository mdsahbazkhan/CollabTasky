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

// const projects = [
//   {
//     id: "1",
//     name: "Website Redesign",
//     description:
//       "Complete overhaul of the company website with modern design and improved UX",
//     status: "In Progress",
//     progress: 65,
//     priority: "High",
//     members: [
//       { name: "John", initials: "JD" },
//       { name: "Sarah", initials: "SC" },
//       { name: "Mike", initials: "MK" },
//       { name: "Emily", initials: "EM" },
//     ],
//     tasksCompleted: 24,
//     totalTasks: 36,
//     dueDate: "Mar 15, 2026",
//     color: "bg-blue-500",
//   },
//   {
//     id: "2",
//     name: "Mobile App Development",
//     description: "Build native iOS and Android apps for the platform",
//     status: "In Progress",
//     progress: 40,
//     priority: "High",
//     members: [
//       { name: "Emily", initials: "EM" },
//       { name: "David", initials: "DV" },
//     ],
//     tasksCompleted: 16,
//     totalTasks: 40,
//     dueDate: "Apr 20, 2026",
//     color: "bg-emerald-500",
//   },
//   {
//     id: "3",
//     name: "Marketing Campaign",
//     description: "Q2 product launch campaign across all channels",
//     status: "Planning",
//     progress: 20,
//     priority: "Medium",
//     members: [
//       { name: "Lisa", initials: "LS" },
//       { name: "Tom", initials: "TM" },
//     ],
//     tasksCompleted: 4,
//     totalTasks: 20,
//     dueDate: "May 1, 2026",
//     color: "bg-purple-500",
//   },
//   {
//     id: "4",
//     name: "API Integration",
//     description: "Integrate third-party APIs for payment and analytics",
//     status: "In Progress",
//     progress: 75,
//     priority: "High",
//     members: [{ name: "Mike", initials: "MK" }],
//     tasksCompleted: 15,
//     totalTasks: 20,
//     dueDate: "Mar 10, 2026",
//     color: "bg-orange-500",
//   },
//   {
//     id: "5",
//     name: "Documentation",
//     description: "Create comprehensive documentation for all features",
//     status: "On Hold",
//     progress: 30,
//     priority: "Low",
//     members: [
//       { name: "Sarah", initials: "SC" },
//       { name: "John", initials: "JD" },
//     ],
//     tasksCompleted: 6,
//     totalTasks: 20,
//     dueDate: "Apr 30, 2026",
//     color: "bg-cyan-500",
//   },
//   {
//     id: "6",
//     name: "Security Audit",
//     description: "Comprehensive security review and penetration testing",
//     status: "Completed",
//     progress: 100,
//     priority: "High",
//     members: [
//       { name: "David", initials: "DV" },
//       { name: "Emily", initials: "EM" },
//     ],
//     tasksCompleted: 12,
//     totalTasks: 12,
//     dueDate: "Feb 28, 2026",
//     color: "bg-red-500",
//   },
// ];

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
                if (typeof m === "object" && m.name) {
                  // Populated member object
                  return {
                    name: m.name,
                    initials: m.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase(),
                  };
                }
                // Just ID - placeholder until backend populates
                return {
                  name: "Member",
                  initials: "?",
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
      />
    </DashboardLayout>
  );
}
