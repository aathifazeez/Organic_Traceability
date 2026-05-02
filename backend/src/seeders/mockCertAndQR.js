require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const connectDB = require('../config/database');
const User = require('../models/user');
const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const ProductBatch = require('../models/ProductBatch');
const QRCode = require('../models/QRCode');
const { generateQRCodeImage, generateVerificationUrl, createBlockchainHash } = require('../services/qrService');

const run = async () => {
    try {
        await connectDB();
        console.log('🔗 Connected to database\n');

        // Find the latest product batch
        const product = await ProductBatch.findOne()
            .sort({ createdAt: -1 })
            .populate({
                path: 'ingredients.ingredientBatch',
                populate: { path: 'supplier certificates' },
            });

        if (!product) {
            console.error('❌ No product batch found. Create a product batch first.');
            process.exit(1);
        }

        console.log(`📦 Latest product: "${product.productName}" (${product.batchNumber})\n`);

        // Get admin user
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('❌ No admin user found.');
            process.exit(1);
        }

        // ===== ADD MOCK CERTIFICATES TO INGREDIENT BATCHES =====
        let certCount = 0;
        for (const item of product.ingredients) {
            const ingBatch = item.ingredientBatch;
            if (!ingBatch) continue;

            const hasValidCert = ingBatch.certificates && ingBatch.certificates.some(
                c => c.status === 'valid' || c.status === 'expiring-soon'
            );

            if (hasValidCert) {
                console.log(`  ✅ ${ingBatch.ingredientName} (${ingBatch.batchNumber}) — already certified`);
                continue;
            }

            const supplierId = ingBatch.supplier?._id || ingBatch.supplier;

            const certNum = `CERT-MOCK-${ingBatch.batchNumber}-${Date.now()}`;
            const cert = await Certificate.create({
                certificateNumber: certNum,
                certificateType: 'USDA Organic',
                certificateName: 'USDA Organic Certification',
                issuingAuthority: 'United States Department of Agriculture',
                issueDate: new Date('2024-01-01'),
                expiryDate: new Date('2027-12-31'),
                supplier: supplierId,
                documentUrl: '/uploads/certificates/mock-usda.pdf',
                documentName: 'mock-usda-organic.pdf',
                status: 'valid',
                isVerified: true,
                verifiedBy: admin._id,
                verifiedAt: new Date(),
                scope: 'Organic cosmetic ingredient certification',
            });

            await IngredientBatch.findByIdAndUpdate(ingBatch._id, {
                $addToSet: { certificates: cert._id },
            });

            console.log(`  🏅 Created certificate for: ${ingBatch.ingredientName} (${ingBatch.batchNumber})`);
            certCount++;
        }

        if (certCount > 0) {
            console.log(`\n✅ Created ${certCount} mock certificate(s)\n`);
        } else {
            console.log('\n✅ All ingredients already have valid certificates\n');
        }

        // ===== REGENERATE QR CODE =====
        // Remove existing QR code
        const existingQR = await QRCode.findOne({ productBatch: product._id });
        if (existingQR) {
            await QRCode.deleteOne({ _id: existingQR._id });
            console.log('🗑️  Removed old QR code');
        }

        // Create new QR with real image + correct URL
        const qr = new QRCode({
            productBatch: product._id,
            generatedBy: admin._id,
            isActive: true,
            isVerified: true,
        });

        const verificationUrl = generateVerificationUrl(qr.qrId);
        qr.verificationUrl = verificationUrl;
        qr.qrCodeUrl = verificationUrl;
        qr.qrCodeImage = await generateQRCodeImage(verificationUrl, {
            width: 300,
            errorCorrectionLevel: 'M',
        });
        qr.blockchainHash = createBlockchainHash({
            qrId: qr.qrId,
            productBatchId: product._id.toString(),
            timestamp: Date.now(),
            manufacturer: admin._id.toString(),
        });

        await qr.save();

        // Link back to product
        product.qrCode = qr._id;
        await product.save();

        console.log(`\n🎉 QR code generated: ${qr.qrId}`);
        console.log(`🔗 Scan URL: ${verificationUrl}`);
        console.log('\nNow go to Admin → Product Batches → View QR to see and scan the code!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

run();
