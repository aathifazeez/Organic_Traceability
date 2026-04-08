const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Ensure upload directories exist
 */
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// Create upload directories
const uploadDirs = [
    'uploads/certificates',
    'uploads/products',
    'uploads/batches',
    'uploads/documents',
    'uploads/temp',
];

uploadDirs.forEach(dir => ensureDirectoryExists(dir));

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Determine upload path based on fieldname
        if (file.fieldname === 'certificate') {
            uploadPath += 'certificates/';
        } else if (file.fieldname === 'productImage' || file.fieldname === 'images') {
            uploadPath += 'products/';
        } else if (file.fieldname === 'batchImage') {
            uploadPath += 'batches/';
        } else if (file.fieldname === 'document') {
            uploadPath += 'documents/';
        } else {
            uploadPath += 'temp/';
        }

        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate secure random filename
        const randomString = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);

        // Sanitize original filename
        const sanitizedName = nameWithoutExt
            .replace(/[^a-zA-Z0-9]/g, '_')
            .substring(0, 50); // Limit length

        const filename = `${sanitizedName}-${timestamp}-${randomString}${ext}`;
        cb(null, filename);
    },
});

/**
 * File filter for validation
 */
const fileFilter = (req, file, cb) => {
    // Allowed file types by category
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const allowedDocTypes = /pdf|jpeg|jpg|png/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Remove leading dot from extension
    const ext = extname.substring(1);

    // Certificate uploads
    if (file.fieldname === 'certificate') {
        const isValidExt = allowedDocTypes.test(ext);
        const isValidMime = /^(application\/pdf|image\/(jpeg|jpg|png))$/.test(mimetype);

        if (isValidExt && isValidMime) {
            return cb(null, true);
        } else {
            return cb(new Error('Certificates must be PDF, JPG, or PNG files'), false);
        }
    }

    // Image uploads
    if (['productImage', 'images', 'batchImage'].includes(file.fieldname)) {
        const isValidExt = allowedImageTypes.test(ext);
        const isValidMime = /^image\/(jpeg|jpg|png|webp)$/.test(mimetype);

        if (isValidExt && isValidMime) {
            return cb(null, true);
        } else {
            return cb(new Error('Images must be JPG, PNG, or WEBP files'), false);
        }
    }

    // Document uploads
    if (file.fieldname === 'document') {
        const isValidExt = /pdf|doc|docx|txt/.test(ext);
        const isValidMime = /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/plain)$/.test(mimetype);

        if (isValidExt && isValidMime) {
            return cb(null, true);
        } else {
            return cb(new Error('Documents must be PDF, DOC, DOCX, or TXT files'), false);
        }
    }

    // Default: allow
    cb(null, true);
};

/**
 * File size limits by type
 */
const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 5, // Max 5 files per upload
};

/**
 * Multer upload instance
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
});

/**
 * Custom error handler for multer
 */
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB',
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 5 files',
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field',
            });
        }
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error',
        });
    }

    next();
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;