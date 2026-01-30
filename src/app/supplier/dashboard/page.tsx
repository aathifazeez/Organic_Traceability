"use client";

import { motion } from "framer-motion";
import {
    Package,
    FileCheck,
    AlertCircle,
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle,
    Plus,
} from "lucide-react";
import Link from "next/link";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock data for organic skincare ingredients
const statsData = {
    totalBatches: 45,
    activeBatches: 32,
    totalCertificates: 18,
    expiringCertificates: 3,
};

const recentBatches = [
    {
        id: "1",
        name: "Organic Argan Oil",
        batchNumber: "ARG-2024-001",
        quantity: "500L",
        status: "active",
        createdDate: "2024-01-25",
        certificateStatus: "valid",
    },
    {
        id: "2",
        name: "Cold-Pressed Rosehip Oil",
        batchNumber: "RSH-2024-015",
        quantity: "250L",
        status: "active",
        createdDate: "2024-01-23",
        certificateStatus: "expiring",
    },
    {
        id: "3",
        name: "Organic Shea Butter",
        batchNumber: "SHB-2024-008",
        quantity: "800kg",
        status: "pending",
        createdDate: "2024-01-22",
        certificateStatus: "valid",
    },
];

const upcomingExpirations = [
    {
        certificateName: "USDA Organic Certificate",
        ingredientName: "Organic Jojoba Oil",
        expiryDate: "2024-02-15",
        daysLeft: 17,
    },
    {
        certificateName: "Ecocert Certification",
        ingredientName: "Cold-Pressed Rosehip Oil",
        expiryDate: "2024-02-28",
        daysLeft: 30,
    },
    {
        certificateName: "Fair Trade Certificate",
        ingredientName: "Organic Coconut Oil",
        expiryDate: "2024-03-10",
        daysLeft: 41,
    },
];

export default function SupplierDashboardPage() {
    const stats = [
        {
            title: "Total Batches",
            value: statsData.totalBatches,
            icon: Package,
            color: "bg-blue-100 text-blue-600",
            trend: "+12%",
        },
        {
            title: "Active Batches",
            value: statsData.activeBatches,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600",
            trend: "+8%",
        },
        {
            title: "Certificates",
            value: statsData.totalCertificates,
            icon: FileCheck,
            color: "bg-purple-100 text-purple-600",
            trend: "+5%",
        },
        {
            title: "Expiring Soon",
            value: statsData.expiringCertificates,
            icon: AlertCircle,
            color: "bg-amber-100 text-amber-600",
            trend: "Action needed",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <SupplierSidebar />

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
                                    Supplier Dashboard
                                </h1>
                                <p className="text-earth-600">
                                    Welcome back! Here's your organic ingredient supply overview.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/supplier/dashboard/batches">
                                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                                        New Batch
                                    </Button>
                                </Link>
                                <Link href="/supplier/dashboard/certificates">
                                    <Button variant="outline">Upload Certificate</Button>
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
                        {/* Recent Batches */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900">
                                            Recent Ingredient Batches
                                        </h2>
                                        <Link href="/supplier/dashboard/batches">
                                            <Button variant="ghost" size="sm">
                                                View All
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        {recentBatches.map((batch) => (
                                            <div
                                                key={batch.id}
                                                className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                                            {batch.name}
                                                        </h3>
                                                        <p className="text-sm text-earth-600">
                                                            Batch: {batch.batchNumber}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge
                                                            variant={
                                                                batch.status === "active"
                                                                    ? "success"
                                                                    : "warning"
                                                            }
                                                        >
                                                            {batch.status}
                                                        </Badge>
                                                        <Badge
                                                            variant={
                                                                batch.certificateStatus === "valid"
                                                                    ? "success"
                                                                    : "warning"
                                                            }
                                                        >
                                                            {batch.certificateStatus === "valid"
                                                                ? "Certified"
                                                                : "Expiring"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 text-sm text-earth-600">
                                                    <div className="flex items-center gap-1">
                                                        <Package className="w-4 h-4" />
                                                        {batch.quantity}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(batch.createdDate).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-secondary-200 flex gap-2">
                                                    <Link href={`/supplier/dashboard/batches/${batch.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Expiring Certificates */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card padding="lg">
                                    <div className="flex items-center gap-2 mb-6">
                                        <AlertCircle className="w-6 h-6 text-amber-600" />
                                        <h2 className="font-serif font-bold text-xl text-earth-900">
                                            Upcoming Expirations
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {upcomingExpirations.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                                            >
                                                <div className="flex items-start gap-3 mb-2">
                                                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-earth-900 text-sm mb-1">
                                                            {cert.certificateName}
                                                        </p>
                                                        <p className="text-xs text-earth-600 mb-2">
                                                            {cert.ingredientName}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-amber-700">
                                                                Expires:{" "}
                                                                {new Date(cert.expiryDate).toLocaleDateString()}
                                                            </p>
                                                            <Badge
                                                                variant="warning"
                                                                size="sm"
                                                            >
                                                                {cert.daysLeft} days
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Link href="/supplier/dashboard/certificates">
                                        <Button variant="outline" size="sm" className="w-full mt-4">
                                            Manage Certificates
                                        </Button>
                                    </Link>
                                </Card>

                                {/* Quick Actions */}
                                <Card padding="lg" className="mt-6">
                                    <h3 className="font-semibold text-earth-900 mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-2">
                                        <Link href="/supplier/dashboard/batches">
                                            <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors text-sm font-medium text-earth-900">
                                                Create New Batch
                                            </button>
                                        </Link>
                                        <Link href="/supplier/dashboard/certificates">
                                            <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors text-sm font-medium text-earth-900">
                                                Upload Certificate
                                            </button>
                                        </Link>
                                        <Link href="/supplier/dashboard/analytics">
                                            <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors text-sm font-medium text-earth-900">
                                                View Analytics
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