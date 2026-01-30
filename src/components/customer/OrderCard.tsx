"use client";

import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface OrderCardProps {
    order: {
        id: string;
        orderNumber: string;
        date: string;
        status: "processing" | "shipped" | "delivered" | "pending";
        total: number;
        items: number;
        estimatedDelivery?: string;
        trackingNumber?: string;
        image: string;
    };
}

export default function OrderCard({ order }: OrderCardProps) {
    const statusConfig = {
        pending: {
            icon: Clock,
            color: "warning",
            label: "Pending",
            bgColor: "bg-amber-50",
            textColor: "text-amber-700",
        },
        processing: {
            icon: Package,
            color: "info",
            label: "Processing",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
        },
        shipped: {
            icon: Truck,
            color: "primary",
            label: "Shipped",
            bgColor: "bg-primary-50",
            textColor: "text-primary-700",
        },
        delivered: {
            icon: CheckCircle,
            color: "success",
            label: "Delivered",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
        },
    };

    const config = statusConfig[order.status];
    const StatusIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300 transition-all p-6 shadow-organic">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Order Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary-100">
                        <img
                            src={order.image}
                            alt="Order"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg text-earth-900">
                                        Order #{order.orderNumber}
                                    </h3>
                                    <Badge variant={config.color as any} size="sm">
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {config.label}
                                    </Badge>
                                </div>
                                <p className="text-sm text-earth-600">
                                    Placed on {new Date(order.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-sm text-earth-600">
                                    {order.items} {order.items === 1 ? "item" : "items"}
                                </p>
                            </div>

                            <div className="text-left md:text-right">
                                <p className="text-sm text-earth-600 mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    ${order.total.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        {order.status !== "delivered" && order.estimatedDelivery && (
                            <div className={`p-4 ${config.bgColor} rounded-xl mb-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className={`text-sm font-medium ${config.textColor}`}>
                                        {order.status === "shipped"
                                            ? "On the way"
                                            : "Preparing your order"}
                                    </p>
                                    {order.trackingNumber && (
                                        <p className="text-xs text-earth-600">
                                            Tracking: {order.trackingNumber}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-earth-700">
                                    Estimated delivery:{" "}
                                    <span className="font-semibold">
                                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Link href={`/orders/${order.id}`}>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    leftIcon={<Eye className="w-4 h-4" />}
                                >
                                    View Details
                                </Button>
                            </Link>
                            {order.status === "shipped" && (
                                <Button variant="outline" size="sm">
                                    Track Package
                                </Button>
                            )}
                            {order.status === "delivered" && (
                                <Button variant="outline" size="sm">
                                    Reorder
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}