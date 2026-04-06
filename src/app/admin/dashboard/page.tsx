"use client";

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
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Mock data
const systemStats = {
    totalUsers: 1247,
    totalSuppliers: 89,
    totalManufacturers: 45,
    totalCustomers: 1113,
    pendingApprovals: 5,
    totalProducts: 342,
    totalOrders: 2156,
    activeListings: 298,
    totalRevenue: 145678,
    qrScans: 8934,
    certificatesValid: 156,
    certificatesExpiring: 12,
};

// Manufacturing stats (merged from manufacturer dashboard)
const manufacturingStats = {
    totalProductBatches: 28,
    activeListings: 15,
    qrCodesGenerated: 28,
    pendingApproval: 3,
};

const recentActivity = [
    {
        id: "1",
        type: "approval",
        action: "New supplier registration",
        user: "Natural Oils Co.",
        timestamp: "5 minutes ago",
        status: "pending",
    },
    {
        id: "2",
        type: "order",
        action: "Large order placed",
        user: "Sarah Johnson",
        timestamp: "23 minutes ago",
        status: "completed",
    },
    {
        id: "3",
        type: "certificate",
        action: "Certificate expiring soon",
        user: "Atlas Organic Oils",
        timestamp: "1 hour ago",
        status: "warning",
    },
    {
        id: "4",
        type: "product",
        action: "New product batch created",
        user: "PureGlow Organics",
        timestamp: "2 hours ago",
        status: "completed",
    },
    {
        id: "5",
        type: "user",
        action: "New customer registered",
        user: "Michael Chen",
        timestamp: "3 hours ago",
        status: "completed",
    },
];

// Recent product batches (merged from manufacturer dashboard)
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

// Manufacturing activity (merged from manufacturer dashboard)
const manufacturingActivity = [
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

const pendingApprovals = [
    {
        id: "1",
        name: "Natural Oils Co.",
        type: "Supplier",
        email: "contact@naturaloils.com",
        requestedDate: "2024-01-29",
    },
    {
        id: "2",
        name: "EcoBeauty Manufacturing",
        type: "Manufacturer",
        email: "info@ecobeauty.com",
        requestedDate: "2024-01-28",
    },
    {
        id: "3",
        name: "Organic Extracts Ltd",
        type: "Supplier",
        email: "sales@organicextracts.com",
        requestedDate: "2024-01-28",
    },
];

const systemHealth = [
    { metric: "API Response Time", value: "124ms", status: "good" },
    { metric: "Database Load", value: "45%", status: "good" },
    { metric: "Storage Usage", value: "67%", status: "warning" },
    { metric: "Active Sessions", value: "342", status: "good" },
];

export default function AdminDashboardPage() {
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
                            change="+12%"
                            trend="up"
                            icon={Users}
                            color="bg-blue-100 text-blue-600"
                            delay={0}
                        />
                        <StatCard
                            title="Total Products"
                            value={systemStats.totalProducts}
                            change="+8%"
                            trend="up"
                            icon={Package}
                            color="bg-green-100 text-green-600"
                            delay={0.1}
                        />
                        <StatCard
                            title="Total Orders"
                            value={systemStats.totalOrders}
                            change="+23%"
                            trend="up"
                            icon={ShoppingBag}
                            color="bg-purple-100 text-purple-600"
                            delay={0.2}
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`$${(systemStats.totalRevenue / 1000).toFixed(0)}K`}
                            change="+15%"
                            trend="up"
                            icon={TrendingUp}
                            color="bg-primary-100 text-primary-600"
                            delay={0.3}
                        />
                    </div>

                    {/* Manufacturing Stats (merged from manufacturer) */}
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
                                    trend: "+5 this month",
                                },
                                {
                                    title: "Active Listings",
                                    value: manufacturingStats.activeListings,
                                    icon: ShoppingBag,
                                    color: "bg-green-100 text-green-600",
                                    trend: "+3 this week",
                                },
                                {
                                    title: "QR Codes",
                                    value: manufacturingStats.qrCodesGenerated,
                                    icon: QrCode,
                                    color: "bg-purple-100 text-purple-600",
                                    trend: "100% coverage",
                                },
                                {
                                    title: "Pending",
                                    value: manufacturingStats.pendingApproval,
                                    icon: AlertCircle,
                                    color: "bg-amber-100 text-amber-600",
                                    trend: "Action needed",
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
                                    <span className="text-earth-600">Customers</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.totalCustomers}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600">Suppliers</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.totalSuppliers}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-earth-600">Manufacturers</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.totalManufacturers}
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
                                    <span className="text-earth-600">Total QR Scans</span>
                                    <span className="font-bold text-earth-900">
                                        {systemStats.qrScans}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-earth-900">System Health</h3>
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="space-y-3">
                                {systemHealth.map((item, index) => (
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

                    {/* Recent Product Batches (merged from manufacturer) */}
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
                                                href={`/admin/dashboard/products/${product.id}`}
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

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2">
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900">
                                        Recent Activity
                                    </h2>
                                    <Link href="/admin/dashboard/monitoring">
                                        <Button variant="ghost" size="sm">
                                            View All
                                        </Button>
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentActivity.map((activity) => {
                                        const statusConfig = {
                                            pending: { color: "bg-amber-100 text-amber-600", icon: Clock },
                                            completed: { color: "bg-green-100 text-green-600", icon: CheckCircle },
                                            warning: { color: "bg-red-100 text-red-600", icon: AlertTriangle },
                                        };

                                        const config = statusConfig[activity.status as keyof typeof statusConfig];
                                        const StatusIcon = config.icon;

                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-start gap-4 p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                            >
                                                <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                                                    <StatusIcon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-earth-900">
                                                        {activity.action}
                                                    </p>
                                                    <p className="text-sm text-earth-600">{activity.user}</p>
                                                    <p className="text-xs text-earth-500 mt-1">
                                                        {activity.timestamp}
                                                    </p>
                                                </div>
                                                {activity.status === "pending" && (
                                                    <Button size="sm">Review</Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Approvals + Quick Actions + Manufacturing Activity */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Pending Approvals */}
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif font-bold text-xl text-earth-900">
                                        Pending Approvals
                                    </h2>
                                    <Badge variant="danger">{pendingApprovals.length}</Badge>
                                </div>

                                <div className="space-y-4">
                                    {pendingApprovals.map((approval) => (
                                        <div
                                            key={approval.id}
                                            className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-earth-900">
                                                        {approval.name}
                                                    </p>
                                                    <p className="text-sm text-earth-600">
                                                        {approval.email}
                                                    </p>
                                                </div>
                                                <Badge variant="warning" size="sm">
                                                    {approval.type}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-earth-600 mb-3">
                                                Requested: {new Date(approval.requestedDate).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1">
                                                    Approve
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/admin/dashboard/approvals">
                                    <Button variant="outline" className="w-full mt-4">
                                        View All Approvals
                                    </Button>
                                </Link>
                            </Card>

                            {/* Manufacturing Activity (merged from manufacturer) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-xl text-earth-900 mb-6">
                                        Manufacturing Activity
                                    </h2>

                                    <div className="space-y-4">
                                        {manufacturingActivity.map((activity) => {
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
                                                        className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0"
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
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}