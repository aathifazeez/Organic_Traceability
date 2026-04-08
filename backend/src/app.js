const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const batchRoutes = require('./routes/batch.routes');
const certificateRoutes = require('./routes/certificate.routes');
const userRoutes = require('./routes/user.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const productRoutes = require('./routes/product.routes');
const qrRoutes = require('./routes/qr.routes');
const fileRoutes = require('./routes/file.routes');
const orderRoutes = require('./routes/order.routes');

const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Create Express app
const app = express();

// Trust proxy (for rate limiting behind proxy/load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// API routes (will be added in next phases)
const API_VERSION = process.env.API_VERSION || 'v1';

// Welcome route
app.get(`/api/${API_VERSION}`, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to OrganicTrace API',
        version: API_VERSION,
        documentation: `/api/${API_VERSION}/docs`,
    });
});

// Import routes here (will be added in next phases)
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/batches`, batchRoutes);
app.use(`/api/${API_VERSION}/certificates`, certificateRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/products`, productRoutes);
app.use(`/api/${API_VERSION}/qr`, qrRoutes);
app.use(`/api/${API_VERSION}/files`, fileRoutes);
app.use(`/api/${API_VERSION}/orders`, orderRoutes);
// app.use(`/api/${API_VERSION}/users`, require('./routes/user.routes'));
// ... more routes

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;