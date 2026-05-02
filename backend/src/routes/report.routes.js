const express = require('express');
const router = express.Router();

const {
    getSupplierPerformance,
    getRevenueByCategory,
    getCertificateCompliance,
    getInventoryAlerts,
    getTopProducts,
    exportData,
    getDashboardReport,
} = require('../controllers/reportController');

const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// Report endpoints
router.get('/dashboard', getDashboardReport);
router.get('/supplier-performance', getSupplierPerformance);
router.get('/revenue-by-category', getRevenueByCategory);
router.get('/certificate-compliance', getCertificateCompliance);
router.get('/inventory-alerts', getInventoryAlerts);
router.get('/top-products', getTopProducts);

// Export endpoints
router.get('/export/:type', exportData);

module.exports = router;