import apiClient from '../../../shared/services/api';

export const getLoanOffersApi = () => {
  return apiClient.get('/loan-offers').then((response) => response.data);
};

export const getLoanOfferApi = (id) => {
  return apiClient.get(`/loan-offers/${id}`).then((response) => response.data);
};

export const applyLoanApi = (payload) => {
  return apiClient.post('/applications', payload).then((response) => response.data);
};
