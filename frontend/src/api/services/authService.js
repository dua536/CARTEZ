import { apiClient } from '../client';

export const authService = {
  signIn: (payload) => apiClient.post('/auth/login', payload),
  register: (payload) => apiClient.post('/auth/register', payload),
  me: () => apiClient.get('/auth/me'),
};
