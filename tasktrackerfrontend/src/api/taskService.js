// src/api.js
import axios from "axios";

/* ================= BASE URL ================= */
// Production backend URL (deployed)
const api = axios.create({
  baseURL: "https://fullstack-task-tracker-app-5.onrender.com/api",
});

/* ================= JWT INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= AUTH ENDPOINTS ================= */
// Signup / Login (no token needed)
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

/* ================= TASKS ENDPOINTS ================= */
export const getAllTasks = (page = 0, size = 5) =>
  api.get("/tasks", { params: { page, size } });

export const getTasks = (params) =>
  api.get("/tasks", { params });

export const createTask = (task) =>
  api.post("/tasks", task);

export const updateTask = (id, task) =>
  api.put(`/tasks/${id}`, task);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

/* ================= PROGRESS ENDPOINTS ================= */
export const getWeeklyProgress = () =>
  api.get("/tasks/progress/weekly");

export const getMonthlyProgress = () =>
  api.get("/tasks/progress/monthly");

export default api;