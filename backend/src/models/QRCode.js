const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const qrCodeSchema = new mongoose.Schema(
    {
        // Unique QR Code ID
        qrId: {
            type: String,
            required: true,
            unique: true,
            default: () => `QR-${uuidv4().substring(0, 8).toUpperCase()}`,
        },

        // Product Reference
        productBatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductBatch',
            required: [true, 'Product batch is required'],
            index: true,
        },

        // QR Code Data
        qrCodeUrl: {
            type: String,
            required: true,
        },
        qrCodeImage: {
            type: String, // Base64 or URL to image
        },

        // Verification URL
        verificationUrl: {
            type: String,
            required: true,
        },

        // Blockchain Hash (for immutability)
        blockchainHash: {
            type: String,
            unique: true,
            sparse: true,
        },
        blockchainTimestamp: Date,

        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Generation Details
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },

        // Scan Analytics
        scanCount: {
            type: Number,
            default: 0,
        },
        lastScannedAt: Date,
        scans: [
            {
                scannedAt: {
                    type: Date,
                    default: Date.now,
                },
                ipAddress: String,
                userAgent: String,
                location: {
                    country: String,
                    city: String,
                    coordinates: {
                        latitude: Number,
                        longitude: Number,
                    },
                },
                device: {
                    type: String,
                    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
                },
            },
        ],

        // Expiry (optional - for promotional QR codes)
        expiresAt: Date,

        // Additional Data
        metadata: {
            version: {
                type: String,
                default: '1.0',
            },
            format: {
                type: String,
                enum: ['png', 'svg', 'pdf'],
                default: 'png',
            },
            size: {
                type: Number,
                default: 300,
            },
            errorCorrectionLevel: {
                type: String,
                enum: ['L', 'M', 'Q', 'H'],
                default: 'M',
            },
        },

        // Notes
        notes: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
qrCodeSchema.index({ qrId: 1 });
qrCodeSchema.index({ productBatch: 1 });
qrCodeSchema.index({ blockchainHash: 1 });
qrCodeSchema.index({ isActive: 1 });

// Virtual for is expired
qrCodeSchema.virtual('isExpired').get(function () {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
});

// Virtual for unique scanners
qrCodeSchema.virtual('uniqueScanners').get(function () {
    if (!this.scans || this.scans.length === 0) return 0;
    const uniqueIPs = new Set(this.scans.map(scan => scan.ipAddress));
    return uniqueIPs.size;
});

// Method to record a scan
qrCodeSchema.methods.recordScan = function (scanData = {}) {
    this.scanCount += 1;
    this.lastScannedAt = new Date();

    this.scans.push({
        scannedAt: new Date(),
        ipAddress: scanData.ipAddress || null,
        userAgent: scanData.userAgent || null,
        location: scanData.location || {},
        device: scanData.device || 'unknown',
    });

    // Keep only last 1000 scans for performance
    if (this.scans.length > 1000) {
        this.scans = this.scans.slice(-1000);
    }

    return this.save();
};

// Method to deactivate QR code
qrCodeSchema.methods.deactivate = function () {
    this.isActive = false;
    return this.save();
};

// Method to get scan statistics
qrCodeSchema.methods.getScanStats = function () {
    if (!this.scans || this.scans.length === 0) {
        return {
            totalScans: 0,
            uniqueScanners: 0,
            lastScan: null,
            deviceBreakdown: {},
            topLocations: [],
        };
    }

    // Device breakdown
    const deviceBreakdown = this.scans.reduce((acc, scan) => {
        const device = scan.device || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {});

    // Top locations
    const locationCounts = this.scans
        .filter(scan => scan.location && scan.location.country)
        .reduce((acc, scan) => {
            const country = scan.location.country;
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {});

    const topLocations = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, count]) => ({ country, count }));

    return {
        totalScans: this.scanCount,
        uniqueScanners: this.uniqueScanners,
        lastScan: this.lastScannedAt,
        deviceBreakdown,
        topLocations,
    };
};

// Static method to find by QR ID
qrCodeSchema.statics.findByQrId = function (qrId) {
    return this.findOne({ qrId, isActive: true })
        .populate({
            path: 'productBatch',
            populate: {
                path: 'ingredients.ingredientBatch',
                populate: {
                    path: 'supplier certificates',
                },
            },
        });
};

// Static method to get analytics
qrCodeSchema.statics.getAnalytics = function (startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalQRCodes: { $sum: 1 },
                totalScans: { $sum: '$scanCount' },
                avgScansPerQR: { $avg: '$scanCount' },
            },
        },
    ]);
};

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;