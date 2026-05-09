"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    Server,
    Database,
    Zap,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    HardDrive,
    Cpu,
    Users,
    ShoppingBag,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";

// Mock system monitoring data
const systemMetrics = {
    apiResponseTime: 124,
    databaseLoad: 45,
    storageUsage: 67,
    activeSessions: 342,
    requestsPerMinute: 1247,
    errorRate: 0.12,
    uptime: 99.98,
    cpuUsage: 38,
    memoryUsage: 52,
    networkTraffic: 856,
};

const realtimeActivity = [
    {
        id: "1",
        timestamp: new Date().toISOString(),
        type: "api_call",
        endpoint: "/api/products/search",
        status: "success",
        responseTime: "145ms",
        user: "emma.wilson@example.com",
    },
    {
        id: "2",
        timestamp: new Date(Date.now() - 5000).toISOString(),
        type: "database",
        endpoint: "INSERT INTO batches",
        status: "success",
        responseTime: "23ms",
        user: "supplier-service",
    },
    {
        id: "3",
        timestamp: new Date(Date.now() - 12000).toISOString(),
        type: "api_call",
        endpoint: "/api/verify/QR-001",
        status: "success",
        responseTime: "98ms",
        user: "customer-app",
    },
    {
        id: "4",
        timestamp: new Date(Date.now() - 18000).toISOString(),
        type: "api_call",
        endpoint: "/api/certificates/upload",
        status: "error",
        responseTime: "2134ms",
        user: "atlas@organic.com",
    },
    {
        id: "5",
        timestamp: new Date(Date.now() - 25000).toISOString(),
        type: "qr_scan",
        endpoint: "QR Verification",
        status: "success",
        responseTime: "67ms",
        user: "anonymous",
    },
];

const alerts = [
    {
        id: "1",
        severity: "warning",
        message: "Storage usage above 65%",
        timestamp: "2 hours ago",
        action: "Consider archiving old data",
    },
    {
        id: "2",
        severity: "info",
        message: "Scheduled maintenance in 3 days",
        timestamp: "5 hours ago",
        action: "Notify users",
    },
    {
        id: "3",
        severity: "error",
        message: "Failed login attempts spike detected",
        timestamp: "1 day ago",
        action: "Review security logs",
    },
];

const serverStatus = [
    {
        name: "API Server",
        status: "operational",
        uptime: "99.99%",
        lastCheck: "2 minutes ago",
        location: "US East",
    },
    {
        name: "Database Primary",
        status: "operational",
        uptime: "99.98%",
        lastCheck: "1 minute ago",
        location: "US East",
    },
    {
        name: "Database Replica",
        status: "operational",
        uptime: "99.95%",
        lastCheck: "3 minutes ago",
        location: "EU West",
    },
    {
        name: "Storage Service",
        status: "degraded",
        uptime: "98.50%",
        lastCheck: "5 minutes ago",
        location: "US West",
    },
];

