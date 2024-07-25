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
    const response = await myAxios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Tasks fetched:', response.data);
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

export const getMyProfile = async () => {
  try {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    if (!token) {
      throw new Error('User is not authenticated'); // Handle unauthenticated scenario
    }

    const response = await axios.get(`${BASE_URL}/adminuser/task/profile`, {
      headers: {
        Authorization: `Bearer ${token}` // Pass JWT token in the Authorization header
      }
    });
    
    return response.data; // Assuming your backend returns data in a structured format

  } catch (error) {
    throw error; // Rethrow the error to handle it in the calling component
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await privateAxios.put(`/adminuser/task/complete/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getAchievements = async () => {
    const token = localStorage.getItem('token'); // Ensure the token is stored correctly
    const response = await axios.get('/adminuser/task/achievements', {
        headers: {
            'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        }
    });
    return response.data;
};



