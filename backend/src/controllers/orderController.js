const Order = require('../models/Order');
const ProductBatch = require('../models/ProductBatch');
const User = require('../models/user');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responses');
const { HTTP_STATUS, PAGINATION, ORDER_STATUS } = require('../config/constants');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../services/emailService');

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Public (customers) / Private (logged in users)
 */
const createOrder = async (req, res) => {
    try {
        const {
            items,
            customerInfo,
            shippingAddress,
            billingAddress,
            paymentMethod,
            notes,
        } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return errorResponse(
                res,
                'Order must contain at least one item',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Check product availability and calculate totals
        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await ProductBatch.findById(item.productBatch);

            if (!product) {
                return errorResponse(
                    res,
                    `Product not found: ${item.productBatch}`,
                    HTTP_STATUS.NOT_FOUND
                );
            }

            // Check if product is listed
            if (!product.isListed) {
                return errorResponse(
                    res,
                    `Product not available: ${product.productName}`,
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            // Check stock availability
            if (product.unitsRemaining < item.quantity) {
                return errorResponse(
                    res,
                    `Insufficient stock for ${product.productName}. Available: ${product.unitsRemaining}, Requested: ${item.quantity}`,
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const itemSubtotal = product.retailPrice * item.quantity;

            orderItems.push({
                productBatch: product._id,
                productName: product.productName,
                batchNumber: product.batchNumber,
                quantity: item.quantity,
                unitPrice: product.retailPrice,
                subtotal: itemSubtotal,
            });

            subtotal += itemSubtotal;
        }

        // Calculate totals
        const shippingCost = subtotal >= 100 ? 0 : 10; // Free shipping over $100
        const taxRate = 0.1; // 10% tax
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;

        // Generate order number
        const orderCount = await Order.countDocuments();
        const orderNumber = `ORD-${Date.now()}-${String(orderCount + 1).padStart(4, '0')}`;

        // Create order
        const order = await Order.create({
            orderNumber,
            customer: req.user?._id || null, // null for guest checkout
            customerInfo,
            items: orderItems,
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress, // Use shipping as billing if not provided
            paymentMethod,
            notes,
            status: ORDER_STATUS.PENDING,
        });

        sendOrderConfirmation(order).catch(err => {
            console.error('Order confirmation email failed:', err);
        });

        // Reduce product inventory
        for (const item of items) {
            const product = await ProductBatch.findById(item.productBatch);
            if (product) {
                await product.reduceInventory(item.quantity);
            }
        }

        // Populate order details
        await order.populate('customer items.productBatch');

        // Log the action
        await AuditLog.logAction({
            action: 'CREATE',
            entityType: 'Order',
            entityId: order._id,
            performedBy: req.user?._id || null,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Created order: ${order.orderNumber}`,
        });



        return successResponse(
            res,
            'Order created successfully',
            { order },
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Create order error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to create order',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get all orders (with filters and pagination)
 * @route   GET /api/v1/orders
 * @access  Private (Admin) / Customer (own orders only)
 */
const getOrders = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            search,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = { isCancelled: false };

        // If customer, only show their orders
        // If admin, show all orders
        if (req.user && req.user.role !== 'admin') {
            query.customer = req.user._id;
        }

        // Filters
        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { orderNumber: new RegExp(search, 'i') },
                { 'customerInfo.name': new RegExp(search, 'i') },
                { 'customerInfo.email': new RegExp(search, 'i') },
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [orders, totalCount] = await Promise.all([
            Order.find(query)
                .populate('customer', 'name email')
                .populate('items.productBatch', 'productName batchNumber images')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Order.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'Orders retrieved successfully',
            orders,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get orders error:', error);
        return errorResponse(
            res,
            'Failed to retrieve orders',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private (Admin or Order Owner)
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate({
                path: 'items.productBatch',
                populate: {
                    path: 'ingredients.ingredientBatch',
                    populate: 'supplier certificates',
                },
            });

        if (!order) {
            return errorResponse(
                res,
                'Order not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check access - customers can only view their own orders
        if (req.user.role !== 'admin' &&
            order.customer &&
            order.customer._id.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to view this order',
                HTTP_STATUS.FORBIDDEN
            );
        }

        return successResponse(
            res,
            'Order retrieved successfully',
            { order }
        );
    } catch (error) {
        console.error('Get order error:', error);
        return errorResponse(
            res,
            'Failed to retrieve order',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get order by order number (public tracking)
 * @route   GET /api/v1/orders/track/:orderNumber
 * @access  Public
 */
const trackOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { email } = req.query;

        const order = await Order.findOne({ orderNumber })
            .populate('items.productBatch', 'productName batchNumber images')
            .select('-customer -billingAddress -paymentMethod');

        if (!order) {
            return errorResponse(
                res,
                'Order not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Verify email for security
        if (email && order.customerInfo.email.toLowerCase() !== email.toLowerCase()) {
            return errorResponse(
                res,
                'Invalid order number or email',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Return limited information for tracking
        const trackingInfo = {
            orderNumber: order.orderNumber,
            status: order.status,
            items: order.items,
            total: order.total,
            shippingAddress: order.shippingAddress,
            estimatedDelivery: order.estimatedDelivery,
            trackingNumber: order.trackingNumber,
            statusHistory: order.statusHistory,
            createdAt: order.createdAt,
        };

        return successResponse(
            res,
            'Order tracking information retrieved successfully',
            trackingInfo
        );
    } catch (error) {
        console.error('Track order error:', error);
        return errorResponse(
            res,
            'Failed to track order',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private (Admin)
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { status, notes, trackingNumber } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(
                res,
                'Order not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        const oldStatus = order.status;

        // Update status
        await order.updateStatus(status, notes);

        sendOrderStatusUpdate(order).catch(err => {
            console.error('Status update email failed:', err);
        });

        // Update tracking number if provided
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        // Set estimated delivery for shipped orders
        if (status === ORDER_STATUS.SHIPPED && !order.estimatedDelivery) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
            order.estimatedDelivery = deliveryDate;
        }

        await order.save();

        // Log the action
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'Order',
            entityId: order._id,
            performedBy: req.user._id,
            changes: {
                before: { status: oldStatus },
                after: { status: status },
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Updated order status from ${oldStatus} to ${status}: ${order.orderNumber}`,
        });

        return successResponse(
            res,
            'Order status updated successfully',
            { order }
        );
    } catch (error) {
        console.error('Update order status error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to update order status',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Cancel order
 * @route   PATCH /api/v1/orders/:id/cancel
 * @access  Private (Admin or Order Owner - only if pending)
 */
const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(
                res,
                'Order not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check access
        if (req.user.role !== 'admin' &&
            order.customer &&
            order.customer.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to cancel this order',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Only pending or processing orders can be cancelled
        if (![ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING].includes(order.status)) {
            return errorResponse(
                res,
                `Cannot cancel order with status: ${order.status}`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Cancel order
        await order.cancelOrder(reason);

        // Restore inventory
        for (const item of order.items) {
            const product = await ProductBatch.findById(item.productBatch);
            if (product) {
                await product.restoreInventory(item.quantity);
            }
        }

        // Log the action
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'Order',
            entityId: order._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Cancelled order: ${order.orderNumber}`,
            metadata: { reason },
        });

        return successResponse(
            res,
            'Order cancelled successfully',
            { order }
        );
    } catch (error) {
        console.error('Cancel order error:', error);
        return errorResponse(
            res,
            'Failed to cancel order',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get order analytics
 * @route   GET /api/v1/orders/analytics/summary
 * @access  Private (Admin)
 */
const getOrderAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        const matchFilter = { isCancelled: false };
        if (Object.keys(dateFilter).length > 0) {
            matchFilter.createdAt = dateFilter;
        }

        // Basic stats
        const [totalOrders, totalRevenue, avgOrderValue] = await Promise.all([
            Order.countDocuments(matchFilter),
            Order.aggregate([
                { $match: matchFilter },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]).then(result => result[0]?.total || 0),
            Order.aggregate([
                { $match: matchFilter },
                { $group: { _id: null, avg: { $avg: '$total' } } },
            ]).then(result => result[0]?.avg || 0),
        ]);

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    revenue: { $sum: '$total' },
                },
            },
        ]);

        // Revenue trend (by day for last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const revenueTrend = await Order.aggregate([
            {
                $match: {
                    isCancelled: false,
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: matchFilter },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productBatch',
                    productName: { $first: '$items.productName' },
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.subtotal' },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
        ]);

        return successResponse(
            res,
            'Order analytics retrieved successfully',
            {
                summary: {
                    totalOrders,
                    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
                },
                ordersByStatus,
                revenueTrend,
                topProducts,
            }
        );
    } catch (error) {
        console.error('Get order analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve order analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get customer order history
 * @route   GET /api/v1/orders/my-orders
 * @access  Private (Customer)
 */
const getMyOrders = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
        } = req.query;

        const query = {
            customer: req.user._id,
            isCancelled: false,
        };

        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
        const skip = (pageNum - 1) * limitNum;

        const [orders, totalCount] = await Promise.all([
            Order.find(query)
                .populate('items.productBatch', 'productName batchNumber images retailPrice')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Order.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'Order history retrieved successfully',
            orders,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get my orders error:', error);
        return errorResponse(
            res,
            'Failed to retrieve order history',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    trackOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderAnalytics,
    getMyOrders,
};