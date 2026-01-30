"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    SlidersHorizontal,
    Grid3x3,
    List,
    Star,
    ShoppingCart,
    QrCode,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

// Mock Products Data
const allProducts = [
    {
        id: "1",
        name: "Organic Botanical Face Serum",
        price: 42.99,
        originalPrice: 54.99,
        rating: 4.9,
        reviews: 287,
        image: "/images/product-face-serum.png",
        category: "Serums",
        inStock: true,
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
        inStock: true,
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
        inStock: true,
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
        inStock: true,
        verified: true,
    },
    {
        id: "5",
        name: "Botanical Eye Cream",
        price: 45.99,
        rating: 4.8,
        reviews: 156,
        image: "/images/product-eye-cream.png",
        category: "Eye Care",
        inStock: false,
        verified: true,
    },
    {
        id: "6",
        name: "Organic Night Cream",
        price: 52.99,
        rating: 4.9,
        reviews: 223,
        image: "/images/product-night-cream.png",
        category: "Night Care",
        inStock: true,
        verified: true,
    },
];

const categories = [
    "All Products",
    "Serums",
    "Moisturizers",
    "Cleansers",
    "Masks",
    "Eye Care",
    "Night Care",
];

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
];

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6">
                            Organic Skincare
                        </h1>
                        <p className="text-xl text-primary-100">
                            Discover our curated collection of certified organic skincare products with
                            complete traceability.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Search Bar */}
            <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-lg border-b border-secondary-200 py-6">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="w-full md:w-96">
                            <Input
                                placeholder="Search products..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* Sort */}
                            <div className="flex-1 md:w-48">
                                <Select
                                    options={sortOptions}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                />
                            </div>

                            {/* Filter Toggle */}
                            <Button
                                variant="outline"
                                size="md"
                                leftIcon={<SlidersHorizontal className="w-5 h-5" />}
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                Filters
                            </Button>

                            {/* View Mode */}
                            <div className="hidden md:flex items-center gap-2 bg-secondary-100 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-full transition-colors ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-primary-600"
                                        : "text-earth-600 hover:text-earth-900"
                                        }`}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-full transition-colors ${viewMode === "list"
                                        ? "bg-white shadow-sm text-primary-600"
                                        : "text-earth-600 hover:text-earth-900"
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="flex gap-8">
                        {/* Sidebar Filters */}
                        <aside
                            className={`${showFilters ? "block" : "hidden"
                                } md:block w-full md:w-64 flex-shrink-0`}
                        >
                            <Card padding="lg" className="sticky top-40">
                                <h3 className="font-serif font-semibold text-xl text-earth-900 mb-6">
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${selectedCategory === category
                                                ? "bg-primary-100 text-primary-700 font-medium"
                                                : "text-earth-700 hover:bg-secondary-100"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {/* Additional Filters */}
                                <div className="mt-8 pt-8 border-t border-secondary-200">
                                    <h4 className="font-semibold text-earth-900 mb-4">
                                        Availability
                                    </h4>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-earth-700">In Stock Only</span>
                                    </label>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-earth-900 mb-4">Rating</h4>
                                    {[4, 3, 2, 1].map((rating) => (
                                        <label
                                            key={rating}
                                            className="flex items-center gap-3 cursor-pointer mb-2"
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                                <span className="text-sm text-earth-600 ml-1">
                                                    & Up
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </Card>
                        </aside>

                        {/* Products Grid/List */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-earth-600">
                                    Showing <span className="font-semibold">{allProducts.length}</span> products
                                </p>
                            </div>

                            <AnimatePresence mode="wait">
                                {viewMode === "grid" ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {allProducts.map((product, index) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                index={index}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        {allProducts.map((product, index) => (
                                            <ProductListItem
                                                key={product.id}
                                                product={product}
                                                index={index}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Product Card Component (Grid View)
function ProductCard({ product, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Card hover padding="none" className="overflow-hidden group h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-earth-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Link href={`/products/${product.id}`}>
                            <Button size="sm" variant="secondary">
                                View
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            leftIcon={<ShoppingCart className="w-4 h-4" />}
                            disabled={!product.inStock}
                        >
                            Add
                        </Button>
                    </div>
                    {!product.inStock && (
                        <div className="absolute top-4 left-4">
                            <Badge variant="danger">Out of Stock</Badge>
                        </div>
                    )}
                    {product.verified && product.inStock && (
                        <div className="absolute top-4 left-4">
                            <Badge variant="success">
                                <QrCode className="w-3 h-3 mr-1" />
                                Verified
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-primary-600 font-medium mb-2">
                        {product.category}
                    </p>
                    <h3 className="font-serif font-semibold text-lg text-earth-900 mb-3">
                        {product.name}
                    </h3>

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
    );
}

// Product List Item Component (List View)
function ProductListItem({ product, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Card hover padding="md" className="flex gap-6">
                <div className="w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-primary-600 font-medium mb-1">
                                    {product.category}
                                </p>
                                <h3 className="font-serif font-semibold text-2xl text-earth-900">
                                    {product.name}
                                </h3>
                            </div>
                            {product.verified && (
                                <Badge variant="success">
                                    <QrCode className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>

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
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-earth-900">
                                ${product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-earth-500 line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Link href={`/products/${product.id}`}>
                                <Button variant="outline">View Details</Button>
                            </Link>
                            <Button
                                leftIcon={<ShoppingCart className="w-5 h-5" />}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}