import { API } from "../lib/axios";

export const loginUser = async (data: any) => {
  const res = await API.post("/users/login", data);
  return res.data;
};
export const signupUser = async (data: any) => {
  const res = await API.post("/users/register", data);
  return res.data;
};
