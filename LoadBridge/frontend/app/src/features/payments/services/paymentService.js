import apiClient from '../../../shared/services/api';

export const createOrderApi = (payload) => {
  return apiClient.post('/payments/create-order', payload).then((response) => response.data);
};

export const verifyPaymentApi = (payload) => {
  return apiClient.post('/payments/verify', payload).then((response) => response.data);
};
