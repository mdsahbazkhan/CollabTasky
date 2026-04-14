import { API } from "@/src/lib/axios";
import { handleRequest } from "../lib/utils";

export const getTasksByProject = async (projectId: string) => {
  const res = await handleRequest(API.get(`/tasks/project/${projectId}`));
  return res?.tasks || []; // backend: { tasks }
};

export interface CreateTaskData {
  title: string;
  description?: string;
  project: string;
  assignedTo?: string;
  priority?: string;
  dueDate?: string;
  tags?: string[];
}

export const createTask = async (taskData: CreateTaskData) => {
  const res = await handleRequest(API.post("/tasks/create", taskData));
  return res;
};
export const getAllTask = async () => {
  const res = await handleRequest(API.get("/tasks/all"));
  return res?.tasks || []; // return empty array if null
};

export const updateStatus = async (taskId: string, status: string) => {
  const res = await handleRequest(
    API.patch(`/tasks/${taskId}/status`, { status }),
  );
  return res;
};

export const updateTask = async (
  taskId: string,
  taskData: Partial<CreateTaskData>,
) => {
  const res = await handleRequest(API.put(`/tasks/${taskId}`, taskData));
  return res;
};
export const deleteTask = async (taskId: string) => {
  const res = await handleRequest(API.delete(`/tasks/${taskId}`));
  return res;
};

export const getRecentTasks = async () => {
  const res = await handleRequest(API.get("/tasks/recent"));
  return res?.tasks || []; // return empty array if null
};

export const getTasksByUser = async (userId: string) => {
  const res = await handleRequest(API.get(`/tasks/user/${userId}`));
  return res?.tasks || []; // return empty array if null
};

export const getTasksCountByUser = async (userId: string) => {
  const res = await handleRequest(API.get(`/tasks/user/${userId}/count`));
  return res?.taskCount || 0; // return 0 if null
};
