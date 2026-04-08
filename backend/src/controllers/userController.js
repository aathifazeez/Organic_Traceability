const User = require('../models/user');
const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responses');
const { HTTP_STATUS, PAGINATION, USER_ROLES, ACCOUNT_STATUS } = require('../config/constants');
const { sendEmail } = require('../services/emailService');

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            role,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = { isDeleted: false };

        // Filters
        if (role) {
            query.role = role;
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { companyName: new RegExp(search, 'i') },
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
        const [users, totalCount] = await Promise.all([
            User.find(query)
                .select('-password -refreshToken')
                .populate('approvedBy', 'name email')
                .populate('rejectedBy', 'name email')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            User.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'Users retrieved successfully',
            users,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get users error:', error);
        return errorResponse(
            res,
            'Failed to retrieve users',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private (Admin)
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -refreshToken')
            .populate('approvedBy', 'name email')
            .populate('rejectedBy', 'name email');

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Get additional stats if supplier
        let additionalData = {};
        if (user.role === USER_ROLES.SUPPLIER) {
            const [batchCount, certificateCount] = await Promise.all([
                IngredientBatch.countDocuments({ supplier: user._id }),
                Certificate.countDocuments({ supplier: user._id }),
            ]);

            additionalData = {
                batchCount,
                certificateCount,
            };
        }

        return successResponse(
            res,
            'User retrieved successfully',
            { user, ...additionalData }
        );
    } catch (error) {
        console.error('Get user error:', error);
        return errorResponse(
            res,
            'Failed to retrieve user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Fields that admin can update
        const allowedUpdates = [
            'name',
            'phone',
            'companyName',
            'companyInfo',
            'companyAddress',
            'status',
            'bio',
            'website',
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Store old values for audit
        const oldValues = {};
        Object.keys(updates).forEach(key => {
            oldValues[key] = user[key];
        });

        Object.assign(user, updates);
        await user.save();

        // Log the update
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: req.user._id,
            changes: {
                before: oldValues,
                after: updates,
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Admin updated user: ${user.email}`,
        });

        return successResponse(
            res,
            'User updated successfully',
            { user: user.toPublicJSON() }
        );
    } catch (error) {
        console.error('Update user error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to update user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Delete user (soft delete)
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Prevent deleting admin accounts
        if (user.role === USER_ROLES.ADMIN) {
            return errorResponse(
                res,
                'Cannot delete admin accounts',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Soft delete
        user.isDeleted = true;
        user.deletedAt = new Date();
        user.status = ACCOUNT_STATUS.SUSPENDED;
        await user.save();

        // Log the deletion
        await AuditLog.logAction({
            action: 'DELETE',
            entityType: 'User',
            entityId: user._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Admin deleted user: ${user.email}`,
        });

        return successResponse(res, 'User deleted successfully');
    } catch (error) {
        console.error('Delete user error:', error);
        return errorResponse(
            res,
            'Failed to delete user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Approve supplier registration
 * @route   POST /api/v1/users/:id/approve
 * @access  Private (Admin)
 */
const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        if (user.status !== ACCOUNT_STATUS.PENDING) {
            return errorResponse(
                res,
                `User is already ${user.status}`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Approve user
        user.status = ACCOUNT_STATUS.APPROVED;
        user.approvedBy = req.user._id;
        user.approvedAt = new Date();
        await user.save();

        // Send approval email
        try {
            await sendEmail({
                to: user.email,
                template: 'registration-approved',
                data: {
                    name: user.name,
                },
            });
        } catch (emailError) {
            console.error('Approval email failed:', emailError);
            // Don't fail approval if email fails
        }

        // Log the approval
        await AuditLog.logAction({
            action: 'APPROVE',
            entityType: 'User',
            entityId: user._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Admin approved supplier registration: ${user.email}`,
        });

        return successResponse(
            res,
            'Supplier approved successfully',
            { user: user.toPublicJSON() }
        );
    } catch (error) {
        console.error('Approve user error:', error);
        return errorResponse(
            res,
            'Failed to approve user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Reject supplier registration
 * @route   POST /api/v1/users/:id/reject
 * @access  Private (Admin)
 */
const rejectUser = async (req, res) => {
    try {
        const { reason } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        if (user.status !== ACCOUNT_STATUS.PENDING) {
            return errorResponse(
                res,
                `User is already ${user.status}`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Reject user
        user.status = ACCOUNT_STATUS.REJECTED;
        user.rejectedBy = req.user._id;
        user.rejectedAt = new Date();
        user.rejectionReason = reason;
        await user.save();

        // Send rejection email (optional)
        try {
            await sendEmail({
                to: user.email,
                subject: 'Registration Update - OrganicTrace',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2d5016;">Registration Update</h2>
                        <p>Dear ${user.name},</p>
                        <p>Thank you for your interest in OrganicTrace.</p>
                        <p>After careful review, we are unable to approve your supplier registration at this time.</p>
                        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                        <p>If you have any questions, please contact our support team.</p>
                        <p>Best regards,<br>The OrganicTrace Team</p>
                    </div>
                `,
                text: `Your OrganicTrace registration was not approved. ${reason ? 'Reason: ' + reason : ''}`,
            });
        } catch (emailError) {
            console.error('Rejection email failed:', emailError);
        }

        // Log the rejection
        await AuditLog.logAction({
            action: 'REJECT',
            entityType: 'User',
            entityId: user._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Admin rejected supplier registration: ${user.email}`,
            metadata: { reason },
        });

        return successResponse(
            res,
            'Supplier rejected successfully',
            { user: user.toPublicJSON() }
        );
    } catch (error) {
        console.error('Reject user error:', error);
        return errorResponse(
            res,
            'Failed to reject user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get pending approvals
 * @route   GET /api/v1/users/approvals/pending
 * @access  Private (Admin)
 */
const getPendingApprovals = async (req, res) => {
    try {
        const pendingUsers = await User.find({
            status: ACCOUNT_STATUS.PENDING,
            isDeleted: false,
        })
            .select('-password -refreshToken')
            .sort({ createdAt: -1 });

        return successResponse(
            res,
            'Pending approvals retrieved successfully',
            { users: pendingUsers, count: pendingUsers.length }
        );
    } catch (error) {
        console.error('Get pending approvals error:', error);
        return errorResponse(
            res,
            'Failed to retrieve pending approvals',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Suspend user account
 * @route   POST /api/v1/users/:id/suspend
 * @access  Private (Admin)
 */
const suspendUser = async (req, res) => {
    try {
        const { reason } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        if (user.role === USER_ROLES.ADMIN) {
            return errorResponse(
                res,
                'Cannot suspend admin accounts',
                HTTP_STATUS.FORBIDDEN
            );
        }

        user.status = ACCOUNT_STATUS.SUSPENDED;
        await user.save();

        // Log the suspension
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Admin suspended user: ${user.email}`,
            metadata: { reason },
        });

        return successResponse(
            res,
            'User suspended successfully',
            { user: user.toPublicJSON() }
        );
    } catch (error) {
        console.error('Suspend user error:', error);
        return errorResponse(
            res,
            'Failed to suspend user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Reactivate user account
 * @route   POST /api/v1/users/:id/reactivate
 * @access  Private (Admin)
 */
const reactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        user.status = ACCOUNT_STATUS.APPROVED;
        user.isDeleted = false;
        await user.save();

        // Log the reactivation
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'User',
            entityId: user._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Admin reactivated user: ${user.email}`,
        });

        return successResponse(
            res,
            'User reactivated successfully',
            { user: user.toPublicJSON() }
        );
    } catch (error) {
        console.error('Reactivate user error:', error);
        return errorResponse(
            res,
            'Failed to reactivate user',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    approveUser,
    rejectUser,
    getPendingApprovals,
    suspendUser,
    reactivateUser,
};