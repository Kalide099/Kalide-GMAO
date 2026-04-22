import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach JWT and Language
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('kgmao_token');
    const lang = localStorage.getItem('kgmao_language') || 'en';
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Pass the current locale to the backend for localized data fetching (name_en vs name_fr)
    config.headers['Accept-Language'] = lang;
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle Global Auth Errors securely
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        // Token expired or invalid, forcibly clear and eject to login
        localStorage.removeItem('kgmao_token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;
