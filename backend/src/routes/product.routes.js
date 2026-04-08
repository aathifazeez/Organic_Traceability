const express = require('express');
const router = express.Router();

const {
    createProductBatch,
    getProductBatches,
    getProductBatchById,
    updateProductBatch,
    deleteProductBatch,
    toggleProductListing,
    getProductTraceability,
    getAvailableIngredients,
    getProductAnalytics,
} = require('../controllers/productController');

const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const upload = require('../config/multer');

const {
    createProductBatchValidation,
    updateProductBatchValidation,
    mongoIdValidation,
} = require('../utils/validators');

// Public routes (no authentication required)
router.get('/', optionalAuth, getProductBatches); // Public can see listed products

router.get(
    '/:id',
    optionalAuth,
    mongoIdValidation('id'),
    validate,
    getProductBatchById
);

router.get(
    '/:id/traceability',
    mongoIdValidation('id'),
    validate,
    getProductTraceability
);

// Protected routes (require admin authentication)
router.use(authenticate);
router.use(isAdmin);

// Analytics and helper routes (must be before :id routes)
router.get('/analytics/summary', getProductAnalytics);
router.get('/ingredients/available', getAvailableIngredients);

// CRUD routes
router.post(
    '/',
    upload.array('images', 5),
    createProductBatchValidation,
    validate,
    createProductBatch
);

router.put(
    '/:id',
    upload.array('images', 5),
    mongoIdValidation('id'),
    updateProductBatchValidation,
    validate,
    updateProductBatch
);

router.delete(
    '/:id',
    mongoIdValidation('id'),
    validate,
    deleteProductBatch
);

router.patch(
    '/:id/toggle-listing',
    mongoIdValidation('id'),
    validate,
    toggleProductListing
);

module.exports = router;