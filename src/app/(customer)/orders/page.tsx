"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Filter } from "lucide-react";
import OrderCard from "@/components/customer/OrderCard";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/shared/EmptyState";

// Mock orders data
const mockOrders = [
    {
        id: "123456",
        orderNumber: "ORG-2024-001",
        date: "2024-01-25",
        status: "shipped" as const,
        total: 130.48,
        items: 2,
        estimatedDelivery: "2024-02-02",
        trackingNumber: "TRK9876543210",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80",
    },
    {
        id: "123455",
        orderNumber: "ORG-2024-002",
        date: "2024-01-20",
        status: "delivered" as const,
        total: 89.99,
        items: 3,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80",
    },
    {
        id: "123454",
        orderNumber: "ORG-2024-003",
        date: "2024-01-15",
        status: "processing" as const,
        total: 245.50,
        items: 4,
        estimatedDelivery: "2024-02-05",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&q=80",
    },
    {
        id: "123453",
        orderNumber: "ORG-2023-125",
        date: "2023-12-28",
        status: "delivered" as const,
        total: 156.75,
        items: 2,
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&q=80",
    },
];

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.includes(searchQuery);
        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-cream">
            <div className="container-custom py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                        Order History
                    </h1>
                    <p className="text-earth-600">
                        Track and manage all your organic skincare orders
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-organic border border-secondary-200">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by order number..."
                                    leftIcon={<Search className="w-5 h-5" />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="w-full md:w-64">
                                <Select
                                    options={[
                                        { value: "all", label: "All Orders" },
                                        { value: "pending", label: "Pending" },
                                        { value: "processing", label: "Processing" },
                                        { value: "shipped", label: "Shipped" },
                                        { value: "delivered", label: "Delivered" },
                                    ]}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <OrderCard order={order} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Package className="w-10 h-10 text-primary-500" />}
                        title="No orders found"
                        description="We couldn't find any orders matching your search criteria."
                        actionLabel="Clear Filters"
                        onAction={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                        }}
                    />
                )}
            </div>
        </div>
    );
}