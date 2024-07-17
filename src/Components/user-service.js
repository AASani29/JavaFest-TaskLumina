import axios from "axios";
import { BASE_URL } from "./helper";

export const myAxios = axios.create({
  baseURL: BASE_URL
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
});

privateAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export const signUp = (user) => {
  return myAxios.post("/auth/register", user).then((res) => res.data);
};

export const loginUser = (loginDetails) => {
  return myAxios.post("/auth/login", loginDetails).then((res) => res.data);
};

export const addTask = (task) => {
  return privateAxios.post("/adminuser/task/add", task).then((res) => res.data);
};

export const getTasks = async (date = null) => {
  try {
    const token = localStorage.getItem("token");
    const url = date ? `/adminuser/task/tasks?date=${date}` : `/adminuser/task/tasks`;
    const response = await privateAxios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedTaskData) => {
  try {
    const response = await privateAxios.put(`/adminuser/task/update/${taskId}`, updatedTaskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await privateAxios.delete(`/adminuser/task/delete/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
