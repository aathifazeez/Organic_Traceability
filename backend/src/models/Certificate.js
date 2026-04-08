const mongoose = require('mongoose');
const { CERTIFICATE_TYPES } = require('../config/constants');

const certificateSchema = new mongoose.Schema(
    {
        // Certificate Details
        certificateNumber: {
            type: String,
            required: [true, 'Certificate number is required'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        certificateType: {
            type: String,
            required: [true, 'Certificate type is required'],
            enum: CERTIFICATE_TYPES,
        },
        certificateName: {
            type: String,
            required: [true, 'Certificate name is required'],
            trim: true,
        },

        // Issuing Authority
        issuingAuthority: {
            type: String,
            required: [true, 'Issuing authority is required'],
            trim: true,
        },
        issueDate: {
            type: Date,
            required: [true, 'Issue date is required'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
            validate: {
                validator: function (value) {
                    return value > this.issueDate;
                },
                message: 'Expiry date must be after issue date',
            },
        },

        // Supplier Reference
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Supplier is required'],
            index: true,
        },

        // File Information
        documentUrl: {
            type: String,
            required: [true, 'Certificate document is required'],
        },
        documentName: String,
        documentSize: Number,
        documentType: String,

        // Status
        status: {
            type: String,
            enum: ['valid', 'expiring-soon', 'expired', 'revoked'],
            default: 'valid',
        },

        // Verification
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        verifiedAt: Date,
        verificationNotes: String,

        // Additional Information
        scope: {
            type: String,
            trim: true,
            maxlength: [500, 'Scope cannot exceed 500 characters'],
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        },

        // Metadata
        metadata: {
            country: String,
            region: String,
            standards: [String],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
certificateSchema.index({ supplier: 1, status: 1 });
certificateSchema.index({ certificateType: 1 });
certificateSchema.index({ expiryDate: 1 });
certificateSchema.index({ certificateNumber: 1 });

// Virtual for days until expiry
certificateSchema.virtual('daysUntilExpiry').get(function () {
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for is expired
certificateSchema.virtual('isExpired').get(function () {
    return new Date() > new Date(this.expiryDate);
});

// Virtual for is expiring soon (within 30 days)
certificateSchema.virtual('isExpiringSoon').get(function () {
    const daysUntilExpiry = this.daysUntilExpiry;
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
});

// Update status based on expiry date
certificateSchema.pre('save', function (next) {
    if (this.isExpired) {
        this.status = 'expired';
    } else if (this.isExpiringSoon) {
        this.status = 'expiring-soon';
    } else if (this.status !== 'revoked') {
        this.status = 'valid';
    }
    next();
});

// Static method to find expiring certificates
certificateSchema.statics.findExpiring = function (days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.find({
        expiryDate: {
            $lte: futureDate,
            $gte: new Date(),
        },
        status: { $ne: 'revoked' },
    }).populate('supplier', 'name email companyName');
};

// Static method to find expired certificates
certificateSchema.statics.findExpired = function () {
    return this.find({
        expiryDate: { $lt: new Date() },
        status: { $ne: 'revoked' },
    }).populate('supplier', 'name email companyName');
};

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;