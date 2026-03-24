"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { getProjectById } from "@/src/services/project.service";
import { getTasksByProject } from "@/src/services/task.service";
import AddMemberModal from "@/components/projects/AddMemberModal";
import { getAllUsers } from "@/src/services/auth.service";

const project = null;

const tasks: any[] = [];
function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Review":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "inProgress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Todo":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [tasksCompleted, setTasksCompleted] = React.useState(0);
  const [totalTasks, setTotalTasks] = React.useState(0);
  const [openMemberModal, setOpenMemberModal] = React.useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] =
    React.useState(false);
  const [users, setUsers] = React.useState([]);
  const fetchProject = async () => {
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (projectId) {
          fetchProject();
        }

        const tasksData = await getTasksByProject(projectId);
        setTasks(tasksData);

        const total = tasksData.length;
        const completed = tasksData.filter(
          (task: any) => task.status === "completed",
        ).length;
        const calculatedProgress =
          total === 0 ? 0 : Math.round((completed / total) * 100);

        setProgress(calculatedProgress);
        setTasksCompleted(completed);
        setTotalTasks(total);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);
  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleTaskCreated = async () => {
    try {
      const tasksData = await getTasksByProject(projectId);
      setTasks(tasksData);

      const total = tasksData.length;
      const completed = tasksData.filter(
        (task: any) => task.status === "completed",
      ).length;
      const calculatedProgress =
        total === 0 ? 0 : Math.round((completed / total) * 100);

      setProgress(calculatedProgress);
      setTasksCompleted(completed);
      setTotalTasks(total);
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Details">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout title="Project Details">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </DashboardLayout>
    );
  }

  // Process owner (same logic as members)
  const processedOwner = (() => {
    const o = project.owner;
    if (typeof o === "object" && o.name) {
      return {
        name: o.name,
        initials: o.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
        role: "Owner",
      };
    }
    return {
      name: "Owner",
      initials: "?",
      role: "Owner",
    };
  })();

  // Process members to handle both populated and non-populated
  const processedMembers = (project.members || []).map((m: any) => {
    if (typeof m === "object" && m.name) {
      return {
        _id: m._id,
        name: m.name,
        initials: m.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
        role: m.role || "Member",
      };
    }
    return {
      _id: m,
      name: "Member",
      initials: "?",
      role: "Member",
    };
  });

  // Get owner ID for filtering
  const ownerId = project.owner._id || project.owner;

  // Filter out owner from members to avoid duplicates
  const uniqueMembers = processedMembers.filter(
    (m: any) => m._id?.toString() !== ownerId?.toString(),
  );

  // Include owner in team members for assignment
  const teamMembers = [
    {
      _id: ownerId,
      name: project.owner.name || "Owner",
      initials: project.owner.name
        ? project.owner.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
        : "?",
    },
    ...uniqueMembers,
  ];

  // Map task status for display
  const getTaskStatus = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "review":
        return "Review";
      case "inProgress":
        return "In Progress";
      default:
        return "Todo";
    }
  };
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

  const getAssigneeInitials = (assignedTo: any) => {
    if (assignedTo && typeof assignedTo === "object" && assignedTo.name) {
      return assignedTo.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return "?";
  };
  return (
    <DashboardLayout title="Project Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to projects</span>
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${project.color}`} />
              <h1 className="text-2xl font-bold text-foreground">
                {project.name}
              </h1>
              <Badge
                variant="secondary"
                className={getStatusColor(project.status)}
              >
                {project.status?.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate project</DropdownMenuItem>
                <DropdownMenuItem>Export data</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Archive project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tasksCompleted}/{totalTasks}
                </p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {processedMembers.length}
                </p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {progress}%
                </p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
                <p className="text-sm text-muted-foreground">Due Date</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Row */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <Avatar className="h-7 w-7 border-2 border-background">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {processedOwner.initials}
              </AvatarFallback>
            </Avatar>
            <span className="ml-3 text-sm text-muted-foreground">
              Owned by {processedOwner.name}
            </span>

            {processedMembers.length > 4 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{processedMembers.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Overall Progress
              </span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Project Tasks
              </h3>
              <Button size="sm" onClick={() => setIsCreateTaskModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task: any) => (
                <Card
                  key={task._id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {task.title}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(getTaskStatus(task.status))}
                    >
                      {getTaskStatus(task.status)}
                    </Badge>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getAssigneeInitials(task.assignedTo)}
                      </AvatarFallback>
                    </Avatar>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Team Members
              </h3>
              <Button size="sm" onClick={() => setOpenMemberModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {processedMembers.map((member: any, idx: number) => (
                <Card key={idx}>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <Avatar className="h-16 w-16 mb-4">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium text-foreground">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-border" />
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium text-foreground">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateTaskModal
          open={isCreateTaskModalOpen}
          onOpenChange={setIsCreateTaskModalOpen}
          projectId={projectId}
          teamMembers={teamMembers}
          onSuccess={handleTaskCreated}
        />
        <AddMemberModal
          open={openMemberModal}
          onOpenChange={setOpenMemberModal}
          projectId={projectId}
          users={users}
          refreshProject={fetchProject}
        />
      </div>
    </DashboardLayout>
  );
}
