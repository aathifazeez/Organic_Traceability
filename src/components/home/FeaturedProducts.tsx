"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, QrCode, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

const featuredProducts = [
    {
        id: "1",
        name: "Organic Botanical Face Serum",
        price: 42.99,
        originalPrice: 54.99,
        rating: 4.9,
        reviews: 287,
        image: "/images/product-face-serum.png",
        category: "Serums",
        badge: "Best Seller",
        verified: true,
    },
    {
        id: "2",
        name: "Natural Shea & Cocoa Body Butter",
        price: 34.99,
        rating: 4.8,
        reviews: 215,
        image: "/images/product-body-butter.png",
        category: "Moisturizers",
        badge: "New",
        verified: true,
    },
    {
        id: "3",
        name: "Aloe & Green Tea Facial Cleanser",
        price: 28.99,
        originalPrice: 35.99,
        rating: 5.0,
        reviews: 342,
        image: "/images/product-facial-cleanser.png",
        category: "Cleansers",
        badge: "Top Rated",
        verified: true,
    },
    {
        id: "4",
        name: "Herbal Clay & Matcha Face Mask",
        price: 38.99,
        rating: 4.7,
        reviews: 198,
        image: "/images/product-face-mask.png",
        category: "Masks",
        verified: true,
    },
];

export default function FeaturedProducts() {
    return (
        <section className="section-padding bg-gradient-cream">
            <div className="container-custom">
                {/* Section Header */}
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

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card hover padding="none" className="overflow-hidden group h-full flex flex-col">
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-earth-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                        <Link href={`/products/${product.id}`}>
                                            <Button size="sm" variant="secondary">
                                                View Details
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            leftIcon={<ShoppingCart className="w-4 h-4" />}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.badge && (
                                            <Badge variant="primary" size="sm">
                                                {product.badge}
                                            </Badge>
                                        )}
                                        {product.verified && (
                                            <Badge variant="success" size="sm">
                                                <QrCode className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    {/* Discount */}
                                    {product.originalPrice && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <p className="text-sm text-primary-600 font-medium mb-2">
                                        {product.category}
                                    </p>
                                    <h3 className="font-serif font-semibold text-lg text-earth-900 mb-3 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-earth-600">
                                            {product.rating} ({product.reviews})
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mt-auto">
                                        <span className="text-2xl font-bold text-earth-900">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-earth-500 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View All Button */}
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