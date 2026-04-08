const express = require('express');
const router = express.Router();

const {
    getFileDetails,
    deleteFileEndpoint,
    listFilesEndpoint,
    cleanTempFilesEndpoint,
    getUploadStatsEndpoint,
} = require('../controllers/fileController');

const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// File management routes
router.get('/info', getFileDetails);
router.delete('/', deleteFileEndpoint);
router.get('/list', listFilesEndpoint);
router.post('/clean-temp', cleanTempFilesEndpoint);
router.get('/stats', getUploadStatsEndpoint);

module.exports = router;