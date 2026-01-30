"use client";

import { motion } from "framer-motion";
import {
    Package,
    Truck,
    CheckCircle,
    MapPin,
    Calendar,
    CreditCard,
    Download,
    MessageCircle,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock order details
const orderDetails = {
    id: "123456",
    orderNumber: "ORG-2024-001",
    date: "2024-01-25",
    status: "shipped",
    total: 130.48,
    subtotal: 110.48,
    shipping: 12.00,
    tax: 8.00,
    trackingNumber: "TRK9876543210",
    estimatedDelivery: "2024-02-02",
    shippingAddress: {
        name: "Emma Wilson",
        street: "123 Beauty Lane",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "United States",
    },
    items: [
        {
            id: "1",
            name: "Organic Rose Face Cream",
            variant: "50ml - For Dry Skin",
            price: 45.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80",
            qrCode: "QR-ROSE-CREAM-001",
        },
        {
            id: "2",
            name: "Vitamin C Serum",
            variant: "30ml - Brightening",
            price: 38.50,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80",
            qrCode: "QR-VIT-C-SERUM-002",
        },
    ],
    timeline: [
        {
            status: "Order Placed",
            date: "2024-01-25 10:30 AM",
            completed: true,
        },
        {
            status: "Payment Confirmed",
            date: "2024-01-25 10:35 AM",
            completed: true,
        },
        {
            status: "Processing",
            date: "2024-01-26 09:00 AM",
            completed: true,
        },
        {
            status: "Shipped",
            date: "2024-01-27 02:15 PM",
            completed: true,
        },
        {
            status: "Out for Delivery",
            date: "Expected: 2024-02-02",
            completed: false,
        },
        {
            status: "Delivered",
            date: "Pending",
            completed: false,
        },
    ],
};

export default function OrderDetailPage() {
    return (
        <div className="min-h-screen bg-gradient-cream">
            <div className="container-custom py-12">
                {/* Back Button */}
                <Link href="/orders">
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="mb-6"
                    >
                        Back to Orders
                    </Button>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                Order #{orderDetails.orderNumber}
                            </h1>
                            <p className="text-earth-600">
                                Placed on{" "}
                                {new Date(orderDetails.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" leftIcon={<Download className="w-5 h-5" />}>
                                Invoice
                            </Button>
                            <Button variant="outline" leftIcon={<MessageCircle className="w-5 h-5" />}>
                                Support
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                    Order Status
                                </h2>
                                <div className="space-y-6">
                                    {orderDetails.timeline.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed
                                                            ? "bg-green-600 text-white"
                                                            : "bg-secondary-200 text-earth-600"
                                                        }`}
                                                >
                                                    {event.completed ? (
                                                        <CheckCircle className="w-5 h-5" />
                                                    ) : (
                                                        <div className="w-2 h-2 bg-earth-400 rounded-full" />
                                                    )}
                                                </div>
                                                {index < orderDetails.timeline.length - 1 && (
                                                    <div
                                                        className={`w-0.5 flex-1 min-h-[40px] ${event.completed ? "bg-green-600" : "bg-secondary-300"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-8">
                                                <p
                                                    className={`font-semibold ${event.completed ? "text-earth-900" : "text-earth-600"
                                                        }`}
                                                >
                                                    {event.status}
                                                </p>
                                                <p className="text-sm text-earth-600">{event.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {orderDetails.trackingNumber && (
                                    <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-earth-900 mb-1">
                                                    Tracking Number
                                                </p>
                                                <p className="font-mono text-primary-700">
                                                    {orderDetails.trackingNumber}
                                                </p>
                                            </div>
                                            <Button size="sm">Track Package</Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                    Order Items
                                </h2>
                                <div className="space-y-6">
                                    {orderDetails.items.map((item) => (
                                        <div key={item.id} className="flex gap-6 pb-6 border-b border-secondary-200 last:border-0 last:pb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-24 h-24 rounded-xl object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-earth-600 mb-3">
                                                    {item.variant}
                                                </p>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <p className="text-earth-700">
                                                        Quantity: <span className="font-semibold">{item.quantity}</span>
                                                    </p>
                                                    <p className="text-earth-700">
                                                        Price: <span className="font-semibold">${item.price}</span>
                                                    </p>
                                                </div>
                                                <Link href={`/verify/${item.qrCode}`}>
                                                    <Button size="sm" variant="outline">
                                                        Verify Product Authenticity
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-primary-600">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card padding="lg">
                                <h3 className="font-serif font-bold text-xl text-earth-900 mb-6">
                                    Order Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-earth-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">
                                            ${orderDetails.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            ${orderDetails.shipping.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Tax</span>
                                        <span className="font-semibold">
                                            ${orderDetails.tax.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t-2 border-secondary-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-serif font-bold text-lg text-earth-900">
                                                Total
                                            </span>
                                            <span className="font-serif font-bold text-2xl text-primary-600">
                                                ${orderDetails.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Shipping Address */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card padding="lg">
                                <h3 className="font-semibold text-lg text-earth-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                    Shipping Address
                                </h3>
                                <div className="text-earth-700">
                                    <p className="font-medium mb-1">
                                        {orderDetails.shippingAddress.name}
                                    </p>
                                    <p>{orderDetails.shippingAddress.street}</p>
                                    <p>
                                        {orderDetails.shippingAddress.city},{" "}
                                        {orderDetails.shippingAddress.state}{" "}
                                        {orderDetails.shippingAddress.zipCode}
                                    </p>
                                    <p>{orderDetails.shippingAddress.country}</p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Expected Delivery */}
                        {orderDetails.estimatedDelivery && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card padding="lg" className="bg-primary-50 border-primary-200">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-primary-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-earth-900 mb-1">
                                                Expected Delivery
                                            </h3>
                                            <p className="text-2xl font-bold text-primary-700">
                                                {new Date(
                                                    orderDetails.estimatedDelivery
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <p className="text-sm text-earth-600 mt-1">
                                                {new Date(orderDetails.estimatedDelivery).toLocaleDateString(
                                                    "en-US",
                                                    { weekday: "long" }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}