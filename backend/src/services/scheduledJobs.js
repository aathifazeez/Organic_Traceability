const cron = require('node-cron');
const User = require('../models/user');
const Certificate = require('../models/Certificate');
const IngredientBatch = require('../models/IngredientBatch');
const ProductBatch = require('../models/ProductBatch');
const {
    sendCertificateExpiryReminder,
    sendBatchExpiryReminder,
    sendLowStockAlert,
} = require('./emailService');
const { cleanTempFiles } = require('../utils/fileHelper');

/**
 * Check for expiring certificates and send reminders
 * Runs daily at 9:00 AM
 */
const checkExpiringCertificates = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('🔔 Running certificate expiry check...');

            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            // Find certificates expiring in next 30 days
            const expiringCertificates = await Certificate.find({
                expiryDate: {
                    $gte: new Date(),
                    $lte: thirtyDaysFromNow,
                },
                status: { $ne: 'revoked' },
            }).populate('supplier', 'name email');

            // Group by supplier
            const certificatesBySupplier = {};

            expiringCertificates.forEach(cert => {
                const supplierId = cert.supplier._id.toString();
                if (!certificatesBySupplier[supplierId]) {
                    certificatesBySupplier[supplierId] = {
                        user: cert.supplier,
                        certificates: [],
                    };
                }

                certificatesBySupplier[supplierId].certificates.push({
                    certificateName: cert.certificateName,
                    expiryDate: cert.expiryDate,
                    daysUntilExpiry: cert.daysUntilExpiry,
                });
            });

            // Send emails
            for (const [supplierId, data] of Object.entries(certificatesBySupplier)) {
                await sendCertificateExpiryReminder(data.user, data.certificates);
            }

            console.log(`✅ Sent ${Object.keys(certificatesBySupplier).length} certificate expiry reminders`);
        } catch (error) {
            console.error('❌ Certificate expiry check error:', error);
        }
    });

    console.log('✅ Certificate expiry check scheduled (daily at 9:00 AM)');
};

/**
 * Check for expiring batches and send reminders
 * Runs daily at 9:00 AM
 */
const checkExpiringBatches = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('🔔 Running batch expiry check...');

            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            // Find batches expiring in next 30 days
            const expiringBatches = await IngredientBatch.find({
                expiryDate: {
                    $gte: new Date(),
                    $lte: thirtyDaysFromNow,
                },
                status: 'active',
            }).populate('supplier', 'name email');

            // Group by supplier
            const batchesBySupplier = {};

            expiringBatches.forEach(batch => {
                const supplierId = batch.supplier._id.toString();
                if (!batchesBySupplier[supplierId]) {
                    batchesBySupplier[supplierId] = {
                        user: batch.supplier,
                        batches: [],
                    };
                }

                batchesBySupplier[supplierId].batches.push({
                    batchNumber: batch.batchNumber,
                    ingredientName: batch.ingredientName,
                    expiryDate: batch.expiryDate,
                    daysUntilExpiry: batch.daysUntilExpiry,
                });
            });

            // Send emails
            for (const [supplierId, data] of Object.entries(batchesBySupplier)) {
                await sendBatchExpiryReminder(data.user, data.batches);
            }

            console.log(`✅ Sent ${Object.keys(batchesBySupplier).length} batch expiry reminders`);
        } catch (error) {
            console.error('❌ Batch expiry check error:', error);
        }
    });

    console.log('✅ Batch expiry check scheduled (daily at 9:00 AM)');
};

/**
 * Check for low stock products and alert admin
 * Runs daily at 10:00 AM
 */
const checkLowStock = () => {
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('🔔 Running low stock check...');

            // Find products with low stock (less than 10% or 0 units)
            const lowStockProducts = await ProductBatch.find({
                $or: [
                    { unitsRemaining: 0 },
                    { $expr: { $lt: ['$unitsRemaining', { $multiply: ['$totalUnits', 0.1] }] } },
                ],
                isListed: true,
            }).select('productName batchNumber unitsRemaining totalUnits');

            if (lowStockProducts.length > 0) {
                // Get admin users
                const admins = await User.find({ role: 'admin' }).select('email');

                // Send alert to all admins
                for (const admin of admins) {
                    await sendLowStockAlert(admin.email, lowStockProducts);
                }

                console.log(`✅ Sent low stock alerts for ${lowStockProducts.length} products to ${admins.length} admins`);
            } else {
                console.log('✅ No low stock products found');
            }
        } catch (error) {
            console.error('❌ Low stock check error:', error);
        }
    });

    console.log('✅ Low stock check scheduled (daily at 10:00 AM)');
};

/**
 * Clean old temporary files
 * Runs daily at 2:00 AM
 */
const cleanOldTempFiles = () => {
    cron.schedule('0 2 * * *', async () => {
        try {
            console.log('🧹 Cleaning old temporary files...');
            const result = await cleanTempFiles(24); // Older than 24 hours

            if (result.success) {
                console.log(`✅ Cleaned ${result.deleted} temporary files`);
            } else {
                console.error('❌ Temp file cleanup error:', result.error);
            }
        } catch (error) {
            console.error('❌ Temp file cleanup error:', error);
        }
    });

    console.log('✅ Temp file cleanup scheduled (daily at 2:00 AM)');
};

/**
 * Initialize all scheduled jobs
 */
const initScheduledJobs = () => {
    console.log('\n🕐 Initializing scheduled jobs...\n');

    checkExpiringCertificates();
    checkExpiringBatches();
    checkLowStock();
    cleanOldTempFiles();

    console.log('\n✅ All scheduled jobs initialized\n');
};

module.exports = {
    initScheduledJobs,
    checkExpiringCertificates,
    checkExpiringBatches,
    checkLowStock,
    cleanOldTempFiles,
};