import apiClient from '../../../shared/services/api';

export const getCustomerDashboardApi = async () => {
  const response = await apiClient.get('/customer/dashboard');
  return response.data;
};

export const getUserApplicationsApi = async (userId) => {
  const response = await apiClient.get(`/applications/user/${userId}`);
  return response.data;
};

export const getUserLoanAccountsApi = async () => {
  const response = await apiClient.get('/loan-accounts/user');
  return response.data;
};

export const getEmiScheduleApi = async (loanAccountId) => {
  const response = await apiClient.get(`/loan-accounts/${loanAccountId}/emi-schedule`);
  return response.data;
};
