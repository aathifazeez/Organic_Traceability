const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generate QR code image
 * @param {string} data - Data to encode in QR
 * @param {object} options - QR code options
 * @returns {Promise<string>} Base64 QR code image
 */
const generateQRCodeImage = async (data, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            width: 300,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        };

        const qrOptions = { ...defaultOptions, ...options };

        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(data, qrOptions);

        return qrCodeDataURL;
    } catch (error) {
        console.error('QR code generation error:', error);
        throw new Error('Failed to generate QR code image');
    }
};

/**
 * Generate QR code as buffer (for file saving)
 * @param {string} data - Data to encode
 * @param {object} options - QR code options
 * @returns {Promise<Buffer>} QR code image buffer
 */
const generateQRCodeBuffer = async (data, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            width: 300,
            margin: 1,
        };

        const qrOptions = { ...defaultOptions, ...options };

        const buffer = await QRCode.toBuffer(data, qrOptions);
        return buffer;
    } catch (error) {
        console.error('QR code buffer generation error:', error);
        throw new Error('Failed to generate QR code buffer');
    }
};

/**
 * Generate verification URL for QR code
 * @param {string} qrId - Unique QR ID
 * @returns {string} Verification URL
 */
const generateVerificationUrl = (qrId) => {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return `${baseUrl}/verify/${qrId}`;
};

/**
 * Generate API verification URL
 * @param {string} qrId - Unique QR ID
 * @returns {string} API verification URL
 */
const generateApiVerificationUrl = (qrId) => {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';
    return `${apiUrl}/qr/verify/${qrId}`;
};

/**
 * Create blockchain hash for QR code
 * @param {object} data - Data to hash
 * @returns {string} Blockchain hash
 */
const createBlockchainHash = (data) => {
    const dataString = JSON.stringify({
        qrId: data.qrId,
        productBatchId: data.productBatchId,
        timestamp: data.timestamp,
        manufacturer: data.manufacturer,
    });

    // Create SHA-256 hash
    const hash = crypto
        .createHash('sha256')
        .update(dataString)
        .digest('hex');

    return hash;
};

/**
 * Verify blockchain hash
 * @param {object} data - Original data
 * @param {string} hash - Hash to verify
 * @returns {boolean} Verification result
 */
const verifyBlockchainHash = (data, hash) => {
    const calculatedHash = createBlockchainHash(data);
    return calculatedHash === hash;
};

/**
 * Parse user agent for device type
 * @param {string} userAgent - User agent string
 * @returns {string} Device type
 */
const parseDeviceType = (userAgent) => {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
        return 'tablet';
    } else if (ua.includes('desktop') || ua.includes('windows') || ua.includes('mac')) {
        return 'desktop';
    }

    return 'unknown';
};

/**
 * Extract location from IP address (simplified)
 * In production, use a real IP geolocation service
 * @param {string} ipAddress - IP address
 * @returns {object} Location data
 */
const getLocationFromIP = async (ipAddress) => {
    // This is a simplified mock implementation
    // In production, use services like:
    // - MaxMind GeoIP2
    // - ip-api.com
    // - ipstack.com

    return {
        country: 'Unknown',
        city: 'Unknown',
        coordinates: {
            latitude: null,
            longitude: null,
        },
    };
};

module.exports = {
    generateQRCodeImage,
    generateQRCodeBuffer,
    generateVerificationUrl,
    generateApiVerificationUrl,
    createBlockchainHash,
    verifyBlockchainHash,
    parseDeviceType,
    getLocationFromIP,
};