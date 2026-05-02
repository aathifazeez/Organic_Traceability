const express = require('express');
const router = express.Router();

const {
    uploadCertificate,
    getCertificates,
    getCertificateById,
    updateCertificate,
    deleteCertificate,
    getCertificateAnalytics,
    getExpiringCertificates,
    verifyCertificate,
    rejectCertificate,
    getPendingCount,
} = require('../controllers/certificateController');

const { authenticate } = require('../middleware/auth.middleware');
const { isSupplier, isAdmin, authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const upload = require('../config/multer');

const {
    uploadCertificateValidation,
    mongoIdValidation,
} = require('../utils/validators');

// All routes require authentication
router.use(authenticate);

// Analytics & special routes (must be before :id routes)
router.get('/analytics/summary', isSupplier, getCertificateAnalytics);
router.get('/expiring', getExpiringCertificates);
router.get('/pending/count', isAdmin, getPendingCount);

// CRUD routes
router.post(
    '/',
    isSupplier,
    upload.single('certificate'),
    uploadCertificateValidation,
    validate,
    uploadCertificate
);

router.get('/', getCertificates);

router.get(
    '/:id',
    mongoIdValidation('id'),
    validate,
    getCertificateById
);

router.put(
    '/:id',
    authorize('supplier', 'admin'),
    upload.single('certificate'),
    mongoIdValidation('id'),
    validate,
    updateCertificate
);

router.delete(
    '/:id',
    authorize('supplier', 'admin'),
    mongoIdValidation('id'),
    validate,
    deleteCertificate
);

// Admin verification routes
router.patch('/:id/verify', isAdmin, mongoIdValidation('id'), validate, verifyCertificate);
router.patch('/:id/reject', isAdmin, mongoIdValidation('id'), validate, rejectCertificate);

module.exports = router;