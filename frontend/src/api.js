const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get Firebase token for API calls
const getFirebaseToken = async () => {
  try {
    const { auth } = await import('./firebase');
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
  } catch (e) {}
  return localStorage.getItem('findoorr_token');
};

const authHeaders = async () => {
  const token = await getFirebaseToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const saveToken = (token) => localStorage.setItem('findoorr_token', token);
export const clearToken = () => localStorage.removeItem('findoorr_token');
export const getToken = () => localStorage.getItem('findoorr_token');

// AUTH
export const registerUser = async (data) => {
  const h = await authHeaders();
  return fetch(`${BASE_URL}/api/auth/register`, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(r => r.json());
};

export const loginUser = async (data) => {
  const h = await authHeaders();
  return fetch(`${BASE_URL}/api/auth/login`, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(r => r.json());
};

// PROFESSORS - public, no auth needed
export const getAllProfessors = () =>
  fetch(`${BASE_URL}/api/professors`).then(r => r.json());

export const getProfessorById = (id) =>
  fetch(`${BASE_URL}/api/professors/${id}`).then(r => r.json());

// MEETINGS - needs auth via backend token
export const requestMeeting = async (data) => {
  const token = getToken();
  if (!token) return { message: 'Not authenticated' };
  return fetch(`${BASE_URL}/api/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json());
};

export const getMeetings = async () => {
  const token = getToken();
  if (!token) return [];
  return fetch(`${BASE_URL}/api/meetings`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
};

export const updateMeetingStatus = async (id, data) => {
  const token = getToken();
  if (!token) return { message: 'Not authenticated' };
  return fetch(`${BASE_URL}/api/meetings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json());
};

// NOTIFICATIONS
export const getNotifications = async () => {
  const token = getToken();
  if (!token) return [];
  return fetch(`${BASE_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
};

export const markNotificationRead = async (id) => {
  const token = getToken();
  if (!token) return {};
  return fetch(`${BASE_URL}/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
};