import apiClient, { panApi } from '../../../shared/services/api';

export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const verifyPanApi = async (pan) => {
  const response = await panApi.post('/pan/verify', { pan });
  return response.data;
};

export const meApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const sendOtpApi = async (email) => {
  const response = await apiClient.post('/auth/send-otp', { email });
  return response.data;
};

export const verifyOtpApi = async (email, otp) => {
  const response = await apiClient.post('/auth/verify-otp', { email, otp });
  return response.data;
};
