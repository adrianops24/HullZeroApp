import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8002',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
