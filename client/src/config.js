// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || '';

// Helper function to get full API endpoint
export const getApiUrl = (endpoint) => {
  if (!API_URL) return endpoint;
  if (API_URL.startsWith(':')) {
    return `http://localhost${API_URL}${endpoint}`;
  }
  if (API_URL.startsWith('http://') || API_URL.startsWith('https://') || API_URL.startsWith('/')) {
    return `${API_URL}${endpoint}`;
  }
  return `http://${API_URL}${endpoint}`;
};

