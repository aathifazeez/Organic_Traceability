const { body, param, query } = require('express-validator');

/**
 * Registration validation
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('companyName')
        .trim()
        .notEmpty()
        .withMessage('Company name is required')
        .isLength({ max: 200 })
        .withMessage('Company name cannot exceed 200 characters'),

    body('companyInfo')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Company info cannot exceed 1000 characters'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),
];

/**
 * Login validation
 */
const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

/**
 * Refresh token validation
 */
const refreshTokenValidation = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required'),
];

/**
 * Update profile validation
 */
const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),

    body('companyName')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Company name cannot exceed 200 characters'),

    body('companyInfo')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Company info cannot exceed 1000 characters'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),

    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Please provide a valid URL'),
];

/**
 * Change password validation
 */
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
];

/**
 * Forgot password validation
 */
const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
];

/**
 * Reset password validation
 */
const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),

    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

/**
 * MongoDB ObjectId validation
 */
const mongoIdValidation = (paramName = 'id') => [
    param(paramName)
        .notEmpty()
        .withMessage(`${paramName} is required`)
        .isMongoId()
        .withMessage(`Invalid ${paramName} format`),
];

/**
 * Create batch validation
 */
const createBatchValidation = [
    body('ingredientName')
        .trim()
        .notEmpty()
        .withMessage('Ingredient name is required')
        .isLength({ max: 200 })
        .withMessage('Ingredient name cannot exceed 200 characters'),

    body('quantity.value')
        .notEmpty()
        .withMessage('Quantity value is required')
        .isNumeric()
        .withMessage('Quantity value must be a number')
        .custom(value => value > 0)
        .withMessage('Quantity must be greater than 0'),

    body('quantity.unit')
        .notEmpty()
        .withMessage('Quantity unit is required')
        .isIn(['ml', 'L', 'g', 'kg', 'oz', 'lb'])
        .withMessage('Invalid quantity unit'),

    body('origin.country')
        .trim()
        .notEmpty()
        .withMessage('Origin country is required'),

    body('harvestDate')
        .notEmpty()
        .withMessage('Harvest date is required')
        .isISO8601()
        .withMessage('Invalid harvest date format'),

    body('manufacturingDate')
        .notEmpty()
        .withMessage('Manufacturing date is required')
        .isISO8601()
        .withMessage('Invalid manufacturing date format'),

    body('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Invalid expiry date format')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.manufacturingDate)) {
                throw new Error('Expiry date must be after manufacturing date');
            }
            return true;
        }),

    body('unitPrice')
        .optional()
        .isNumeric()
        .withMessage('Unit price must be a number')
        .custom(value => value >= 0)
        .withMessage('Unit price cannot be negative'),

    body('purity')
        .optional()
        .isNumeric()
        .withMessage('Purity must be a number')
        .custom(value => value >= 0 && value <= 100)
        .withMessage('Purity must be between 0 and 100'),
];

/**
 * Update batch validation
 */
const updateBatchValidation = [
    body('ingredientName')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Ingredient name cannot exceed 200 characters'),

    body('quantity.value')
        .optional()
        .isNumeric()
        .withMessage('Quantity value must be a number')
        .custom(value => value > 0)
        .withMessage('Quantity must be greater than 0'),

    body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid expiry date format'),

    body('unitPrice')
        .optional()
        .isNumeric()
        .withMessage('Unit price must be a number')
        .custom(value => value >= 0)
        .withMessage('Unit price cannot be negative'),
];

/**
 * Upload certificate validation
 */
const uploadCertificateValidation = [
    body('certificateType')
        .trim()
        .notEmpty()
        .withMessage('Certificate type is required'),

    body('certificateName')
        .trim()
        .notEmpty()
        .withMessage('Certificate name is required')
        .isLength({ max: 200 })
        .withMessage('Certificate name cannot exceed 200 characters'),

    body('issuingAuthority')
        .trim()
        .notEmpty()
        .withMessage('Issuing authority is required'),

    body('issueDate')
        .notEmpty()
        .withMessage('Issue date is required')
        .isISO8601()
        .withMessage('Invalid issue date format'),

    body('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Invalid expiry date format')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.issueDate)) {
                throw new Error('Expiry date must be after issue date');
            }
            return true;
        }),
];

/**
 * Update user validation (admin)
 */
const updateUserValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),

    body('status')
        .optional()
        .isIn(['pending', 'approved', 'rejected', 'suspended'])
        .withMessage('Invalid status'),
];

/**
 * Reject user validation
 */
const rejectUserValidation = [
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Rejection reason is required')
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters'),
];

/**
 * Suspend user validation
 */
const suspendUserValidation = [
    body('reason')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters'),
];

