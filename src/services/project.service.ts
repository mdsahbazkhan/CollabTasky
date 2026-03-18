import { API } from "@/src/lib/axios";

export const getProjects = async () => {
  const res = await API.get("/projects/myprojects");
  return res.data.projects;
};
