import { API } from "@/src/lib/axios";

export const getProjects = async () => {
  const res = await API.get("/projects/myprojects");
  return res.data.projects;
};

export const getProjectByIdAPI = async (projectId: string) => {
  const res = await API.get(`/projects/${projectId}`);
  return res.data;
};

export const createProject = async (projectData: any) => {
  const res = await API.post("/projects/create", projectData);
  return res.data.project;
};

export const updateProject = async (projectId: string, projectData: any) => {
  const res = await API.put(`/projects/${projectId}`, projectData);
  return res.data.project;
};

export const addMember = async (
  projectId: string,
  userId: string,
  role: string,
) => {
  const res = await API.post(`/projects/${projectId}/members`, {
    userId,
    role,
  });
  return res.data;
};
export const removeMember = async (projectId: string, userId: string) => {
  const res = await API.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};

export const deleteMemberFromDB = async (userId: string) => {
  const res = await API.delete(`/projects/members/${userId}`);
  return res.data;
};

export const getProjectsCountByUser = async (userId: string) => {
  const res = await API.get(`/projects/user/${userId}/count`);
  return res.data.projectCount;
};
export const deleteProject = async (projectId: string) => {
  const res = await API.delete(`/projects/${projectId}`);
  return res.data;
};

export const changeMemberRole = async (
  projectId: string,
  memberId: string,
  role: string,
) => {
  const res = await API.patch(
    `/projects/${projectId}/members/${memberId}/role`,
    { role },
  );
  return res.data;
};
