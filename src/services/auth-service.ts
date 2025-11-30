import api from './api';
import { LoginCredentials, AuthResponse, User } from '../types';

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token.access_token);
    return response.data;
  },

  register: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/user/new', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/user/me');
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },
};

export default authService; 