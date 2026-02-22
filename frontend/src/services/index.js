import api from './api';

// Goals
export const goalsService = {
  getAll: (params) => api.get('/goals', { params }),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`)
};

// Study Sessions
export const sessionsService = {
  getAll: (params) => api.get('/study-sessions', { params }),
  create: (data) => api.post('/study-sessions', data),
  delete: (id) => api.delete(`/study-sessions/${id}`)
};

// Feedback
export const feedbackService = {
  getAll: (params) => api.get('/feedback', { params }),
  create: (data) => api.post('/feedback', data)
};

// Analytics
export const analyticsService = {
  getStudentAnalytics: () => api.get('/analytics/student'),
  getAdminAnalytics: () => api.get('/analytics/admin')
};

// Users
export const usersService = {
  getAll: (params) => api.get('/users', { params }),
  getStudents: () => api.get('/users/students'),
  getStudentDetail: (id) => api.get(`/users/students/${id}`),
  toggleBlock: (id) => api.put(`/users/${id}/toggle-block`),
  delete: (id) => api.delete(`/users/${id}`)
};
