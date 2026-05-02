const User = require('../models/User');
const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const ProductBatch = require('../models/ProductBatch');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/responses');
const { HTTP_STATUS, USER_ROLES } = require('../config/constants');

/**
 * @desc    Get supplier performance metrics
 * @route   GET /api/v1/reports/supplier-performance
 * @access  Private (Admin)
 */
const getSupplierPerformance = async (req, res) => {
    try {
        const suppliers = await User.find({ role: USER_ROLES.SUPPLIER, isDeleted: false });

        const performanceData = [];

        for (const supplier of suppliers) {
            const [totalBatches, totalCertificates] = await Promise.all([
                IngredientBatch.countDocuments({ supplier: supplier._id }),
                Certificate.countDocuments({ supplier: supplier._id }),
            ]);

            performanceData.push({
                supplierId: supplier._id,
                name: supplier.name,
                companyName: supplier.companyName,
                email: supplier.email,
                totalBatches,
                totalCertificates,
            });
        }

        return successResponse(
            res,
            'Supplier performance metrics retrieved',
            { suppliers: performanceData }
        );
    } catch (error) {
        console.error('Get supplier performance error:', error);
        return errorResponse(
            res,
            'Failed to retrieve supplier performance',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get revenue by category report
 * @route   GET /api/v1/reports/revenue-by-category
 * @access  Private (Admin)
 */
const getRevenueByCategory = async (req, res) => {
    try {
        const categoryRevenue = await Order.aggregate([
            { $match: { isCancelled: false } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'productbatches',
                    localField: 'items.productBatch',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    totalRevenue: { $sum: '$items.subtotal' },
                    totalOrders: { $addToSet: '$_id' },
                },
            },
            {
                $project: {
                    category: '$_id',
                    totalRevenue: 1,
                    totalOrders: { $size: '$totalOrders' },
                },
            },
            { $sort: { totalRevenue: -1 } },
        ]);

        const totalRevenue = categoryRevenue.reduce((sum, cat) => sum + cat.totalRevenue, 0);

        const categoryData = categoryRevenue.map(cat => ({
            category: cat.category || 'Uncategorized',
            totalRevenue: parseFloat(cat.totalRevenue.toFixed(2)),
            totalOrders: cat.totalOrders,
            percentage: parseFloat(((cat.totalRevenue / totalRevenue) * 100).toFixed(2)),
        }));

        return successResponse(
            res,
            'Revenue by category report retrieved',
            {
                categories: categoryData,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            }
        );
    } catch (error) {
        console.error('Get revenue by category error:', error);
        return errorResponse(
            res,
            'Failed to retrieve revenue report',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get certificate compliance report
 * @route   GET /api/v1/reports/certificate-compliance
 * @access  Private (Admin)
 */
const getCertificateCompliance = async (req, res) => {
    try {
        const suppliers = await User.find({ role: USER_ROLES.SUPPLIER, isDeleted: false });

        const complianceData = [];

        for (const supplier of suppliers) {
            const certificates = await Certificate.find({ supplier: supplier._id });

            const totalCertificates = certificates.length;
            const validCertificates = certificates.filter(c => c.status === 'valid').length;

            const complianceRate = totalCertificates > 0
                ? (validCertificates / totalCertificates) * 100
                : 0;

            let complianceStatus = 'Not Compliant';
            if (complianceRate >= 90) complianceStatus = 'Excellent';
            else if (complianceRate >= 75) complianceStatus = 'Good';
            else if (complianceRate >= 50) complianceStatus = 'Fair';

            complianceData.push({
                supplierId: supplier._id,
                supplierName: supplier.name,
                companyName: supplier.companyName,
                totalCertificates,
                validCertificates,
                complianceRate: parseFloat(complianceRate.toFixed(2)),
                complianceStatus,
            });
        }

        complianceData.sort((a, b) => b.complianceRate - a.complianceRate);

        return successResponse(
            res,
            'Certificate compliance report retrieved',
            { compliance: complianceData }
        );
    } catch (error) {
        console.error('Get certificate compliance error:', error);
        return errorResponse(
            res,
            'Failed to retrieve compliance report',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get inventory alerts report
 * @route   GET /api/v1/reports/inventory-alerts
 * @access  Private (Admin)
 */
const getInventoryAlerts = async (req, res) => {
    try {
        const products = await ProductBatch.find({ status: { $ne: 'depleted' } })
            .select('productName batchNumber totalUnits unitsRemaining status expiryDate inventoryPercentage')
            .lean();

        const alerts = [];

        for (const product of products) {
            let alertType = null;
            let priority = 0;

            if (product.unitsRemaining === 0) {
                alertType = 'Out of Stock';
                priority = 3;
            } else if (product.inventoryPercentage < 10) {
                alertType = 'Critical Low Stock';
                priority = 3;
            } else if (product.inventoryPercentage < 25) {
                alertType = 'Low Stock';
                priority = 2;
            }

            const daysUntilExpiry = Math.ceil(
                (new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
            );

            if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
                if (!alertType || priority < 2) {
                    alertType = 'Expiring Soon';
                    priority = 2;
                }
            } else if (daysUntilExpiry <= 0) {
                alertType = 'Expired';
                priority = 3;
            }

            if (alertType) {
                alerts.push({
                    productName: product.productName,
                    batchNumber: product.batchNumber,
                    totalUnits: product.totalUnits,
                    unitsRemaining: product.unitsRemaining,
                    inventoryPercentage: parseFloat(product.inventoryPercentage.toFixed(2)),
                    alertType,
                    priority,
                    daysUntilExpiry,
                    status: product.status,
                });
            }
        }

        alerts.sort((a, b) => b.priority - a.priority);

        return successResponse(
            res,
            'Inventory alerts report retrieved',
            {
                alerts,
                summary: {
                    total: alerts.length,
                    critical: alerts.filter(a => a.priority === 3).length,
                    medium: alerts.filter(a => a.priority === 2).length,
                    low: alerts.filter(a => a.priority === 1).length,
                },
            }
        );
    } catch (error) {
        console.error('Get inventory alerts error:', error);
        return errorResponse(
            res,
            'Failed to retrieve inventory alerts',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get top products report
 * @route   GET /api/v1/reports/top-products
 * @access  Private (Admin)
 */
const getTopProducts = async (req, res) => {
    try {
        const { limit = 10, sortBy = 'revenue' } = req.query;

        const topProducts = await Order.aggregate([
            { $match: { isCancelled: false } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productBatch',
                    productName: { $first: '$items.productName' },
                    totalRevenue: { $sum: '$items.subtotal' },
                    totalOrders: { $sum: 1 },
                    totalUnits: { $sum: '$items.quantity' },
                },
            },
            { $sort: { [sortBy]: -1 } },
            { $limit: parseInt(limit) },
        ]);

        return successResponse(
            res,
            `Top ${limit} products by ${sortBy}`,
            { products: topProducts }
        );
    } catch (error) {
        console.error('Get top products error:', error);
        return errorResponse(
            res,
            'Failed to retrieve top products',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Export data to CSV
 * @route   GET /api/v1/reports/export/:type
 * @access  Private (Admin)
 */
const exportData = async (req, res) => {
    try {
        return successResponse(
            res,
            'CSV export feature - install json2csv package to enable',
            { message: 'Run: npm install json2csv' }
        );
    } catch (error) {
        console.error('Export data error:', error);
        return errorResponse(
            res,
            'Failed to export data',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get comprehensive dashboard report
 * @route   GET /api/v1/reports/dashboard
 * @access  Private (Admin)
 */
const getDashboardReport = async (req, res) => {
    try {
        const [userStats, batchStats, productStats, orderStats] = await Promise.all([
            User.countDocuments({ isDeleted: false }),
            IngredientBatch.countDocuments(),
            ProductBatch.countDocuments(),
            Order.countDocuments({ isCancelled: false }),
        ]);

        return successResponse(
            res,
            'Dashboard report retrieved',
            {
                report: {
                    users: { total: userStats },
                    batches: { total: batchStats },
                    products: { total: productStats },
                    orders: { total: orderStats },
                },
            }
        );
    } catch (error) {
        console.error('Get dashboard report error:', error);
        return errorResponse(
            res,
            'Failed to retrieve dashboard report',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    getSupplierPerformance,
    getRevenueByCategory,
    getCertificateCompliance,
    getInventoryAlerts,
    getTopProducts,
    exportData,
    getDashboardReport,
};