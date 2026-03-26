"use client";

import * as React from "react";
import {
  getAllTask,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
  CreateTaskData,
} from "@/src/services/task.service";
import { toast } from "sonner";

// Task type matching the backend and frontend
export interface Task {
  id: string;
  _id: string;
  title: string;
  description: string;
  status: "todo" | "inProgress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  project: string;
  projectId: string;
  assignedTo?: string | { _id: string; name: string; email?: string };
  assignee?: { name: string; initials: string };
  dueDate?: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
  comments?: Array<{ _id: string; user: any; text: string; createdAt: string }>;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (projectId?: string) => Promise<void>;
  addTask: (data: CreateTaskData) => Promise<Task | null>;
  editTask: (id: string, data: Partial<CreateTaskData>) => Promise<Task | null>;
  removeTask: (id: string) => Promise<boolean>;
  changeTaskStatus: (id: string, status: string) => Promise<boolean>;
  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: string) => Task[];
}

const TaskContext = React.createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTasks = React.useCallback(async (projectId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let data: Task[];
      if (projectId) {
        // Would need a getTasksByProject function - for now use all tasks
        const allTasks = await getAllTask();
        data = allTasks.filter(
          (t: any) => t.project._id === projectId || t.project === projectId,
        );
      } else {
        data = await getAllTask();
      }

      // Transform data to consistent format
      const transformedTasks: Task[] = data.map((t: any) => ({
        id: t._id,
        _id: t._id,
        title: t.title,
        description: t.description || "",
        status: t.status,
        priority: t.priority,
        project: typeof t.project === "object" ? t.project._id : t.project,
        projectId: typeof t.project === "object" ? t.project._id : t.project,
        assignedTo: t.assignedTo,
        assignee: t.assignedTo
          ? {
              name: t.assignedTo.name || "Unknown",
              initials: t.assignedTo.name
                ? t.assignedTo.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                : "U",
            }
          : { name: "Unassigned", initials: "U" },
        dueDate: t.dueDate,
        tags: t.tags || [],
        createdBy: t.createdBy,
        createdAt: t.createdAt,
        comments: t.comments,
      }));

      setTasks(transformedTasks);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (data: CreateTaskData): Promise<Task | null> => {
    setLoading(true);
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully");
      return newTask;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (
    id: string,
    data: Partial<CreateTaskData>,
  ): Promise<Task | null> => {
    setLoading(true);
    try {
      const updated = await updateTask(id, data);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id || t._id === id ? { ...t, ...updated } : t,
        ),
      );
      toast.success("Task updated successfully");
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update task";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      toast.success("Task deleted successfully");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeTaskStatus = async (
    id: string,
    status: string,
  ): Promise<boolean> => {
    try {
      const updated = await updateStatus(id, status);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id || t._id === id ? { ...t, status: updated.status } : t,
        ),
      );
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(message);
      return false;
    }
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((t) => t.id === id || t._id === id);
  };

  const getTasksByProject = (projectId: string): Task[] => {
    return tasks.filter(
      (t) => t.project === projectId || t.projectId === projectId,
    );
  };

  const getTasksByStatus = (status: string): Task[] => {
    return tasks.filter((t) => t.status === status);
  };

  const value = React.useMemo(
    () => ({
      tasks,
      loading,
      error,
      fetchTasks,
      addTask,
      editTask,
      removeTask,
      changeTaskStatus,
      getTaskById,
      getTasksByProject,
      getTasksByStatus,
    }),
    [tasks, loading, error, fetchTasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = React.useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
