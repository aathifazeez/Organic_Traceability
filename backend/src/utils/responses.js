const { HTTP_STATUS } = require('../config/constants');

const successResponse = (res, message, data = null, statusCode = HTTP_STATUS.OK) => {
    const response = {
        success: true,
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

const errorResponse = (res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
    const response = {
        success: false,
        message,
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

/**
 * Validation error response
 */
const validationErrorResponse = (res, errors) => {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Validation failed',
        errors,
    });
};

/**
 * Paginated response
 */
const paginatedResponse = (res, message, data, pagination) => {
    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message,
        data,
        pagination: {
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            itemsPerPage: pagination.limit,
            hasNextPage: pagination.page < pagination.totalPages,
            hasPrevPage: pagination.page > 1,
        },
    });
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    paginatedResponse,
};