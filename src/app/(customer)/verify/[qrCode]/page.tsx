"use client";

import { motion } from "framer-motion";
import {
    QrCode,
    Package,
    Factory,
    Calendar,
    ShieldCheck,
    MapPin,
    FileText,
    Download,
    Share2,
    CheckCircle,
    Leaf,
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import IngredientCard from "@/components/customer/IngredientCard";

// Mock verification data
const verificationData = {
    qrCode: "QR-ROSE-CREAM-001",
    product: {
        name: "Organic Rose Face Cream",
        description:
            "Luxurious anti-aging face cream enriched with organic rose oil, hyaluronic acid, and vitamin E. Suitable for dry and sensitive skin.",
        variant: "50ml",
        batchNumber: "BATCH-2024-RC-001",
        manufacturedDate: "2024-01-15",
        expiryDate: "2026-01-15",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
        skinType: "Dry & Sensitive",
        benefits: [
            "Deep Hydration",
            "Anti-Aging",
            "Reduces Fine Lines",
            "Brightens Skin",
        ],
    },
    manufacturer: {
        name: "PureGlow Organics",
        location: "Portland, Oregon, USA",
        certifications: ["USDA Organic", "Leaping Bunny", "Ecocert"],
        contactEmail: "info@pureglow.com",
    },
    ingredients: [
        {
            id: "1",
            name: "Organic Rose Oil",
            batchNumber: "ING-2024-001",
            supplier: "Rosa Organics Ltd",
            origin: "Bulgaria",
            quantity: "15ml per batch",
            certifications: [
                {
                    name: "USDA Organic Certificate",
                    issuedBy: "USDA Organic Program",
                    expiryDate: "2025-06-30",
                    status: "valid" as const,
                },
                {
                    name: "EU Organic Certification",
                    issuedBy: "Ecocert",
                    expiryDate: "2025-08-15",
                    status: "valid" as const,
                },
            ],
        },
        {
            id: "2",
            name: "Hyaluronic Acid (Plant-Based)",
            batchNumber: "ING-2024-002",
            supplier: "BioActive Ingredients Co.",
            origin: "France",
            quantity: "5ml per batch",
            certifications: [
                {
                    name: "Cosmos Organic",
                    issuedBy: "Cosmetics Organic Standard",
                    expiryDate: "2025-12-31",
                    status: "valid" as const,
                },
            ],
        },
        {
            id: "3",
            name: "Organic Shea Butter",
            batchNumber: "ING-2024-003",
            supplier: "Fair Trade Shea Cooperative",
            origin: "Ghana",
            quantity: "20ml per batch",
            certifications: [
                {
                    name: "Fair Trade Certified",
                    issuedBy: "Fair Trade USA",
                    expiryDate: "2025-04-30",
                    status: "expiring" as const,
                },
                {
                    name: "USDA Organic",
                    issuedBy: "USDA",
                    expiryDate: "2025-09-30",
                    status: "valid" as const,
                },
            ],
        },
        {
            id: "4",
            name: "Vitamin E (Non-GMO)",
            batchNumber: "ING-2024-004",
            supplier: "Natural Vitamins Inc",
            origin: "California, USA",
            quantity: "2ml per batch",
            certifications: [
                {
                    name: "Non-GMO Project Verified",
                    issuedBy: "Non-GMO Project",
                    expiryDate: "2025-11-30",
                    status: "valid" as const,
                },
            ],
        },
    ],
    verificationDate: new Date().toISOString(),
};

export default function QRVerificationPage({
    params,
}: {
    params: { qrCode: string };
}) {
    const handleDownloadReport = () => {
        // Implement PDF download
        console.log("Download verification report");
    };

    const handleShare = () => {
        // Implement share functionality
        console.log("Share verification");
    };

    return (
        <div className="min-h-screen bg-gradient-cream">
            <div className="container-custom py-12">
                {/* Verification Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-4">
                        Product Verified
                    </h1>
                    <p className="text-xl text-earth-600 max-w-2xl mx-auto">
                        This product's authenticity and organic certifications have been
                        successfully verified through our blockchain-secured traceability
                        system.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Download className="w-4 h-4" />}
                            onClick={handleDownloadReport}
                        >
                            Download Report
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Share2 className="w-4 h-4" />}
                            onClick={handleShare}
                        >
                            Share
                        </Button>
                    </div>
                </motion.div>

                {/* Product Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <Card padding="lg">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Product Image */}
                            <div className="relative">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary-100">
                                    <img
                                        src={verificationData.product.image}
                                        alt={verificationData.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Badge variant="success" size="lg">
                                        <ShieldCheck className="w-4 h-4 mr-1" />
                                        Verified Organic
                                    </Badge>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div>
                                <div className="mb-6">
                                    <h2 className="font-serif font-bold text-3xl text-earth-900 mb-2">
                                        {verificationData.product.name}
                                    </h2>
                                    <p className="text-lg text-earth-600 mb-4">
                                        {verificationData.product.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="info">
                                            For {verificationData.product.skinType} Skin
                                        </Badge>
                                        <Badge variant="primary">
                                            {verificationData.product.variant}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Key Benefits */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-earth-900 mb-3">
                                        Key Benefits:
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {verificationData.product.benefits.map((benefit, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 text-earth-700"
                                            >
                                                <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span className="text-sm">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Batch Information */}
                                <div className="space-y-3 p-4 bg-secondary-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-earth-600">Batch Number:</span>
                                        <span className="font-mono font-semibold text-earth-900">
                                            {verificationData.product.batchNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-earth-600">Manufactured:</span>
                                        <span className="font-semibold text-earth-900">
                                            {new Date(
                                                verificationData.product.manufacturedDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-earth-600">Best Before:</span>
                                        <span className="font-semibold text-earth-900">
                                            {new Date(
                                                verificationData.product.expiryDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-earth-600">QR Code:</span>
                                        <span className="font-mono font-semibold text-primary-600">
                                            {verificationData.qrCode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Manufacturer Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <Card padding="lg">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <Factory className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-1">
                                    Manufacturer Information
                                </h2>
                                <p className="text-earth-600">
                                    Verified organic skincare manufacturer
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-earth-600 mb-1">Company Name</p>
                                    <p className="font-semibold text-earth-900 text-lg">
                                        {verificationData.manufacturer.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-earth-600 mb-1 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </p>
                                    <p className="font-medium text-earth-900">
                                        {verificationData.manufacturer.location}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-earth-600 mb-1">Contact</p>
                                    <a
                                        href={`mailto:${verificationData.manufacturer.contactEmail}`}
                                        className="font-medium text-primary-600 hover:underline"
                                    >
                                        {verificationData.manufacturer.contactEmail}
                                    </a>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-earth-600 mb-3">
                                    Company Certifications:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {verificationData.manufacturer.certifications.map(
                                        (cert, index) => (
                                            <Badge key={index} variant="success">
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                {cert}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Ingredient Traceability */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="mb-8">
                        <h2 className="font-serif font-bold text-3xl text-earth-900 mb-2">
                            Ingredient Traceability
                        </h2>
                        <p className="text-earth-600">
                            Complete transparency of all organic ingredients and their
                            certifications
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {verificationData.ingredients.map((ingredient, index) => (
                            <motion.div
                                key={ingredient.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <IngredientCard ingredient={ingredient} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Verification Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12"
                >
                    <Card padding="lg" className="bg-green-50 border-green-200">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                    Verification Complete
                                </h3>
                                <p className="text-sm text-earth-700">
                                    This product has been verified on{" "}
                                    {new Date(verificationData.verificationDate).toLocaleString()}.
                                    All ingredients are certified organic and traceable to their
                                    source suppliers.
                                </p>
                            </div>
                            <Link href="/products">
                                <Button>Shop More Products</Button>
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}