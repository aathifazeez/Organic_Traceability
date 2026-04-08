const mongoose = require('mongoose');
const { BATCH_STATUS } = require('../config/constants');

const ingredientBatchSchema = new mongoose.Schema(
    {
        // Batch Identification
        batchNumber: {
            type: String,
            required: [true, 'Batch number is required'],
            unique: true,
            trim: true,
            uppercase: true,
        },

        // Ingredient Details
        ingredientName: {
            type: String,
            required: [true, 'Ingredient name is required'],
            trim: true,
            index: true,
        },
        scientificName: {
            type: String,
            trim: true,
        },
        commonNames: [String],

        // Supplier Reference
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Supplier is required'],
            index: true,
        },

        // Quantity
        quantity: {
            value: {
                type: Number,
                required: [true, 'Quantity value is required'],
                min: [0, 'Quantity cannot be negative'],
            },
            unit: {
                type: String,
                required: [true, 'Quantity unit is required'],
                enum: ['ml', 'L', 'g', 'kg', 'oz', 'lb'],
            },
        },
        quantityRemaining: {
            value: {
                type: Number,
                required: true,
                min: [0, 'Remaining quantity cannot be negative'],
            },
            unit: String,
        },

        // Origin Information
        origin: {
            country: {
                type: String,
                required: [true, 'Origin country is required'],
            },
            region: String,
            farm: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },

        // Dates
        harvestDate: {
            type: Date,
            required: [true, 'Harvest date is required'],
        },
        manufacturingDate: {
            type: Date,
            required: [true, 'Manufacturing date is required'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
            validate: {
                validator: function (value) {
                    return value > this.manufacturingDate;
                },
                message: 'Expiry date must be after manufacturing date',
            },
        },

        // Certificates
        certificates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Certificate',
            },
        ],

        // Status
        status: {
            type: String,
            enum: Object.values(BATCH_STATUS),
            default: BATCH_STATUS.ACTIVE,
        },

        // Quality Parameters
        qualityGrade: {
            type: String,
            enum: ['A', 'B', 'C', 'Premium', 'Standard'],
            default: 'Standard',
        },
        purity: {
            type: Number,
            min: [0, 'Purity cannot be less than 0'],
            max: [100, 'Purity cannot exceed 100'],
        },

        // Storage
        storageConditions: {
            temperature: {
                min: Number,
                max: Number,
                unit: {
                    type: String,
                    enum: ['C', 'F'],
                    default: 'C',
                },
            },
            humidity: {
                min: Number,
                max: Number,
            },
            specialConditions: String,
        },

        // Testing & Analysis
        testResults: [
            {
                testType: String,
                result: String,
                testedBy: String,
                testDate: Date,
                documentUrl: String,
            },
        ],

        // Pricing
        unitPrice: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'INR'],
        },

        // Additional Information
        description: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        processingMethod: String,
        extractionMethod: String,

        // Images
        images: [
            {
                url: String,
                caption: String,
                isPrimary: Boolean,
            },
        ],

        // Usage Tracking
        usedInProducts: [
            {
                productBatch: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ProductBatch',
                },
                quantityUsed: {
                    value: Number,
                    unit: String,
                },
                usedDate: Date,
            },
        ],

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
ingredientBatchSchema.index({ batchNumber: 1 });
ingredientBatchSchema.index({ supplier: 1, status: 1 });
ingredientBatchSchema.index({ ingredientName: 1 });
ingredientBatchSchema.index({ expiryDate: 1 });
ingredientBatchSchema.index({ 'origin.country': 1 });

// Virtual for total quantity used
ingredientBatchSchema.virtual('totalQuantityUsed').get(function () {
    if (!this.usedInProducts || this.usedInProducts.length === 0) return 0;

    return this.usedInProducts.reduce((total, usage) => {
        return total + (usage.quantityUsed?.value || 0);
    }, 0);
});

// Virtual for percentage used
ingredientBatchSchema.virtual('percentageUsed').get(function () {
    if (!this.quantity || !this.quantity.value) return 0;
    const totalUsed = this.totalQuantityUsed;
    return (totalUsed / this.quantity.value) * 100;
});

// Virtual for is expired
ingredientBatchSchema.virtual('isExpired').get(function () {
    return new Date() > new Date(this.expiryDate);
});

// Virtual for days until expiry
ingredientBatchSchema.virtual('daysUntilExpiry').get(function () {
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Update quantityRemaining when batch is saved
ingredientBatchSchema.pre('save', function (next) {
    if (this.isNew) {
        this.quantityRemaining = {
            value: this.quantity.value,
            unit: this.quantity.unit,
        };
    }

    // Update status based on expiry and quantity
    if (this.isExpired) {
        this.status = BATCH_STATUS.EXPIRED;
    } else if (this.quantityRemaining.value <= 0) {
        this.status = BATCH_STATUS.DEPLETED;
    } else if (this.status !== BATCH_STATUS.PENDING) {
        this.status = BATCH_STATUS.ACTIVE;
    }

    next();
});

// Static method to find batches by supplier
ingredientBatchSchema.statics.findBySupplier = function (supplierId, status = null) {
    const query = { supplier: supplierId };
    if (status) query.status = status;

    return this.find(query)
        .populate('certificates')
        .sort({ createdAt: -1 });
};

// Static method to find expiring batches
ingredientBatchSchema.statics.findExpiring = function (days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.find({
        expiryDate: {
            $lte: futureDate,
            $gte: new Date(),
        },
        status: BATCH_STATUS.ACTIVE,
    }).populate('supplier', 'name email companyName');
};

// Method to reduce quantity when used
ingredientBatchSchema.methods.reduceQuantity = function (amount, unit) {
    if (unit !== this.quantityRemaining.unit) {
        throw new Error('Unit mismatch');
    }

    if (amount > this.quantityRemaining.value) {
        throw new Error('Insufficient quantity available');
    }

    this.quantityRemaining.value -= amount;

    if (this.quantityRemaining.value <= 0) {
        this.status = BATCH_STATUS.DEPLETED;
    }

    return this.save();
};

const IngredientBatch = mongoose.model('IngredientBatch', ingredientBatchSchema);

module.exports = IngredientBatch;