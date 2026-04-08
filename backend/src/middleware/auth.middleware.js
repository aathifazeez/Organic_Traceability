const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorResponse } = require('../utils/responses');
const { HTTP_STATUS } = require('../config/constants');
const jwtConfig = require('../config/jwt');

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(
                res,
                'No token provided. Please login.',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, jwtConfig.secret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return errorResponse(
                    res,
                    'Token expired. Please login again.',
                    HTTP_STATUS.UNAUTHORIZED
                );
            }
            return errorResponse(
                res,
                'Invalid token. Please login again.',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found. Please login again.',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Check if user is active
        if (user.status !== 'approved') {
            return errorResponse(
                res,
                'Your account is not active. Please contact support.',
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (user.isDeleted) {
            return errorResponse(
                res,
                'This account has been deleted.',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Update last activity
        user.updateLastActivity();

        // Attach user to request
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return errorResponse(
            res,
            'Authentication failed',
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, jwtConfig.secret);
            const user = await User.findById(decoded.id);

            if (user && user.status === 'approved' && !user.isDeleted) {
                req.user = user;
                req.token = token;
            }
        } catch (error) {
            // Silently fail for optional auth
            console.log('Optional auth failed:', error.message);
        }

        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuth,
};