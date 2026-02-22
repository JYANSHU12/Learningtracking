import api from './api';

export const feedbackService = {
  getFeedback: () => api.get('/feedback'),
  createFeedback: (data) => api.post('/feedback', data),
  getStudents: () => api.get('/feedback/students'),
  getStudentStats: (id) => api.get(`/feedback/students/${id}/stats`)
};
