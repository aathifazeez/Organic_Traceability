const express = require('express');
const router = express.Router();

const {
    getPlatformOverview,
    getUserAnalytics,
    getBatchAnalytics,
    getCertificateAnalytics,
    getQRAnalytics,
    getOrderAnalytics,
    getActivityLogs,
} = require('../controllers/analyticsController');

const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// Analytics endpoints
router.get('/overview', getPlatformOverview);
router.get('/users', getUserAnalytics);
router.get('/batches', getBatchAnalytics);
router.get('/certificates', getCertificateAnalytics);
router.get('/qr-codes', getQRAnalytics);
router.get('/orders', getOrderAnalytics);
router.get('/activity', getActivityLogs);

module.exports = router;