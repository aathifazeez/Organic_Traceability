const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
        console.warn('⚠️  Email service not configured. Emails will be logged to console.');
        return null;
    }

    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Email base template
 */
const emailBaseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #2d5016 0%, #4a8028 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2d5016;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .info-box {
            background-color: #f0f7ed;
            border-left: 4px solid #2d5016;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th, table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        table th {
            background-color: #f0f7ed;
            font-weight: bold;
            color: #2d5016;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
`;

/**
 * Email templates
 */
const emailTemplates = {
    /**
     * Welcome Email
     */
    'welcome': (data) => ({
        subject: 'Welcome to OrganicTrace! 🌿',
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header">
                    <h1>🌿 Welcome to OrganicTrace</h1>
                    <p>Organic Skincare Traceability Platform</p>
                </div>
                <div class="content">
                    <h2>Hello ${data.name}!</h2>
                    <p>Thank you for joining OrganicTrace. We're excited to have you on board!</p>
                    
                    <div class="info-box">
                        <strong>Account Details:</strong><br>
                        Email: ${data.email}<br>
                        Role: ${data.role}<br>
                        Status: Pending Approval
                    </div>
                    
                    <p>Your account is currently pending admin approval. You'll receive a confirmation email once your account has been approved.</p>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" class="button">Visit OrganicTrace</a>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        `),
        text: `Welcome to OrganicTrace!\n\nHello ${data.name},\n\nThank you for registering. Your account is pending admin approval.\n\nEmail: ${data.email}\nRole: ${data.role}\n\nYou'll receive a confirmation once approved.`,
    }),

    /**
     * Registration Approved
     */
    'registration-approved': (data) => ({
        subject: 'Your OrganicTrace Account Has Been Approved! 🎉',
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header">
                    <h1>✅ Account Approved!</h1>
                    <p>You're ready to start</p>
                </div>
                <div class="content">
                    <h2>Congratulations, ${data.name}!</h2>
                    <p>Great news! Your OrganicTrace account has been approved by our admin team.</p>
                    
                    <div class="info-box">
                        <strong>You can now:</strong><br>
                        ✓ Upload ingredient batches<br>
                        ✓ Manage certificates<br>
                        ✓ Track your products<br>
                        ✓ Access full platform features
                    </div>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" class="button">Login to Your Account</a>
                    
                    <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Congratulations ${data.name}!\n\nYour OrganicTrace account has been approved.\n\nYou can now login and access all platform features.\n\nLogin at: ${process.env.CLIENT_URL || 'http://localhost:3000'}/login`,
    }),

    /**
     * Order Confirmation
     */
    'order-confirmation': (data) => ({
        subject: `Order Confirmation - ${data.orderNumber} 📦`,
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header">
                    <h1>Order Confirmed! 📦</h1>
                    <p>Thank you for your purchase</p>
                </div>
                <div class="content">
                    <h2>Hello ${data.customerName},</h2>
                    <p>Your order has been confirmed and is being processed.</p>
                    
                    <div class="info-box">
                        <strong>Order Details:</strong><br>
                        Order Number: <strong>${data.orderNumber}</strong><br>
                        Order Date: ${new Date(data.orderDate).toLocaleDateString()}<br>
                        Status: ${data.status}
                    </div>
                    
                    <h3>Items Ordered:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(item => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.subtotal.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="info-box">
                        <strong>Order Summary:</strong><br>
                        Subtotal: $${data.subtotal.toFixed(2)}<br>
                        Tax: $${data.tax.toFixed(2)}<br>
                        Shipping: $${data.shippingCost.toFixed(2)}<br>
                        <strong>Total: $${data.total.toFixed(2)}</strong>
                    </div>
                    
                    <h3>Shipping Address:</h3>
                    <p>
                        ${data.shippingAddress.street}<br>
                        ${data.shippingAddress.city}, ${data.shippingAddress.state || ''} ${data.shippingAddress.postalCode}<br>
                        ${data.shippingAddress.country}
                    </p>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/orders/${data.orderId}" class="button">Track Your Order</a>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Order Confirmation\n\nHello ${data.customerName},\n\nYour order ${data.orderNumber} has been confirmed.\n\nTotal: $${data.total.toFixed(2)}\n\nTrack at: ${process.env.CLIENT_URL || 'http://localhost:3000'}/orders/${data.orderId}`,
    }),

    /**
     * Order Status Update
     */
    'order-status-update': (data) => ({
        subject: `Order ${data.orderNumber} - Status Update 📬`,
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header">
                    <h1>Order Status Update</h1>
                    <p>Your order has been updated</p>
                </div>
                <div class="content">
                    <h2>Hello ${data.customerName},</h2>
                    <p>Your order status has been updated:</p>
                    
                    <div class="info-box">
                        <strong>Order Number:</strong> ${data.orderNumber}<br>
                        <strong>New Status:</strong> ${data.status.toUpperCase()}<br>
                        ${data.trackingNumber ? `<strong>Tracking Number:</strong> ${data.trackingNumber}<br>` : ''}
                        ${data.estimatedDelivery ? `<strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}<br>` : ''}
                    </div>
                    
                    ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/orders/${data.orderId}" class="button">View Order Details</a>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Order Status Update\n\nOrder: ${data.orderNumber}\nStatus: ${data.status}\n${data.trackingNumber ? 'Tracking: ' + data.trackingNumber : ''}`,
    }),

    /**
     * Low Stock Alert (Admin)
     */
    'low-stock-alert': (data) => ({
        subject: '⚠️ Low Stock Alert - Action Required',
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);">
                    <h1>⚠️ Low Stock Alert</h1>
                    <p>Immediate attention required</p>
                </div>
                <div class="content">
                    <h2>Low Stock Warning</h2>
                    <p>The following products are running low on stock:</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Remaining</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.products.map(product => `
                                <tr>
                                    <td>${product.productName}</td>
                                    <td>${product.unitsRemaining} units</td>
                                    <td>${product.unitsRemaining === 0 ? '❌ Out of Stock' : '⚠️ Low Stock'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="warning-box">
                        <strong>Action Required:</strong><br>
                        Please review inventory and consider restocking these products.
                    </div>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/inventory" class="button">Manage Inventory</a>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Low Stock Alert\n\nThe following products need restocking:\n${data.products.map(p => `${p.productName}: ${p.unitsRemaining} units`).join('\n')}`,
    }),

    /**
     * Certificate Expiry Reminder
     */
    'certificate-expiry': (data) => ({
        subject: '⚠️ Certificate Expiring Soon - Action Required',
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);">
                    <h1>Certificate Expiry Notice</h1>
                    <p>Renewal required</p>
                </div>
                <div class="content">
                    <h2>Hello ${data.name},</h2>
                    <p>Your certificates are expiring soon:</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Certificate</th>
                                <th>Expiry Date</th>
                                <th>Days Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.certificates.map(cert => `
                                <tr>
                                    <td>${cert.certificateName}</td>
                                    <td>${new Date(cert.expiryDate).toLocaleDateString()}</td>
                                    <td>${cert.daysUntilExpiry} days</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="warning-box">
                        <strong>Action Required:</strong><br>
                        Please renew these certificates before they expire to maintain compliance.
                    </div>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/certificates" class="button">Manage Certificates</a>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Certificate Expiry Notice\n\nYour certificates are expiring soon:\n${data.certificates.map(c => `${c.certificateName}: ${c.daysUntilExpiry} days`).join('\n')}`,
    }),

    /**
     * Batch Expiry Reminder
     */
    'batch-expiry': (data) => ({
        subject: '⚠️ Ingredient Batches Expiring Soon',
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);">
                    <h1>Batch Expiry Notice</h1>
                    <p>Action required</p>
                </div>
                <div class="content">
                    <h2>Hello ${data.name},</h2>
                    <p>Your ingredient batches are expiring soon:</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Batch Number</th>
                                <th>Ingredient</th>
                                <th>Expiry Date</th>
                                <th>Days Left</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.batches.map(batch => `
                                <tr>
                                    <td>${batch.batchNumber}</td>
                                    <td>${batch.ingredientName}</td>
                                    <td>${new Date(batch.expiryDate).toLocaleDateString()}</td>
                                    <td>${batch.daysUntilExpiry} days</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="warning-box">
                        <strong>Action Required:</strong><br>
                        Use or dispose of these batches before expiry.
                    </div>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/batches" class="button">View Batches</a>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Batch Expiry Notice\n\nYour batches are expiring:\n${data.batches.map(b => `${b.batchNumber}: ${b.daysUntilExpiry} days`).join('\n')}`,
    }),

    /**
     * Password Reset
     */
    'password-reset': (data) => ({
        subject: 'Password Reset Request - OrganicTrace',
        html: emailBaseTemplate(`
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                    <p>Reset your password</p>
                </div>
                <div class="content">
                    <h2>Hello ${data.name},</h2>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    
                    <a href="${data.resetUrl}" class="button">Reset Password</a>
                    
                    <div class="warning-box">
                        <strong>Security Notice:</strong><br>
                        This link will expire in 1 hour.<br>
                        If you didn't request this, please ignore this email.
                    </div>
                    
                    <p>Or copy this link to your browser:<br>${data.resetUrl}</p>
                </div>
                <div class="footer">
                    <p>© 2024 OrganicTrace. All rights reserved.</p>
                </div>
            </div>
        `),
        text: `Password Reset\n\nHello ${data.name},\n\nReset your password here: ${data.resetUrl}\n\nLink expires in 1 hour.`,
    }),
};

