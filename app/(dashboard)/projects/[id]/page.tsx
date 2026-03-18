"use client"

import * as React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const project = {
  id: "1",
  name: "Website Redesign",
  description:
    "Complete overhaul of the company website with modern design, improved UX, and better performance. This project includes redesigning all pages, implementing new features, and migrating to a new tech stack.",
  status: "In Progress",
  progress: 65,
  priority: "High",
  members: [
    { name: "John Doe", initials: "JD", role: "Project Lead" },
    { name: "Sarah Chen", initials: "SC", role: "Designer" },
    { name: "Mike Johnson", initials: "MJ", role: "Developer" },
    { name: "Emily Davis", initials: "ED", role: "Developer" },
  ],
  tasksCompleted: 24,
  totalTasks: 36,
  startDate: "Jan 15, 2026",
  dueDate: "Mar 15, 2026",
  color: "bg-blue-500",
}

const tasks = [
  { id: "1", title: "Design homepage mockup", status: "Done", assignee: "SC" },
  { id: "2", title: "Implement navigation", status: "Done", assignee: "MJ" },
  { id: "3", title: "Create component library", status: "In Progress", assignee: "ED" },
  { id: "4", title: "Setup CI/CD pipeline", status: "In Progress", assignee: "MJ" },
  { id: "5", title: "Design mobile layouts", status: "Todo", assignee: "SC" },
  { id: "6", title: "API integration", status: "Todo", assignee: "ED" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    case "In Progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case "Todo":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export default function ProjectDetailsPage() {
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
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {project.status}
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
                <DropdownMenuItem className="text-destructive">Archive project</DropdownMenuItem>
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
                  {project.tasksCompleted}/{project.totalTasks}
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
                  {project.members.length}
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
                <p className="text-2xl font-bold text-foreground">{project.progress}%</p>
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
                <p className="text-lg font-bold text-foreground">{project.dueDate}</p>
                <p className="text-sm text-muted-foreground">Due Date</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
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
              <h3 className="text-lg font-semibold text-foreground">Project Tasks</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <Card key={task.id} className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{task.title}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {task.assignee}
                      </AvatarFallback>
                    </Avatar>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.members.map((member, idx) => (
                <Card key={idx}>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <Avatar className="h-16 w-16 mb-4">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
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
                  <p className="font-medium text-foreground">{project.startDate}</p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-border" />
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium text-foreground">{project.dueDate}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
