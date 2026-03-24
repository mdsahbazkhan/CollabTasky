"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { TaskDetailsPanel } from "@/components/tasks/task-details-panel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo"| "inProgress"| "review"| "completed"
  priority: "Low" | "Medium" | "High" 
  project: string
  assignee: { name: string; initials: string }
  dueDate: string
  tags: string[]
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern landing page design with hero section, features, and testimonials.",
    status: "todo",
    priority: "High",
    project: "Website Redesign",
    assignee: { name: "Sarah Chen", initials: "SC" },
    dueDate: "Mar 15",
    tags: ["design", "ui"],
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up authentication system with email/password and OAuth providers.",
    status: "todo",
    priority: "High",
    project: "Mobile App",
    assignee: { name: "Mike Johnson", initials: "MJ" },
    dueDate: "Mar 12",
    tags: ["backend", "security"],
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples and error codes.",
    status: "todo",
    priority: "Medium",
    project: "Documentation",
    assignee: { name: "Emily Davis", initials: "ED" },
    dueDate: "Mar 20",
    tags: ["docs"],
  },
  {
    id: "4",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    status: "inProgress",
    priority: "High",
    project: "API Integration",
    assignee: { name: "David Kim", initials: "DK" },
    dueDate: "Mar 10",
    tags: ["devops"],
  },
  {
    id: "5",
    title: "Create component library",
    description: "Build reusable UI components with Storybook documentation.",
    status: "inProgress",
    priority: "High",
    project: "Website Redesign",
    assignee: { name: "Sarah Chen", initials: "SC" },
    dueDate: "Mar 18",
    tags: ["design", "frontend"],
  },
  {
    id: "6",
    title: "Database optimization",
    description: "Optimize database queries and add proper indexing.",
    status: "inProgress",
    priority: "Medium",
    project: "Mobile App",
    assignee: { name: "Mike Johnson", initials: "MJ" },
    dueDate: "Mar 14",
    tags: ["backend", "database"],
  },
  {
    id: "7",
    title: "User onboarding flow",
    description: "Design and implement the user onboarding experience.",
    status: "completed",
    priority: "High",
    project: "Website Redesign",
    assignee: { name: "Emily Davis", initials: "ED" },
    dueDate: "Mar 5",
    tags: ["ux", "frontend"],
  },
  {
    id: "8",
    title: "Payment integration",
    description: "Integrate Stripe for subscription payments.",
    status: "completed",
    priority: "High",
    project: "API Integration",
    assignee: { name: "David Kim", initials: "DK" },
    dueDate: "Mar 3",
    tags: ["backend", "payments"],
  },
  {
    id: "9",
    title: "Mobile responsive design",
    description: "Ensure all pages are fully responsive on mobile devices.",
    status: "completed",
    priority: "Medium",
    project: "Website Redesign",
    assignee: { name: "Sarah Chen", initials: "SC" },
    dueDate: "Mar 1",
    tags: ["design", "frontend"],
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleDragEnd = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout title="Tasks">
      <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>High</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Medium</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Low</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            tasks={filteredTasks}
            onDragEnd={handleDragEnd}
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <TaskDetailsPanel
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </DashboardLayout>
  )
}
