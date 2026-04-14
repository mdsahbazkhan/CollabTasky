import { API } from "@/src/lib/axios";
import { handleRequest } from "../lib/utils";

export const getProjects = async () => {
  const res = await handleRequest(API.get("/projects/myprojects"));
  return res?.projects || []; // backend: { message, projects }
};

export const getProjectByIdAPI = async (projectId: string) => {
  const res = await handleRequest(API.get(`/projects/${projectId}`));
  return res || null; // backend: { message, project, role } — context needs role too
};

export const createProject = async (projectData: any) => {
  const res = await handleRequest(API.post("/projects/create", projectData));
  return res?.project || null; // backend: { message, project }
};

export const updateProject = async (projectId: string, projectData: any) => {
  const res = await handleRequest(API.put(`/projects/${projectId}`, projectData));
  return res?.project || null; // backend: { message, project }
};

export const addMember = async (
  projectId: string,
  userId: string,
  role: string,
) => {
  const res = await handleRequest(API.post(`/projects/${projectId}/members`, {
    userId,
    role,
  }));
  return res;
};

export const removeMember = async (projectId: string, userId: string) => {
  const res = await handleRequest(API.delete(`/projects/${projectId}/members/${userId}`));
  return res;
};

export const deleteMemberFromDB = async (userId: string) => {
  const res = await handleRequest(API.delete(`/projects/members/${userId}`));
  return res;
};

export const getProjectsCountByUser = async (userId: string) => {
  const res = await handleRequest(API.get(`/projects/user/${userId}/count`));
  return res?.projectCount || 0; // backend: { projectCount }
};

export const deleteProject = async (projectId: string) => {
  const res = await handleRequest(API.delete(`/projects/${projectId}`));
  return res;
};

export const changeMemberRole = async (
  projectId: string,
  memberId: string,
  role: string,
) => {
  const res = await handleRequest(API.patch(
    `/projects/${projectId}/members/${memberId}/role`,
    { role },
  ));
  return res;
};
