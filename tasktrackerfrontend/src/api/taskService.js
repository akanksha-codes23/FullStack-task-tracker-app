import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

/* TOKEN HEADER */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/* ================= GET ALL TASKS ================= */
export const getAllTasks = async (page = 0, size = 5) => {
  const response = await axios.get(API_URL, {
    ...getAuthHeader(),
    params: { page, size }
  });
  return response.data;
};

/* ================= SEARCH / FILTER TASKS ================= */
export const getTasks = (params) => {
  return axios.get(API_URL, {
    ...getAuthHeader(),
    params
  });
};

/* ================= CREATE ================= */
export const createTask = (task) => {
  return axios.post(API_URL, task, getAuthHeader());
};

/* ================= UPDATE ================= */
export const updateTask = (id, task) => {
  return axios.put(`${API_URL}/${id}`, task, getAuthHeader());
};

/* ================= DELETE ================= */
export const deleteTask = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};

/* ================= PROGRESS ================= */
export const getWeeklyProgress = () =>
  axios.get(`${API_URL}/progress/weekly`, getAuthHeader());

export const getMonthlyProgress = () =>
  axios.get(`${API_URL}/progress/monthly`, getAuthHeader());