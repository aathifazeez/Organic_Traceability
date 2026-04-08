const express = require('express');
const router = express.Router();

const {
    generateQRCode,
    verifyQRCode,
    getQRCodes,
    getQRCodeById,
    deactivateQRCode,
    getQRAnalytics,
    getQRScans,
} = require('../controllers/qrController');

const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const { mongoIdValidation } = require('../utils/validators');

// Public routes
router.get('/verify/:qrId', verifyQRCode);

// Protected routes (Admin only)
router.use(authenticate);
router.use(isAdmin);

// Analytics routes (must be before :id routes)
router.get('/analytics/summary', getQRAnalytics);

// QR code management
router.post(
    '/generate/:productId',
    mongoIdValidation('productId'),
    validate,
    generateQRCode
);

router.get('/', getQRCodes);

router.get(
    '/:id',
    mongoIdValidation('id'),
    validate,
    getQRCodeById
);

router.get(
    '/:id/scans',
    mongoIdValidation('id'),
    validate,
    getQRScans
);

router.patch(
    '/:id/deactivate',
    mongoIdValidation('id'),
    validate,
    deactivateQRCode
);

module.exports = router;