const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { getEnv } = require('./env');
const logger = require('./logger');

let io;

exports.initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: '*', // Adjust this for production
            methods: ['GET', 'POST']
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        jwt.verify(token, getEnv('JWT_SECRET', 'dev_secret_key_change_me'), (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
            
            // Attach user details to socket
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', (socket) => {
        logger.info(`Socket connected: ${socket.id} (Company: ${socket.user.company_id})`);

        // Join a room specific to the user's company to broadcast tenant-specific events
        if (socket.user.company_id) {
            socket.join(`company_${socket.user.company_id}`);
        }

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

exports.getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

exports.broadcastToCompany = (companyId, eventName, data) => {
    if (!io) return;
    io.to(`company_${companyId}`).emit(eventName, data);
};
