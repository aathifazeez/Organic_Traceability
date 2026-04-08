const QRCode = require('../models/QRCode');
const ProductBatch = require('../models/ProductBatch');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responses');
const { HTTP_STATUS, PAGINATION } = require('../config/constants');
const {
    generateQRCodeImage,
    generateVerificationUrl,
    generateApiVerificationUrl,
    createBlockchainHash,
    parseDeviceType,
    getLocationFromIP,
} = require('../services/qrService');
const { addQRToBlockchain } = require('../services/blockchainService');

/**
 * @desc    Generate QR code for product batch
 * @route   POST /api/v1/qr/generate/:productId
 * @access  Private (Admin)
 */
const generateQRCode = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await ProductBatch.findById(productId);

        if (!product) {
            return errorResponse(
                res,
                'Product batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check if QR code already exists for this product
        const existingQR = await QRCode.findOne({ productBatch: productId });

        if (existingQR) {
            return errorResponse(
                res,
                'QR code already exists for this product batch',
                HTTP_STATUS.CONFLICT
            );
        }

        // Create QR code record
        const qrCode = new QRCode({
            productBatch: productId,
            generatedBy: req.user._id,
        });

        // Generate verification URL
        const verificationUrl = generateVerificationUrl(qrCode.qrId);
        qrCode.verificationUrl = verificationUrl;

        // Generate QR code image
        const qrCodeImage = await generateQRCodeImage(verificationUrl, {
            width: 300,
            errorCorrectionLevel: 'M',
        });

        qrCode.qrCodeUrl = verificationUrl;
        qrCode.qrCodeImage = qrCodeImage;

        // Create blockchain hash
        const blockchainData = {
            qrId: qrCode.qrId,
            productBatchId: productId,
            timestamp: Date.now(),
            manufacturer: req.user._id.toString(),
        };

        const blockchainHash = createBlockchainHash(blockchainData);
        qrCode.blockchainHash = blockchainHash;

        // Add to blockchain (if enabled)
        if (process.env.BLOCKCHAIN_ENABLED === 'true') {
            const blockInfo = addQRToBlockchain({
                qrId: qrCode.qrId,
                productBatchId: productId,
                productName: product.productName,
                manufacturer: req.user.name,
            });

            qrCode.blockchainTimestamp = new Date(blockInfo.timestamp);
        }

        await qrCode.save();

        // Link QR code to product
        product.qrCode = qrCode._id;
        await product.save();

        await qrCode.populate('productBatch generatedBy');

        // Log the action
        await AuditLog.logAction({
            action: 'CREATE',
            entityType: 'QRCode',
            entityId: qrCode._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Generated QR code: ${qrCode.qrId}`,
        });

        return successResponse(
            res,
            'QR code generated successfully',
            { qrCode },
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Generate QR code error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to generate QR code',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Verify QR code and get product information
 * @route   GET /api/v1/qr/verify/:qrId
 * @access  Public
 */
const verifyQRCode = async (req, res) => {
    try {
        const { qrId } = req.params;

        // Find QR code
        const qrCode = await QRCode.findByQrId(qrId);

        if (!qrCode) {
            return errorResponse(
                res,
                'QR code not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        if (!qrCode.isActive) {
            return errorResponse(
                res,
                'QR code has been deactivated',
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (qrCode.isExpired) {
            return errorResponse(
                res,
                'QR code has expired',
                HTTP_STATUS.GONE
            );
        }

        // Record the scan
        const scanData = {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            device: parseDeviceType(req.get('user-agent')),
            location: await getLocationFromIP(req.ip),
        };

        await qrCode.recordScan(scanData);

        // Build verification response
        const product = qrCode.productBatch;

        const verificationData = {
            verified: true,
            qrId: qrCode.qrId,
            scanCount: qrCode.scanCount,
            product: {
                batchNumber: product.batchNumber,
                productName: product.productName,
                category: product.category,
                skinType: product.skinType,
                description: product.shortDescription,
                productionDate: product.productionDate,
                expiryDate: product.expiryDate,
                manufacturer: {
                    name: product.manufacturer?.name,
                    companyName: product.manufacturer?.companyName,
                },
                images: product.images,
                retailPrice: product.retailPrice,
            },
            ingredients: product.ingredients.map(ing => {
                const batch = ing.ingredientBatch;
                return {
                    ingredientName: batch.ingredientName,
                    batchNumber: batch.batchNumber,
                    supplier: {
                        name: batch.supplier.name,
                        companyName: batch.supplier.companyName,
                    },
                    origin: batch.origin,
                    qualityGrade: batch.qualityGrade,
                    certificates: batch.certificates.map(cert => ({
                        type: cert.certificateType,
                        number: cert.certificateNumber,
                        authority: cert.issuingAuthority,
                        status: cert.status,
                        expiryDate: cert.expiryDate,
                    })),
                };
            }),
            blockchain: {
                hash: qrCode.blockchainHash,
                timestamp: qrCode.blockchainTimestamp,
                verified: qrCode.isVerified,
            },
            certificationSummary: {
                totalCertificates: product.ingredients.reduce(
                    (sum, ing) => sum + (ing.ingredientBatch.certificates?.length || 0),
                    0
                ),
                uniqueSuppliers: new Set(
                    product.ingredients.map(ing => ing.ingredientBatch.supplier._id.toString())
                ).size,
                certificateTypes: [
                    ...new Set(
                        product.ingredients.flatMap(ing =>
                            ing.ingredientBatch.certificates.map(cert => cert.certificateType)
                        )
                    ),
                ],
            },
        };

        return successResponse(
            res,
            'QR code verified successfully',
            verificationData
        );
    } catch (error) {
        console.error('Verify QR code error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to verify QR code',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get all QR codes (with filters and pagination)
 * @route   GET /api/v1/qr
 * @access  Private (Admin)
 */
const getQRCodes = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            isActive,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.qrId = new RegExp(search, 'i');
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [qrCodes, totalCount] = await Promise.all([
            QRCode.find(query)
                .populate('productBatch', 'batchNumber productName')
                .populate('generatedBy', 'name email')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            QRCode.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'QR codes retrieved successfully',
            qrCodes,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get QR codes error:', error);
        return errorResponse(
            res,
            'Failed to retrieve QR codes',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get single QR code by ID
 * @route   GET /api/v1/qr/:id
 * @access  Private (Admin)
 */
const getQRCodeById = async (req, res) => {
    try {
        const qrCode = await QRCode.findById(req.params.id)
            .populate('productBatch')
            .populate('generatedBy', 'name email');

        if (!qrCode) {
            return errorResponse(
                res,
                'QR code not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Get scan statistics
        const scanStats = qrCode.getScanStats();

        return successResponse(
            res,
            'QR code retrieved successfully',
            { qrCode, scanStats }
        );
    } catch (error) {
        console.error('Get QR code error:', error);
        return errorResponse(
            res,
            'Failed to retrieve QR code',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Deactivate QR code
 * @route   PATCH /api/v1/qr/:id/deactivate
 * @access  Private (Admin)
 */
const deactivateQRCode = async (req, res) => {
    try {
        const qrCode = await QRCode.findById(req.params.id);

        if (!qrCode) {
            return errorResponse(
                res,
                'QR code not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        await qrCode.deactivate();

        // Log the action
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'QRCode',
            entityId: qrCode._id,
            performedBy: req.user._id,
            changes: {
                before: { isActive: true },
                after: { isActive: false },
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Deactivated QR code: ${qrCode.qrId}`,
        });

        return successResponse(
            res,
            'QR code deactivated successfully',
            { qrCode }
        );
    } catch (error) {
        console.error('Deactivate QR code error:', error);
        return errorResponse(
            res,
            'Failed to deactivate QR code',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get QR code analytics
 * @route   GET /api/v1/qr/analytics/summary
 * @access  Private (Admin)
 */
const getQRAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        const matchFilter = {};
        if (Object.keys(dateFilter).length > 0) {
            matchFilter.createdAt = dateFilter;
        }

        // Basic stats
        const [totalQRCodes, activeQRCodes, totalScans] = await Promise.all([
            QRCode.countDocuments(matchFilter),
            QRCode.countDocuments({ ...matchFilter, isActive: true }),
            QRCode.aggregate([
                { $match: matchFilter },
                { $group: { _id: null, total: { $sum: '$scanCount' } } },
            ]).then(result => result[0]?.total || 0),
        ]);

        // Top scanned QR codes
        const topScannedQRs = await QRCode.find(matchFilter)
            .sort({ scanCount: -1 })
            .limit(10)
            .populate('productBatch', 'productName batchNumber')
            .select('qrId scanCount productBatch lastScannedAt');

        // Recent scans
        const recentScans = await QRCode.find({
            ...matchFilter,
            lastScannedAt: { $exists: true },
        })
            .sort({ lastScannedAt: -1 })
            .limit(20)
            .populate('productBatch', 'productName batchNumber')
            .select('qrId lastScannedAt scanCount productBatch');

        // Scan trend (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const scanTrend = await QRCode.aggregate([
            {
                $match: {
                    'scans.scannedAt': { $gte: thirtyDaysAgo },
                },
            },
            { $unwind: '$scans' },
            {
                $match: {
                    'scans.scannedAt': { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$scans.scannedAt',
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return successResponse(
            res,
            'QR analytics retrieved successfully',
            {
                summary: {
                    totalQRCodes,
                    activeQRCodes,
                    totalScans,
                    avgScansPerQR: totalQRCodes > 0 ? (totalScans / totalQRCodes).toFixed(2) : 0,
                },
                topScannedQRs,
                recentScans,
                scanTrend,
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
 * @desc    Get scan details for a QR code
 * @route   GET /api/v1/qr/:id/scans
 * @access  Private (Admin)
 */
const getQRScans = async (req, res) => {
    try {
        const qrCode = await QRCode.findById(req.params.id)
            .populate('productBatch', 'productName batchNumber')
            .select('qrId scans scanCount lastScannedAt productBatch');

        if (!qrCode) {
            return errorResponse(
                res,
                'QR code not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Get detailed scan statistics
        const scanStats = qrCode.getScanStats();

        return successResponse(
            res,
            'QR scan details retrieved successfully',
            {
                qrCode: {
                    qrId: qrCode.qrId,
                    productBatch: qrCode.productBatch,
                    scanCount: qrCode.scanCount,
                    lastScannedAt: qrCode.lastScannedAt,
                },
                scans: qrCode.scans.slice(-100), // Last 100 scans
                statistics: scanStats,
            }
        );
    } catch (error) {
        console.error('Get QR scans error:', error);
        return errorResponse(
            res,
            'Failed to retrieve QR scans',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    generateQRCode,
    verifyQRCode,
    getQRCodes,
    getQRCodeById,
    deactivateQRCode,
    getQRAnalytics,
    getQRScans,
};