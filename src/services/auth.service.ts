import { API } from "../lib/axios";
import { handleRequest } from "../lib/utils";

export const loginUser = async (data: any) => {
  const res = await handleRequest(API.post("/users/login", data));
  return res;
};
export const signupUser = async (data: any) => {
  const res = await handleRequest(API.post("/users/register", data));
  return res;
};
export const getAllUsers = async () => {
  const res = await handleRequest(API.get("/users/all"));
  return res?.users || []; // return empty array if null
};
export const getMe = async () => {
  const res = await handleRequest(API.get("/users/me"));
  return res || null; // backend returns user object directly
};
