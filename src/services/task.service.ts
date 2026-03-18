import { API } from "@/src/lib/axios";

export const getTasksByProject = async (projectId: string) => {
  const res = await API.get(`/tasks/project/${projectId}`);
  return res.data;
};