/**
 * Create product batch validation
 */
const createProductBatchValidation = [
    body('productName')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 200 })
        .withMessage('Product name cannot exceed 200 characters'),

    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn([
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
        ])
        .withMessage('Invalid category'),

    body('skinType')
        .notEmpty()
        .withMessage('Skin type is required')
        .isIn(['all', 'dry', 'oily', 'combination', 'sensitive', 'normal', 'acne-prone'])
        .withMessage('Invalid skin type'),

    body('shortDescription')
        .trim()
        .notEmpty()
        .withMessage('Short description is required')
        .isLength({ max: 200 })
        .withMessage('Short description cannot exceed 200 characters'),

    body('ingredients')
        .isArray({ min: 1 })
        .withMessage('At least one ingredient is required'),

    body('ingredients.*.ingredientBatch')
        .notEmpty()
        .withMessage('Ingredient batch ID is required')
        .isMongoId()
        .withMessage('Invalid ingredient batch ID'),

    body('ingredients.*.quantityUsed.value')
        .notEmpty()
        .withMessage('Quantity value is required')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .custom(value => value > 0)
        .withMessage('Quantity must be greater than 0'),

    body('ingredients.*.quantityUsed.unit')
        .notEmpty()
        .withMessage('Quantity unit is required')
        .isIn(['ml', 'L', 'g', 'kg', 'oz', 'lb'])
        .withMessage('Invalid quantity unit'),

    body('productionDate')
        .notEmpty()
        .withMessage('Production date is required')
        .isISO8601()
        .withMessage('Invalid production date format'),

    body('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Invalid expiry date format')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.productionDate)) {
                throw new Error('Expiry date must be after production date');
            }
            return true;
        }),

    body('totalUnits')
        .notEmpty()
        .withMessage('Total units is required')
        .isInt({ min: 1 })
        .withMessage('Total units must be at least 1'),

    body('unitSize.value')
        .notEmpty()
        .withMessage('Unit size value is required')
        .isNumeric()
        .withMessage('Unit size must be a number')
        .custom(value => value > 0)
        .withMessage('Unit size must be greater than 0'),

    body('unitSize.unit')
        .notEmpty()
        .withMessage('Unit size unit is required')
        .isIn(['ml', 'g', 'oz'])
        .withMessage('Invalid unit size unit'),

    body('retailPrice')
        .notEmpty()
        .withMessage('Retail price is required')
        .isNumeric()
        .withMessage('Price must be a number')
        .custom(value => value >= 0)
        .withMessage('Price cannot be negative'),

    body('manufacturingCost')
        .optional()
        .isNumeric()
        .withMessage('Manufacturing cost must be a number')
        .custom(value => value >= 0)
        .withMessage('Cost cannot be negative'),
];

/**
 * Update product batch validation
 */
const updateProductBatchValidation = [
    body('productName')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Product name cannot exceed 200 characters'),

    body('shortDescription')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Short description cannot exceed 200 characters'),

    body('retailPrice')
        .optional()
        .isNumeric()
        .withMessage('Price must be a number')
        .custom(value => value >= 0)
        .withMessage('Price cannot be negative'),

    body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid expiry date format'),
];

/**
 * Create order validation
 */
const createOrderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),

    body('items.*.productBatch')
        .notEmpty()
        .withMessage('Product batch ID is required')
        .isMongoId()
        .withMessage('Invalid product batch ID'),

    body('items.*.quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('customerInfo.name')
        .trim()
        .notEmpty()
        .withMessage('Customer name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),

    body('customerInfo.email')
        .trim()
        .notEmpty()
        .withMessage('Customer email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('customerInfo.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),

    body('shippingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),

    body('shippingAddress.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),

    body('shippingAddress.postalCode')
        .trim()
        .notEmpty()
        .withMessage('Postal code is required'),

    body('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cash-on-delivery'])
        .withMessage('Invalid payment method'),
];

/**
 * Update order status validation
 */
const updateOrderStatusValidation = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),

    body('trackingNumber')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Tracking number cannot exceed 100 characters'),
];

/**
 * Cancel order validation
 */
const cancelOrderValidation = [
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Cancellation reason is required')
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters'),
];


module.exports = {
    registerValidation,
    loginValidation,
    refreshTokenValidation,
    updateProfileValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    mongoIdValidation,
    createBatchValidation,
    updateBatchValidation,
    uploadCertificateValidation,
    updateUserValidation,
    rejectUserValidation,
    suspendUserValidation,
    createProductBatchValidation,
    updateProductBatchValidation,
    createOrderValidation,
    updateOrderStatusValidation,
    cancelOrderValidation,
};