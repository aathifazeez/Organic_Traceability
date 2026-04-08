const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responses');
const { HTTP_STATUS, BATCH_STATUS, PAGINATION } = require('../config/constants');

/**
 * @desc    Create new ingredient batch
 * @route   POST /api/v1/batches
 * @access  Private (Supplier)
 */
const createBatch = async (req, res) => {
    try {
        const {
            ingredientName,
            scientificName,
            commonNames,
            quantity,
            origin,
            harvestDate,
            manufacturingDate,
            expiryDate,
            certificates,
            qualityGrade,
            purity,
            storageConditions,
            unitPrice,
            description,
            processingMethod,
            extractionMethod,
            tags,
        } = req.body;

        // Generate unique batch number
        const batchCount = await IngredientBatch.countDocuments();
        const batchNumber = `ING-${Date.now()}-${String(batchCount + 1).padStart(4, '0')}`;

        // Handle uploaded images
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file, index) => ({
                url: `/${file.path.replace(/\\/g, '/')}`,
                caption: file.originalname,
                isPrimary: index === 0,
            }));
        }

        // Create batch
        const batch = await IngredientBatch.create({
            batchNumber,
            ingredientName,
            scientificName,
            commonNames,
            supplier: req.user._id,
            quantity,
            origin,
            harvestDate,
            manufacturingDate,
            expiryDate,
            certificates,
            qualityGrade,
            purity,
            storageConditions,
            unitPrice,
            description,
            processingMethod,
            extractionMethod,
            images,
            tags,
        });

        // Populate references
        await batch.populate('certificates supplier');

        // Log the action
        await AuditLog.logAction({
            action: 'CREATE',
            entityType: 'IngredientBatch',
            entityId: batch._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Created ingredient batch: ${batch.batchNumber}`,
        });

        return successResponse(
            res,
            'Ingredient batch created successfully',
            { batch },
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Create batch error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to create batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get all batches (with filters and pagination)
 * @route   GET /api/v1/batches
 * @access  Private
 */
const getBatches = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            ingredientName,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = { isDeleted: { $ne: true } };

        // If supplier, only show their batches
        // If admin, show all batches
        if (req.user.role === 'supplier') {
            query.supplier = req.user._id;
        }

        // Filters
        if (status) {
            query.status = status;
        }

        if (ingredientName) {
            query.ingredientName = new RegExp(ingredientName, 'i');
        }

        if (search) {
            query.$or = [
                { batchNumber: new RegExp(search, 'i') },
                { ingredientName: new RegExp(search, 'i') },
                { scientificName: new RegExp(search, 'i') },
            ];
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [batches, totalCount] = await Promise.all([
            IngredientBatch.find(query)
                .populate('supplier', 'name email companyName')
                .populate('certificates')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            IngredientBatch.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'Batches retrieved successfully',
            batches,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get batches error:', error);
        return errorResponse(
            res,
            'Failed to retrieve batches',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get single batch by ID
 * @route   GET /api/v1/batches/:id
 * @access  Private
 */
const getBatchById = async (req, res) => {
    try {
        const batch = await IngredientBatch.findById(req.params.id)
            .populate('supplier', 'name email companyName phone website')
            .populate('certificates')
            .populate('usedInProducts.productBatch', 'batchNumber productName');

        if (!batch) {
            return errorResponse(
                res,
                'Batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check access - suppliers can only view their own batches
        if (req.user.role === 'supplier' && batch.supplier._id.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to view this batch',
                HTTP_STATUS.FORBIDDEN
            );
        }

        return successResponse(
            res,
            'Batch retrieved successfully',
            { batch }
        );
    } catch (error) {
        console.error('Get batch error:', error);
        return errorResponse(
            res,
            'Failed to retrieve batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Update batch
 * @route   PUT /api/v1/batches/:id
 * @access  Private (Supplier - own batches only)
 */
const updateBatch = async (req, res) => {
    try {
        const batch = await IngredientBatch.findById(req.params.id);

        if (!batch) {
            return errorResponse(
                res,
                'Batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check ownership
        if (req.user.role === 'supplier' && batch.supplier.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to update this batch',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Fields that can be updated
        const allowedUpdates = [
            'ingredientName',
            'scientificName',
            'commonNames',
            'quantity',
            'origin',
            'harvestDate',
            'manufacturingDate',
            'expiryDate',
            'certificates',
            'qualityGrade',
            'purity',
            'storageConditions',
            'unitPrice',
            'description',
            'processingMethod',
            'extractionMethod',
            'tags',
            'notes',
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `/${file.path.replace(/\\/g, '/')}`,
                caption: file.originalname,
                isPrimary: false,
            }));
            updates.images = [...(batch.images || []), ...newImages];
        }

        // Store old values for audit
        const oldValues = {};
        Object.keys(updates).forEach(key => {
            oldValues[key] = batch[key];
        });

        // Update batch
        Object.assign(batch, updates);
        await batch.save();

        await batch.populate('certificates supplier');

        // Log the update
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'IngredientBatch',
            entityId: batch._id,
            performedBy: req.user._id,
            changes: {
                before: oldValues,
                after: updates,
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Updated ingredient batch: ${batch.batchNumber}`,
        });

        return successResponse(
            res,
            'Batch updated successfully',
            { batch }
        );
    } catch (error) {
        console.error('Update batch error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to update batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Delete batch (soft delete)
 * @route   DELETE /api/v1/batches/:id
 * @access  Private (Supplier - own batches only)
 */
const deleteBatch = async (req, res) => {
    try {
        const batch = await IngredientBatch.findById(req.params.id);

        if (!batch) {
            return errorResponse(
                res,
                'Batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check ownership
        if (req.user.role === 'supplier' && batch.supplier.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to delete this batch',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Check if batch is used in any products
        if (batch.usedInProducts && batch.usedInProducts.length > 0) {
            return errorResponse(
                res,
                'Cannot delete batch that is used in products',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Soft delete
        batch.status = BATCH_STATUS.DEPLETED;
        batch.isDeleted = true;
        await batch.save();

        // Log the deletion
        await AuditLog.logAction({
            action: 'DELETE',
            entityType: 'IngredientBatch',
            entityId: batch._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Deleted ingredient batch: ${batch.batchNumber}`,
        });

        return successResponse(res, 'Batch deleted successfully');
    } catch (error) {
        console.error('Delete batch error:', error);
        return errorResponse(
            res,
            'Failed to delete batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get batch analytics for supplier
 * @route   GET /api/v1/batches/analytics/summary
 * @access  Private (Supplier)
 */
const getBatchAnalytics = async (req, res) => {
    try {
        const supplierId = req.user._id;

        // Get all batches for supplier
        const batches = await IngredientBatch.find({ supplier: supplierId });

        // Calculate analytics
        const analytics = {
            totalBatches: batches.length,
            activeBatches: batches.filter(b => b.status === BATCH_STATUS.ACTIVE).length,
            expiredBatches: batches.filter(b => b.status === BATCH_STATUS.EXPIRED).length,
            depletedBatches: batches.filter(b => b.status === BATCH_STATUS.DEPLETED).length,
            totalValue: batches.reduce((sum, b) => sum + (b.unitPrice * b.quantity?.value || 0), 0),
            averageQuantity: batches.length > 0
                ? batches.reduce((sum, b) => sum + (b.quantity?.value || 0), 0) / batches.length
                : 0,
            expiringInNext30Days: batches.filter(b => {
                const daysUntilExpiry = b.daysUntilExpiry;
                return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
            }).length,
            lowStock: batches.filter(b => b.percentageUsed > 80).length,
        };

        // Batches by status
        const batchesByStatus = {
            [BATCH_STATUS.ACTIVE]: analytics.activeBatches,
            [BATCH_STATUS.PENDING]: batches.filter(b => b.status === BATCH_STATUS.PENDING).length,
            [BATCH_STATUS.EXPIRED]: analytics.expiredBatches,
            [BATCH_STATUS.DEPLETED]: analytics.depletedBatches,
        };

        // Top ingredients by count
        const ingredientCounts = {};
        batches.forEach(batch => {
            ingredientCounts[batch.ingredientName] = (ingredientCounts[batch.ingredientName] || 0) + 1;
        });

        const topIngredients = Object.entries(ingredientCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Recent batches
        const recentBatches = batches
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(b => ({
                id: b._id,
                batchNumber: b.batchNumber,
                ingredientName: b.ingredientName,
                quantity: b.quantity,
                status: b.status,
                createdAt: b.createdAt,
            }));

        return successResponse(
            res,
            'Analytics retrieved successfully',
            {
                summary: analytics,
                batchesByStatus,
                topIngredients,
                recentBatches,
            }
        );
    } catch (error) {
        console.error('Get analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get expiring batches
 * @route   GET /api/v1/batches/expiring
 * @access  Private
 */
const getExpiringBatches = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const query = { status: BATCH_STATUS.ACTIVE };

        // If supplier, only show their batches
        if (req.user.role === 'supplier') {
            query.supplier = req.user._id;
        }

        const batches = await IngredientBatch.find(query)
            .populate('supplier', 'name email companyName')
            .lean();

        // Filter by expiry
        const expiringBatches = batches.filter(batch => {
            const daysUntilExpiry = Math.ceil(
                (new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExpiry > 0 && daysUntilExpiry <= parseInt(days);
        });

        return successResponse(
            res,
            `Found ${expiringBatches.length} batches expiring in next ${days} days`,
            { batches: expiringBatches }
        );
    } catch (error) {
        console.error('Get expiring batches error:', error);
        return errorResponse(
            res,
            'Failed to retrieve expiring batches',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    createBatch,
    getBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
    getBatchAnalytics,
    getExpiringBatches,
};