const { successResponse, errorResponse } = require('../utils/responses');
const { HTTP_STATUS } = require('../config/constants');
const {
    getFileInfo,
    deleteFile,
    listFiles,
    cleanTempFiles,
    getUploadStats,
} = require('../utils/fileHelper');
const path = require('path');

/**
 * @desc    Get file information
 * @route   GET /api/v1/files/info
 * @access  Private (Admin)
 */
const getFileDetails = async (req, res) => {
    try {
        const { path: filePath } = req.query;

        if (!filePath) {
            return errorResponse(
                res,
                'File path is required',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Security: ensure path is within uploads directory
        if (!filePath.startsWith('uploads/')) {
            return errorResponse(
                res,
                'Invalid file path',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const fullPath = path.join(__dirname, '../../', filePath);
        const fileInfo = await getFileInfo(fullPath);

        if (!fileInfo.exists) {
            return errorResponse(
                res,
                'File not found',
                HTTP_STATUS.NOT_FOUND
            );
        }

        return successResponse(
            res,
            'File information retrieved',
            { file: fileInfo }
        );
    } catch (error) {
        console.error('Get file details error:', error);
        return errorResponse(
            res,
            'Failed to retrieve file information',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Delete file
 * @route   DELETE /api/v1/files
 * @access  Private (Admin)
 */
const deleteFileEndpoint = async (req, res) => {
    try {
        const { path: filePath } = req.query;

        if (!filePath) {
            return errorResponse(
                res,
                'File path is required',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Security: ensure path is within uploads directory
        if (!filePath.startsWith('uploads/')) {
            return errorResponse(
                res,
                'Invalid file path',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const fullPath = path.join(__dirname, '../../', filePath);
        const result = await deleteFile(fullPath);

        if (!result.success) {
            return errorResponse(
                res,
                result.error || 'Failed to delete file',
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }

        return successResponse(
            res,
            'File deleted successfully'
        );
    } catch (error) {
        console.error('Delete file error:', error);
        return errorResponse(
            res,
            'Failed to delete file',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    List files in directory
 * @route   GET /api/v1/files/list
 * @access  Private (Admin)
 */
const listFilesEndpoint = async (req, res) => {
    try {
        const { category } = req.query;

        const allowedCategories = ['certificates', 'products', 'batches', 'documents', 'temp'];

        if (!category || !allowedCategories.includes(category)) {
            return errorResponse(
                res,
                'Valid category is required (certificates, products, batches, documents, temp)',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const directory = path.join(__dirname, '../../uploads', category);
        const result = await listFiles(directory);

        if (!result.success) {
            return errorResponse(
                res,
                result.error || 'Failed to list files',
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }

        return successResponse(
            res,
            `Files in ${category} directory`,
            { files: result.files }
        );
    } catch (error) {
        console.error('List files error:', error);
        return errorResponse(
            res,
            'Failed to list files',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Clean old temporary files
 * @route   POST /api/v1/files/clean-temp
 * @access  Private (Admin)
 */
const cleanTempFilesEndpoint = async (req, res) => {
    try {
        const { olderThanHours = 24 } = req.body;

        const result = await cleanTempFiles(olderThanHours);

        if (!result.success) {
            return errorResponse(
                res,
                result.error || 'Failed to clean temporary files',
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }

        return successResponse(
            res,
            `Cleaned ${result.deleted} temporary files older than ${olderThanHours} hours`
        );
    } catch (error) {
        console.error('Clean temp files error:', error);
        return errorResponse(
            res,
            'Failed to clean temporary files',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @desc    Get upload statistics
 * @route   GET /api/v1/files/stats
 * @access  Private (Admin)
 */
const getUploadStatsEndpoint = async (req, res) => {
    try {
        const result = await getUploadStats();

        if (!result.success) {
            return errorResponse(
                res,
                result.error || 'Failed to get upload statistics',
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }

        return successResponse(
            res,
            'Upload statistics retrieved',
            { stats: result.stats, total: result.total }
        );
    } catch (error) {
        console.error('Get upload stats error:', error);
        return errorResponse(
            res,
            'Failed to get upload statistics',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    getFileDetails,
    deleteFileEndpoint,
    listFilesEndpoint,
    cleanTempFilesEndpoint,
    getUploadStatsEndpoint,
};