const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

/**
 * Get file URL for client access
 */
const getFileUrl = (filePath) => {
    if (!filePath) return null;

    // Remove leading slash if exists
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5001}`;
    return `${baseUrl}/${cleanPath}`;
};

/**
 * Check if file exists
 */
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

/**
 * Get file information
 */
const getFileInfo = async (filePath) => {
    try {
        const stats = await fs.stat(filePath);
        const ext = path.extname(filePath).toLowerCase();

        return {
            exists: true,
            size: stats.size,
            sizeFormatted: formatFileSize(stats.size),
            created: stats.birthtime,
            modified: stats.mtime,
            extension: ext,
            type: getFileType(ext),
        };
    } catch (error) {
        return {
            exists: false,
            error: error.message
        };
    }
};

/**
 * Format file size in human-readable format
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file type from extension
 */
const getFileType = (ext) => {
    const types = {
        '.pdf': 'PDF Document',
        '.jpg': 'JPEG Image',
        '.jpeg': 'JPEG Image',
        '.png': 'PNG Image',
        '.webp': 'WebP Image',
        '.doc': 'Word Document',
        '.docx': 'Word Document',
        '.txt': 'Text File',
    };

    return types[ext.toLowerCase()] || 'Unknown';
};

/**
 * Delete file
 */
const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        return { success: true };
    } catch (error) {
        console.error('Delete file error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Delete multiple files
 */
const deleteFiles = async (filePaths) => {
    const results = [];

    for (const filePath of filePaths) {
        const result = await deleteFile(filePath);
        results.push({
            path: filePath,
            ...result,
        });
    }

    return results;
};

/**
 * List files in directory
 */
const listFiles = async (directory) => {
    try {
        const files = await fs.readdir(directory);
        const fileInfos = [];

        for (const file of files) {
            const filePath = path.join(directory, file);
            const info = await getFileInfo(filePath);

            fileInfos.push({
                name: file,
                path: filePath,
                ...info,
            });
        }

        return {
            success: true,
            files: fileInfos
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Clean old temporary files
 */
const cleanTempFiles = async (olderThanHours = 24) => {
    try {
        const tempDir = path.join(__dirname, '../../uploads/temp');

        if (!fsSync.existsSync(tempDir)) {
            return { success: true, deleted: 0 };
        }

        const files = await fs.readdir(tempDir);
        const now = Date.now();
        const maxAge = olderThanHours * 60 * 60 * 1000;

        let deletedCount = 0;

        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);

            if (now - stats.mtime.getTime() > maxAge) {
                await fs.unlink(filePath);
                deletedCount++;
            }
        }

        return {
            success: true,
            deleted: deletedCount
        };
    } catch (error) {
        console.error('Clean temp files error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get upload statistics
 */
const getUploadStats = async () => {
    try {
        const uploadDir = path.join(__dirname, '../../uploads');
        const categories = ['certificates', 'products', 'batches', 'documents', 'temp'];

        const stats = {};
        let totalSize = 0;
        let totalFiles = 0;

        for (const category of categories) {
            const categoryPath = path.join(uploadDir, category);

            if (!fsSync.existsSync(categoryPath)) {
                stats[category] = { files: 0, size: 0 };
                continue;
            }

            const files = await fs.readdir(categoryPath);
            let categorySize = 0;

            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                const fileStats = await fs.stat(filePath);
                categorySize += fileStats.size;
            }

            stats[category] = {
                files: files.length,
                size: categorySize,
                sizeFormatted: formatFileSize(categorySize),
            };

            totalFiles += files.length;
            totalSize += categorySize;
        }

        return {
            success: true,
            stats: stats,
            total: {
                files: totalFiles,
                size: totalSize,
                sizeFormatted: formatFileSize(totalSize),
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    getFileUrl,
    fileExists,
    getFileInfo,
    formatFileSize,
    getFileType,
    deleteFile,
    deleteFiles,
    listFiles,
    cleanTempFiles,
    getUploadStats,
};