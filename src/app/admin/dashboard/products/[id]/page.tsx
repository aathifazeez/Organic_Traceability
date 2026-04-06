"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Beaker,
    Calendar,
    Package,
    Shield,
    Leaf,
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock product data
const productBatches: Record<
    string,
    {
        id: string;
        name: string;
        batchNumber: string;
        description: string;
        category: string;
        skinType: string;
        quantity: string;
        unit: string;
        manufacturedDate: string;
        expiryDate: string;
        status: string;
        ingredients: {
            name: string;
            supplier: string;
            batchNumber: string;
            certificates: number;
        }[];
    }
> = {
    "1": {
        id: "1",
        name: "Organic Rose Face Cream",
        batchNumber: "PROD-2024-001",
        description:
            "A luxurious face cream made with organic rose extracts, providing deep hydration and a natural glow.",
        category: "Face Cream",
        skinType: "All Skin Types",
        quantity: "150",
        unit: "units",
        manufacturedDate: "2024-01-28",
        expiryDate: "2025-01-28",
        status: "active",
        ingredients: [
            {
                name: "Organic Rose Extract",
                supplier: "Green Valley Farms",
                batchNumber: "ING-001",
                certificates: 3,
            },
            {
                name: "Shea Butter",
                supplier: "Fair Trade Co.",
                batchNumber: "ING-002",
                certificates: 2,
            },
            {
                name: "Jojoba Oil",
                supplier: "Desert Organics",
                batchNumber: "ING-003",
                certificates: 2,
            },
            {
                name: "Vitamin E",
                supplier: "NaturVit Labs",
                batchNumber: "ING-004",
                certificates: 1,
            },
            {
                name: "Aloe Vera Gel",
                supplier: "Tropical Pure",
                batchNumber: "ING-005",
                certificates: 2,
            },
        ],
    },
    "2": {
        id: "2",
        name: "Vitamin C Brightening Serum",
        batchNumber: "PROD-2024-002",
        description:
            "A potent brightening serum formulated with stabilized Vitamin C and organic botanicals for radiant skin.",
        category: "Serum",
        skinType: "All Skin Types",
        quantity: "200",
        unit: "units",
        manufacturedDate: "2024-01-26",
        expiryDate: "2025-01-26",
        status: "active",
        ingredients: [
            {
                name: "Stabilized Vitamin C",
                supplier: "NaturVit Labs",
                batchNumber: "ING-010",
                certificates: 3,
            },
            {
                name: "Hyaluronic Acid",
                supplier: "BioActive Co.",
                batchNumber: "ING-011",
                certificates: 2,
            },
            {
                name: "Niacinamide",
                supplier: "NaturVit Labs",
                batchNumber: "ING-012",
                certificates: 2,
            },
            {
                name: "Ferulic Acid",
                supplier: "Green Chemistry",
                batchNumber: "ING-013",
                certificates: 1,
            },
        ],
    },
    "3": {
        id: "3",
        name: "Hydrating Face Mask",
        batchNumber: "PROD-2024-003",
        description:
            "An intensely hydrating face mask enriched with organic honey and avocado oil for deep nourishment.",
        category: "Face Mask",
        skinType: "Dry Skin",
        quantity: "100",
        unit: "units",
        manufacturedDate: "2024-01-25",
        expiryDate: "2025-01-25",
        status: "pending",
        ingredients: [
            {
                name: "Organic Honey",
                supplier: "Mountain Bee Co.",
                batchNumber: "ING-020",
                certificates: 3,
            },
            {
                name: "Avocado Oil",
                supplier: "Tropical Pure",
                batchNumber: "ING-021",
                certificates: 2,
            },
            {
                name: "Kaolin Clay",
                supplier: "Earth Minerals",
                batchNumber: "ING-022",
                certificates: 1,
            },
            {
                name: "Green Tea Extract",
                supplier: "Asian Botanicals",
                batchNumber: "ING-023",
                certificates: 2,
            },
            {
                name: "Chamomile Extract",
                supplier: "Green Valley Farms",
                batchNumber: "ING-024",
                certificates: 2,
            },
            {
                name: "Glycerin",
                supplier: "BioActive Co.",
                batchNumber: "ING-025",
                certificates: 1,
            },
        ],
    },
};

export default function ManufacturerProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const product = productBatches[id];

    if (!product) {
        return (
            <div className="flex min-h-screen bg-gradient-cream">
                <AdminSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="container-custom py-8">
                        <Link href="/admin/dashboard/products">
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<ArrowLeft className="w-5 h-5" />}
                                className="mb-6"
                            >
                                Back to Products
                            </Button>
                        </Link>
                        <Card padding="lg">
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-earth-400 mx-auto mb-4" />
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-2">
                                    Product Not Found
                                </h2>
                                <p className="text-earth-600">
                                    The product batch you are looking for does
                                    not exist.
                                </p>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Back Button */}
                    <Link href="/admin/dashboard/products">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                            className="mb-6"
                        >
                            Back to Products
                        </Button>
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-earth-600">
                                    {product.batchNumber}
                                </p>
                            </div>
                            <Badge
                                variant={
                                    product.status === "active"
                                        ? "success"
                                        : "warning"
                                }
                            >
                                {product.status}
                            </Badge>
                        </div>
                    </motion.div>

                    {/* Product Details */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2"
                        >
                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-4">
                                    Product Details
                                </h2>
                                <p className="text-earth-700 mb-6">
                                    {product.description}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <Beaker className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600">
                                                Category
                                            </p>
                                            <p className="font-semibold text-earth-900">
                                                {product.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600">
                                                Skin Type
                                            </p>
                                            <p className="font-semibold text-earth-900">
                                                {product.skinType}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <Package className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600">
                                                Quantity
                                            </p>
                                            <p className="font-semibold text-earth-900">
                                                {product.quantity}{" "}
                                                {product.unit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600">
                                                Manufactured
                                            </p>
                                            <p className="font-semibold text-earth-900">
                                                {new Date(
                                                    product.manufacturedDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-xl text-earth-900 mb-4">
                                    Batch Info
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-earth-600">
                                            Expiry Date
                                        </p>
                                        <p className="font-semibold text-earth-900">
                                            {new Date(
                                                product.expiryDate
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-earth-600">
                                            Total Ingredients
                                        </p>
                                        <p className="font-semibold text-earth-900">
                                            {product.ingredients.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-earth-600">
                                            Total Certificates
                                        </p>
                                        <p className="font-semibold text-earth-900">
                                            {product.ingredients.reduce(
                                                (acc, ing) =>
                                                    acc + ing.certificates,
                                                0
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Ingredients List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card padding="lg">
                            <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                Ingredients ({product.ingredients.length})
                            </h2>
                            <div className="space-y-4">
                                {product.ingredients.map(
                                    (ingredient, index) => (
                                        <motion.div
                                            key={ingredient.batchNumber}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.4 + index * 0.05,
                                            }}
                                            className="p-4 bg-secondary-50 rounded-xl flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Leaf className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-earth-900">
                                                    {ingredient.name}
                                                </h3>
                                                <p className="text-sm text-earth-600">
                                                    {ingredient.batchNumber} •{" "}
                                                    {ingredient.supplier}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="info">
                                                    {ingredient.certificates}{" "}
                                                    cert
                                                    {ingredient.certificates !==
                                                        1 && "s"}
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}