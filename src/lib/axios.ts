import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, //  backend URL
});

// attach token automatically
API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});
