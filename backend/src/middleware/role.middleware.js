const { errorResponse } = require('../utils/responses');
const { HTTP_STATUS, USER_ROLES } = require('../config/constants');

/**
 * Check if user has required role(s)
 * @param {string|string[]} roles - Required role(s)
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(
                res,
                'Authentication required',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                'You do not have permission to access this resource',
                HTTP_STATUS.FORBIDDEN
            );
        }

        next();
    };
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return errorResponse(
            res,
            'Authentication required',
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    if (req.user.role !== USER_ROLES.ADMIN) {
        return errorResponse(
            res,
            'Admin access required',
            HTTP_STATUS.FORBIDDEN
        );
    }

    next();
};

/**
 * Check if user is supplier
 */
const isSupplier = (req, res, next) => {
    if (!req.user) {
        return errorResponse(
            res,
            'Authentication required',
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    if (req.user.role !== USER_ROLES.SUPPLIER) {
        return errorResponse(
            res,
            'Supplier access required',
            HTTP_STATUS.FORBIDDEN
        );
    }

    next();
};

/**
 * Check if user owns the resource or is admin
 */
const isOwnerOrAdmin = (resourceField = 'supplier') => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(
                res,
                'Authentication required',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Admin can access everything
        if (req.user.role === USER_ROLES.ADMIN) {
            return next();
        }

        // Check ownership
        const resourceOwnerId = req[resourceField] || req.body[resourceField];

        if (!resourceOwnerId || resourceOwnerId.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You can only access your own resources',
                HTTP_STATUS.FORBIDDEN
            );
        }

        next();
    };
};

module.exports = {
    authorize,
    isAdmin,
    isSupplier,
    isOwnerOrAdmin,
};