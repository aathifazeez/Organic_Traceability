const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    trackOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderAnalytics,
    getMyOrders,
} = require('../controllers/orderController');

const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');

const {
    createOrderValidation,
    updateOrderStatusValidation,
    cancelOrderValidation,
    mongoIdValidation,
} = require('../utils/validators');

// Public routes
router.get('/track/:orderNumber', trackOrder); // Public order tracking

// Protected routes - Customer or Admin
router.use(authenticate);

// Customer routes
router.get('/my-orders', getMyOrders); // Customer's own orders

router.post(
    '/',
    createOrderValidation,
    validate,
    createOrder
);

router.get('/', getOrders); // Admin: all orders, Customer: own orders

router.get(
    '/:id',
    mongoIdValidation('id'),
    validate,
    getOrderById
);

router.patch(
    '/:id/cancel',
    mongoIdValidation('id'),
    cancelOrderValidation,
    validate,
    cancelOrder
);

// Admin only routes
router.use(isAdmin);

router.get('/analytics/summary', getOrderAnalytics);

router.patch(
    '/:id/status',
    mongoIdValidation('id'),
    updateOrderStatusValidation,
    validate,
    updateOrderStatus
);

module.exports = router;