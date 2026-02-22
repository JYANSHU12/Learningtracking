import api from './api';

export const studyService = {
  getSessions: (params) => api.get('/study-sessions', { params }),
  createSession: (data) => api.post('/study-sessions', data),
  getAnalytics: () => api.get('/study-sessions/analytics')
};
