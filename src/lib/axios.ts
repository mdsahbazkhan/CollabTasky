import axios from "axios";

export const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, //  backend URL
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

API.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    console.log("API Error:", error.response?.data || error.message);

    // ✅ Handle Unauthorized (401)
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0"; // clear cookie so middleware redirects too
        window.location.href = "/login"; // redirect user
      }
    }

    // ✅ Handle Server Error
    if (status === 500) {
      console.error("Server error, please try again later");
    }

    // ✅ Handle Network Error
    if (!error.response) {
      console.error("Network error, check your internet");
    }

    return Promise.reject(error);
  },
);
