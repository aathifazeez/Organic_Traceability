const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { USER_ROLES, ACCOUNT_STATUS } = require('../config/constants');
const jwtConfig = require('../config/jwt');

const userSchema = new mongoose.Schema(
    {
        // Basic Information
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't return password by default
        },

        // Role & Status
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.SUPPLIER,
        },
        status: {
            type: String,
            enum: Object.values(ACCOUNT_STATUS),
            default: ACCOUNT_STATUS.PENDING,
        },

        // Company Information (for suppliers)
        companyName: {
            type: String,
            trim: true,
            maxlength: [200, 'Company name cannot exceed 200 characters'],
        },
        companyInfo: {
            type: String,
            trim: true,
            maxlength: [1000, 'Company info cannot exceed 1000 characters'],
        },
        companyAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Please provide a valid phone number'],
        },
        website: {
            type: String,
            trim: true,
        },

        // Profile
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },

        // Verification
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
        emailVerificationExpires: Date,

        // Password Reset
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        // Account Management
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: Date,
        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rejectedAt: Date,
        rejectionReason: String,

        // Refresh Token
        refreshToken: {
            type: String,
            select: false,
        },

        // Last Activity
        lastLogin: Date,
        lastActivity: Date,

        // Soft Delete
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function () {
    if (!this.companyAddress) return null;
    const { street, city, state, country, postalCode } = this.companyAddress;
    return [street, city, state, country, postalCode].filter(Boolean).join(', ');
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.expiresIn,
            issuer: jwtConfig.options.issuer,
            audience: jwtConfig.options.audience,
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        jwtConfig.refreshSecret,
        {
            expiresIn: jwtConfig.refreshExpiresIn,
        }
    );
};

// Get public profile
userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        status: this.status,
        companyName: this.companyName,
        avatar: this.avatar,
        createdAt: this.createdAt,
    };
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email, isDeleted: false }).select('+password');

    if (!user) {
        throw new Error('Invalid login credentials');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }

    return user;
};

// Update last activity
userSchema.methods.updateLastActivity = function () {
    this.lastActivity = new Date();
    return this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);

module.exports = User;