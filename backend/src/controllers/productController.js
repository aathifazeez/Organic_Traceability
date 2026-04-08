const ProductBatch = require('../models/ProductBatch');
const IngredientBatch = require('../models/IngredientBatch');
const QRCode = require('../models/QRCode');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responses');
const { HTTP_STATUS, PAGINATION, BATCH_STATUS } = require('../config/constants');

/**
 * @desc    Create new product batch
 * @route   POST /api/v1/products
 * @access  Private (Admin)
 */
const createProductBatch = async (req, res) => {
    try {
        const {
            productName,
            category,
            skinType,
            shortDescription,
            longDescription,
            ingredients,
            productionDate,
            expiryDate,
            totalUnits,
            unitSize,
            manufacturingCost,
            retailPrice,
            keyFeatures,
            benefits,
            howToUse,
            ingredients_list,
            allergens,
            warnings,
            safetyTested,
            dermatologistTested,
            storageInstructions,
            tags,
        } = req.body;

        // Validate ingredients array
        if (!ingredients || ingredients.length === 0) {
            return errorResponse(
                res,
                'At least one ingredient is required',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Verify all ingredient batches exist and are available
        const ingredientBatchIds = ingredients.map(ing => ing.ingredientBatch);
        const ingredientBatches = await IngredientBatch.find({
            _id: { $in: ingredientBatchIds },
            status: BATCH_STATUS.ACTIVE,
        }).populate('supplier certificates');

        if (ingredientBatches.length !== ingredientBatchIds.length) {
            return errorResponse(
                res,
                'One or more ingredient batches not found or inactive',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Validate ingredient quantities
        for (const ingredient of ingredients) {
            const batch = ingredientBatches.find(
                b => b._id.toString() === ingredient.ingredientBatch.toString()
            );

            if (!batch) continue;

            // Check if enough quantity is available
            if (batch.quantityRemaining.value < ingredient.quantityUsed.value) {
                return errorResponse(
                    res,
                    `Insufficient quantity for ingredient: ${batch.ingredientName}`,
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            // Check unit compatibility
            if (batch.quantityRemaining.unit !== ingredient.quantityUsed.unit) {
                return errorResponse(
                    res,
                    `Unit mismatch for ingredient: ${batch.ingredientName}`,
                    HTTP_STATUS.BAD_REQUEST
                );
            }
        }

        // Generate unique batch number
        const productCount = await ProductBatch.countDocuments();
        const batchNumber = `PROD-${Date.now()}-${String(productCount + 1).padStart(4, '0')}`;

        // Handle uploaded images
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file, index) => ({
                url: `/${file.path.replace(/\\/g, '/')}`,
                caption: file.originalname,
                isPrimary: index === 0,
            }));
        }

        // Create product batch
        const productBatch = await ProductBatch.create({
            batchNumber,
            productName,
            category,
            skinType,
            shortDescription,
            longDescription,
            manufacturer: req.user._id,
            ingredients,
            productionDate,
            expiryDate,
            totalUnits,
            unitSize,
            manufacturingCost,
            retailPrice,
            images,
            keyFeatures,
            benefits,
            howToUse,
            ingredients_list,
            allergens,
            warnings,
            safetyTested: safetyTested === 'true' || safetyTested === true,
            dermatologistTested: dermatologistTested === 'true' || dermatologistTested === true,
            storageInstructions,
            tags,
        });

        // Reduce ingredient batch quantities
        for (const ingredient of ingredients) {
            const batch = await IngredientBatch.findById(ingredient.ingredientBatch);
            if (batch) {
                await batch.reduceQuantity(
                    ingredient.quantityUsed.value,
                    ingredient.quantityUsed.unit
                );

                // Add usage tracking
                batch.usedInProducts.push({
                    productBatch: productBatch._id,
                    quantityUsed: ingredient.quantityUsed,
                    usedDate: new Date(),
                });
                await batch.save();
            }
        }

        // Populate references
        await productBatch.populate([
            {
                path: 'ingredients.ingredientBatch',
                populate: {
                    path: 'supplier certificates',
                },
            },
            { path: 'manufacturer', select: 'name email' },
        ]);

        // Log the action
        await AuditLog.logAction({
            action: 'CREATE',
            entityType: 'ProductBatch',
            entityId: productBatch._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Created product batch: ${productBatch.batchNumber}`,
        });

        return successResponse(
            res,
            'Product batch created successfully',
            { productBatch },
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Create product batch error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to create product batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get all product batches (with filters and pagination)
 * @route   GET /api/v1/products
 * @access  Private (Admin) / Public (listed products only)
 */
const getProductBatches = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            category,
            skinType,
            isListed,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = {};

        // Public access: only listed and active products
        // Admin access: all products
        if (!req.user || req.user.role !== 'admin') {
            query.isListed = true;
            query.status = BATCH_STATUS.ACTIVE;
            query.unitsRemaining = { $gt: 0 };
        }

        // Filters
        if (status) {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (skinType) {
            query.skinType = skinType;
        }

        if (isListed !== undefined) {
            query.isListed = isListed === 'true';
        }

        if (search) {
            query.$or = [
                { batchNumber: new RegExp(search, 'i') },
                { productName: new RegExp(search, 'i') },
                { shortDescription: new RegExp(search, 'i') },
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
        const [products, totalCount] = await Promise.all([
            ProductBatch.find(query)
                .populate('manufacturer', 'name email companyName')
                .populate({
                    path: 'ingredients.ingredientBatch',
                    populate: {
                        path: 'supplier certificates',
                    },
                })
                .populate('qrCode')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            ProductBatch.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'Product batches retrieved successfully',
            products,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get product batches error:', error);
        return errorResponse(
            res,
            'Failed to retrieve product batches',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get single product batch by ID
 * @route   GET /api/v1/products/:id
 * @access  Private (Admin) / Public (if listed)
 */
const getProductBatchById = async (req, res) => {
    try {
        const product = await ProductBatch.findById(req.params.id)
            .populate('manufacturer', 'name email companyName phone')
            .populate({
                path: 'ingredients.ingredientBatch',
                populate: {
                    path: 'supplier certificates',
                },
            })
            .populate('qrCode');

        if (!product) {
            return errorResponse(
                res,
                'Product batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Public access: only if listed and active
        if (!req.user || req.user.role !== 'admin') {
            if (!product.isListed || product.status !== BATCH_STATUS.ACTIVE) {
                return errorResponse(
                    res,
                    'Product not available',
                    HTTP_STATUS.NOT_FOUND
                );
            }
        }

        return successResponse(
            res,
            'Product batch retrieved successfully',
            { product }
        );
    } catch (error) {
        console.error('Get product batch error:', error);
        return errorResponse(
            res,
            'Failed to retrieve product batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Update product batch
 * @route   PUT /api/v1/products/:id
 * @access  Private (Admin)
 */
const updateProductBatch = async (req, res) => {
    try {
        const product = await ProductBatch.findById(req.params.id);

        if (!product) {
            return errorResponse(
                res,
                'Product batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Fields that can be updated
        const allowedUpdates = [
            'productName',
            'category',
            'skinType',
            'shortDescription',
            'longDescription',
            'expiryDate',
            'retailPrice',
            'manufacturingCost',
            'keyFeatures',
            'benefits',
            'howToUse',
            'ingredients_list',
            'allergens',
            'warnings',
            'safetyTested',
            'dermatologistTested',
            'storageInstructions',
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
            updates.images = [...(product.images || []), ...newImages];
        }

        // Store old values for audit
        const oldValues = {};
        Object.keys(updates).forEach(key => {
            oldValues[key] = product[key];
        });

        // Update product
        Object.assign(product, updates);
        await product.save();

        await product.populate([
            {
                path: 'ingredients.ingredientBatch',
                populate: {
                    path: 'supplier certificates',
                },
            },
            { path: 'manufacturer', select: 'name email' },
            'qrCode',
        ]);

        // Log the update
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'ProductBatch',
            entityId: product._id,
            performedBy: req.user._id,
            changes: {
                before: oldValues,
                after: updates,
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Updated product batch: ${product.batchNumber}`,
        });

        return successResponse(
            res,
            'Product batch updated successfully',
            { product }
        );
    } catch (error) {
        console.error('Update product batch error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to update product batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Delete product batch (soft delete)
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin)
 */
const deleteProductBatch = async (req, res) => {
    try {
        const product = await ProductBatch.findById(req.params.id);

        if (!product) {
            return errorResponse(
                res,
                'Product batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check if product has been sold
        if (product.unitsSold > 0) {
            return errorResponse(
                res,
                'Cannot delete product batch with sales history',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Soft delete
        product.status = BATCH_STATUS.DEPLETED;
        product.isListed = false;
        await product.save();

        // Log the deletion
        await AuditLog.logAction({
            action: 'DELETE',
            entityType: 'ProductBatch',
            entityId: product._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Deleted product batch: ${product.batchNumber}`,
        });

        return successResponse(res, 'Product batch deleted successfully');
    } catch (error) {
        console.error('Delete product batch error:', error);
        return errorResponse(
            res,
            'Failed to delete product batch',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Toggle product listing status
 * @route   PATCH /api/v1/products/:id/toggle-listing
 * @access  Private (Admin)
 */
const toggleProductListing = async (req, res) => {
    try {
        const product = await ProductBatch.findById(req.params.id);

        if (!product) {
            return errorResponse(
                res,
                'Product batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Can only list active products with inventory
        if (!product.isListed &&
            (product.status !== BATCH_STATUS.ACTIVE || product.unitsRemaining <= 0)) {
            return errorResponse(
                res,
                'Cannot list inactive or out-of-stock products',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        product.isListed = !product.isListed;
        product.listedAt = product.isListed ? new Date() : null;
        await product.save();

        // Log the action
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'ProductBatch',
            entityId: product._id,
            performedBy: req.user._id,
            changes: {
                before: { isListed: !product.isListed },
                after: { isListed: product.isListed },
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `${product.isListed ? 'Listed' : 'Unlisted'} product: ${product.batchNumber}`,
        });

        return successResponse(
            res,
            `Product ${product.isListed ? 'listed' : 'unlisted'} successfully`,
            { product }
        );
    } catch (error) {
        console.error('Toggle listing error:', error);
        return errorResponse(
            res,
            'Failed to update listing status',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get product traceability information
 * @route   GET /api/v1/products/:id/traceability
 * @access  Public
 */
const getProductTraceability = async (req, res) => {
    try {
        const product = await ProductBatch.findById(req.params.id)
            .populate('manufacturer', 'name email companyName')
            .populate({
                path: 'ingredients.ingredientBatch',
                populate: {
                    path: 'supplier certificates',
                    select: 'name email companyName certificateType certificateNumber issuingAuthority expiryDate status',
                },
            });

        if (!product) {
            return errorResponse(
                res,
                'Product batch not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Build traceability chain
        const traceabilityData = {
            product: {
                batchNumber: product.batchNumber,
                productName: product.productName,
                productionDate: product.productionDate,
                expiryDate: product.expiryDate,
                manufacturer: product.manufacturer,
            },
            ingredients: product.ingredients.map(ing => {
                const batch = ing.ingredientBatch;
                return {
                    ingredientName: batch.ingredientName,
                    batchNumber: batch.batchNumber,
                    quantityUsed: ing.quantityUsed,
                    percentage: ing.percentage,
                    supplier: {
                        name: batch.supplier.name,
                        companyName: batch.supplier.companyName,
                        email: batch.supplier.email,
                    },
                    origin: batch.origin,
                    harvestDate: batch.harvestDate,
                    qualityGrade: batch.qualityGrade,
                    certificates: batch.certificates.map(cert => ({
                        certificateType: cert.certificateType,
                        certificateNumber: cert.certificateNumber,
                        issuingAuthority: cert.issuingAuthority,
                        expiryDate: cert.expiryDate,
                        status: cert.status,
                    })),
                };
            }),
            certificationSummary: {
                totalCertificates: product.ingredients.reduce(
                    (sum, ing) => sum + (ing.ingredientBatch.certificates?.length || 0),
                    0
                ),
                uniqueSuppliers: new Set(
                    product.ingredients.map(ing => ing.ingredientBatch.supplier._id.toString())
                ).size,
            },
        };

        return successResponse(
            res,
            'Traceability information retrieved successfully',
            traceabilityData
        );
    } catch (error) {
        console.error('Get traceability error:', error);
        return errorResponse(
            res,
            'Failed to retrieve traceability information',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get available ingredient batches for product creation
 * @route   GET /api/v1/products/ingredients/available
 * @access  Private (Admin)
 */
const getAvailableIngredients = async (req, res) => {
    try {
        const { search, supplierId } = req.query;

        const query = {
            status: BATCH_STATUS.ACTIVE,
            'quantityRemaining.value': { $gt: 0 },
        };

        if (search) {
            query.$or = [
                { ingredientName: new RegExp(search, 'i') },
                { scientificName: new RegExp(search, 'i') },
                { batchNumber: new RegExp(search, 'i') },
            ];
        }

        if (supplierId) {
            query.supplier = supplierId;
        }

        const ingredients = await IngredientBatch.find(query)
            .populate('supplier', 'name email companyName')
            .populate('certificates')
            .select('batchNumber ingredientName scientificName quantity quantityRemaining unitPrice supplier certificates origin qualityGrade')
            .sort({ createdAt: -1 })
            .limit(50);

        return successResponse(
            res,
            'Available ingredients retrieved successfully',
            { ingredients, count: ingredients.length }
        );
    } catch (error) {
        console.error('Get available ingredients error:', error);
        return errorResponse(
            res,
            'Failed to retrieve available ingredients',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get product analytics
 * @route   GET /api/v1/products/analytics/summary
 * @access  Private (Admin)
 */
const getProductAnalytics = async (req, res) => {
    try {
        const products = await ProductBatch.find();

        const analytics = {
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === BATCH_STATUS.ACTIVE).length,
            listedProducts: products.filter(p => p.isListed).length,
            totalInventory: products.reduce((sum, p) => sum + p.unitsRemaining, 0),
            totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
            totalUnitsSold: products.reduce((sum, p) => sum + p.unitsSold, 0),
            lowStockProducts: products.filter(p => p.isLowStock).length,
            outOfStockProducts: products.filter(p => p.isOutOfStock).length,
        };

        // Products by category
        const productsByCategory = {};
        products.forEach(product => {
            productsByCategory[product.category] = (productsByCategory[product.category] || 0) + 1;
        });

        // Best selling products
        const bestSelling = products
            .sort((a, b) => b.unitsSold - a.unitsSold)
            .slice(0, 5)
            .map(p => ({
                id: p._id,
                productName: p.productName,
                batchNumber: p.batchNumber,
                unitsSold: p.unitsSold,
                revenue: p.revenue,
            }));

        // Low stock alerts
        const lowStockAlerts = products
            .filter(p => p.isLowStock && !p.isOutOfStock)
            .map(p => ({
                id: p._id,
                productName: p.productName,
                batchNumber: p.batchNumber,
                unitsRemaining: p.unitsRemaining,
                inventoryPercentage: p.inventoryPercentage,
            }));

        return successResponse(
            res,
            'Product analytics retrieved successfully',
            {
                summary: analytics,
                productsByCategory,
                bestSelling,
                lowStockAlerts,
            }
        );
    } catch (error) {
        console.error('Get product analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve product analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    createProductBatch,
    getProductBatches,
    getProductBatchById,
    updateProductBatch,
    deleteProductBatch,
    toggleProductListing,
    getProductTraceability,
    getAvailableIngredients,
    getProductAnalytics,
};