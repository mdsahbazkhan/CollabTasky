import { API } from "@/src/lib/axios";

export const getProjects = async () => {
  const res = await API.get("/projects/myprojects");
  return res.data.projects;
};

export const getProjectById = async (projectId: string) => {
  const res = await API.get(`/projects/${projectId}`);
  return res.data.project;
};

export const createProject = async (projectData: any) => {
  const res = await API.post("/projects/create", projectData);
  return res.data.project;
};

export const updateProject = async (projectId: string, projectData: any) => {
  const res = await API.put(`/projects/${projectId}`, projectData);
  return res.data.project;
};
