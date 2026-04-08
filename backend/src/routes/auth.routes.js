const express = require('express');
const router = express.Router();

const {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');

const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

const {
    registerValidation,
    loginValidation,
    refreshTokenValidation,
    updateProfileValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} = require('../utils/validators');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh-token', refreshTokenValidation, validate, refreshToken);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfileValidation, validate, updateProfile);
router.put('/change-password', changePasswordValidation, validate, changePassword);

module.exports = router;