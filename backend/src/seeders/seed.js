require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/user');
const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const { USER_ROLES, ACCOUNT_STATUS } = require('../config/constants');

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🌱 Starting database seed...\n');

        // Clear existing data
        await User.deleteMany({});
        await IngredientBatch.deleteMany({});
        await Certificate.deleteMany({});

        console.log('✅ Cleared existing data\n');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@organictrace.com',
            password: 'admin123',
            role: USER_ROLES.ADMIN,
            status: ACCOUNT_STATUS.APPROVED,
            companyName: 'OrganicTrace Platform',
        });

        console.log('✅ Created admin user\n');

        // Create supplier user
        const supplier = await User.create({
            name: 'John Doe',
            email: 'supplier@organictrace.com',
            password: 'supplier123',
            role: USER_ROLES.SUPPLIER,
            status: ACCOUNT_STATUS.APPROVED,
            companyName: 'Natural Oils Co.',
            companyInfo: 'Provider of premium organic essential oils',
            phone: '+1234567890',
            approvedBy: admin._id,
            approvedAt: new Date(),
        });

        console.log('✅ Created supplier user\n');

        // Create certificates for supplier
        const cert1 = await Certificate.create({
            certificateNumber: 'CERT-USDA-2024-001',
            certificateType: 'USDA Organic',
            certificateName: 'USDA Organic Certification',
            issuingAuthority: 'United States Department of Agriculture',
            issueDate: new Date('2024-01-01'),
            expiryDate: new Date('2025-12-31'),
            supplier: supplier._id,
            documentUrl: '/uploads/certificates/sample-cert.pdf',
            documentName: 'usda-organic.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date(),
        });

        const cert2 = await Certificate.create({
            certificateNumber: 'CERT-ECO-2024-002',
            certificateType: 'Ecocert',
            certificateName: 'Ecocert Organic Certification',
            issuingAuthority: 'Ecocert',
            issueDate: new Date('2024-01-15'),
            expiryDate: new Date('2025-12-31'),
            supplier: supplier._id,
            documentUrl: '/uploads/certificates/sample-cert2.pdf',
            documentName: 'ecocert.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date(),
        });

        console.log('✅ Created certificates\n');

        // Create ingredient batches
        const batch1 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0001',
            ingredientName: 'Organic Argan Oil',
            scientificName: 'Argania spinosa',
            supplier: supplier._id,
            quantity: { value: 100, unit: 'L' },
            quantityRemaining: { value: 100, unit: 'L' },
            origin: {
                country: 'Morocco',
                region: 'Essaouira',
            },
            harvestDate: new Date('2024-01-15'),
            manufacturingDate: new Date('2024-01-20'),
            expiryDate: new Date('2025-01-20'),
            certificates: [cert1._id, cert2._id],
            qualityGrade: 'Premium',
            purity: 99.5,
            unitPrice: 45.99,
            status: 'active',
        });

        const batch2 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0002',
            ingredientName: 'Organic Rose Extract',
            scientificName: 'Rosa damascena',
            supplier: supplier._id,
            quantity: { value: 50, unit: 'L' },
            quantityRemaining: { value: 50, unit: 'L' },
            origin: {
                country: 'Bulgaria',
                region: 'Rose Valley',
            },
            harvestDate: new Date('2024-02-01'),
            manufacturingDate: new Date('2024-02-05'),
            expiryDate: new Date('2025-02-05'),
            certificates: [cert1._id],
            qualityGrade: 'Premium',
            purity: 98.0,
            unitPrice: 89.99,
            status: 'active',
        });

        const batch3 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0003',
            ingredientName: 'Organic Shea Butter',
            scientificName: 'Vitellaria paradoxa',
            supplier: supplier._id,
            quantity: { value: 75, unit: 'kg' },
            quantityRemaining: { value: 75, unit: 'kg' },
            origin: {
                country: 'Ghana',
                region: 'Northern Region',
            },
            harvestDate: new Date('2024-01-10'),
            manufacturingDate: new Date('2024-01-15'),
            expiryDate: new Date('2026-01-15'),
            certificates: [cert1._id, cert2._id],
            qualityGrade: 'A',
            purity: 100,
            unitPrice: 25.50,
            status: 'active',
        });

        console.log('✅ Created ingredient batches\n');

        console.log('🎉 Database seeded successfully!\n');
        console.log('Login credentials:');
        console.log('Admin: admin@organictrace.com / admin123');
        console.log('Supplier: supplier@organictrace.com / supplier123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();