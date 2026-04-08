const { HTTP_STATUS } = require('../config/constants');
const { errorResponse } = require('../utils/responses');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return errorResponse(res, 'Validation Error', HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return errorResponse(res, `${field} already exists`, HTTP_STATUS.CONFLICT);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return errorResponse(res, 'Invalid ID format', HTTP_STATUS.BAD_REQUEST);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(res, 'File size too large', HTTP_STATUS.BAD_REQUEST);
        }
        return errorResponse(res, err.message, HTTP_STATUS.BAD_REQUEST);
    }

    // Default error
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    return errorResponse(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return errorResponse(
        res,
        `Route ${req.originalUrl} not found`,
        HTTP_STATUS.NOT_FOUND
    );
};

module.exports = {
    errorHandler,
    notFoundHandler,
};