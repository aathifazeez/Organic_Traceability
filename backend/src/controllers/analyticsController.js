const User = require('../models/user');
const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const ProductBatch = require('../models/ProductBatch');
const QRCode = require('../models/QRCode');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse } = require('../utils/responses');
const { HTTP_STATUS, USER_ROLES, ACCOUNT_STATUS, BATCH_STATUS, ORDER_STATUS } = require('../config/constants');

/**
 * @desc    Get platform overview analytics
 * @route   GET /api/v1/analytics/overview
 * @access  Private (Admin)
 */
const getPlatformOverview = async (req, res) => {
    try {
        // Get counts
        const [
            totalUsers,
            totalSuppliers,
            activeSuppliers,
            pendingApprovals,
            totalBatches,
            activeBatches,
            totalCertificates,
            validCertificates,
            totalProducts,
            activeProducts,
            totalQRCodes,
            totalOrders,
            totalRevenue,
        ] = await Promise.all([
            User.countDocuments({ isDeleted: false }),
            User.countDocuments({ role: USER_ROLES.SUPPLIER, isDeleted: false }),
            User.countDocuments({ role: USER_ROLES.SUPPLIER, status: ACCOUNT_STATUS.APPROVED }),
            User.countDocuments({ status: ACCOUNT_STATUS.PENDING }),
            IngredientBatch.countDocuments(),
            IngredientBatch.countDocuments({ status: BATCH_STATUS.ACTIVE }),
            Certificate.countDocuments(),
            Certificate.countDocuments({ status: 'valid' }),
            ProductBatch.countDocuments(),
            ProductBatch.countDocuments({ status: BATCH_STATUS.ACTIVE }),
            QRCode.countDocuments(),
            Order.countDocuments({ isCancelled: false }),
            Order.aggregate([
                { $match: { isCancelled: false } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]).then(result => result[0]?.total || 0),
        ]);

        // Calculate growth (last 30 days vs previous 30 days)
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [usersLast30, usersPrevious30] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: last30Days } }),
            User.countDocuments({
                createdAt: { $gte: previous30Days, $lt: last30Days }
            }),
        ]);

        const userGrowth = usersPrevious30 > 0
            ? ((usersLast30 - usersPrevious30) / usersPrevious30) * 100
            : 0;

        return successResponse(
            res,
            'Platform overview retrieved successfully',
            {
                users: {
                    total: totalUsers,
                    suppliers: totalSuppliers,
                    activeSuppliers,
                    pendingApprovals,
                    growth: parseFloat(userGrowth.toFixed(2)),
                },
                batches: {
                    total: totalBatches,
                    active: activeBatches,
                    utilizationRate: totalBatches > 0 ? (activeBatches / totalBatches) * 100 : 0,
                },
                certificates: {
                    total: totalCertificates,
                    valid: validCertificates,
                    validityRate: totalCertificates > 0 ? (validCertificates / totalCertificates) * 100 : 0,
                },
                products: {
                    total: totalProducts,
                    active: activeProducts,
                },
                qrCodes: {
                    total: totalQRCodes,
                },
                orders: {
                    total: totalOrders,
                    revenue: totalRevenue,
                    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                },
            }
        );
    } catch (error) {
        console.error('Get platform overview error:', error);
        return errorResponse(
            res,
            'Failed to retrieve platform overview',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get user analytics
 * @route   GET /api/v1/analytics/users
 * @access  Private (Admin)
 */
const getUserAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        const matchFilter = {};
        if (Object.keys(dateFilter).length > 0) {
            matchFilter.createdAt = dateFilter;
        }

        // User registrations over time
        const registrationTrend = await User.aggregate([
            { $match: { isDeleted: false, ...matchFilter } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Users by role
        const usersByRole = await User.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Users by status
        const usersByStatus = await User.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Top suppliers by batch count
        const topSuppliers = await IngredientBatch.aggregate([
            {
                $group: {
                    _id: '$supplier',
                    batchCount: { $sum: 1 },
                },
            },
            { $sort: { batchCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'supplier',
                },
            },
            { $unwind: '$supplier' },
            {
                $project: {
                    supplierId: '$_id',
                    name: '$supplier.name',
                    companyName: '$supplier.companyName',
                    batchCount: 1,
                },
            },
        ]);

        return successResponse(
            res,
            'User analytics retrieved successfully',
            {
                registrationTrend,
                usersByRole,
                usersByStatus,
                topSuppliers,
            }
        );
    } catch (error) {
        console.error('Get user analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve user analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get batch analytics
 * @route   GET /api/v1/analytics/batches
 * @access  Private (Admin)
 */
const getBatchAnalytics = async (req, res) => {
    try {
        // Batches by status
        const batchesByStatus = await IngredientBatch.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ['$quantity.value', '$unitPrice'] } },
                },
            },
        ]);

        // Top ingredients
        const topIngredients = await IngredientBatch.aggregate([
            {
                $group: {
                    _id: '$ingredientName',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity.value' },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Batches by origin country
        const batchesByCountry = await IngredientBatch.aggregate([
            {
                $group: {
                    _id: '$origin.country',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Expiring batches (next 30 days)
        const expiringBatches = await IngredientBatch.countDocuments({
            status: BATCH_STATUS.ACTIVE,
            expiryDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        return successResponse(
            res,
            'Batch analytics retrieved successfully',
            {
                batchesByStatus,
                topIngredients,
                batchesByCountry,
                expiringBatches,
            }
        );
    } catch (error) {
        console.error('Get batch analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve batch analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get certificate analytics
 * @route   GET /api/v1/analytics/certificates
 * @access  Private (Admin)
 */
const getCertificateAnalytics = async (req, res) => {
    try {
        // Certificates by type
        const certificatesByType = await Certificate.aggregate([
            {
                $group: {
                    _id: '$certificateType',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Certificates by status
        const certificatesByStatus = await Certificate.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Expiring certificates (next 30 days)
        const expiringCertificates = await Certificate.countDocuments({
            status: { $ne: 'revoked' },
            expiryDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        // Verification rate
        const [total, verified] = await Promise.all([
            Certificate.countDocuments(),
            Certificate.countDocuments({ isVerified: true }),
        ]);

        const verificationRate = total > 0 ? (verified / total) * 100 : 0;

        return successResponse(
            res,
            'Certificate analytics retrieved successfully',
            {
                certificatesByType,
                certificatesByStatus,
                expiringCertificates,
                verificationRate: parseFloat(verificationRate.toFixed(2)),
                total,
                verified,
            }
        );
    } catch (error) {
        console.error('Get certificate analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve certificate analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get QR code analytics
 * @route   GET /api/v1/analytics/qr-codes
 * @access  Private (Admin)
 */
const getQRAnalytics = async (req, res) => {
    try {
        const [totalQRCodes, activeQRCodes] = await Promise.all([
            QRCode.countDocuments(),
            QRCode.countDocuments({ isActive: true }),
        ]);

        // Total scans
        const scanStats = await QRCode.aggregate([
            {
                $group: {
                    _id: null,
                    totalScans: { $sum: '$scanCount' },
                    avgScansPerQR: { $avg: '$scanCount' },
                },
            },
        ]);

        // Top scanned QR codes
        const topScannedQRs = await QRCode.aggregate([
            { $sort: { scanCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'productbatches',
                    localField: 'productBatch',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    qrId: 1,
                    scanCount: 1,
                    productName: '$product.productName',
                    batchNumber: '$product.batchNumber',
                },
            },
        ]);

        return successResponse(
            res,
            'QR code analytics retrieved successfully',
            {
                totalQRCodes,
                activeQRCodes,
                totalScans: scanStats[0]?.totalScans || 0,
                avgScansPerQR: scanStats[0]?.avgScansPerQR || 0,
                topScannedQRs,
            }
        );
    } catch (error) {
        console.error('Get QR analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve QR analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get order analytics
 * @route   GET /api/v1/analytics/orders
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

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                },
            },
        ]);

        // Revenue trend
        const revenueTrend = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    revenue: { $sum: '$total' },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Best selling products
        const bestSellingProducts = await Order.aggregate([
            { $match: matchFilter },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productBatch',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.subtotal' },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'productbatches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.productName',
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
        ]);

        return successResponse(
            res,
            'Order analytics retrieved successfully',
            {
                ordersByStatus,
                revenueTrend,
                bestSellingProducts,
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
 * @desc    Get activity logs
 * @route   GET /api/v1/analytics/activity
 * @access  Private (Admin)
 */
const getActivityLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            action,
            entityType,
            userId,
        } = req.query;

        const query = {};

        if (action) query.action = action;
        if (entityType) query.entityType = entityType;
        if (userId) query.performedBy = userId;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [logs, totalCount] = await Promise.all([
            AuditLog.find(query)
                .populate('performedBy', 'name email role')
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            AuditLog.countDocuments(query),
        ]);

        return successResponse(
            res,
            'Activity logs retrieved successfully',
            {
                logs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                },
            }
        );
    } catch (error) {
        console.error('Get activity logs error:', error);
        return errorResponse(
            res,
            'Failed to retrieve activity logs',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    getPlatformOverview,
    getUserAnalytics,
    getBatchAnalytics,
    getCertificateAnalytics,
    getQRAnalytics,
    getOrderAnalytics,
    getActivityLogs,
};