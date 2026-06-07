import axios from 'axios';

// Create an Axios instance
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Automatically append /api if it's missing from the environment variable
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}
if (!baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const api = axios.create({
  baseURL,
  withCredentials: true, // Crucial for sending/receiving HTTP-Only Cookies
});

// Response interceptor to handle token expiration / 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401 Unauthorized, dispatch a custom event
    // The authSlice or a top-level component can listen for this to clear state
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth_unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
