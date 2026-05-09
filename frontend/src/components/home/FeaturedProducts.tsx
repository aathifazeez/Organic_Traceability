"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, QrCode, ArrowRight, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

function getFallbackImage(name: string): string {
    const n = (name || "").toLowerCase();
    if (n.includes("coffee") || n.includes("scrub")) return "/images/product-coffee-scrub.png";
    if (n.includes("serum") || n.includes("niacinamide") || n.includes("glimmer")) return "/images/product-serum.png";
    if (n.includes("soap") || n.includes("lavender") || n.includes("berry")) return "/images/product-soap.png";
    if (n.includes("cream") || n.includes("vivid") || n.includes("glow")) return "/images/product-face-cream.png";
    return "/images/product-serum.png";
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products?limit=4`);
                const data = await res.json();
                if (data.success) {
                    setProducts((data.data || []).slice(0, 4));
                }
            } catch (e) {
                console.error("Failed to fetch featured products", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="section-padding bg-gradient-cream">
            <div className="container-custom">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-xl text-earth-600 max-w-2xl">
                            Handpicked organic essentials with complete traceability
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="hidden md:block"
                    >
                        <Link href="/products">
                            <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                View All Products
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {products.map((product, index) => {
                            const imgs: any[] = product.images || [];
                            const image = imgs.find((i: any) => i.isPrimary)?.url || imgs[0]?.url || getFallbackImage(product.productName);
                            const hasQr = !!product.qrCode;

                            return (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Link href={`/products/${product._id}`}>
                                        <Card hover padding="none" className="overflow-hidden group h-full flex flex-col cursor-pointer">
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={image}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-earth-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <Button size="sm" variant="secondary">View Details</Button>
                                                </div>
                                                {hasQr && (
                                                    <div className="absolute top-4 left-4">
                                                        <Badge variant="success" size="sm">
                                                            <QrCode className="w-3 h-3 mr-1" />Verified
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <p className="text-sm text-primary-600 font-medium mb-2">{product.category}</p>
                                                <h3 className="font-serif font-semibold text-lg text-earth-900 mb-4 line-clamp-2 flex-1">
                                                    {product.productName}
                                                </h3>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-xl font-bold text-earth-900">
                                                        LKR {(product.retailPrice || 0).toLocaleString()}
                                                    </span>
                                                    <div className="p-2 bg-primary-50 rounded-full">
                                                        <ShoppingCart className="w-5 h-5 text-primary-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                <div className="md:hidden text-center">
                    <Link href="/products">
                        <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                            View All Products
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
