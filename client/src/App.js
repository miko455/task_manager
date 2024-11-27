const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getApiUrl = (endpoint) => {
  return `${API_URL}/api${endpoint}`;
};

export const getHeaders = (isAuthenticated = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (isAuthenticated) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

