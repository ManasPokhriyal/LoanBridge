// API Service for Authentication (Login and Proxy Registration)
import apiClient from '../../../shared/services/api';

// 1. User Login API Call
export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// 2. Registration Step 1: Init Registration (Backend calls PAN verification & sends OTP)
export const registerInitApi = async (payload) => {
  const response = await apiClient.post('/auth/register-init', payload);
  return response.data;
};

// 3. Registration Step 2: Confirm OTP & Save User
export const registerConfirmApi = async (payload) => {
  const response = await apiClient.post('/auth/register-confirm', payload);
  return response.data;
};

// 4. Fetch Currently Logged-in User Profile
export const meApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

