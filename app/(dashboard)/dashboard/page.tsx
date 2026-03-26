"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ProjectOverview } from "@/components/dashboard/project-overview";
import { useUser } from "@/src/contexts/user-context";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Sparkles } from "lucide-react";
import { getProjects } from "@/src/services/project.service";
import { getTasksByProject } from "@/src/services/task.service";

export default function DashboardPage() {
  const { user, loading: userLoading, isAdmin } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Guard: don't render during SSG when user is not available
  if (!user && !userLoading) {
    return null;
  }

  const userName = user?.name?.split(" ")[0] || "User";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchTasks = async () => {
      let active = 0;
      for (const project of projects) {
        const tasks = await getTasksByProject(project._id);
        const projectActive = tasks.filter(
          (task: any) => task.status !== "completed",
        ).length;
        active += projectActive;
      }

      setActiveTasks(active);
    };

    if (projects.length > 0) {
      fetchTasks();
    }
  }, [projects]);
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Welcome back, {userName}!
                  </h2>
                  <Badge
                    variant={isAdmin ? "default" : "secondary"}
                    className="gap-1"
                  >
                    {isAdmin ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {isAdmin ? "Admin" : "Member"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {isAdmin
                    ? "You have full access to manage projects, tasks, and team members."
                    : "You can view and work on assigned projects and tasks."}
                </p>
              </div>
              <Sparkles className="h-12 w-12 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <StatsCards
          loading={loading}
          projects={projects}
          activeTasks={activeTasks}
        />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Project Overview - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ProjectOverview projects={projects} />
          </div>

          {/* Activity Feed - Takes 1 column */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Recent Tasks */}
        <RecentTasks />
      </div>
    </DashboardLayout>
  );
}