/**
 * Send email
 */
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            console.log('\n📧 EMAIL (Not sent - email not configured):');
            console.log('To:', options.to);
            console.log('Subject:', options.subject || emailTemplates[options.template]?.(options.data).subject);
            console.log('Template:', options.template || 'custom');
            console.log('\n');
            return { success: true, message: 'Email logged to console' };
        }

        let emailContent;

        if (options.template && emailTemplates[options.template]) {
            emailContent = emailTemplates[options.template](options.data);
        } else {
            emailContent = {
                subject: options.subject,
                html: options.html,
                text: options.text,
            };
        }

        const mailOptions = {
            from: `"OrganicTrace" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Specific email functions
 */
const sendWelcomeEmail = async (user) => {
    return sendEmail({
        to: user.email,
        template: 'welcome',
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};

const sendApprovalEmail = async (user) => {
    return sendEmail({
        to: user.email,
        template: 'registration-approved',
        data: { name: user.name },
    });
};

const sendOrderConfirmation = async (order) => {
    return sendEmail({
        to: order.customerInfo.email,
        template: 'order-confirmation',
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerInfo.name,
            orderDate: order.createdAt,
            status: order.status,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            shippingCost: order.shippingCost,
            total: order.total,
            shippingAddress: order.shippingAddress,
        },
    });
};

const sendOrderStatusUpdate = async (order) => {
    return sendEmail({
        to: order.customerInfo.email,
        template: 'order-status-update',
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerInfo.name,
            status: order.status,
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.estimatedDelivery,
            notes: order.statusHistory[order.statusHistory.length - 1]?.notes,
        },
    });
};

const sendLowStockAlert = async (adminEmail, products) => {
    return sendEmail({
        to: adminEmail,
        template: 'low-stock-alert',
        data: { products },
    });
};

const sendCertificateExpiryReminder = async (user, certificates) => {
    return sendEmail({
        to: user.email,
        template: 'certificate-expiry',
        data: {
            name: user.name,
            certificates,
        },
    });
};

const sendBatchExpiryReminder = async (user, batches) => {
    return sendEmail({
        to: user.email,
        template: 'batch-expiry',
        data: {
            name: user.name,
            batches,
        },
    });
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    return sendEmail({
        to: user.email,
        template: 'password-reset',
        data: {
            name: user.name,
            resetUrl,
        },
    });
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendApprovalEmail,
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendLowStockAlert,
    sendCertificateExpiryReminder,
    sendBatchExpiryReminder,
    sendPasswordResetEmail,
};