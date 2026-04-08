module.exports = {
    // User Roles
    USER_ROLES: {
        SUPPLIER: 'supplier',
        ADMIN: 'admin',
    },

    // Account Status
    ACCOUNT_STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        SUSPENDED: 'suspended',
    },

    // Batch Status
    BATCH_STATUS: {
        ACTIVE: 'active',
        PENDING: 'pending',
        EXPIRED: 'expired',
        DEPLETED: 'depleted',
    },

    // Order Status
    ORDER_STATUS: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        SHIPPED: 'shipped',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled',
    },

    // Certificate Types
    CERTIFICATE_TYPES: [
        'USDA Organic',
        'EU Organic',
        'Ecocert',
        'Fair Trade',
        'Cosmos Organic',
        'Non-GMO Project',
        'Leaping Bunny',
        'Vegan Society',
        'Soil Association',
    ],

    // Product Categories
    PRODUCT_CATEGORIES: [
        'face-cream',
        'serum',
        'face-mask',
        'cleanser',
        'moisturizer',
        'toner',
        'eye-cream',
        'sunscreen',
        'night-cream',
        'exfoliator',
    ],

    // Skin Types
    SKIN_TYPES: [
        'all',
        'dry',
        'oily',
        'combination',
        'sensitive',
        'normal',
        'acne-prone',
    ],

    // File Upload Limits
    FILE_UPLOAD: {
        MAX_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: {
            IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
            DOCUMENTS: ['application/pdf', 'image/jpeg', 'image/png'],
        },
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },

    // HTTP Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500,
    },

};

