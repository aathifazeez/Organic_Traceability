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

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-earth-600">
                            Monitor and manage the entire OrganicTrace platform
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
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

                        {/* Pending Approvals */}
                        <div className="lg:col-span-1">
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}