require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/user');
const IngredientBatch = require('../models/IngredientBatch');
const Certificate = require('../models/Certificate');
const ProductBatch = require('../models/ProductBatch');
const QRCode = require('../models/QRCode');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');
const { USER_ROLES, ACCOUNT_STATUS, BATCH_STATUS, ORDER_STATUS } = require('../config/constants');
const { generateQRCodeImage, generateVerificationUrl, createBlockchainHash } = require('../services/qrService');

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🌱 Starting database seed...\n');

        // Clear existing data
        await User.deleteMany({});
        await IngredientBatch.deleteMany({});
        await Certificate.deleteMany({});
        await ProductBatch.deleteMany({});
        await QRCode.deleteMany({});
        await Order.deleteMany({});
        await AuditLog.deleteMany({});

        console.log('✅ Cleared existing data\n');

        // ===== USERS =====
        const admin = await User.create({
            name: 'OrganicTrace Admin',
            email: 'admin@organictrace.com',
            password: 'admin123',
            role: USER_ROLES.ADMIN,
            status: ACCOUNT_STATUS.APPROVED,
            companyName: 'OrganicTrace Platform',
            companyInfo: 'Platform Administrator & Manufacturer',
            phone: '+15551234567',
            isEmailVerified: true,
        });

        const supplier1 = await User.create({
            name: 'John Doe',
            email: 'supplier@organictrace.com',
            password: 'supplier123',
            role: USER_ROLES.SUPPLIER,
            status: ACCOUNT_STATUS.APPROVED,
            companyName: 'Natural Oils Co.',
            companyInfo: 'Provider of premium organic essential oils from Morocco, Bulgaria, and beyond.',
            phone: '+1234567890',
            website: 'https://naturaloils.com',
            companyAddress: {
                street: '456 Olive Lane',
                city: 'Casablanca',
                state: 'Casablanca-Settat',
                country: 'Morocco',
                postalCode: '20000',
            },
            approvedBy: admin._id,
            approvedAt: new Date('2024-01-02'),
            isEmailVerified: true,
        });

        const supplier2 = await User.create({
            name: 'Maria Santos',
            email: 'supplier2@organictrace.com',
            password: 'supplier123',
            role: USER_ROLES.SUPPLIER,
            status: ACCOUNT_STATUS.APPROVED,
            companyName: 'Atlas Organic Oils',
            companyInfo: 'Premium organic oils and extracts from the Atlas Mountains region.',
            phone: '+212600112233',
            website: 'https://atlasorganic.com',
            companyAddress: {
                street: '12 Atlas Road',
                city: 'Essaouira',
                state: 'Marrakech-Safi',
                country: 'Morocco',
                postalCode: '44000',
            },
            approvedBy: admin._id,
            approvedAt: new Date('2024-01-05'),
            isEmailVerified: true,
        });

        const supplier3 = await User.create({
            name: 'Kwame Asante',
            email: 'supplier3@organictrace.com',
            password: 'supplier123',
            role: USER_ROLES.SUPPLIER,
            status: ACCOUNT_STATUS.PENDING,
            companyName: 'Fair Trade Shea Co.',
            companyInfo: 'Fair trade shea butter and natural ingredients from West Africa.',
            phone: '+233244556677',
            companyAddress: {
                street: '78 Kumasi Highway',
                city: 'Tamale',
                state: 'Northern Region',
                country: 'Ghana',
                postalCode: '00233',
            },
            isEmailVerified: true,
        });

        const supplier4 = await User.create({
            name: 'Priya Sharma',
            email: 'supplier4@organictrace.com',
            password: 'supplier123',
            role: USER_ROLES.SUPPLIER,
            status: ACCOUNT_STATUS.APPROVED,
            companyName: 'Kerala Botanicals',
            companyInfo: 'Organic coconut oil and turmeric extracts from southern India.',
            phone: '+919876543210',
            companyAddress: {
                street: '55 Spice Garden Road',
                city: 'Kochi',
                state: 'Kerala',
                country: 'India',
                postalCode: '682001',
            },
            approvedBy: admin._id,
            approvedAt: new Date('2024-01-10'),
            isEmailVerified: true,
        });

        console.log('✅ Created users (1 admin + 4 suppliers)\n');

        // ===== CERTIFICATES =====
        const cert1 = await Certificate.create({
            certificateNumber: 'CERT-USDA-2024-001',
            certificateType: 'USDA Organic',
            certificateName: 'USDA Organic Certification',
            issuingAuthority: 'United States Department of Agriculture',
            issueDate: new Date('2024-01-01'),
            expiryDate: new Date('2027-12-31'),
            supplier: supplier1._id,
            documentUrl: '/uploads/certificates/usda-cert.pdf',
            documentName: 'usda-organic.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date('2024-01-03'),
            scope: 'Organic essential oils and plant extracts',
        });

        const cert2 = await Certificate.create({
            certificateNumber: 'CERT-ECO-2024-002',
            certificateType: 'Ecocert',
            certificateName: 'Ecocert Organic Certification',
            issuingAuthority: 'Ecocert',
            issueDate: new Date('2024-01-15'),
            expiryDate: new Date('2027-12-31'),
            supplier: supplier1._id,
            documentUrl: '/uploads/certificates/ecocert.pdf',
            documentName: 'ecocert.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date('2024-01-18'),
            scope: 'Organic cosmetic ingredients',
        });

        const cert3 = await Certificate.create({
            certificateNumber: 'CERT-EU-2024-003',
            certificateType: 'EU Organic',
            certificateName: 'EU Organic Certification',
            issuingAuthority: 'European Commission',
            issueDate: new Date('2024-02-01'),
            expiryDate: new Date('2027-12-31'),
            supplier: supplier2._id,
            documentUrl: '/uploads/certificates/eu-organic.pdf',
            documentName: 'eu-organic.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date('2024-02-05'),
            scope: 'Organic plant-based oils',
        });

        const cert4 = await Certificate.create({
            certificateNumber: 'CERT-FT-2024-004',
            certificateType: 'Fair Trade',
            certificateName: 'Fair Trade Certification',
            issuingAuthority: 'Fairtrade International',
            issueDate: new Date('2024-01-20'),
            expiryDate: new Date('2027-06-30'),
            supplier: supplier2._id,
            documentUrl: '/uploads/certificates/fairtrade.pdf',
            documentName: 'fairtrade.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date('2024-01-25'),
            scope: 'Fair trade organic ingredients',
        });

        const cert5 = await Certificate.create({
            certificateNumber: 'CERT-COSMOS-2024-005',
            certificateType: 'Cosmos Organic',
            certificateName: 'COSMOS Organic Standard',
            issuingAuthority: 'COSMOS-standard AISBL',
            issueDate: new Date('2024-03-01'),
            expiryDate: new Date('2027-12-31'),
            supplier: supplier4._id,
            documentUrl: '/uploads/certificates/cosmos.pdf',
            documentName: 'cosmos-organic.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date('2024-03-05'),
            scope: 'Organic coconut and turmeric products',
        });

        const cert6 = await Certificate.create({
            certificateNumber: 'CERT-LB-2024-006',
            certificateType: 'Leaping Bunny',
            certificateName: 'Leaping Bunny Cruelty-Free',
            issuingAuthority: 'Coalition for Consumer Information on Cosmetics',
            issueDate: new Date('2024-01-01'),
            expiryDate: new Date('2027-12-31'),
            supplier: supplier1._id,
            documentUrl: '/uploads/certificates/leaping-bunny.pdf',
            documentName: 'leaping-bunny.pdf',
            status: 'valid',
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date('2024-01-05'),
            scope: 'No animal testing certification',
        });

        console.log('✅ Created 6 certificates\n');

        // ===== INGREDIENT BATCHES =====
        const batch1 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0001',
            ingredientName: 'Organic Argan Oil',
            scientificName: 'Argania spinosa',
            supplier: supplier1._id,
            quantity: { value: 500, unit: 'L' },
            quantityRemaining: { value: 420, unit: 'L' },
            origin: {
                country: 'Morocco',
                region: 'Essaouira',
                farm: 'Cooperative Arganière',
            },
            harvestDate: new Date('2024-01-15'),
            manufacturingDate: new Date('2024-01-20'),
            expiryDate: new Date('2027-01-20'),
            certificates: [cert1._id, cert2._id],
            qualityGrade: 'Premium',
            purity: 99.5,
            unitPrice: 45.99,
            currency: 'USD',
            status: 'active',
            description: 'Cold-pressed virgin argan oil from certified organic cooperatives.',
            processingMethod: 'Cold Pressed',
            extractionMethod: 'Mechanical pressing',
            tags: ['argan', 'anti-aging', 'moisturizing'],
        });

        const batch2 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0002',
            ingredientName: 'Organic Rose Extract',
            scientificName: 'Rosa damascena',
            supplier: supplier1._id,
            quantity: { value: 200, unit: 'L' },
            quantityRemaining: { value: 150, unit: 'L' },
            origin: {
                country: 'Bulgaria',
                region: 'Rose Valley',
                farm: 'Damascena Farms',
            },
            harvestDate: new Date('2024-02-01'),
            manufacturingDate: new Date('2024-02-05'),
            expiryDate: new Date('2027-02-05'),
            certificates: [cert1._id],
            qualityGrade: 'Premium',
            purity: 98.0,
            unitPrice: 89.99,
            currency: 'USD',
            status: 'active',
            description: 'Steam-distilled organic rose extract from the Valley of Roses.',
            processingMethod: 'Steam Distillation',
            tags: ['rose', 'hydrating', 'anti-inflammatory'],
        });

        const batch3 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0003',
            ingredientName: 'Organic Shea Butter',
            scientificName: 'Vitellaria paradoxa',
            supplier: supplier2._id,
            quantity: { value: 800, unit: 'kg' },
            quantityRemaining: { value: 650, unit: 'kg' },
            origin: {
                country: 'Ghana',
                region: 'Northern Region',
                farm: 'Tamale Women\'s Cooperative',
            },
            harvestDate: new Date('2024-01-10'),
            manufacturingDate: new Date('2024-01-15'),
            expiryDate: new Date('2027-01-15'),
            certificates: [cert3._id, cert4._id],
            qualityGrade: 'A',
            purity: 100,
            unitPrice: 25.50,
            currency: 'USD',
            status: 'active',
            description: 'Unrefined organic shea butter, fair trade sourced.',
            processingMethod: 'Traditional Hand-Churned',
            tags: ['shea', 'moisturizing', 'healing'],
        });

        const batch4 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0004',
            ingredientName: 'Organic Jojoba Oil',
            scientificName: 'Simmondsia chinensis',
            supplier: supplier2._id,
            quantity: { value: 300, unit: 'L' },
            quantityRemaining: { value: 250, unit: 'L' },
            origin: {
                country: 'Argentina',
                region: 'Mendoza',
                farm: 'Organic Desert Farms',
            },
            harvestDate: new Date('2024-02-15'),
            manufacturingDate: new Date('2024-02-20'),
            expiryDate: new Date('2027-02-20'),
            certificates: [cert3._id],
            qualityGrade: 'Premium',
            purity: 99.0,
            unitPrice: 38.50,
            currency: 'USD',
            status: 'active',
            description: 'Cold-pressed golden jojoba oil from sustainable desert farms.',
            processingMethod: 'Cold Pressed',
            tags: ['jojoba', 'balancing', 'non-comedogenic'],
        });

        const batch5 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0005',
            ingredientName: 'Organic Coconut Oil',
            scientificName: 'Cocos nucifera',
            supplier: supplier4._id,
            quantity: { value: 1000, unit: 'L' },
            quantityRemaining: { value: 800, unit: 'L' },
            origin: {
                country: 'India',
                region: 'Kerala',
                farm: 'Kerala Coconut Estate',
            },
            harvestDate: new Date('2024-03-01'),
            manufacturingDate: new Date('2024-03-05'),
            expiryDate: new Date('2027-03-05'),
            certificates: [cert5._id],
            qualityGrade: 'Premium',
            purity: 99.8,
            unitPrice: 15.99,
            currency: 'USD',
            status: 'active',
            description: 'Virgin cold-pressed organic coconut oil.',
            processingMethod: 'Cold Pressed',
            extractionMethod: 'Centrifuge extraction',
            tags: ['coconut', 'moisturizing', 'antimicrobial'],
        });

        const batch6 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0006',
            ingredientName: 'Organic Turmeric Extract',
            scientificName: 'Curcuma longa',
            supplier: supplier4._id,
            quantity: { value: 100, unit: 'kg' },
            quantityRemaining: { value: 85, unit: 'kg' },
            origin: {
                country: 'India',
                region: 'Kerala',
                farm: 'Spice Valley Organics',
            },
            harvestDate: new Date('2024-03-10'),
            manufacturingDate: new Date('2024-03-15'),
            expiryDate: new Date('2027-03-15'),
            certificates: [cert5._id],
            qualityGrade: 'A',
            purity: 95.0,
            unitPrice: 55.00,
            currency: 'USD',
            status: 'active',
            description: 'Organic turmeric extract with high curcumin content.',
            processingMethod: 'CO2 Extraction',
            tags: ['turmeric', 'brightening', 'anti-inflammatory'],
        });

        const batch7 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0007',
            ingredientName: 'Organic Lavender Essential Oil',
            scientificName: 'Lavandula angustifolia',
            supplier: supplier1._id,
            quantity: { value: 150, unit: 'L' },
            quantityRemaining: { value: 130, unit: 'L' },
            origin: {
                country: 'France',
                region: 'Provence',
                farm: 'Provence Lavande Bio',
            },
            harvestDate: new Date('2024-04-01'),
            manufacturingDate: new Date('2024-04-05'),
            expiryDate: new Date('2027-04-05'),
            certificates: [cert1._id, cert2._id],
            qualityGrade: 'Premium',
            purity: 99.2,
            unitPrice: 65.00,
            currency: 'USD',
            status: 'active',
            description: 'Steam-distilled organic lavender essential oil from Provence.',
            processingMethod: 'Steam Distillation',
            tags: ['lavender', 'calming', 'soothing'],
        });

        const batch8 = await IngredientBatch.create({
            batchNumber: 'ING-2024-0008',
            ingredientName: 'Organic Aloe Vera Gel',
            scientificName: 'Aloe barbadensis',
            supplier: supplier2._id,
            quantity: { value: 500, unit: 'kg' },
            quantityRemaining: { value: 400, unit: 'kg' },
            origin: {
                country: 'Mexico',
                region: 'Tamaulipas',
                farm: 'Desert Aloe Organics',
            },
            harvestDate: new Date('2024-02-20'),
            manufacturingDate: new Date('2024-02-25'),
            expiryDate: new Date('2028-02-25'),
            certificates: [cert3._id],
            qualityGrade: 'A',
            purity: 99.0,
            unitPrice: 18.50,
            currency: 'USD',
            status: 'active',
            description: 'Freshly harvested organic aloe vera inner gel.',
            processingMethod: 'Cold Processed',
            tags: ['aloe', 'soothing', 'hydrating'],
        });

        console.log('✅ Created 8 ingredient batches\n');

        // ===== PRODUCT BATCHES (4 Luna Botanica products) =====
        const product1 = await ProductBatch.create({
            batchNumber: 'LB-CS-2024-001',
            productName: 'Luna Botanica Coffee Scrub for Face',
            category: 'exfoliator',
            skinType: 'all',
            shortDescription: 'A luxurious organic coffee face scrub that gently exfoliates dead skin cells, boosts circulation, and leaves your skin radiant and smooth.',
            longDescription: 'Our Luna Botanica Coffee Scrub for Face is crafted with pure Coffea Arabica seed powder blended with cold-pressed coconut, olive, and jojoba oils. Enriched with nourishing Shea Butter and Vitamin E, this gentle yet effective scrub buffs away dead skin, reduces puffiness, and unveils a bright, energised complexion. Suitable for all skin types. Free from parabens, SLS, and artificial fragrance.',
            manufacturer: admin._id,
            ingredients: [
                {
                    ingredientBatch: batch5._id,
                    quantityUsed: { value: 20, unit: 'L' },
                    percentage: 30,
                    purpose: 'Carrier oil base',
                },
                {
                    ingredientBatch: batch4._id,
                    quantityUsed: { value: 10, unit: 'L' },
                    percentage: 15,
                    purpose: 'Skin-balancing oil',
                },
                {
                    ingredientBatch: batch3._id,
                    quantityUsed: { value: 15, unit: 'kg' },
                    percentage: 20,
                    purpose: 'Nourishing butter',
                },
            ],
            productionDate: new Date('2024-03-01'),
            expiryDate: new Date('2028-03-01'),
            totalUnits: 100,
            unitsRemaining: 50,
            unitSize: { value: 100, unit: 'g' },
            currency: 'LKR',
            retailPrice: 2500,
            keyFeatures: [
                'Gently exfoliates & removes dead skin cells',
                'Boosts blood circulation for a healthy glow',
                'Deeply nourishing with Shea Butter & Vitamin E',
                '100% natural & organic ingredients',
                'Paraben-free, SLS-free, cruelty-free',
            ],
            benefits: ['Exfoliation', 'Brightening', 'Circulation boost', 'Deep nourishment'],
            howToUse: 'Apply to damp skin in gentle circular motions. Rinse thoroughly with warm water. Use 2–3 times per week.',
            allergens: ['None known'],
            safetyTested: true,
            dermatologistTested: true,
            storageInstructions: 'Store in a cool, dry place.',
            images: [{ url: '/images/product-coffee-scrub.png', caption: 'Luna Botanica Coffee Scrub', isPrimary: true }],
            isListed: true,
            listedAt: new Date('2024-03-05'),
            unitsSold: 50,
            tags: ['coffee', 'scrub', 'exfoliator', 'organic'],
            status: BATCH_STATUS.ACTIVE,
        });

        const product2 = await ProductBatch.create({
            batchNumber: 'LB-NS-2024-001',
            productName: 'Luna Botanica Glimmer 10% Niacinamide Serum',
            category: 'serum',
            skinType: 'sensitive',
            shortDescription: 'A powerful yet gentle 10% Niacinamide serum that minimises pores, fades dark spots, and delivers an instant luminous glow.',
            longDescription: 'The Glimmer Niacinamide Serum by Luna Botanica combines a clinical 10% Niacinamide (Vitamin B3) concentration with Hyaluronic Acid and Pro-Vitamin B5 to deliver deep hydration, even out skin tone, and visibly reduce enlarged pores. Aloe Barbadensis Leaf Juice soothes redness while Xanthan Gum gives the formula its smooth, lightweight texture. Dermatologically tested. Suitable for all skin types including sensitive skin.',
            manufacturer: admin._id,
            ingredients: [
                {
                    ingredientBatch: batch8._id,
                    quantityUsed: { value: 30, unit: 'kg' },
                    percentage: 40,
                    purpose: 'Soothing aloe base',
                },
                {
                    ingredientBatch: batch4._id,
                    quantityUsed: { value: 5, unit: 'L' },
                    percentage: 10,
                    purpose: 'Hydrating carrier',
                },
            ],
            productionDate: new Date('2024-03-15'),
            expiryDate: new Date('2028-03-15'),
            totalUnits: 150,
            unitsRemaining: 80,
            unitSize: { value: 30, unit: 'ml' },
            currency: 'LKR',
            retailPrice: 3500,
            keyFeatures: [
                '10% Niacinamide — minimises pores & evens skin tone',
                'Sodium Hyaluronate for intense 72-hour hydration',
                'Soothes redness and inflammation',
                'Lightweight water-gel texture, absorbs instantly',
                'Suitable for sensitive skin',
            ],
            benefits: ['Pore minimising', 'Skin brightening', 'Hydration', 'Anti-inflammatory'],
            howToUse: 'Apply 3–4 drops to clean face morning and evening before moisturiser.',
            allergens: ['None known'],
            safetyTested: true,
            dermatologistTested: true,
            storageInstructions: 'Store in a cool, dark place.',
            images: [{ url: '/images/product-serum.png', caption: 'Luna Botanica Niacinamide Serum', isPrimary: true }],
            isListed: true,
            listedAt: new Date('2024-03-20'),
            unitsSold: 70,
            tags: ['serum', 'niacinamide', 'brightening', 'organic'],
            status: BATCH_STATUS.ACTIVE,
        });

        const product3 = await ProductBatch.create({
            batchNumber: 'LB-LS-2024-001',
            productName: 'Luna Botanica Lavender Berry Glow Soap',
            category: 'cleanser',
            skinType: 'all',
            shortDescription: 'A handcrafted cold-process soap infused with calming lavender and antioxidant-rich berry powder for a gentle, glowing cleanse.',
            longDescription: 'Our Lavender Berry Glow Soap is a handmade cold-process bar crafted from saponified olive oil, coconut oil, and shea butter — a classic triple-butter base that cleanses without stripping your skin\'s natural moisture. Infused with soothing lavender powder and antioxidant-rich berry powder, this bar gently exfoliates, brightens, and relaxes. Finished with purifying Kaolin clay that draws out impurities without over-drying. Vegan. Palm-oil free.',
            manufacturer: admin._id,
            ingredients: [
                {
                    ingredientBatch: batch7._id,
                    quantityUsed: { value: 8, unit: 'L' },
                    percentage: 12,
                    purpose: 'Calming essential oil',
                },
                {
                    ingredientBatch: batch3._id,
                    quantityUsed: { value: 20, unit: 'kg' },
                    percentage: 25,
                    purpose: 'Rich cleansing butter',
                },
                {
                    ingredientBatch: batch5._id,
                    quantityUsed: { value: 15, unit: 'L' },
                    percentage: 20,
                    purpose: 'Saponified cleansing oil',
                },
            ],
            productionDate: new Date('2024-04-01'),
            expiryDate: new Date('2028-04-01'),
            totalUnits: 200,
            unitsRemaining: 120,
            unitSize: { value: 100, unit: 'g' },
            currency: 'LKR',
            retailPrice: 2000,
            keyFeatures: [
                'Cold-process handmade soap',
                'Triple-butter base — gentle & moisturising',
                'Lavender for calm & soothing cleanse',
                'Berry powder for antioxidant brightening',
                'Kaolin clay to draw out impurities',
            ],
            benefits: ['Gentle cleansing', 'Moisturising', 'Antioxidant protection', 'Soothing'],
            howToUse: 'Lather with water and massage gently onto wet skin. Rinse thoroughly.',
            allergens: ['Contains essential oils'],
            safetyTested: true,
            dermatologistTested: false,
            storageInstructions: 'Store in a dry soap dish. Allow to dry between uses.',
            images: [{ url: '/images/product-soap.png', caption: 'Luna Botanica Lavender Berry Soap', isPrimary: true }],
            isListed: true,
            listedAt: new Date('2024-04-05'),
            unitsSold: 80,
            tags: ['soap', 'cleanser', 'lavender', 'organic'],
            status: BATCH_STATUS.ACTIVE,
        });

        const product4 = await ProductBatch.create({
            batchNumber: 'LB-VG-2024-001',
            productName: 'Luna Botanica Vivid Glow Face Cream',
            category: 'moisturizer',
            skinType: 'dry',
            shortDescription: 'A rich daily moisturiser loaded with Aloe Vera, Rosehip Oil, and Vitamin E to plump, brighten, and protect your skin all day.',
            longDescription: 'The Vivid Glow Face Cream is Luna Botanica\'s signature everyday moisturiser. Its velvety formula blends Aloe Vera Juice and Vegetable Glycerin for lasting hydration with Jojoba and Rosehip oils that target fine lines and uneven tone. Glyceryl Stearate creates a silky emulsion while Tocopherol (Vitamin E) shields against free-radical damage. Free from mineral oil, synthetic fragrances, and parabens. Suitable for normal to dry skin.',
            manufacturer: admin._id,
            ingredients: [
                {
                    ingredientBatch: batch8._id,
                    quantityUsed: { value: 40, unit: 'kg' },
                    percentage: 45,
                    purpose: 'Aloe hydration base',
                },
                {
                    ingredientBatch: batch4._id,
                    quantityUsed: { value: 12, unit: 'L' },
                    percentage: 18,
                    purpose: 'Balancing jojoba oil',
                },
                {
                    ingredientBatch: batch3._id,
                    quantityUsed: { value: 10, unit: 'kg' },
                    percentage: 12,
                    purpose: 'Emollient shea butter',
                },
            ],
            productionDate: new Date('2024-04-10'),
            expiryDate: new Date('2028-04-10'),
            totalUnits: 120,
            unitsRemaining: 65,
            unitSize: { value: 50, unit: 'ml' },
            currency: 'LKR',
            retailPrice: 3000,
            keyFeatures: [
                'Deep 24-hour moisturisation with Aloe Vera & Glycerin',
                'Rosehip Oil — brightens & reduces fine lines',
                'Jojoba Oil — balances skin\'s natural oil production',
                'Vitamin E antioxidant protection',
                'Free from mineral oil & synthetic fragrance',
            ],
            benefits: ['Deep moisturisation', 'Brightening', 'Anti-aging', 'Antioxidant protection'],
            howToUse: 'Apply to clean face and neck morning and evening. Massage gently until absorbed.',
            allergens: ['None known'],
            safetyTested: true,
            dermatologistTested: true,
            storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
            images: [{ url: '/images/product-face-cream.png', caption: 'Luna Botanica Vivid Glow Face Cream', isPrimary: true }],
            isListed: true,
            listedAt: new Date('2024-04-15'),
            unitsSold: 55,
            tags: ['face-cream', 'moisturizer', 'vivid-glow', 'organic'],
            status: BATCH_STATUS.ACTIVE,
        });

        console.log('✅ Created 4 Luna Botanica product batches\n');

        // ===== QR CODES =====
        const qrCodes = [];
        const products = [product1, product2, product3, product4];
        for (const product of products) {
            // Create QR doc first to get the auto-generated qrId
            const qr = new QRCode({
                productBatch: product._id,
                generatedBy: admin._id,
                generatedAt: product.listedAt,
                isActive: true,
                isVerified: true,
                scanCount: Math.floor(Math.random() * 200) + 10,
                lastScannedAt: new Date(),
                metadata: { version: '1.0', format: 'png', size: 300, errorCorrectionLevel: 'M' },
            });

            // Generate URL using the real qrId, then generate the QR image
            const verificationUrl = generateVerificationUrl(qr.qrId);
            qr.verificationUrl = verificationUrl;
            qr.qrCodeUrl = verificationUrl;
            qr.qrCodeImage = await generateQRCodeImage(verificationUrl, { width: 300, errorCorrectionLevel: 'M' });
            qr.blockchainHash = createBlockchainHash({
                qrId: qr.qrId,
                productBatchId: product._id.toString(),
                timestamp: Date.now(),
                manufacturer: admin._id.toString(),
            });

            await qr.save();

            // Link QR code back to product
            product.qrCode = qr._id;
            await product.save();
            qrCodes.push(qr);
        }

        console.log('✅ Created 4 QR codes\n');

        // ===== ORDERS =====
        const order1 = await Order.create({
            orderNumber: 'ORD-2024-001',
            customer: {
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                phone: '+15559876543',
            },
            items: [
                {
                    productBatch: product1._id,
                    productName: product1.productName,
                    quantity: 2,
                    unitPrice: product1.retailPrice,
                    subtotal: 2 * product1.retailPrice,
                    qrCode: qrCodes[0]._id,
                },
                {
                    productBatch: product2._id,
                    productName: product2.productName,
                    quantity: 1,
                    unitPrice: product2.retailPrice,
                    subtotal: product2.retailPrice,
                    qrCode: qrCodes[1]._id,
                },
            ],
            shippingAddress: {
                street: '123 Oak Street',
                city: 'Portland',
                state: 'Oregon',
                country: 'USA',
                postalCode: '97205',
            },
            billingAddress: { sameAsShipping: true },
            subtotal: 2 * product1.retailPrice + product2.retailPrice,
            tax: 12.50,
            shippingCost: 5.99,
            total: 2 * product1.retailPrice + product2.retailPrice + 12.50 + 5.99,
            paymentMethod: 'credit_card',
            paymentStatus: 'paid',
            paidAt: new Date('2024-04-01'),
            status: ORDER_STATUS.DELIVERED,
            shippingMethod: 'standard',
            deliveredAt: new Date('2024-04-08'),
        });

        const order2 = await Order.create({
            orderNumber: 'ORD-2024-002',
            customer: {
                name: 'Michael Chen',
                email: 'michael.chen@example.com',
                phone: '+15551234567',
            },
            items: [
                {
                    productBatch: product3._id,
                    productName: product3.productName,
                    quantity: 3,
                    unitPrice: product3.retailPrice,
                    subtotal: 3 * product3.retailPrice,
                    qrCode: qrCodes[2]._id,
                },
            ],
            shippingAddress: {
                street: '456 Maple Ave',
                city: 'San Francisco',
                state: 'California',
                country: 'USA',
                postalCode: '94102',
            },
            billingAddress: { sameAsShipping: true },
            subtotal: 3 * product3.retailPrice,
            tax: 8.40,
            shippingCost: 5.99,
            total: 3 * product3.retailPrice + 8.40 + 5.99,
            paymentMethod: 'paypal',
            paymentStatus: 'paid',
            paidAt: new Date('2024-04-15'),
            status: ORDER_STATUS.SHIPPED,
            shippingMethod: 'express',
            shippedAt: new Date('2024-04-16'),
            trackingNumber: 'USPS987654321',
        });

        const order3 = await Order.create({
            orderNumber: 'ORD-2024-003',
            customer: {
                name: 'Emma Wilson',
                email: 'emma.w@example.com',
                phone: '+15558765432',
            },
            items: [
                {
                    productBatch: product4._id,
                    productName: product4.productName,
                    quantity: 1,
                    unitPrice: product4.retailPrice,
                    subtotal: product4.retailPrice,
                    qrCode: qrCodes[3]._id,
                },
                {
                    productBatch: product2._id,
                    productName: product2.productName,
                    quantity: 1,
                    unitPrice: product2.retailPrice,
                    subtotal: product2.retailPrice,
                    qrCode: qrCodes[1]._id,
                },
            ],
            shippingAddress: {
                street: '789 Pine Street',
                city: 'Seattle',
                state: 'Washington',
                country: 'USA',
                postalCode: '98101',
            },
            billingAddress: { sameAsShipping: true },
            subtotal: product4.retailPrice + product2.retailPrice,
            tax: 9.20,
            shippingCost: 0,
            total: product4.retailPrice + product2.retailPrice + 9.20,
            paymentMethod: 'credit_card',
            paymentStatus: 'paid',
            paidAt: new Date('2024-05-01'),
            status: ORDER_STATUS.PROCESSING,
            shippingMethod: 'standard',
        });

        const order4 = await Order.create({
            orderNumber: 'ORD-2024-004',
            customer: {
                name: 'David Park',
                email: 'david.park@example.com',
                phone: '+15553456789',
            },
            items: [
                {
                    productBatch: product1._id,
                    productName: product1.productName,
                    quantity: 1,
                    unitPrice: product1.retailPrice,
                    subtotal: product1.retailPrice,
                    qrCode: qrCodes[0]._id,
                },
                {
                    productBatch: product3._id,
                    productName: product3.productName,
                    quantity: 2,
                    unitPrice: product3.retailPrice,
                    subtotal: 2 * product3.retailPrice,
                    qrCode: qrCodes[2]._id,
                },
            ],
            shippingAddress: {
                street: '321 Elm Drive',
                city: 'Denver',
                state: 'Colorado',
                country: 'USA',
                postalCode: '80201',
            },
            billingAddress: { sameAsShipping: true },
            subtotal: product1.retailPrice + 2 * product3.retailPrice,
            tax: 8.10,
            shippingCost: 5.99,
            total: product1.retailPrice + 2 * product3.retailPrice + 8.10 + 5.99,
            paymentMethod: 'stripe',
            paymentStatus: 'paid',
            paidAt: new Date('2024-05-10'),
            status: ORDER_STATUS.PENDING,
            shippingMethod: 'standard',
        });

        const order5 = await Order.create({
            orderNumber: 'ORD-2024-005',
            customer: {
                name: 'Lisa Thompson',
                email: 'lisa.t@example.com',
                phone: '+15557890123',
            },
            items: [
                {
                    productBatch: product2._id,
                    productName: product2.productName,
                    quantity: 2,
                    unitPrice: product2.retailPrice,
                    subtotal: 2 * product2.retailPrice,
                    qrCode: qrCodes[1]._id,
                },
                {
                    productBatch: product3._id,
                    productName: product3.productName,
                    quantity: 1,
                    unitPrice: product3.retailPrice,
                    subtotal: product3.retailPrice,
                    qrCode: qrCodes[2]._id,
                },
            ],
            shippingAddress: {
                street: '555 Birch Lane',
                city: 'Austin',
                state: 'Texas',
                country: 'USA',
                postalCode: '73301',
            },
            billingAddress: { sameAsShipping: true },
            subtotal: 2 * product2.retailPrice + product3.retailPrice,
            tax: 10.50,
            shippingCost: 5.99,
            total: 2 * product2.retailPrice + product3.retailPrice + 10.50 + 5.99,
            paymentMethod: 'credit_card',
            paymentStatus: 'paid',
            paidAt: new Date('2024-05-15'),
            status: ORDER_STATUS.DELIVERED,
            shippingMethod: 'express',
            shippedAt: new Date('2024-05-16'),
            deliveredAt: new Date('2024-05-18'),
        });

        console.log('✅ Created 5 orders\n');

        // ===== AUDIT LOGS =====
        const auditLogs = [
            {
                action: 'CREATE',
                entityType: 'User',
                entityId: supplier1._id,
                performedBy: admin._id,
                description: 'Supplier account created: Natural Oils Co.',
            },
            {
                action: 'APPROVE',
                entityType: 'User',
                entityId: supplier1._id,
                performedBy: admin._id,
                description: 'Supplier approved: Natural Oils Co.',
            },
            {
                action: 'CREATE',
                entityType: 'IngredientBatch',
                entityId: batch1._id,
                performedBy: supplier1._id,
                description: 'Ingredient batch created: Organic Argan Oil (ING-2024-0001)',
            },
            {
                action: 'CREATE',
                entityType: 'ProductBatch',
                entityId: product1._id,
                performedBy: admin._id,
                description: `Product batch created: ${product1.productName} (${product1.batchNumber})`,
            },
            {
                action: 'SCAN_QR',
                entityType: 'QRCode',
                entityId: qrCodes[0]._id,
                performedBy: admin._id,
                description: `QR code scanned for product: ${product1.productName}`,
            },
            {
                action: 'PLACE_ORDER',
                entityType: 'Order',
                entityId: order1._id,
                performedBy: admin._id,
                description: 'Order placed: ORD-2024-001 by Sarah Johnson',
            },
            {
                action: 'STATUS_CHANGE',
                entityType: 'Order',
                entityId: order1._id,
                performedBy: admin._id,
                description: 'Order ORD-2024-001 status changed to delivered',
            },
        ];

        for (const log of auditLogs) {
            await AuditLog.create(log);
        }

        console.log('✅ Created 7 audit logs\n');

        // ===== SUMMARY =====
        console.log('═══════════════════════════════════════');
        console.log('🎉 Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log('   Users: 5 (1 admin, 3 approved suppliers, 1 pending)');
        console.log('   Certificates: 6');
        console.log('   Ingredient Batches: 8');
        console.log('   Product Batches: 4 (Luna Botanica)');
        console.log('   QR Codes: 4');
        console.log('   Orders: 5');
        console.log('   Audit Logs: 7');
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log('   Admin:    admin@organictrace.com / admin123');
        console.log('   Supplier: supplier@organictrace.com / supplier123');
        console.log('   Supplier: supplier2@organictrace.com / supplier123');
        console.log('   Supplier: supplier4@organictrace.com / supplier123');
        console.log('   (Pending) supplier3@organictrace.com / supplier123');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();