export default function MonitoringPage() {
    const [timeRange, setTimeRange] = useState("1hour");

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    System Monitoring
                                </h1>
                                <p className="text-earth-600">
                                    Real-time system health and performance metrics
                                </p>
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    options={[
                                        { value: "5min", label: "Last 5 Minutes" },
                                        { value: "1hour", label: "Last Hour" },
                                        { value: "24hours", label: "Last 24 Hours" },
                                        { value: "7days", label: "Last 7 Days" },
                                    ]}
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* System Health Overview */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <Badge variant="success">Good</Badge>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">API Response</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {systemMetrics.apiResponseTime}ms
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Database className="w-6 h-6 text-green-600" />
                                    </div>
                                    <Badge variant="success">Good</Badge>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Database Load</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {systemMetrics.databaseLoad}%
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <HardDrive className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <Badge variant="warning">Warning</Badge>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Storage Usage</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {systemMetrics.storageUsage}%
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card hover padding="lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <Badge variant="info">Active</Badge>
                                </div>
                                <p className="text-sm text-earth-600 mb-1">Active Sessions</p>
                                <p className="text-3xl font-bold text-earth-900">
                                    {systemMetrics.activeSessions}
                                </p>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card padding="md">
                            <div className="flex items-center gap-3 mb-3">
                                <Cpu className="w-5 h-5 text-primary-600" />
                                <span className="text-sm text-earth-600">CPU Usage</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-earth-900">
                                    {systemMetrics.cpuUsage}%
                                </span>
                                <span className="text-sm text-green-600 mb-1">Normal</span>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2 mt-3">
                                <div
                                    className="h-full bg-primary-600 rounded-full"
                                    style={{ width: `${systemMetrics.cpuUsage}%` }}
                                />
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3 mb-3">
                                <Server className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-earth-600">Memory Usage</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-earth-900">
                                    {systemMetrics.memoryUsage}%
                                </span>
                                <span className="text-sm text-green-600 mb-1">Normal</span>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2 mt-3">
                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${systemMetrics.memoryUsage}%` }}
                                />
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3 mb-3">
                                <Activity className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-earth-600">Requests/min</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-earth-900">
                                    {systemMetrics.requestsPerMinute}
                                </span>
                                <span className="text-sm text-green-600 mb-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    +12%
                                </span>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <span className="text-sm text-earth-600">Error Rate</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-earth-900">
                                    {systemMetrics.errorRate}%
                                </span>
                                <span className="text-sm text-green-600 mb-1">Low</span>
                            </div>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-8">
                        {/* Real-time Activity */}
                        <div className="lg:col-span-2">
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900">
                                        Real-time Activity
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                                        <span className="text-sm text-earth-600">Live</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {realtimeActivity.map((activity) => {
                                        const statusConfig = {
                                            success: {
                                                bg: "bg-green-50",
                                                border: "border-green-200",
                                                text: "text-green-700",
                                            },
                                            error: {
                                                bg: "bg-red-50",
                                                border: "border-red-200",
                                                text: "text-red-700",
                                            },
                                        };

                                        const config = statusConfig[activity.status as keyof typeof statusConfig];

                                        return (
                                            <div
                                                key={activity.id}
                                                className={`p-3 rounded-xl border-2 ${config.bg} ${config.border}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm font-semibold text-earth-900">
                                                                {activity.endpoint}
                                                            </span>
                                                            <Badge
                                                                variant={
                                                                    activity.status === "success"
                                                                        ? "success"
                                                                        : "danger"
                                                                }
                                                                size="sm"
                                                            >
                                                                {activity.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-earth-600">
                                                            User: {activity.user}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-semibold ${config.text}`}>
                                                            {activity.responseTime}
                                                        </p>
                                                        <p className="text-xs text-earth-600">
                                                            {new Date(activity.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>

                        {/* Alerts */}
                        <div className="lg:col-span-1">
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif font-bold text-xl text-earth-900">
                                        System Alerts
                                    </h2>
                                    <Badge variant="warning">{alerts.length}</Badge>
                                </div>

                                <div className="space-y-4">
                                    {alerts.map((alert) => {
                                        const severityConfig = {
                                            error: {
                                                bg: "bg-red-50",
                                                border: "border-red-200",
                                                icon: "text-red-600",
                                            },
                                            warning: {
                                                bg: "bg-amber-50",
                                                border: "border-amber-200",
                                                icon: "text-amber-600",
                                            },
                                            info: {
                                                bg: "bg-blue-50",
                                                border: "border-blue-200",
                                                icon: "text-blue-600",
                                            },
                                        };

                                        const config = severityConfig[alert.severity as keyof typeof severityConfig];

                                        return (
                                            <div
                                                key={alert.id}
                                                className={`p-4 rounded-xl border-2 ${config.bg} ${config.border}`}
                                            >
                                                <div className="flex items-start gap-3 mb-2">
                                                    <AlertTriangle
                                                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.icon}`}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-earth-900 text-sm mb-1">
                                                            {alert.message}
                                                        </p>
                                                        <p className="text-xs text-earth-600 mb-2">
                                                            {alert.timestamp}
                                                        </p>
                                                        <p className="text-xs text-earth-700 italic">
                                                            Action: {alert.action}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Server Status */}
                    <Card padding="lg">
                        <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                            Server Status
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {serverStatus.map((server, index) => {
                                const statusConfig = {
                                    operational: {
                                        color: "text-green-600",
                                        bg: "bg-green-100",
                                        icon: CheckCircle,
                                    },
                                    degraded: {
                                        color: "text-amber-600",
                                        bg: "bg-amber-100",
                                        icon: AlertTriangle,
                                    },
                                    down: {
                                        color: "text-red-600",
                                        bg: "bg-red-100",
                                        icon: AlertTriangle,
                                    },
                                };

                                const config = statusConfig[server.status as keyof typeof statusConfig];
                                const StatusIcon = config.icon;

                                return (
                                    <div
                                        key={index}
                                        className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-earth-900 mb-1">
                                                    {server.name}
                                                </h3>
                                                <p className="text-sm text-earth-600">{server.location}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 ${config.color}`}>
                                                <StatusIcon className="w-5 h-5" />
                                                <span className="text-sm font-medium capitalize">
                                                    {server.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-earth-600">Uptime:</span>
                                            <span className="font-semibold text-earth-900">
                                                {server.uptime}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm mt-2">
                                            <span className="text-earth-600">Last Check:</span>
                                            <span className="text-earth-700">{server.lastCheck}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}