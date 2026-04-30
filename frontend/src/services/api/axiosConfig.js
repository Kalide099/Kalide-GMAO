import axios from 'axios';

const api = axios.create({
    baseURL: 'https://kgmao.com/api/v1',
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

import { queueAction } from '../../utils/offlineSync';

// Response interceptor to handle Global Auth Errors and Offline Persistence
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    // Handle Network Errors (Offline)
    if (!error.response && !navigator.onLine) {
        if (['post', 'put', 'delete'].includes(originalRequest.method.toLowerCase())) {
            console.warn('📡 System Offline: Queuing transaction for later synchronization...');
            await queueAction(
                originalRequest.method.toUpperCase(), 
                originalRequest.url, 
                JSON.parse(originalRequest.data)
            );
            return Promise.resolve({ data: { success: true, message: 'Queued for offline sync' } });
        }
    }

    if (error.response && error.response.status === 401) {
        // Token expired or invalid, forcibly clear and eject to login
        localStorage.removeItem('kgmao_token');
        window.location.href = '/login';
    }

    // Enhance error object with backend message if available
    const errorMessage = error.response?.data?.message || error.message || 'Unknown Network Error';
    console.error('❌ API Error:', errorMessage);

    return Promise.reject(error);
});

export default api;
