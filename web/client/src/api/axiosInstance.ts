import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle Token Expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("/auth/login")
    ) {
      // Clear storage and redirect to login if token is invalid/expired
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
