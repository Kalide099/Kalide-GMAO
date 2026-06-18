import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
    if (socket) {
        socket.disconnect();
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    // Remove /api/v1 if present in VITE_API_URL to get the base domain for socket
    const baseUrl = apiUrl.replace('/api/v1', '');

    socket = io(baseUrl, {
        auth: {
            token
        }
    });

    socket.on('connect', () => {
        console.log('✅ Connected to real-time telemetry stream');
    });

    socket.on('disconnect', () => {
        console.warn('❌ Disconnected from real-time stream');
    });

    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
    });

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
