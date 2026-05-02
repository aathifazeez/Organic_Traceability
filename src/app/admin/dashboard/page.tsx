"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Package,
    ShoppingBag,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity,
    Beaker,
    QrCode,
    AlertCircle,
    Plus,
    Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { apiRequest } from "@/lib/auth";

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<any>(null);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewRes, productsRes, usersRes] = await Promise.all([
                    apiRequest("/analytics/overview"),
                    apiRequest("/products?limit=3&sortBy=createdAt&sortOrder=desc"),
                    apiRequest("/users?status=pending&limit=5"),
                ]);

                if (overviewRes.success) setOverview(overviewRes.data);
                if (productsRes.success) setRecentProducts(productsRes.data || []);
                if (usersRes.success) setPendingUsers(usersRes.data || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            setActionLoading(id);
            const res = await apiRequest(`/users/${id}/approve`, { method: "PATCH" });
            if (res.success) {
                setPendingUsers(pendingUsers.filter((u: any) => (u._id || u.id) !== id));
            } else {
                alert(res.message || "Failed to approve user");
            }
        } catch {
            alert("Failed to approve user.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        try {
            setActionLoading(id);
            const res = await apiRequest(`/users/${id}/reject`, { method: "PATCH" });
            if (res.success) {
                setPendingUsers(pendingUsers.filter((u: any) => (u._id || u.id) !== id));
            } else {
                alert(res.message || "Failed to reject user");
            }
        } catch {
            alert("Failed to reject user.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-cream">
                <AdminSidebar />
                <main className="flex-1 lg:ml-0 min-h-screen overflow-auto flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                        <p className="text-earth-600 text-lg">Loading dashboard...</p>
                    </div>
                </main>
            </div>
        );
    }

    const systemStats = {
        totalUsers: overview?.users?.total || 0,
        totalSuppliers: overview?.users?.suppliers || 0,
        pendingApprovals: overview?.users?.pendingApprovals || 0,
        totalProducts: overview?.products?.total || 0,
        totalOrders: overview?.orders?.total || 0,
        totalRevenue: overview?.orders?.revenue || 0,
        qrScans: 0,
        certificatesValid: overview?.certificates?.valid || 0,
        certificatesExpiring: 0,
        activeBatches: overview?.batches?.active || 0,
        totalQRCodes: overview?.qrCodes?.total || 0,
    };

    const manufacturingStats = {
        totalProductBatches: overview?.products?.total || 0,
        activeListings: overview?.products?.active || 0,
        qrCodesGenerated: overview?.qrCodes?.total || 0,
        pendingApproval: overview?.users?.pendingApprovals || 0,
    };

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <AdminSidebar />

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
                                    Admin Dashboard
                                </h1>
                                <p className="text-earth-600">
                                    Monitor and manage the entire OrganicTrace platform
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/admin/dashboard/products/create">
                                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                                        Create Product Batch
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Platform Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={systemStats.totalUsers}
                            change={`${systemStats.totalSuppliers} suppliers`}
                            trend="up"
                            icon={Users}
                            color="bg-blue-100 text-blue-600"
                            delay={0}
                        />
                        <StatCard
                            title="Total Products"
                            value={systemStats.totalProducts}
                            change={`${systemStats.activeBatches} active batches`}
                            trend="up"
                            icon={Package}
                            color="bg-green-100 text-green-600"
                            delay={0.1}
                        />
                        <StatCard
                            title="Total Orders"
                            value={systemStats.totalOrders}
                            change={`$${(systemStats.totalRevenue / 1000).toFixed(1)}K revenue`}
                            trend="up"
                            icon={ShoppingBag}
                            color="bg-purple-100 text-purple-600"
                            delay={0.2}
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`$${systemStats.totalRevenue > 0 ? (systemStats.totalRevenue / 1000).toFixed(0) + 'K' : '0'}`}
                            change={`${systemStats.totalOrders} orders`}
                            trend="up"
                            icon={TrendingUp}
                            color="bg-primary-100 text-primary-600"
                            delay={0.3}
                        />
                    </div>

                    {/* Manufacturing Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="font-serif font-bold text-2xl text-earth-900 mb-4">
                            Manufacturing Overview
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Product Batches",
                                    value: manufacturingStats.totalProductBatches,
                                    icon: Beaker,
                                    color: "bg-blue-100 text-blue-600",
                                    trend: "View all →",
                                },
                                {
                                    title: "Active Listings",
                                    value: manufacturingStats.activeListings,
                                    icon: ShoppingBag,
                                    color: "bg-green-100 text-green-600",
                                    trend: "Listed products",
                                },
                                {
                                    title: "QR Codes",
                                    value: manufacturingStats.qrCodesGenerated,
                                    icon: QrCode,
                                    color: "bg-purple-100 text-purple-600",
                                    trend: "100% coverage",
                                },
                                {
                                    title: "Pending Approvals",
                                    value: manufacturingStats.pendingApproval,
                                    icon: AlertCircle,
                                    color: "bg-amber-100 text-amber-600",
                                    trend: manufacturingStats.pendingApproval > 0 ? "Action needed" : "All clear",
                                },
                            ].map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
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
                    </motion.div>

                    {/* Secondary Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-earth-900">User Distribution</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600">Total Users</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.totalUsers}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600">Suppliers</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.totalSuppliers}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600">Pending</span>
                                    <span className="font-bold text-amber-600">
                                        {systemStats.pendingApprovals}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-earth-900">Certificates</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Valid
                                    </span>
                                    <span className="font-bold text-green-600">
                                        {systemStats.certificatesValid}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                        Expiring Soon
                                    </span>
                                    <span className="font-bold text-amber-600">
                                        {systemStats.certificatesExpiring}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600">Total QR Codes</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.totalQRCodes}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-earth-900">Platform Health</h3>
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="space-y-3">
                                {[
                                    { metric: "Active Suppliers", value: String(overview?.users?.activeSuppliers || 0), status: overview?.users?.activeSuppliers > 0 ? "good" : "warn" },
                                    { metric: "Valid Certificates", value: String(overview?.certificates?.valid || 0), status: overview?.certificates?.valid > 0 ? "good" : "warn" },
                                    { metric: "Active Products", value: String(systemStats.totalProducts), status: systemStats.totalProducts > 0 ? "good" : "warn" },
                                    { metric: "Total Orders", value: String(systemStats.totalOrders), status: "good" },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-earth-600">{item.metric}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-earth-900">
                                                {item.value}
                                            </span>
                                            <div
                                                className={`w-2 h-2 rounded-full ${item.status === "good"
                                                    ? "bg-green-600"
                                                    : "bg-amber-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Recent Product Batches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif font-bold text-2xl text-earth-900">
                                    Recent Product Batches
                                </h2>
                                <Link href="/admin/dashboard/products">
                                    <Button variant="ghost" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentProducts.length === 0 ? (
                                    <p className="text-earth-600 text-center py-8">No product batches yet. Create your first one!</p>
                                ) : (
                                    recentProducts.map((product: any) => (
                                        <div
                                            key={product._id || product.id}
                                            className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                                        {product.productName}
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
                                                        {product.ingredients?.length || 0}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-earth-600 mb-1">
                                                        QR Code
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        {product.qrCode ? (
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
                                                        {product.isListed ? (
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
                                                    href={`/admin/dashboard/products/${product._id || product.id}`}
                                                >
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                                {!product.qrCode && (
                                                    <Button size="sm">Generate QR</Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900">
                                        Quick Actions
                                    </h2>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Link href="/admin/dashboard/products/create">
                                        <div className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <Beaker className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-earth-900">Create Product Batch</p>
                                                    <p className="text-sm text-earth-600">Add new product</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href="/admin/dashboard/approvals">
                                        <div className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-earth-900">Supplier Approvals</p>
                                                    <p className="text-sm text-earth-600">{systemStats.pendingApprovals} pending</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href="/admin/dashboard/qr-codes">
                                        <div className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                    <QrCode className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-earth-900">QR Codes</p>
                                                    <p className="text-sm text-earth-600">Manage QR codes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href="/admin/dashboard/reports">
                                        <div className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-earth-900">Reports</p>
                                                    <p className="text-sm text-earth-600">View analytics</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </Card>
                        </div>

                        {/* Pending Approvals */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif font-bold text-xl text-earth-900">
                                        Pending Approvals
                                    </h2>
                                    <Badge variant="danger">{pendingUsers.length}</Badge>
                                </div>

                                <div className="space-y-4">
                                    {pendingUsers.length === 0 ? (
                                        <p className="text-earth-600 text-center py-4">No pending approvals</p>
                                    ) : (
                                        pendingUsers.map((user: any) => (
                                            <div
                                                key={user._id || user.id}
                                                className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold text-earth-900">
                                                            {user.companyName || user.name}
                                                        </p>
                                                        <p className="text-sm text-earth-600">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <Badge variant="warning" size="sm">
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-earth-600 mb-3">
                                                    Requested: {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleApprove(user._id || user.id)}
                                                        disabled={actionLoading === (user._id || user.id)}
                                                    >
                                                        {actionLoading === (user._id || user.id) ? "..." : "Approve"}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleReject(user._id || user.id)}
                                                        disabled={actionLoading === (user._id || user.id)}
                                                    >
                                                        {actionLoading === (user._id || user.id) ? "..." : "Reject"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Link href="/admin/dashboard/approvals">
                                    <Button variant="outline" className="w-full mt-4">
                                        View All Approvals
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}