const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}/api${endpoint}`;
};

export const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

