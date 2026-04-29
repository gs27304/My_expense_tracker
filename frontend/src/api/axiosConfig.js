import axios from 'axios';

const api = axios.create({
  // Vite exposes env variables using import.meta.env
  // We use VITE_API_URL to point to the backend server (either localhost or Railway)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
