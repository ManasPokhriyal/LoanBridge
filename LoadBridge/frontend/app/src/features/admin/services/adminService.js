import apiClient from '../../../shared/services/api';

export const getAdminDashboardApi = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const getAdminApplicationsApi = async () => {
  const response = await apiClient.get('/applications/admin/all');
  return response.data;
};

export const getAdminLoanAccountsApi = async () => {
  const response = await apiClient.get('/loan-accounts/admin/all');
  return response.data;
};

export const approveApplicationApi = async (id) => {
  const response = await apiClient.put(`/applications/admin/${id}/approve`);
  return response.data;
};

export const rejectApplicationApi = async (id, reason) => {
  const response = await apiClient.put(`/applications/admin/${id}/reject`, { reason });
  return response.data;
};
