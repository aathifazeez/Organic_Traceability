"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Tag, Truck, Gift } from "lucide-react";
import Link from "next/link";
import CartItem from "@/components/customer/CartItem";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";

// Mock cart data - organic skincare products
const initialCartItems = [
    {
        id: "1",
        name: "Organic Rose Face Cream",
        variant: "50ml",
        price: 45.99,
        originalPrice: 59.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
        inStock: true,
        skinType: "Dry",
    },
    {
        id: "2",
        name: "Vitamin C Serum",
        variant: "30ml",
        price: 38.50,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
        inStock: true,
        skinType: "All Types",
    },
    {
        id: "3",
        name: "Hydrating Face Mask",
        variant: "100ml",
        price: 28.00,
        originalPrice: 35.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&q=80",
        inStock: true,
        skinType: "Sensitive",
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const handleUpdateQuantity = (id: string, quantity: number) => {
        setCartItems((items) =>
            items.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const handleRemove = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "SAVE10") {
            setAppliedCoupon("SAVE10");
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const discount = appliedCoupon ? subtotal * 0.1 : 0;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shipping + tax;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-cream flex items-center justify-center">
                <EmptyState
                    icon={<ShoppingBag className="w-10 h-10 text-primary-500" />}
                    title="Your cart is empty"
                    description="Looks like you haven't added any organic skincare products to your cart yet."
                    actionLabel="Start Shopping"
                    onAction={() => (window.location.href = "/products")}
                />
            </div>
        );
    }

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
                        Shopping Cart
                    </h1>
                    <p className="text-earth-600">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
                        your cart
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Free Shipping Progress */}
                        {shipping > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="bg-primary-50 border-primary-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Truck className="w-5 h-5 text-primary-600" />
                                        <p className="text-sm font-medium text-earth-900">
                                            Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                                        </p>
                                    </div>
                                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(subtotal / 50) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                            className="h-full bg-primary-600"
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-24 space-y-6"
                        >
                            {/* Coupon Code */}
                            <Card padding="lg">
                                <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary-600" />
                                    Apply Coupon Code
                                </h3>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={!!appliedCoupon}
                                    />
                                    <Button
                                        variant={appliedCoupon ? "outline" : "primary"}
                                        onClick={handleApplyCoupon}
                                        disabled={!!appliedCoupon}
                                    >
                                        {appliedCoupon ? "Applied" : "Apply"}
                                    </Button>
                                </div>
                                {appliedCoupon && (
                                    <p className="mt-2 text-sm text-green-600 font-medium">
                                        ✓ Coupon "{appliedCoupon}" applied! 10% off
                                    </p>
                                )}
                                <p className="mt-3 text-xs text-earth-600">
                                    Try code: <span className="font-semibold">SAVE10</span> for 10%
                                    off
                                </p>
                            </Card>

                            {/* Order Summary */}
                            <Card padding="lg">
                                <h3 className="font-serif font-bold text-xl text-earth-900 mb-6">
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-earth-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span className="font-semibold">
                                                -${discount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-earth-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-earth-700">
                                        <span>Tax (8%)</span>
                                        <span className="font-semibold">${tax.toFixed(2)}</span>
                                    </div>

                                    <div className="pt-4 border-t-2 border-secondary-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-serif font-bold text-xl text-earth-900">
                                                Total
                                            </span>
                                            <span className="font-serif font-bold text-2xl text-primary-600">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <Button
                                        size="lg"
                                        className="w-full mb-3"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <Link href="/products">
                                    <Button variant="outline" size="lg" className="w-full">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </Card>

                            {/* Benefits */}
                            <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
                                <h4 className="font-semibold text-earth-900 mb-4">
                                    Why Shop With Us?
                                </h4>
                                <ul className="space-y-3 text-sm text-earth-700">
                                    <li className="flex items-start gap-2">
                                        <Gift className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        <span>Free samples with every order</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Truck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        <span>Free shipping on orders over $50</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ShoppingBag className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        <span>100% organic & cruelty-free</span>
                                    </li>
                                </ul>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}