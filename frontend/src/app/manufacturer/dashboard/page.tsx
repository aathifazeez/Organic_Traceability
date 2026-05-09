"use client";

import { motion } from "framer-motion";
import {
    Beaker,
    ShoppingBag,
    QrCode,
    TrendingUp,
    AlertCircle,
    Package,
    CheckCircle,
    Plus,
} from "lucide-react";
import Link from "next/link";
import ManufacturerSidebar from "@/components/manufacturer/ManufacturerSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock data for organic skincare products
const statsData = {
    totalProductBatches: 28,
    activeListings: 15,
    qrCodesGenerated: 28,
    pendingApproval: 3,
};

const recentProducts = [
    {
        id: "1",
        name: "Organic Rose Face Cream",
        batchNumber: "PROD-2024-001",
        ingredients: 5,
        qrGenerated: true,
        listed: true,
        createdDate: "2024-01-28",
        status: "active",
    },
    {
        id: "2",
        name: "Vitamin C Brightening Serum",
        batchNumber: "PROD-2024-002",
        ingredients: 4,
        qrGenerated: true,
        listed: true,
        createdDate: "2024-01-26",
        status: "active",
    },
    {
        id: "3",
        name: "Hydrating Face Mask",
        batchNumber: "PROD-2024-003",
        ingredients: 6,
        qrGenerated: false,
        listed: false,
        createdDate: "2024-01-25",
        status: "pending",
    },
];

const recentActivity = [
    {
        id: "1",
        action: "QR Code Generated",
        product: "Organic Rose Face Cream",
        timestamp: "2 hours ago",
        type: "qr",
    },
    {
        id: "2",
        action: "Product Listed",
        product: "Vitamin C Brightening Serum",
        timestamp: "5 hours ago",
        type: "listing",
    },
    {
        id: "3",
        action: "Batch Created",
        product: "Hydrating Face Mask",
        timestamp: "1 day ago",
        type: "batch",
    },
    {
        id: "4",
        action: "Ingredients Linked",
        product: "Anti-Aging Night Cream",
        timestamp: "2 days ago",
        type: "ingredient",
    },
];

export default function ManufacturerDashboardPage() {
    const stats = [
        {
            title: "Product Batches",
            value: statsData.totalProductBatches,
            icon: Beaker,
            color: "bg-blue-100 text-blue-600",
            trend: "+5 this month",
        },
        {
            title: "Active Listings",
            value: statsData.activeListings,
            icon: ShoppingBag,
            color: "bg-green-100 text-green-600",
            trend: "+3 this week",
        },
        {
            title: "QR Codes",
            value: statsData.qrCodesGenerated,
            icon: QrCode,
            color: "bg-purple-100 text-purple-600",
            trend: "100% coverage",
        },
        {
            title: "Pending",
            value: statsData.pendingApproval,
            icon: AlertCircle,
            color: "bg-amber-100 text-amber-600",
            trend: "Action needed",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <ManufacturerSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    Manufacturer Dashboard
                                </h1>
                                <p className="text-earth-600">
                                    Welcome back! Manage your organic skincare production.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/manufacturer/dashboard/products/create">
                                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                                        Create Product Batch
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card hover padding="lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                                <TrendingUp className="w-4 h-4" />
                                                {stat.trend}
                                            </div>
                                        </div>
                                        <p className="text-sm text-earth-600 mb-1">{stat.title}</p>
                                        <p className="text-3xl font-bold text-earth-900">
                                            {stat.value}
                                        </p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Products */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900">
                                            Recent Product Batches
                                        </h2>
                                        <Link href="/manufacturer/dashboard/products">
                                            <Button variant="ghost" size="sm">
                                                View All
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        {recentProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-earth-600">
                                                            Batch: {product.batchNumber}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            product.status === "active" ? "success" : "warning"
                                                        }
                                                    >
                                                        {product.status}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 mb-3">
                                                    <div>
                                                        <p className="text-xs text-earth-600 mb-1">
                                                            Ingredients
                                                        </p>
                                                        <p className="font-semibold text-earth-900">
                                                            {product.ingredients}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-earth-600 mb-1">
                                                            QR Code
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            {product.qrGenerated ? (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                    <span className="text-sm font-medium text-green-600">
                                                                        Generated
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                                                    <span className="text-sm font-medium text-amber-600">
                                                                        Pending
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-earth-600 mb-1">Listed</p>
                                                        <div className="flex items-center gap-1">
                                                            {product.listed ? (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                    <span className="text-sm font-medium text-green-600">
                                                                        Yes
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="w-4 h-4 text-earth-400" />
                                                                    <span className="text-sm font-medium text-earth-600">
                                                                        No
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-secondary-200 flex gap-2">
                                                    <Link
                                                        href={`/manufacturer/dashboard/products/${product.id}`}
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    {!product.qrGenerated && (
                                                        <Button size="sm">Generate QR</Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-xl text-earth-900 mb-6">
                                        Recent Activity
                                    </h2>

                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => {
                                            const iconConfig = {
                                                qr: { icon: QrCode, color: "text-purple-600" },
                                                listing: { icon: ShoppingBag, color: "text-green-600" },
                                                batch: { icon: Beaker, color: "text-blue-600" },
                                                ingredient: { icon: Package, color: "text-amber-600" },
                                            };

                                            const config = iconConfig[activity.type as keyof typeof iconConfig];
                                            const Icon = config.icon;

                                            return (
                                                <div key={activity.id} className="flex gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0`}
                                                    >
                                                        <Icon className={`w-5 h-5 ${config.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-earth-900">
                                                            {activity.action}
                                                        </p>
                                                        <p className="text-sm text-earth-600 truncate">
                                                            {activity.product}
                                                        </p>
                                                        <p className="text-xs text-earth-500 mt-1">
                                                            {activity.timestamp}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>

                                {/* Quick Actions */}
                                <Card padding="lg" className="mt-6">
                                    <h3 className="font-semibold text-earth-900 mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-2">
                                        <Link href="/manufacturer/dashboard/products/create">
                                            <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors text-sm font-medium text-earth-900">
                                                Create Product Batch
                                            </button>
                                        </Link>
                                        <Link href="/manufacturer/dashboard/qr-codes">
                                            <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors text-sm font-medium text-earth-900">
                                                Generate QR Codes
                                            </button>
                                        </Link>
                                        <Link href="/manufacturer/dashboard/listings">
                                            <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors text-sm font-medium text-earth-900">
                                                Manage Listings
                                            </button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}