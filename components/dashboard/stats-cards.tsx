"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export function StatsCards({
  projects,
  activeTasks,
  loading,
}: {
  projects: any[];
  activeTasks: number;
  loading?: boolean;
}) {
  const stats = [
    {
      name: "Total Projects",
      value: projects.length,
      change: "+2",
      changeType: "positive" as const,
      icon: FolderKanban,
    },
    {
      name: "Active Tasks",
      value: activeTasks,
      change: "0",
      changeType: "positive" as const,
      icon: CheckSquare,
    },
    {
      name: "Hours Logged",
      value: 0,
      change: "0",
      changeType: "negative" as const,
      icon: Clock,
    },
    {
      name: "Team Members",
      value: 0,
      change: "+0",
      changeType: "positive" as const,
      icon: Users,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  stat.changeType === "positive"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
