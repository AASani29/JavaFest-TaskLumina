// event-service.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Replace with your backend API base URL

export const getEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/adminuser/event/events`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

export const addEvent = async (eventData) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
    const response = await axios.post(`${BASE_URL}/adminuser/event/add`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add event: ${error.message}`);
  }
};

// Add more methods as needed (e.g., updateEvent, deleteEvent)
