const User = require('../models/user');
const { successResponse, errorResponse } = require('../utils/responses');
const { HTTP_STATUS, USER_ROLES, ACCOUNT_STATUS } = require('../config/constants');
const crypto = require('crypto');
const { sendWelcomeEmail } = require('../services/emailService');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Register new supplier
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, password, companyName, companyInfo, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(
                res,
                'Email already registered',
                HTTP_STATUS.CONFLICT
            );
        }

        // Create new user (supplier only)
        const user = await User.create({
            name,
            email,
            password,
            role: USER_ROLES.SUPPLIER, // Always supplier for public registration
            companyName,
            companyInfo,
            phone,
            status: ACCOUNT_STATUS.PENDING, // Requires admin approval
        });

        // Log the action
        await AuditLog.logAction({
            action: 'CREATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: 'New supplier registration',
        });

        // Send welcome email (don't wait for it - fire and forget)
        sendWelcomeEmail(user).catch(err => {
            console.error('Welcome email failed:', err);
            // Don't fail registration if email fails
        });

        return successResponse(
            res,
            'Registration successful. Your account is pending admin approval.',
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    companyName: user.companyName,
                },
            },
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(
            res,
            error.message || 'Registration failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by credentials
        const user = await User.findByCredentials(email, password);

        // Check account status
        if (user.status === 'pending') {
            return errorResponse(
                res,
                'Your account is pending approval. Please wait for admin confirmation.',
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (user.status === 'rejected') {
            return errorResponse(
                res,
                'Your account has been rejected. Please contact support.',
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (user.status === 'suspended') {
            return errorResponse(
                res,
                'Your account has been suspended. Please contact support.',
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (user.isDeleted) {
            return errorResponse(
                res,
                'This account has been deleted.',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Generate tokens
        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Log the login
        await AuditLog.logAction({
            action: 'LOGIN',
            entityType: 'User',
            entityId: user._id,
            performedBy: user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: 'User logged in',
        });

        return successResponse(res, 'Login successful', {
            user: user.toPublicJSON(),
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(
            res,
            'Invalid email or password',
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(
                res,
                'Refresh token is required',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Verify refresh token
        const jwt = require('jsonwebtoken');
        const jwtConfig = require('../config/jwt');

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
        } catch (error) {
            return errorResponse(
                res,
                'Invalid or expired refresh token',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Find user and verify refresh token matches
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return errorResponse(
                res,
                'Invalid refresh token',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if (user.status !== 'approved' || user.isDeleted) {
            return errorResponse(
                res,
                'Account is not active',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Generate new tokens
        const newAccessToken = user.generateAuthToken();
        const newRefreshToken = user.generateRefreshToken();

        // Update refresh token
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return successResponse(res, 'Token refreshed successfully', {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return errorResponse(
            res,
            'Token refresh failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
    try {
        // Clear refresh token
        req.user.refreshToken = null;
        await req.user.save({ validateBeforeSave: false });

        // Log the logout
        await AuditLog.logAction({
            action: 'LOGOUT',
            entityType: 'User',
            entityId: req.user._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: 'User logged out',
        });

        return successResponse(res, 'Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        return errorResponse(
            res,
            'Logout failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        return successResponse(res, 'Profile retrieved successfully', {
            user: user.toPublicJSON(),
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return errorResponse(
            res,
            'Failed to get profile',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const allowedUpdates = ['name', 'phone', 'companyName', 'companyInfo', 'bio', 'website'];
        const updates = {};

        // Filter allowed updates
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        // Log the update
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: user._id,
            changes: { after: updates },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: 'Profile updated',
        });

        return successResponse(res, 'Profile updated successfully', {
            user: user.toPublicJSON(),
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse(
            res,
            error.message || 'Profile update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return errorResponse(
                res,
                'Current password is incorrect',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Log the action
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: 'Password changed',
        });

        return successResponse(res, 'Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error);
        return errorResponse(
            res,
            error.message || 'Password change failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email, isDeleted: false });

        // Don't reveal if email exists or not (security)
        if (!user) {
            return successResponse(
                res,
                'If your email is registered, you will receive a password reset link.'
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token and expiry (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Send email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request - OrganicTrace',
                template: 'password-reset',
                data: {
                    name: user.name,
                    resetUrl,
                    expiryTime: '1 hour',
                },
            });

            return successResponse(
                res,
                'Password reset link sent to your email'
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError);

            // Clear reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return errorResponse(
                res,
                'Failed to send reset email. Please try again.',
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return errorResponse(
            res,
            'Failed to process request',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the token from URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
            isDeleted: false,
        });

        if (!user) {
            return errorResponse(
                res,
                'Invalid or expired reset token',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Log the action
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: 'Password reset via email token',
        });

        // Send confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Successful - OrganicTrace',
                template: 'password-reset-success',
                data: {
                    name: user.name,
                },
            });
        } catch (emailError) {
            console.error('Confirmation email failed:', emailError);
            // Don't fail the reset if confirmation email fails
        }

        return successResponse(res, 'Password reset successful. You can now login with your new password.');
    } catch (error) {
        console.error('Reset password error:', error);
        return errorResponse(
            res,
            error.message || 'Password reset failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
};


/**
* "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDRhODY3YTE4MTE2N2ZlMzhlZTE3YyIsImVtYWlsIjoiYWRtaW5Ab3JnYW5pY3RyYWNlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTU0NzM5OCwiZXhwIjoxNzc2MTUyMTk4LCJhdWQiOiJvcmdhbmljdHJhY2UtY2xpZW50IiwiaXNzIjoib3JnYW5pY3RyYWNlLWFwaSJ9.mp-5LxoNs_RewUVP1-opRhBzUXJ0dX9rG85XfH6Rh-g",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDRhODY3YTE4MTE2N2ZlMzhlZTE3YyIsImlhdCI6MTc3NTU0NzM5OCwiZXhwIjoxNzc4MTM5Mzk4fQ.l-Fweu_zKOvsyTr8zBv_29idf5tHfhWHDgM78jcKvBU"
 */

/**
 * "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDRhODY3YTE4MTE2N2ZlMzhlZTE3ZSIsImVtYWlsIjoic3VwcGxpZXJAb3JnYW5pY3RyYWNlLmNvbSIsInJvbGUiOiJzdXBwbGllciIsImlhdCI6MTc3NTU0OTM5OSwiZXhwIjoxNzc2MTU0MTk5LCJhdWQiOiJvcmdhbmljdHJhY2UtY2xpZW50IiwiaXNzIjoib3JnYW5pY3RyYWNlLWFwaSJ9.COnY8haNanQxftONSHn3_S_H7lSTcmlbY4jkqQRzVVg",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDRhODY3YTE4MTE2N2ZlMzhlZTE3ZSIsImlhdCI6MTc3NTU0OTM5OSwiZXhwIjoxNzc4MTQxMzk5fQ.qln05Le4pRy4qN2kS_hp2Kl86A1SBDGKs8iV_ucb0Eo"
 */