"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Truck, Gift } from "lucide-react";
import Link from "next/link";
import CartItem from "@/components/customer/CartItem";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";
import { getCart, updateCartItem, removeCartItem, CartItem as CartItemType } from "@/lib/cart";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);

    useEffect(() => {
        setCartItems(getCart());
    }, []);

    const handleUpdateQuantity = (id: string, quantity: number) => {
        const updated = updateCartItem(id, quantity);
        setCartItems(updated);
    };

    const handleRemove = (id: string) => {
        const updated = removeCartItem(id);
        setCartItems(updated);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 15000 ? 0 : 500;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    // Map CartItem to the shape CartItem component expects
    const mappedItems = cartItems.map((item) => ({
        id: item.productId,
        name: item.name,
        variant: item.variant ?? "Standard",
        skinType: item.skinType ?? "All skin types",
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        inStock: item.quantity <= item.unitsAvailable,
    }));

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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">Shopping Cart</h1>
                    <p className="text-earth-600">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {mappedItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </AnimatePresence>

                        {shipping > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="bg-primary-50 border-primary-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Truck className="w-5 h-5 text-primary-600" />
                                        <p className="text-sm font-medium text-earth-900">
                                            Add LKR {(15000 - subtotal).toLocaleString()} more for FREE shipping!
                                        </p>
                                    </div>
                                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((subtotal / 15000) * 100, 100)}%` }}
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
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24 space-y-6">
                            <Card padding="lg">
                                <h3 className="font-serif font-bold text-xl text-earth-900 mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-earth-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Tax (10%)</span>
                                        <span className="font-semibold">LKR {Math.round(tax).toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4 border-t-2 border-secondary-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-serif font-bold text-xl text-earth-900">Total</span>
                                            <span className="font-serif font-bold text-2xl text-primary-600">LKR {Math.round(total).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <Button size="lg" className="w-full mb-3" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <Link href="/products">
                                    <Button variant="outline" size="lg" className="w-full">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </Card>

                            <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
                                <h4 className="font-semibold text-earth-900 mb-4">Why Shop With Us?</h4>
                                <ul className="space-y-3 text-sm text-earth-700">
                                    <li className="flex items-start gap-2">
                                        <Gift className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        <span>Free samples with every order</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Truck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        <span>Free shipping on orders over LKR 15,000</span>
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
