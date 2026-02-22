import api from './api';

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleBlock: (id) => api.put(`/admin/users/${id}/block`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics')
};
