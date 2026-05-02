const { Parser } = require('json2csv');

/**
 * Convert JSON data to CSV
 */
const convertToCSV = (data, fields) => {
    try {
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);
        return { success: true, csv };
    } catch (error) {
        console.error('CSV conversion error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Export users to CSV
 */
const exportUsersToCSV = (users) => {
    const fields = [
        { label: 'Name', value: 'name' },
        { label: 'Email', value: 'email' },
        { label: 'Role', value: 'role' },
        { label: 'Status', value: 'status' },
        { label: 'Company Name', value: 'companyName' },
        { label: 'Phone', value: 'phone' },
        { label: 'Registered Date', value: 'createdAt' },
    ];

    return convertToCSV(users, fields);
};

/**
 * Export batches to CSV
 */
const exportBatchesToCSV = (batches) => {
    const fields = [
        { label: 'Batch Number', value: 'batchNumber' },
        { label: 'Ingredient Name', value: 'ingredientName' },
        { label: 'Supplier', value: 'supplier.name' },
        { label: 'Quantity', value: row => `${row.quantity.value} ${row.quantity.unit}` },
        { label: 'Remaining', value: row => `${row.quantityRemaining.value} ${row.quantityRemaining.unit}` },
        { label: 'Origin Country', value: 'origin.country' },
        { label: 'Quality Grade', value: 'qualityGrade' },
        { label: 'Purity %', value: 'purity' },
        { label: 'Unit Price', value: 'unitPrice' },
        { label: 'Status', value: 'status' },
        { label: 'Harvest Date', value: 'harvestDate' },
        { label: 'Expiry Date', value: 'expiryDate' },
        { label: 'Created Date', value: 'createdAt' },
    ];

    return convertToCSV(batches, fields);
};

/**
 * Export certificates to CSV
 */
const exportCertificatesToCSV = (certificates) => {
    const fields = [
        { label: 'Certificate Number', value: 'certificateNumber' },
        { label: 'Certificate Name', value: 'certificateName' },
        { label: 'Type', value: 'certificateType' },
        { label: 'Supplier', value: 'supplier.name' },
        { label: 'Issuing Authority', value: 'issuingAuthority' },
        { label: 'Issue Date', value: 'issueDate' },
        { label: 'Expiry Date', value: 'expiryDate' },
        { label: 'Status', value: 'status' },
        { label: 'Verified', value: row => row.isVerified ? 'Yes' : 'No' },
        { label: 'Created Date', value: 'createdAt' },
    ];

    return convertToCSV(certificates, fields);
};

/**
 * Export products to CSV
 */
const exportProductsToCSV = (products) => {
    const fields = [
        { label: 'Batch Number', value: 'batchNumber' },
        { label: 'Product Name', value: 'productName' },
        { label: 'Category', value: 'category' },
        { label: 'Skin Type', value: 'skinType' },
        { label: 'Total Units', value: 'totalUnits' },
        { label: 'Units Remaining', value: 'unitsRemaining' },
        { label: 'Units Sold', value: 'unitsSold' },
        { label: 'Manufacturing Cost', value: 'manufacturingCost' },
        { label: 'Retail Price', value: 'retailPrice' },
        { label: 'Revenue', value: 'revenue' },
        { label: 'Status', value: 'status' },
        { label: 'Listed', value: row => row.isListed ? 'Yes' : 'No' },
        { label: 'Production Date', value: 'productionDate' },
        { label: 'Expiry Date', value: 'expiryDate' },
        { label: 'Created Date', value: 'createdAt' },
    ];

    return convertToCSV(products, fields);
};

/**
 * Export orders to CSV
 */
const exportOrdersToCSV = (orders) => {
    const fields = [
        { label: 'Order Number', value: 'orderNumber' },
        { label: 'Customer Name', value: 'customerInfo.name' },
        { label: 'Customer Email', value: 'customerInfo.email' },
        { label: 'Status', value: 'status' },
        { label: 'Items Count', value: row => row.items.length },
        { label: 'Subtotal', value: 'subtotal' },
        { label: 'Tax', value: 'tax' },
        { label: 'Shipping', value: 'shippingCost' },
        { label: 'Total', value: 'total' },
        { label: 'Payment Method', value: 'paymentMethod' },
        { label: 'Order Date', value: 'createdAt' },
    ];

    return convertToCSV(orders, fields);
};

/**
 * Export QR codes to CSV
 */
const exportQRCodesToCSV = (qrCodes) => {
    const fields = [
        { label: 'QR ID', value: 'qrId' },
        { label: 'Product Batch', value: 'productBatch.batchNumber' },
        { label: 'Product Name', value: 'productBatch.productName' },
        { label: 'Scan Count', value: 'scanCount' },
        { label: 'Active', value: row => row.isActive ? 'Yes' : 'No' },
        { label: 'Last Scanned', value: 'lastScannedAt' },
        { label: 'Generated Date', value: 'createdAt' },
    ];

    return convertToCSV(qrCodes, fields);
};

/**
 * Export supplier performance to CSV
 */
const exportSupplierPerformanceToCSV = (suppliers) => {
    const fields = [
        { label: 'Supplier Name', value: 'name' },
        { label: 'Company', value: 'companyName' },
        { label: 'Total Batches', value: 'totalBatches' },
        { label: 'Active Batches', value: 'activeBatches' },
        { label: 'Total Certificates', value: 'totalCertificates' },
        { label: 'Valid Certificates', value: 'validCertificates' },
        { label: 'Total Value', value: 'totalValue' },
        { label: 'Average Quality', value: 'avgQuality' },
        { label: 'On-Time Rate %', value: 'onTimeRate' },
    ];

    return convertToCSV(suppliers, fields);
};

/**
 * Export inventory alerts to CSV
 */
const exportInventoryAlertsToCSV = (products) => {
    const fields = [
        { label: 'Product Name', value: 'productName' },
        { label: 'Batch Number', value: 'batchNumber' },
        { label: 'Total Units', value: 'totalUnits' },
        { label: 'Remaining Units', value: 'unitsRemaining' },
        { label: 'Stock %', value: 'inventoryPercentage' },
        { label: 'Alert Type', value: 'alertType' },
        { label: 'Days Until Expiry', value: 'daysUntilExpiry' },
        { label: 'Status', value: 'status' },
    ];

    return convertToCSV(products, fields);
};

/**
 * Export certificate compliance report to CSV
 */
const exportCertificateComplianceToCSV = (data) => {
    const fields = [
        { label: 'Supplier Name', value: 'supplierName' },
        { label: 'Total Certificates', value: 'totalCertificates' },
        { label: 'Valid Certificates', value: 'validCertificates' },
        { label: 'Expiring Soon', value: 'expiringSoon' },
        { label: 'Expired', value: 'expired' },
        { label: 'Compliance %', value: 'complianceRate' },
        { label: 'Status', value: 'complianceStatus' },
    ];

    return convertToCSV(data, fields);
};

module.exports = {
    convertToCSV,
    exportUsersToCSV,
    exportBatchesToCSV,
    exportCertificatesToCSV,
    exportProductsToCSV,
    exportOrdersToCSV,
    exportQRCodesToCSV,
    exportSupplierPerformanceToCSV,
    exportInventoryAlertsToCSV,
    exportCertificateComplianceToCSV,
};