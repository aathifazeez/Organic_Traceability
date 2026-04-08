const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responses');
const { HTTP_STATUS, PAGINATION } = require('../config/constants');

/**
 * @desc    Upload new certificate
 * @route   POST /api/v1/certificates
 * @access  Private (Supplier)
 */
const uploadCertificate = async (req, res) => {
    try {
        const {
            certificateType,
            certificateName,
            issuingAuthority,
            issueDate,
            expiryDate,
            scope,
            notes,
            metadata,
        } = req.body;

        if (!req.file) {
            return errorResponse(
                res,
                'Certificate document is required',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Generate unique certificate number
        const certCount = await Certificate.countDocuments();
        const certificateNumber = `CERT-${Date.now()}-${String(certCount + 1).padStart(4, '0')}`;

        // Create certificate
        const certificate = await Certificate.create({
            certificateNumber,
            certificateType,
            certificateName,
            issuingAuthority,
            issueDate,
            expiryDate,
            supplier: req.user._id,
            documentUrl: `/${req.file.path.replace(/\\/g, '/')}`,
            documentName: req.file.originalname,
            documentSize: req.file.size,
            documentType: req.file.mimetype,
            scope,
            notes,
            metadata: metadata ? JSON.parse(metadata) : undefined,
        });

        await certificate.populate('supplier', 'name email companyName');

        // Log the action
        await AuditLog.logAction({
            action: 'CREATE',
            entityType: 'Certificate',
            entityId: certificate._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Uploaded certificate: ${certificate.certificateNumber}`,
        });

        return successResponse(
            res,
            'Certificate uploaded successfully',
            { certificate },
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Upload certificate error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to upload certificate',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get all certificates (with filters and pagination)
 * @route   GET /api/v1/certificates
 * @access  Private
 */
const getCertificates = async (req, res) => {
    try {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            certificateType,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = {};

        // If supplier, only show their certificates
        // If admin, show all certificates
        if (req.user.role === 'supplier') {
            query.supplier = req.user._id;
        }

        // Filters
        if (status) {
            query.status = status;
        }

        if (certificateType) {
            query.certificateType = certificateType;
        }

        if (search) {
            query.$or = [
                { certificateNumber: new RegExp(search, 'i') },
                { certificateName: new RegExp(search, 'i') },
                { issuingAuthority: new RegExp(search, 'i') },
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
        const [certificates, totalCount] = await Promise.all([
            Certificate.find(query)
                .populate('supplier', 'name email companyName')
                .populate('verifiedBy', 'name email')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Certificate.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return paginatedResponse(
            res,
            'Certificates retrieved successfully',
            certificates,
            {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalItems: totalCount,
            }
        );
    } catch (error) {
        console.error('Get certificates error:', error);
        return errorResponse(
            res,
            'Failed to retrieve certificates',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get single certificate by ID
 * @route   GET /api/v1/certificates/:id
 * @access  Private
 */
const getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('supplier', 'name email companyName phone')
            .populate('verifiedBy', 'name email');

        if (!certificate) {
            return errorResponse(
                res,
                'Certificate not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check access - suppliers can only view their own certificates
        if (req.user.role === 'supplier' && certificate.supplier._id.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to view this certificate',
                HTTP_STATUS.FORBIDDEN
            );
        }

        return successResponse(
            res,
            'Certificate retrieved successfully',
            { certificate }
        );
    } catch (error) {
        console.error('Get certificate error:', error);
        return errorResponse(
            res,
            'Failed to retrieve certificate',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Update certificate
 * @route   PUT /api/v1/certificates/:id
 * @access  Private (Supplier - own certificates only)
 */
const updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return errorResponse(
                res,
                'Certificate not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check ownership
        if (req.user.role === 'supplier' && certificate.supplier.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to update this certificate',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Fields that can be updated
        const allowedUpdates = [
            'certificateName',
            'issuingAuthority',
            'issueDate',
            'expiryDate',
            'scope',
            'notes',
            'metadata',
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Handle document replacement
        if (req.file) {
            updates.documentUrl = `/${req.file.path.replace(/\\/g, '/')}`;
            updates.documentName = req.file.originalname;
            updates.documentSize = req.file.size;
            updates.documentType = req.file.mimetype;
        }

        // Update certificate
        Object.assign(certificate, updates);
        await certificate.save();

        await certificate.populate('supplier verifiedBy');

        // Log the update
        await AuditLog.logAction({
            action: 'UPDATE',
            entityType: 'Certificate',
            entityId: certificate._id,
            performedBy: req.user._id,
            changes: { after: updates },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Updated certificate: ${certificate.certificateNumber}`,
        });

        return successResponse(
            res,
            'Certificate updated successfully',
            { certificate }
        );
    } catch (error) {
        console.error('Update certificate error:', error);
        return errorResponse(
            res,
            error.message || 'Failed to update certificate',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Delete certificate
 * @route   DELETE /api/v1/certificates/:id
 * @access  Private (Supplier - own certificates only)
 */
const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return errorResponse(
                res,
                'Certificate not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Check ownership
        if (req.user.role === 'supplier' && certificate.supplier.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                'You do not have permission to delete this certificate',
                HTTP_STATUS.FORBIDDEN
            );
        }

        await certificate.deleteOne();

        // Log the deletion
        await AuditLog.logAction({
            action: 'DELETE',
            entityType: 'Certificate',
            entityId: certificate._id,
            performedBy: req.user._id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            description: `Deleted certificate: ${certificate.certificateNumber}`,
        });

        return successResponse(res, 'Certificate deleted successfully');
    } catch (error) {
        console.error('Delete certificate error:', error);
        return errorResponse(
            res,
            'Failed to delete certificate',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get certificate analytics for supplier
 * @route   GET /api/v1/certificates/analytics/summary
 * @access  Private (Supplier)
 */
const getCertificateAnalytics = async (req, res) => {
    try {
        const supplierId = req.user._id;

        const certificates = await Certificate.find({ supplier: supplierId });

        // Calculate analytics
        const analytics = {
            totalCertificates: certificates.length,
            validCertificates: certificates.filter(c => c.status === 'valid').length,
            expiringSoon: certificates.filter(c => c.status === 'expiring-soon').length,
            expiredCertificates: certificates.filter(c => c.status === 'expired').length,
            revokedCertificates: certificates.filter(c => c.status === 'revoked').length,
            verifiedCertificates: certificates.filter(c => c.isVerified).length,
        };

        // Certificates by type
        const certificatesByType = {};
        certificates.forEach(cert => {
            certificatesByType[cert.certificateType] = (certificatesByType[cert.certificateType] || 0) + 1;
        });

        // Expiring in next 30 days
        const expiringCertificates = certificates
            .filter(c => c.daysUntilExpiry > 0 && c.daysUntilExpiry <= 30)
            .map(c => ({
                id: c._id,
                certificateNumber: c.certificateNumber,
                certificateName: c.certificateName,
                certificateType: c.certificateType,
                expiryDate: c.expiryDate,
                daysUntilExpiry: c.daysUntilExpiry,
            }))
            .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

        return successResponse(
            res,
            'Certificate analytics retrieved successfully',
            {
                summary: analytics,
                certificatesByType,
                expiringCertificates,
            }
        );
    } catch (error) {
        console.error('Get certificate analytics error:', error);
        return errorResponse(
            res,
            'Failed to retrieve certificate analytics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get expiring certificates
 * @route   GET /api/v1/certificates/expiring
 * @access  Private
 */
const getExpiringCertificates = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const query = { status: { $ne: 'revoked' } };

        // If supplier, only show their certificates
        if (req.user.role === 'supplier') {
            query.supplier = req.user._id;
        }

        const certificates = await Certificate.find(query)
            .populate('supplier', 'name email companyName')
            .lean();

        // Filter by expiry
        const expiringCertificates = certificates.filter(cert => {
            const daysUntilExpiry = Math.ceil(
                (new Date(cert.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExpiry > 0 && daysUntilExpiry <= parseInt(days);
        });

        return successResponse(
            res,
            `Found ${expiringCertificates.length} certificates expiring in next ${days} days`,
            { certificates: expiringCertificates }
        );
    } catch (error) {
        console.error('Get expiring certificates error:', error);
        return errorResponse(
            res,
            'Failed to retrieve expiring certificates',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    uploadCertificate,
    getCertificates,
    getCertificateById,
    updateCertificate,
    deleteCertificate,
    getCertificateAnalytics,
    getExpiringCertificates,
};