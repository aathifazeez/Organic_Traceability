"use client";

import { useState, useEffect } from "react";
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
    Loader2,
} from "lucide-react";
import Link from "next/link";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { apiRequest, getCurrentUser } from "@/lib/auth";

export default function SupplierDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [statsData, setStatsData] = useState({
        totalBatches: 0,
        activeBatches: 0,
        totalCertificates: 0,
        expiringCertificates: 0,
    });
    const [expiringCerts, setExpiringCerts] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [batchesRes, certsRes] = await Promise.all([
                    apiRequest("/batches?limit=3&sortBy=createdAt&sortOrder=desc"),
                    apiRequest("/certificates?limit=10"),
                ]);

                if (batchesRes.success) {
                    const allBatches = batchesRes.data || [];
                    setBatches(allBatches);
                    setStatsData(prev => ({
                        ...prev,
                        totalBatches: batchesRes.pagination?.totalItems || allBatches.length,
                        activeBatches: allBatches.filter((b: any) => b.status === "active").length,
                    }));
                }

                if (certsRes.success) {
                    const allCerts = certsRes.data || [];
                    setCertificates(allCerts);
                    const expiring = allCerts.filter((c: any) => {
                        const daysLeft = Math.ceil((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        return daysLeft > 0 && daysLeft <= 90;
                    });
                    setExpiringCerts(expiring);
                    setStatsData(prev => ({
                        ...prev,
                        totalCertificates: certsRes.pagination?.totalItems || allCerts.length,
                        expiringCertificates: expiring.length,
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch supplier data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-cream">
                <SupplierSidebar />
                <main className="flex-1 lg:ml-0 min-h-screen overflow-auto flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                        <p className="text-earth-600 text-lg">Loading dashboard...</p>
                    </div>
                </main>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Batches",
            value: statsData.totalBatches,
            icon: Package,
            color: "bg-blue-100 text-blue-600",
            trend: "All batches",
        },
        {
            title: "Active Batches",
            value: statsData.activeBatches,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600",
            trend: "Active now",
        },
        {
            title: "Certificates",
            value: statsData.totalCertificates,
            icon: FileCheck,
            color: "bg-purple-100 text-purple-600",
            trend: "Total certs",
        },
        {
            title: "Expiring Soon",
            value: statsData.expiringCertificates,
            icon: AlertCircle,
            color: "bg-amber-100 text-amber-600",
            trend: statsData.expiringCertificates > 0 ? "Action needed" : "All clear",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <SupplierSidebar />

            <main className="flex-1 lg:ml-0 min-h-screen overflow-auto">
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
                                    Welcome back! Here&apos;s your organic ingredient supply overview.
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
                                        {batches.length === 0 ? (
                                            <p className="text-earth-600 text-center py-8">No batches yet. Add your first ingredient batch!</p>
                                        ) : (
                                            batches.map((batch: any) => (
                                                <div
                                                    key={batch._id || batch.id}
                                                    className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                                                {batch.ingredientName}
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
                                                                    batch.certificates && batch.certificates.length > 0
                                                                        ? "success"
                                                                        : "warning"
                                                                }
                                                            >
                                                                {batch.certificates && batch.certificates.length > 0
                                                                    ? "Certified"
                                                                    : "No Cert"}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6 text-sm text-earth-600">
                                                        <div className="flex items-center gap-1">
                                                            <Package className="w-4 h-4" />
                                                            {batch.quantity?.value}{batch.quantity?.unit}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(batch.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-secondary-200 flex gap-2">
                                                        <Link href={`/supplier/dashboard/batches/${batch._id || batch.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        )}
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
                                        {expiringCerts.length === 0 ? (
                                            <p className="text-earth-600 text-center py-4 text-sm">No certificates expiring soon. All clear! ✅</p>
                                        ) : (
                                            expiringCerts.map((cert: any, index: number) => {
                                                const daysLeft = Math.ceil(
                                                    (new Date(cert.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                                                );
                                                return (
                                                    <div
                                                        key={cert._id || index}
                                                        className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                                                    >
                                                        <div className="flex items-start gap-3 mb-2">
                                                            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-earth-900 text-sm mb-1">
                                                                    {cert.certificateName}
                                                                </p>
                                                                <p className="text-xs text-earth-600 mb-2">
                                                                    {cert.certificateType}
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
                                                                        {daysLeft} days
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <Link href="/supplier/dashboard/certificates">
                                        <Button variant="outline" size="sm" className="w-full mt-4">
                                            Manage Certificates
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}