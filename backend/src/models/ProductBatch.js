const mongoose = require('mongoose');
const { BATCH_STATUS, PRODUCT_CATEGORIES, SKIN_TYPES } = require('../config/constants');

const productBatchSchema = new mongoose.Schema(
    {
        // Batch Identification
        batchNumber: {
            type: String,
            required: [true, 'Batch number is required'],
            unique: true,
            trim: true,
            uppercase: true,
        },

        // Product Details
        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            index: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: PRODUCT_CATEGORIES,
        },
        skinType: {
            type: String,
            required: [true, 'Skin type is required'],
            enum: SKIN_TYPES,
        },

        // Description
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            maxlength: [200, 'Short description cannot exceed 200 characters'],
        },
        longDescription: {
            type: String,
            maxlength: [2000, 'Long description cannot exceed 2000 characters'],
        },

        // Manufacturer (Admin)
        manufacturer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Manufacturer is required'],
        },

        // Ingredients Used
        ingredients: [
            {
                ingredientBatch: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'IngredientBatch',
                    required: true,
                },
                quantityUsed: {
                    value: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                    unit: {
                        type: String,
                        required: true,
                    },
                },
                percentage: {
                    type: Number,
                    min: 0,
                    max: 100,
                },
                purpose: String, // e.g., "Active ingredient", "Preservative"
            },
        ],

        // Production Details
        productionDate: {
            type: Date,
            required: [true, 'Production date is required'],
            default: Date.now,
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
            validate: {
                validator: function (value) {
                    return value > this.productionDate;
                },
                message: 'Expiry date must be after production date',
            },
        },

        // Quantity
        totalUnits: {
            type: Number,
            required: [true, 'Total units is required'],
            min: [1, 'Total units must be at least 1'],
        },
        unitsRemaining: {
            type: Number,
            required: true,
            min: [0, 'Units remaining cannot be negative'],
        },
        unitSize: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
                enum: ['ml', 'g', 'oz'],
            },
        },

        // Status
        status: {
            type: String,
            enum: Object.values(BATCH_STATUS),
            default: BATCH_STATUS.ACTIVE,
        },

        // Pricing
        manufacturingCost: {
            type: Number,
            min: [0, 'Cost cannot be negative'],
        },
        retailPrice: {
            type: Number,
            required: [true, 'Retail price is required'],
            min: [0, 'Price cannot be negative'],
        },
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'INR'],
        },

        // Images
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                caption: String,
                isPrimary: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

        // Features & Benefits
        keyFeatures: [String],
        benefits: [String],
        howToUse: String,
        ingredients_list: String, // Formatted for label

        // Quality & Safety
        allergens: [String],
        warnings: [String],
        safetyTested: {
            type: Boolean,
            default: false,
        },
        dermatologistTested: {
            type: Boolean,
            default: false,
        },

        // Storage
        storageInstructions: String,

        // E-commerce Listing
        isListed: {
            type: Boolean,
            default: false,
        },
        listedAt: Date,

        // QR Code
        qrCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QRCode',
        },

        // Sales Tracking
        unitsSold: {
            type: Number,
            default: 0,
            min: 0,
        },
        revenue: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Metadata
        tags: [String],
        notes: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
productBatchSchema.index({ batchNumber: 1 });
productBatchSchema.index({ productName: 1 });
productBatchSchema.index({ category: 1, skinType: 1 });
productBatchSchema.index({ status: 1, isListed: 1 });
productBatchSchema.index({ manufacturer: 1 });

// Virtual for inventory percentage
productBatchSchema.virtual('inventoryPercentage').get(function () {
    if (!this.totalUnits) return 0;
    return (this.unitsRemaining / this.totalUnits) * 100;
});

// Virtual for is low stock (less than 20%)
productBatchSchema.virtual('isLowStock').get(function () {
    return this.inventoryPercentage < 20;
});

// Virtual for is out of stock
productBatchSchema.virtual('isOutOfStock').get(function () {
    return this.unitsRemaining <= 0;
});

// Virtual for is expired
productBatchSchema.virtual('isExpired').get(function () {
    return new Date() > new Date(this.expiryDate);
});

// Virtual for profit margin
productBatchSchema.virtual('profitMargin').get(function () {
    if (!this.manufacturingCost || !this.retailPrice) return 0;
    return ((this.retailPrice - this.manufacturingCost) / this.retailPrice) * 100;
});

// Virtual for primary image
productBatchSchema.virtual('primaryImage').get(function () {
    if (!this.images || this.images.length === 0) return null;
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0];
});

// Update status based on inventory and expiry
productBatchSchema.pre('save', function (next) {
    // Set initial unitsRemaining
    if (this.isNew) {
        this.unitsRemaining = this.totalUnits;
    }

    // Update status
    if (this.isExpired) {
        this.status = BATCH_STATUS.EXPIRED;
    } else if (this.unitsRemaining <= 0) {
        this.status = BATCH_STATUS.DEPLETED;
    } else if (this.status !== BATCH_STATUS.PENDING) {
        this.status = BATCH_STATUS.ACTIVE;
    }

    next();
});

/**
 * Reduce inventory when order is placed
 */
productBatchSchema.methods.reduceInventory = async function (quantity) {
    if (this.unitsRemaining < quantity) {
        throw new Error('Insufficient inventory');
    }

    this.unitsRemaining -= quantity;
    this.unitsSold += quantity;

    await this.save();
    return this;
};

/**
 * Restore inventory when order is cancelled
 */
productBatchSchema.methods.restoreInventory = async function (quantity) {
    this.unitsRemaining += quantity;
    this.unitsSold = Math.max(0, this.unitsSold - quantity);

    await this.save();
    return this;
};

// Static method to find listed products
productBatchSchema.statics.findListed = function (filters = {}) {
    return this.find({
        isListed: true,
        status: BATCH_STATUS.ACTIVE,
        unitsRemaining: { $gt: 0 },
        expiryDate: { $gt: new Date() },
        ...filters,
    })
        .populate('ingredients.ingredientBatch')
        .populate('qrCode')
        .sort({ listedAt: -1 });
};

// Static method to find low stock products
productBatchSchema.statics.findLowStock = function (threshold = 20) {
    return this.find({
        status: BATCH_STATUS.ACTIVE,
    }).then(products => {
        return products.filter(product => product.inventoryPercentage < threshold);
    });
};

const ProductBatch = mongoose.model('ProductBatch', productBatchSchema);

module.exports = ProductBatch;