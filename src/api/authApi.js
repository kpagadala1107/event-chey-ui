import axiosClient from './axiosClient';

export const authApi = {
  // Google OAuth login
  googleLogin: async (credential) => {
    const response = await axiosClient.post('/auth/google', { credential });
    return response.data;
  },

  // Facebook OAuth login
  facebookLogin: async (accessToken) => {
    const response = await axiosClient.post('/auth/facebook', { accessToken });
    return response.data;
  },

  // Regular email/password login (if needed)
  login: async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },
};

export default authApi;
