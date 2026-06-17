import axios from 'axios';
import { decodeJWT } from '../../utils/jwt';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach JWT and Language
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('kgmao_token');
    let lang = localStorage.getItem('kgmao_language') || 'en';
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        const decoded = decodeJWT(token);
        const preferred = decoded?.preferred_language;
        if (preferred === 'en' || preferred === 'fr') {
            lang = preferred;
            localStorage.setItem('kgmao_language', preferred);
        }
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
    const errorCode = error.response?.data?.error_code;
    const requestUrl = originalRequest?.url || '';

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

    const isMfaChallenge = errorCode === 'MFA_REQUIRED' || errorCode === 'MFA_INVALID';

    if (error.response && error.response.status === 401 && !isMfaChallenge) {
        const isAuthRequest = requestUrl.startsWith('/auth/');
        const isOptionalBackgroundRequest = requestUrl.startsWith('/notifications');

        if (!isAuthRequest && !isOptionalBackgroundRequest) {
            // Token expired or invalid, clear session and preserve intended route.
            localStorage.removeItem('kgmao_token');
            const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
            const loginRedirectUrl = `/login?redirect=${encodeURIComponent(currentPath || '/app')}`;
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = loginRedirectUrl;
            }
        }
    }

    // Enhance error object with backend message if available
    const errorMessage = error.response?.data?.message || error.message || 'Unknown Network Error';
    console.error('❌ API Error:', errorMessage);

    return Promise.reject(error);
});

export default api;
