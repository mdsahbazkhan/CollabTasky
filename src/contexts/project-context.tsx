"use client";

import * as React from "react";
import {
  getProjects,
  createProject,
  updateProject,
  addMember,
  deleteProject,
  getProjectByIdAPI,
} from "@/src/services/project.service";
import { toast } from "sonner";

export interface ProjectMember {
  _id: string;
  name: string;
  email?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  status: string;
  owner: string | { _id: string; name: string };
  members: ProjectMember[];
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  role?: "owner" | "admin" | "member";
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (data: Partial<Project>) => Promise<Project | null>;
  editProject: (id: string, data: Partial<Project>) => Promise<Project | null>;
  removeProject: (id: string) => Promise<boolean>;
  addProjectMember: (projectId: string, userId: string) => Promise<boolean>;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = React.createContext<ProjectContextType | undefined>(
  undefined,
);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = async (
    data: Partial<Project>,
  ): Promise<Project | null> => {
    setLoading(true);
    try {
      const newProject = await createProject(data);
      setProjects((prev) => [newProject, ...prev]);
      toast.success("Project created successfully");
      return newProject;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create project";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editProject = async (
    id: string,
    data: Partial<Project>,
  ): Promise<Project | null> => {
    setLoading(true);
    try {
      const updated = await updateProject(id, data);
      setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
      toast.success("Project updated successfully");
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update project";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete project";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addProjectMember = async (
    projectId: string,
    userId: string,
    role: string,
  ): Promise<boolean> => {
    try {
      await addMember(projectId, userId, role);
      toast.success("Member added successfully");
      await fetchProjects(); // Refresh to get updated member list
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add member";
      toast.error(message);
      return false;
    }
  };

  const getProjectById = async (id: string) => {
    try {
      const res = await getProjectByIdAPI(id);

      return {
        ...res.project,
        role: res.role,
      };
    } catch (err) {
      toast.error("Failed to fetch project");
      return null;
    }
  };

  const value = React.useMemo(
    () => ({
      projects,
      loading,
      error,
      fetchProjects,
      addProject,
      editProject,
      removeProject,
      addProjectMember,
      getProjectById,
    }),
    [projects, loading, error, fetchProjects],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
