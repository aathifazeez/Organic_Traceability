const express = require('express');
const router = express.Router();

const {
    createBatch,
    getBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
    getBatchAnalytics,
    getExpiringBatches,
} = require('../controllers/batchController');

const { authenticate } = require('../middleware/auth.middleware');
const { isSupplier, authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const upload = require('../config/multer');

const {
    createBatchValidation,
    updateBatchValidation,
    mongoIdValidation,
} = require('../utils/validators');

// All routes require authentication
router.use(authenticate);

// Analytics routes (must be before :id routes)
router.get('/analytics/summary', isSupplier, getBatchAnalytics);
router.get('/expiring', getExpiringBatches);

// CRUD routes
router.post(
    '/',
    isSupplier,
    upload.array('images', 5),
    createBatchValidation,
    validate,
    createBatch
);

router.get('/', getBatches);

router.get(
    '/:id',
    mongoIdValidation('id'),
    validate,
    getBatchById
);

router.put(
    '/:id',
    authorize('supplier', 'admin'),
    upload.array('images', 5),
    mongoIdValidation('id'),
    updateBatchValidation,
    validate,
    updateBatch
);

router.delete(
    '/:id',
    authorize('supplier', 'admin'),
    mongoIdValidation('id'),
    validate,
    deleteBatch
);

module.exports = router;