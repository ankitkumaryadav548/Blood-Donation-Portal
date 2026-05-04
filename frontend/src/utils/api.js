import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000, // 20 seconds timeout
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Donor API calls
export const donorAPI = {
  getAllDonors: (filters) => api.get('/donors', { params: filters }),
  createDonor: (donorData) => api.post('/donors', donorData),
  getDonorProfile: () => api.get('/donors/profile'),
  updateDonorProfile: (profileData) => api.put('/donors/profile', profileData),
  updateAvailability: (data) => api.put('/donors/availability', data),
  getDonationHistory: () => api.get('/donors/history'),
};

// Request API calls
export const requestAPI = {
  getAllRequests: (filters) => api.get('/requests', { params: filters }),
  createRequest: (requestData) => api.post('/requests', requestData),
  getRequest: (id) => api.get(`/requests/${id}`),
  getUserRequests: () => api.get('/requests/user/my-requests'),
  updateRequestStatus: (id, status, fulfilledBy) => api.put(`/requests/${id}/status`, { status, fulfilledBy }),
  searchMatchingDonors: (filters) => api.get('/requests/search/donors', { params: filters }),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserBlock: (id) => api.put(`/admin/users/${id}/toggle-block`),
  getAnalytics: () => api.get('/admin/analytics'),
  manageRequest: (requestId, data) => api.put(`/admin/requests/${requestId}`, data),
  getAllDonors: (params) => api.get('/admin/donors', { params }),
  getAllRecipients: () => api.get('/admin/recipients'),
  getAllRequests: () => api.get('/admin/requests'),
};

// Report API calls
export const reportAPI = {
  createReport: (data) => api.post('/reports', data),
  getAllReports: () => api.get('/reports'),
  updateReportStatus: (id, status) => api.put(`/reports/${id}`, { status }),
};

export default api;
