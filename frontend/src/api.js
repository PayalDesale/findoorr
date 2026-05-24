const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('findoorr_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

// AUTH
export const registerUser = (data) =>
  fetch(`${BASE_URL}/api/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const loginUser = (data) =>
  fetch(`${BASE_URL}/api/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const getProfile = () =>
  fetch(`${BASE_URL}/api/auth/profile`, { headers: headers() }).then(r => r.json());

// PROFESSORS
export const getAllProfessors = () =>
  fetch(`${BASE_URL}/api/professors`, { headers: headers() }).then(r => r.json());

export const getProfessorById = (id) =>
  fetch(`${BASE_URL}/api/professors/${id}`, { headers: headers() }).then(r => r.json());

export const updateAvailability = (data) =>
  fetch(`${BASE_URL}/api/professors/availability`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// MEETINGS
export const requestMeeting = (data) =>
  fetch(`${BASE_URL}/api/meetings`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const getMeetings = () =>
  fetch(`${BASE_URL}/api/meetings`, { headers: headers() }).then(r => r.json());

export const updateMeetingStatus = (id, data) =>
  fetch(`${BASE_URL}/api/meetings/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// NOTIFICATIONS
export const getNotifications = () =>
  fetch(`${BASE_URL}/api/notifications`, { headers: headers() }).then(r => r.json());

export const markNotificationRead = (id) =>
  fetch(`${BASE_URL}/api/notifications/${id}/read`, { method: 'PUT', headers: headers() }).then(r => r.json());

// Save token after login/register
export const saveToken = (token) => localStorage.setItem('findoorr_token', token);
export const clearToken = () => localStorage.removeItem('findoorr_token');
export const isLoggedIn = () => !!getToken();
