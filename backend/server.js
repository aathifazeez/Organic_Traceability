require('dotenv').config();
const appModule = require('./src/app.js');
const connectDB = require('./src/config/database');
const { initScheduledJobs } = require('./src/services/scheduledJobs');

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const appCandidates = [
    appModule,
    appModule?.default,
    appModule?.app,
    appModule?.default?.app,
    appModule?.default?.default,
];
const app = appCandidates.find((candidate) => candidate && typeof candidate.listen === 'function');

if (!app || typeof app.listen !== 'function') {
    throw new TypeError(
        `Invalid Express app export from ./src/app.js. Received: ${typeof appModule}`
    );
}

// Connect to MongoDB
connectDB();

// Initialize scheduled jobs
if (process.env.NODE_ENV !== 'test') {
    initScheduledJobs();
}

// Start server
const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 OrganicTrace Backend Server');
    console.log('=================================');
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log('=================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Closing server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});