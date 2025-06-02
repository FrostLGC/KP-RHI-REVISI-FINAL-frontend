import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Only redirect to login for 401 errors that are NOT from the login endpoint
      if (error.response.status === 401) {
        const isLoginRequest =
          error.config?.url?.includes("/auth/login") ||
          error.config?.url?.includes("/login");

        // Only redirect if it's not a login request and user has a token (meaning they were authenticated before)
        if (!isLoginRequest && localStorage.getItem("token")) {
          // Clear the invalid token
          localStorage.removeItem("token");
          // Redirect to login page
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
