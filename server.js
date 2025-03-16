const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { redisClient, connectRedis } = require('./config/redis');
const errorHandler = require('./controllers/middleware/errorHandler');

require('dotenv').config();

const app = express();

// Enhanced security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));

// CORS configuration (since frontend is served from same origin)
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5000', // Same origin
            'http://127.0.0.1:5500'  // Live Server
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        redis: redisClient.isReady ? 'connected' : 'disconnected'
    });
});

// Routes
app.use('/api/todos', require('./routes/todoRoutes'));

// Error handling
app.use(errorHandler);

// Start server only after connections are established
const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        await connectRedis(); // Connect to Redis

        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log('🔻 Shutting down gracefully...');
            await redisClient.quit();
            server.close(() => {
                console.log('💤 Server exited');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        process.on('unhandledRejection', (err) => {
            console.error('❌ Unhandled Rejection:', err);
            shutdown();
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();