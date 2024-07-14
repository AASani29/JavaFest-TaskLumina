// src/user-service.js
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
