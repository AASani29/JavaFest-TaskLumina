import axios from 'axios';
import { BASE_URL } from './helper';

export const myAxios = axios.create({
  baseURL: BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
});

privateAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export const getEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await myAxios.get('/adminuser/event/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Events fetched:', response.data); // Log fetched events
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const addEvent = (eventData) => {
  return privateAxios.post("/adminuser/event/add", eventData).then((res) => res.data);
};
