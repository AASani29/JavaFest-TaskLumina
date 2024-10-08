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

export const getAchievements = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/adminuser/task/achievements', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTaskProgress = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/adminuser/task/progress', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProgress = async (progressData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put('/adminuser/task/progress', progressData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyRewards = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await privateAxios.get('/adminuser/task/reward/name');
    console.log('Fetched rewards:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rewards:', error);
    throw error;
  }
};

export const markRewardAsNotified = async (rewardId) => {
  try {
    const token = localStorage.getItem('token');
    await privateAxios.put(`/adminuser/task/reward/${rewardId}/notified`);
  } catch (error) {
    console.error('Failed to mark reward as notified:', error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await privateAxios.get('/adminuser/task/reward/notifications');
    return response.data;
  } catch (error) {
    console.error('Failed to load notifications', error);
    throw error;
  }
};

// In your service file (e.g., user-service.js)

export const getReminders = async () => {
  try {
    const response = await privateAxios.get('/adminuser/reminders');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reminders:", error);
    throw error;
  }
};

export const markReminderAsNotified = async (reminderId) => {
  try {
    await privateAxios.put(`/adminuser/reminders/${reminderId}/notified`);
  } catch (error) {
    console.error('Failed to mark reminder as notified:', error);
    throw error;
  }
};


export const generateRoutine = async ({ tasks, timeRange }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await privateAxios.post("/adminuser/routine/generate", {
      timeRange,
      tasks
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Ensure the response contains scheduledTasks and failedTasks
    return {
      scheduledTasks: response.data.scheduledTasks || [],
      failedTasks: response.data.failedTasks || []
    };
  } catch (error) {
    console.error("Error generating routine:", error);
    throw error;
  }
};




