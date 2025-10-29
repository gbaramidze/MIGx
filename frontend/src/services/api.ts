import axios from 'axios';
import { Participant, Metrics } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
      console.log(`API Call: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.error || error.message;
      console.error('API Error:', message);
      return Promise.reject(new Error(message));
    }
);

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  authToken = null;
  delete api.defaults.headers.common['Authorization'];
};

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/token', { username, password });
    return response.data;
  },
};

export const participantsAPI = {
  getParticipants: async (): Promise<Participant[]> => {
    const response = await api.get('/participants/');
    return response.data;
  },

  getParticipant: async (id: string): Promise<Participant> => {
    const response = await api.get(`/participants/${id}`);
    return response.data;
  },

  createParticipant: async (participant: Omit<Participant, 'participant_id'>): Promise<Participant> => {
    const response = await api.post('/participants/', participant);
    return response.data;
  },

  updateParticipant: async (id: string, participant: Partial<Participant>): Promise<Participant> => {
    const response = await api.put(`/participants/${id}`, participant);
    return response.data;
  },

  deleteParticipant: async (id: string): Promise<void> => {
    await api.delete(`/participants/${id}`);
  },
};

export const metricsAPI = {
  getMetrics: async (): Promise<Metrics> => {
    const response = await api.get('/metrics/');
    return response.data;
  },
};