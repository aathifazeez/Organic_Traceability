"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Search, Loader2 } from "lucide-react";
import OrderCard from "@/components/customer/OrderCard";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/shared/EmptyState";
import { apiRequest } from "@/lib/auth";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await apiRequest("/orders/my-orders");
                if (res.success) {
                    setOrders(res.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            (order.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order._id || "").includes(searchQuery);
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Map backend order fields to what OrderCard expects
    const mappedOrders = filteredOrders.map((order) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        date: order.createdAt ? new Date(order.createdAt).toISOString().split("T")[0] : "",
        status: order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
        total: order.total,
        items: order.items?.length || 0,
        estimatedDelivery: order.estimatedDelivery,
        trackingNumber: order.trackingNumber,
        image: order.items?.[0]?.image || "",
    }));

    return (
        <div className="min-h-screen bg-gradient-cream">
            <div className="container-custom py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">Order History</h1>
                    <p className="text-earth-600">Track and manage all your organic skincare orders</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-organic border border-secondary-200">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by order number..."
                                    leftIcon={<Search className="w-5 h-5" />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <Select
                                    options={[
                                        { value: "all", label: "All Orders" },
                                        { value: "pending", label: "Pending" },
                                        { value: "processing", label: "Processing" },
                                        { value: "shipped", label: "Shipped" },
                                        { value: "delivered", label: "Delivered" },
                                        { value: "cancelled", label: "Cancelled" },
                                    ]}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                        <p className="text-earth-600 text-lg">Loading orders...</p>
                    </div>
                ) : mappedOrders.length > 0 ? (
                    <div className="space-y-6">
                        {mappedOrders.map((order, index) => (
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
                        title={searchQuery || statusFilter !== "all" ? "No orders found" : "No orders yet"}
                        description={
                            searchQuery || statusFilter !== "all"
                                ? "We couldn't find any orders matching your search criteria."
                                : "You haven't placed any orders yet. Start shopping!"
                        }
                        actionLabel={searchQuery || statusFilter !== "all" ? "Clear Filters" : "Shop Now"}
                        onAction={() => {
                            if (searchQuery || statusFilter !== "all") {
                                setSearchQuery("");
                                setStatusFilter("all");
                            } else {
                                window.location.href = "/products";
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}
