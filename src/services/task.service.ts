import { API } from "@/src/lib/axios";

export const getTasksByProject = async (projectId: string) => {
  const res = await API.get(`/tasks/project/${projectId}`);
  return res.data.tasks;
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
  const res = await API.post("/tasks/create", taskData);
  return res.data.task;
};
export const getAllTask = async () => {
  const res = await API.get("/tasks/all");
  return res.data.tasks;
};

export const updateStatus = async (taskId: string, status: string) => {
  const res = await API.patch(`/tasks/${taskId}/status`, { status });
  return res.data.task;
};

export const updateTask=async(  taskId: string,
  taskData: Partial<CreateTaskData>
)=> {
  const res = await API.put(`/tasks/${taskId}`, taskData);
  return res.data.task;
}
export const deleteTask=async(taskId:string)=>{
  const res=await API.delete(`/tasks/${taskId}`)
  return res.data
}

export const getRecentTasks = async () => {
  const res = await API.get("/tasks/recent");
  return res.data.tasks;
};
