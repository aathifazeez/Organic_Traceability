const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        // Action Details
        action: {
            type: String,
            required: true,
            enum: [
                'CREATE',
                'UPDATE',
                'DELETE',
                'LOGIN',
                'LOGOUT',
                'APPROVE',
                'REJECT',
                'SCAN_QR',
                'PLACE_ORDER',
                'STATUS_CHANGE',
            ],
        },
        entityType: {
            type: String,
            required: true,
            enum: [
                'User',
                'IngredientBatch',
                'Certificate',
                'ProductBatch',
                'QRCode',
                'Order',
            ],
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        // User who performed the action
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Changes
        changes: {
            before: mongoose.Schema.Types.Mixed,
            after: mongoose.Schema.Types.Mixed,
        },

        // Metadata
        ipAddress: String,
        userAgent: String,
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },

        // Additional context
        description: String,
        metadata: mongoose.Schema.Types.Mixed,
    },
    {
        timestamps: false,
    }
);

// Indexes
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1 });

// Static method to log action
auditLogSchema.statics.logAction = function (data) {
    return this.create({
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        performedBy: data.performedBy,
        changes: data.changes || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        description: data.description,
        metadata: data.metadata || {},
    });
};

// Static method to get entity history
auditLogSchema.statics.getEntityHistory = function (entityType, entityId) {
    return this.find({ entityType, entityId })
        .populate('performedBy', 'name email')
        .sort({ timestamp: -1 });
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;