"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Download,
    Calendar,
    TrendingUp,
    Users,
    ShoppingBag,
    Package,
    DollarSign,
    FileText,
    Printer,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

// Mock analytics data
const analyticsData = {
    revenue: {
        current: 145678,
        previous: 123456,
        change: 18,
    },
    orders: {
        current: 2156,
        previous: 1834,
        change: 17.5,
    },
    users: {
        current: 1247,
        previous: 1089,
        change: 14.5,
    },
    products: {
        current: 342,
        previous: 298,
        change: 14.8,
    },
};

const monthlyRevenue = [
    { month: "Jan", revenue: 12450, orders: 145 },
    { month: "Feb", revenue: 15230, orders: 178 },
    { month: "Mar", revenue: 18900, orders: 223 },
    { month: "Apr", revenue: 16780, orders: 198 },
    { month: "May", revenue: 21340, orders: 267 },
    { month: "Jun", revenue: 24560, orders: 312 },
];

const topProducts = [
    {
        name: "Organic Rose Face Cream",
        sales: 456,
        revenue: 20976.44,
        growth: 23,
    },
    {
        name: "Vitamin C Brightening Serum",
        sales: 389,
        revenue: 14981.50,
        growth: 18,
    },
    {
        name: "Anti-Aging Night Cream",
        sales: 334,
        revenue: 17699.66,
        growth: 15,
    },
    {
        name: "Hydrating Face Mask",
        sales: 298,
        revenue: 8344.00,
        growth: 12,
    },
    {
        name: "Gentle Cleansing Foam",
        sales: 267,
        revenue: 6672.33,
        growth: 8,
    },
];

const topSuppliers = [
    { name: "Atlas Organic Oils", batches: 45, value: 87560 },
    { name: "Natural Extracts Ltd", batches: 38, value: 72340 },
    { name: "Fair Trade Shea Co.", batches: 32, value: 65890 },
    { name: "Rosa Organics", batches: 28, value: 54230 },
    { name: "BioActive Ingredients", batches: 24, value: 48670 },
];

const userGrowth = [
    { category: "Customers", count: 1113, percentage: 89.3 },
    { category: "Suppliers", count: 89, percentage: 7.1 },
    { category: "Manufacturers", count: 45, percentage: 3.6 },
];

const certificateStats = {
    total: 168,
    valid: 156,
    expiring: 12,
    expired: 0,
    byType: [
        { type: "USDA Organic", count: 67 },
        { type: "Ecocert", count: 45 },
        { type: "Fair Trade", count: 28 },
        { type: "Cosmos", count: 18 },
        { type: "Non-GMO", count: 10 },
    ],
};

