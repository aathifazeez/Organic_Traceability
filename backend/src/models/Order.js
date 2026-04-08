const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../config/constants');

const orderSchema = new mongoose.Schema(
    {
        // Order Identification
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        },

        // Customer Information
        customer: {
            name: {
                type: String,
                required: [true, 'Customer name is required'],
            },
            email: {
                type: String,
                required: [true, 'Customer email is required'],
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
            },
            phone: {
                type: String,
                required: [true, 'Customer phone is required'],
            },
        },

        // Order Items
        items: [
            {
                productBatch: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ProductBatch',
                    required: true,
                },
                productName: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                },
                unitPrice: {
                    type: Number,
                    required: true,
                    min: [0, 'Price cannot be negative'],
                },
                subtotal: {
                    type: Number,
                    required: true,
                },
                qrCode: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'QRCode',
                },
            },
        ],

        // Shipping Address
        shippingAddress: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: String,
            country: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
        },

        // Billing Address
        billingAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,
            sameAsShipping: {
                type: Boolean,
                default: true,
            },
        },

        // Pricing
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        tax: {
            type: Number,
            default: 0,
            min: 0,
        },
        shippingCost: {
            type: Number,
            default: 0,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'INR'],
        },

        // Payment
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paidAt: Date,
        paymentId: String,

        // Order Status
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },

        // Status History
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: Object.values(ORDER_STATUS),
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                notes: String,
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],

        // Shipping
        shippingMethod: {
            type: String,
            enum: ['standard', 'express', 'overnight'],
            default: 'standard',
        },
        trackingNumber: String,
        shippedAt: Date,
        estimatedDelivery: Date,
        deliveredAt: Date,

        // Notes
        customerNotes: String,
        internalNotes: String,

        // Cancellation
        isCancelled: {
            type: Boolean,
            default: false,
        },
        cancelledAt: Date,
        cancellationReason: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// Virtual for full shipping address
orderSchema.virtual('fullShippingAddress').get(function () {
    const { street, city, state, country, postalCode } = this.shippingAddress;
    return [street, city, state, country, postalCode].filter(Boolean).join(', ');
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function () {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Calculate totals before saving
orderSchema.pre('save', function (next) {
    // Calculate subtotal
    if (this.items && this.items.length > 0) {
        this.subtotal = this.items.reduce((total, item) => {
            item.subtotal = item.quantity * item.unitPrice;
            return total + item.subtotal;
        }, 0);
    }

    // Calculate total
    this.total = this.subtotal + this.tax + this.shippingCost - this.discount;

    // Add to status history if status changed
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
        });
    }

    next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus, notes, updatedBy) {
    this.status = newStatus;

    this.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        notes,
        updatedBy,
    });

    // Update relevant dates
    if (newStatus === ORDER_STATUS.SHIPPED) {
        this.shippedAt = new Date();
    } else if (newStatus === ORDER_STATUS.DELIVERED) {
        this.deliveredAt = new Date();
    }

    return this.save();
};

// Method to cancel order
orderSchema.methods.cancel = function (reason) {
    if (this.status === ORDER_STATUS.DELIVERED) {
        throw new Error('Cannot cancel delivered order');
    }

    this.isCancelled = true;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.status = ORDER_STATUS.CANCELLED;

    return this.save();
};

// Static method to get order statistics
orderSchema.statics.getStatistics = function (startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
                isCancelled: false,
            },
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$total' },
                avgOrderValue: { $avg: '$total' },
                totalItemsSold: { $sum: { $sum: '$items.quantity' } },
            },
        },
    ]);
};

// Static method to find orders by customer email
orderSchema.statics.findByCustomerEmail = function (email) {
    return this.find({ 'customer.email': email })
        .populate('items.productBatch')
        .sort({ createdAt: -1 });
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;