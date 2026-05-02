const User = require('../models/user');
const Certificate = require('../models/Certificate');
const { successResponse, errorResponse } = require('../utils/responses');
const { HTTP_STATUS } = require('../config/constants');

/**
 * @desc    Get all approved suppliers with their verified certificates (public)
 * @route   GET /api/v1/public/suppliers
 * @access  Public
 */
const getPublicSuppliers = async (req, res) => {
    try {
        const suppliers = await User.find({
            role: 'supplier',
            accountStatus: 'active',
            isDeleted: { $ne: true },
        })
            .select('name companyName bio companyInfo companyAddress avatar')
            .lean();

        const suppliersWithCerts = await Promise.all(
            suppliers.map(async (supplier) => {
                const certificates = await Certificate.find({
                    supplier: supplier._id,
                    isVerified: true,
                    status: { $ne: 'revoked' },
                })
                    .select(
                        'certificateName certificateType issuingAuthority issueDate expiryDate status documentUrl documentType documentName'
                    )
                    .lean();

                return { ...supplier, certificates };
            })
        );

        return successResponse(res, 'Suppliers fetched successfully', {
            suppliers: suppliersWithCerts,
        });
    } catch (error) {
        console.error('Get public suppliers error:', error);
        return errorResponse(
            res,
            'Failed to fetch suppliers',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = { getPublicSuppliers };
