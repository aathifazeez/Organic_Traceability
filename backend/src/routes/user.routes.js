const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    approveUser,
    rejectUser,
    getPendingApprovals,
    suspendUser,
    reactivateUser,
} = require('../controllers/userController');

const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');

const {
    updateUserValidation,
    rejectUserValidation,
    suspendUserValidation,
    mongoIdValidation,
} = require('../utils/validators');

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// Approval routes (must be before :id routes)
router.get('/approvals/pending', getPendingApprovals);

// User actions
router.post(
    '/:id/approve',
    mongoIdValidation('id'),
    validate,
    approveUser
);

router.post(
    '/:id/reject',
    mongoIdValidation('id'),
    rejectUserValidation,
    validate,
    rejectUser
);

router.post(
    '/:id/suspend',
    mongoIdValidation('id'),
    suspendUserValidation,
    validate,
    suspendUser
);

router.post(
    '/:id/reactivate',
    mongoIdValidation('id'),
    validate,
    reactivateUser
);

// CRUD routes
router.get('/', getUsers);

router.get(
    '/:id',
    mongoIdValidation('id'),
    validate,
    getUserById
);

router.put(
    '/:id',
    mongoIdValidation('id'),
    updateUserValidation,
    validate,
    updateUser
);

router.delete(
    '/:id',
    mongoIdValidation('id'),
    validate,
    deleteUser
);

module.exports = router;