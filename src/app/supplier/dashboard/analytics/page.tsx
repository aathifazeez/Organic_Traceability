"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Package,
    FileCheck,
    Calendar,
    AlertTriangle,
    BarChart3,
    PieChart,
} from "lucide-react";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import AnalyticsChart from "@/components/supplier/AnalyticsChart";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { useState } from "react";

// Mock analytics data
const batchesByMonth = [
    { label: "Jan 2024", value: 12 },
    { label: "Feb 2024", value: 15 },
    { label: "Mar 2024", value: 18 },
    { label: "Apr 2024", value: 14 },
    { label: "May 2024", value: 20 },
    { label: "Jun 2024", value: 16 },
];

const topIngredients = [
    { label: "Organic Argan Oil", value: 45 },
    { label: "Shea Butter", value: 38 },
    { label: "Rosehip Oil", value: 32 },
    { label: "Jojoba Oil", value: 28 },
    { label: "Coconut Oil", value: 24 },
];

const certificateTypes = [
    { label: "USDA Organic", value: 8, color: "bg-green-500" },
    { label: "Ecocert", value: 5, color: "bg-blue-500" },
    { label: "Fair Trade", value: 3, color: "bg-purple-500" },
    { label: "Cosmos", value: 2, color: "bg-amber-500" },
];

const batchStatusData = {
    active: 32,
    pending: 8,
    expired: 5,
};

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("6months");

    const kpiData = [
        {
            title: "Total Batches Created",
            value: "135",
            change: "+23%",
            trend: "up",
            icon: Package,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Active Certifications",
            value: "18",
            change: "+5",
            trend: "up",
            icon: FileCheck,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Avg. Batch Size",
            value: "450L",
            change: "+12%",
            trend: "up",
            icon: TrendingUp,
            color: "bg-purple-100 text-purple-600",
        },
        {
            title: "Expiring Certificates",
            value: "3",
            change: "Action needed",
            trend: "warning",
            icon: AlertTriangle,
            color: "bg-amber-100 text-amber-600",
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
                                    Performance Analytics
                                </h1>
                                <p className="text-earth-600">
                                    Track your supply performance and insights
                                </p>
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    options={[
                                        { value: "1month", label: "Last Month" },
                                        { value: "3months", label: "Last 3 Months" },
                                        { value: "6months", label: "Last 6 Months" },
                                        { value: "1year", label: "Last Year" },
                                    ]}
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* KPI Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {kpiData.map((kpi, index) => {
                            const Icon = kpi.icon;
                            return (
                                <motion.div
                                    key={kpi.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card hover padding="lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className={`w-12 h-12 rounded-xl ${kpi.color} flex items-center justify-center`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === "up"
                                                        ? "text-green-600"
                                                        : kpi.trend === "warning"
                                                            ? "text-amber-600"
                                                            : "text-red-600"
                                                    }`}
                                            >
                                                {kpi.trend === "up" && (
                                                    <TrendingUp className="w-4 h-4" />
                                                )}
                                                {kpi.change}
                                            </div>
                                        </div>
                                        <p className="text-sm text-earth-600 mb-1">{kpi.title}</p>
                                        <p className="text-3xl font-bold text-earth-900">
                                            {kpi.value}
                                        </p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* Batches by Month */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <AnalyticsChart
                                title="Ingredient Batches Created"
                                data={batchesByMonth}
                                type="bar"
                            />
                        </motion.div>

                        {/* Top Ingredients */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <AnalyticsChart
                                title="Top 5 Ingredients Supplied"
                                data={topIngredients}
                                type="bar"
                            />
                        </motion.div>
                    </div>

                    {/* Additional Analytics */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Batch Status Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card padding="lg">
                                <h3 className="font-semibold text-lg text-earth-900 mb-6">
                                    Batch Status Distribution
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-earth-700">Active</span>
                                            <span className="text-sm font-semibold text-green-600">
                                                {batchStatusData.active}
                                            </span>
                                        </div>
                                        <div className="w-full bg-secondary-200 rounded-full h-3">
                                            <div
                                                className="h-full bg-green-600 rounded-full"
                                                style={{
                                                    width: `${(batchStatusData.active /
                                                            (batchStatusData.active +
                                                                batchStatusData.pending +
                                                                batchStatusData.expired)) *
                                                        100
                                                        }%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-earth-700">Pending</span>
                                            <span className="text-sm font-semibold text-amber-600">
                                                {batchStatusData.pending}
                                            </span>
                                        </div>
                                        <div className="w-full bg-secondary-200 rounded-full h-3">
                                            <div
                                                className="h-full bg-amber-600 rounded-full"
                                                style={{
                                                    width: `${(batchStatusData.pending /
                                                            (batchStatusData.active +
                                                                batchStatusData.pending +
                                                                batchStatusData.expired)) *
                                                        100
                                                        }%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-earth-700">Expired</span>
                                            <span className="text-sm font-semibold text-red-600">
                                                {batchStatusData.expired}
                                            </span>
                                        </div>
                                        <div className="w-full bg-secondary-200 rounded-full h-3">
                                            <div
                                                className="h-full bg-red-600 rounded-full"
                                                style={{
                                                    width: `${(batchStatusData.expired /
                                                            (batchStatusData.active +
                                                                batchStatusData.pending +
                                                                batchStatusData.expired)) *
                                                        100
                                                        }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Certificate Types */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Card padding="lg">
                                <h3 className="font-semibold text-lg text-earth-900 mb-6">
                                    Certificate Types
                                </h3>
                                <div className="space-y-4">
                                    {certificateTypes.map((cert, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded ${cert.color}`} />
                                            <div className="flex-1">
                                                <p className="text-sm text-earth-700">{cert.label}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-earth-900">
                                                {cert.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Performance Insights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Card padding="lg">
                                <h3 className="font-semibold text-lg text-earth-900 mb-6">
                                    Performance Insights
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-green-900 text-sm mb-1">
                                                    Excellent Performance
                                                </p>
                                                <p className="text-xs text-green-700">
                                                    23% increase in batch creation this month
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-blue-900 text-sm mb-1">
                                                    Compliance Rate
                                                </p>
                                                <p className="text-xs text-blue-700">
                                                    98% of batches have valid certifications
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-amber-900 text-sm mb-1">
                                                    Renewal Reminder
                                                </p>
                                                <p className="text-xs text-amber-700">
                                                    3 certificates expiring in the next 30 days
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}