export default function ReportsPage() {
    const [reportType, setReportType] = useState("overview");
    const [timeRange, setTimeRange] = useState("30days");

    const handleExport = (format: string) => {
        console.log(`Exporting report as ${format}`);
    };

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    Reports & Analytics
                                </h1>
                                <p className="text-earth-600">
                                    Comprehensive business insights and data analysis
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    leftIcon={<Download className="w-5 h-5" />}
                                    onClick={() => handleExport("pdf")}
                                >
                                    Export PDF
                                </Button>
                                <Button
                                    variant="outline"
                                    leftIcon={<Printer className="w-5 h-5" />}
                                    onClick={() => handleExport("print")}
                                >
                                    Print
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <Card padding="md">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Select
                                        options={[
                                            { value: "overview", label: "Overview Report" },
                                            { value: "revenue", label: "Revenue Report" },
                                            { value: "users", label: "User Analytics" },
                                            { value: "products", label: "Product Performance" },
                                            { value: "suppliers", label: "Supplier Analytics" },
                                            { value: "certificates", label: "Certificate Report" },
                                        ]}
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select
                                        options={[
                                            { value: "7days", label: "Last 7 Days" },
                                            { value: "30days", label: "Last 30 Days" },
                                            { value: "90days", label: "Last 90 Days" },
                                            { value: "1year", label: "Last Year" },
                                        ]}
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Key Metrics */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        +{analyticsData.revenue.change}%
                                    </div>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    ${(analyticsData.revenue.current / 1000).toFixed(0)}K
                                </p>
                                <p className="text-xs text-earth-600 mt-2">
                                    vs ${(analyticsData.revenue.previous / 1000).toFixed(0)}K last
                                    period
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        +{analyticsData.orders.change}%
                                    </div>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {analyticsData.orders.current}
                                </p>
                                <p className="text-xs text-earth-600 mt-2">
                                    vs {analyticsData.orders.previous} last period
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        +{analyticsData.users.change}%
                                    </div>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {analyticsData.users.current}
                                </p>
                                <p className="text-xs text-earth-600 mt-2">
                                    vs {analyticsData.users.previous} last period
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        +{analyticsData.products.change}%
                                    </div>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Active Products</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {analyticsData.products.current}
                                </p>
                                <p className="text-xs text-earth-600 mt-2">
                                    vs {analyticsData.products.previous} last period
                                </p>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* Revenue Trend */}
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif font-bold text-2xl text-earth-900">
                                    Revenue Trend
                                </h2>
                                <BarChart3 className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="space-y-4">
                                {monthlyRevenue.map((month, index) => {
                                    const maxRevenue = Math.max(
                                        ...monthlyRevenue.map((m) => m.revenue)
                                    );
                                    const percentage = (month.revenue / maxRevenue) * 100;

                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-earth-700">
                                                    {month.month}
                                                </span>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-earth-900">
                                                        ${month.revenue.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-earth-600 ml-2">
                                                        ({month.orders} orders)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Top Products */}
                        <Card padding="lg">
                            <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                Top Performing Products
                            </h2>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-earth-900 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-earth-600">
                                                    {product.sales} units sold
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                +{product.growth}%
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-earth-600">Revenue:</span>
                                            <span className="text-lg font-bold text-primary-600">
                                                ${product.revenue.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* Top Suppliers */}
                        <Card padding="lg">
                            <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                Top Suppliers by Volume
                            </h2>
                            <div className="space-y-3">
                                {topSuppliers.map((supplier, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-earth-900">
                                                {supplier.name}
                                            </p>
                                            <p className="text-sm text-earth-600">
                                                {supplier.batches} ingredient batches
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary-600">
                                                ${(supplier.value / 1000).toFixed(1)}K
                                            </p>
                                            <p className="text-xs text-earth-600">Total Value</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* User Distribution & Certificates */}
                        <div className="space-y-8">
                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                    User Distribution
                                </h2>
                                <div className="space-y-4">
                                    {userGrowth.map((category, index) => (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-earth-700">
                                                    {category.category}
                                                </span>
                                                <span className="text-sm font-bold text-earth-900">
                                                    {category.count} ({category.percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-secondary-200 rounded-full h-2">
                                                <div
                                                    className="h-full bg-primary-600 rounded-full"
                                                    style={{ width: `${category.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                    Certificate Statistics
                                </h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <span className="text-earth-700">Valid Certificates</span>
                                        <span className="font-bold text-green-600">
                                            {certificateStats.valid}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                        <span className="text-earth-700">Expiring Soon</span>
                                        <span className="font-bold text-amber-600">
                                            {certificateStats.expiring}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-secondary-200">
                                    <p className="text-sm font-medium text-earth-900 mb-3">
                                        By Type:
                                    </p>
                                    <div className="space-y-2">
                                        {certificateStats.byType.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <span className="text-earth-600">{cert.type}</span>
                                                <span className="font-semibold text-earth-900">
                                                    {cert.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Export Options */}
                    <Card padding="lg">
                        <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                            Export Reports
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                className="justify-start"
                                leftIcon={<FileText className="w-5 h-5" />}
                                onClick={() => handleExport("csv")}
                            >
                                Export as CSV
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start"
                                leftIcon={<FileText className="w-5 h-5" />}
                                onClick={() => handleExport("excel")}
                            >
                                Export as Excel
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start"
                                leftIcon={<FileText className="w-5 h-5" />}
                                onClick={() => handleExport("pdf")}
                            >
                                Export as PDF
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}