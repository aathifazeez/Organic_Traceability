"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    SlidersHorizontal,
    Grid3x3,
    List,
    ShoppingCart,
    QrCode,
    Loader2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/_/backend/api/v1";

const categories = [
    "All Products",
    "Serums",
    "Moisturizers",
    "Cleansers",
    "Exfoliators",
    "Masks",
];

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

function getFallbackImage(name: string): string {
    const n = (name || "").toLowerCase();
    if (n.includes("coffee") || n.includes("scrub")) return "/images/product-coffee-scrub.png";
    if (n.includes("serum") || n.includes("niacinamide") || n.includes("glimmer")) return "/images/product-serum.png";
    if (n.includes("soap") || n.includes("lavender") || n.includes("berry")) return "/images/product-soap.png";
    if (n.includes("cream") || n.includes("vivid") || n.includes("glow")) return "/images/product-face-cream.png";
    return "/images/product-serum.png";
}

function getCategoryLabel(cat: string): string {
    const map: Record<string, string> = {
        "exfoliator": "Exfoliators",
        "serum": "Serums",
        "cleanser": "Cleansers",
        "moisturizer": "Moisturizers",
        "face-cream": "Moisturizers",
        "face-mask": "Masks",
        "toner": "Toners",
        "eye-cream": "Eye Creams",
        "sunscreen": "Sunscreen",
        "night-cream": "Night Creams",
    };
    return map[cat] || cat;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products?limit=100`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data || []);
                }
            } catch (e) {
                console.error("Failed to fetch products", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = useMemo(() => {
        let list = [...products];

        if (selectedCategory !== "All Products") {
            list = list.filter((p) => getCategoryLabel(p.category) === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (p) =>
                    (p.productName || "").toLowerCase().includes(q) ||
                    (p.category || "").toLowerCase().includes(q) ||
                    (p.shortDescription || "").toLowerCase().includes(q)
            );
        }

        if (sortBy === "price-low") list.sort((a, b) => (a.retailPrice || 0) - (b.retailPrice || 0));
        if (sortBy === "price-high") list.sort((a, b) => (b.retailPrice || 0) - (a.retailPrice || 0));

        return list;
    }, [products, selectedCategory, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Hero */}
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
                            Discover our curated collection of certified organic skincare products
                            with complete traceability.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search & Sort Bar */}
            <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-lg border-b border-secondary-200 py-6">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-96">
                            <Input
                                placeholder="Search products..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex-1 md:w-48">
                                <Select
                                    options={sortOptions}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="md"
                                leftIcon={<SlidersHorizontal className="w-5 h-5" />}
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                Filters
                            </Button>
                            <div className="hidden md:flex items-center gap-2 bg-secondary-100 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-full transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-primary-600" : "text-earth-600 hover:text-earth-900"}`}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-full transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-primary-600" : "text-earth-600 hover:text-earth-900"}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="flex gap-8">
                        {/* Category Sidebar */}
                        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}>
                            <Card padding="lg" className="sticky top-40">
                                <h3 className="font-serif font-semibold text-xl text-earth-900 mb-6">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${selectedCategory === cat ? "bg-primary-100 text-primary-700 font-medium" : "text-earth-700 hover:bg-secondary-100"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </aside>

                        {/* Product Grid / List */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                                    <p className="text-earth-600 text-lg">Loading products...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="text-earth-600">
                                            Showing <span className="font-semibold">{filtered.length}</span> products
                                        </p>
                                    </div>

                                    {filtered.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <p className="text-xl font-semibold text-earth-900 mb-2">No products found</p>
                                            <p className="text-earth-600">Try adjusting your filters or search query.</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence mode="wait">
                                            {viewMode === "grid" ? (
                                                <motion.div
                                                    key="grid"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                                >
                                                    {filtered.map((product, index) => (
                                                        <ProductCard key={product._id} product={product} index={index} />
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
                                                    {filtered.map((product, index) => (
                                                        <ProductListItem key={product._id} product={product} index={index} />
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ProductCard({ product, index }: { product: any; index: number }) {
    const imgs: any[] = product.images || [];
    const image = imgs.find((i: any) => i.isPrimary)?.url || imgs[0]?.url || getFallbackImage(product.productName);
    const hasQr = !!product.qrCode;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Link href={`/products/${product._id}`}>
                <Card hover padding="none" className="overflow-hidden group h-full flex flex-col cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-secondary-100">
                        <img
                            src={image}
                            alt={product.productName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-earth-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button size="sm" variant="secondary">View Details</Button>
                        </div>
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {hasQr && (
                                <Badge variant="success" size="sm">
                                    <QrCode className="w-3 h-3 mr-1" />Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <p className="text-sm text-primary-600 font-medium mb-2">{getCategoryLabel(product.category)}</p>
                        <h3 className="font-serif font-semibold text-lg text-earth-900 mb-3 line-clamp-2">{product.productName}</h3>
                        <p className="text-sm text-earth-600 mb-4 line-clamp-2">{product.shortDescription}</p>
                        <div className="mt-auto">
                            <span className="text-2xl font-bold text-earth-900">LKR {(product.retailPrice || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}

function ProductListItem({ product, index }: { product: any; index: number }) {
    const imgs: any[] = product.images || [];
    const image = imgs.find((i: any) => i.isPrimary)?.url || imgs[0]?.url || getFallbackImage(product.productName);
    const hasQr = !!product.qrCode;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Card hover padding="md" className="flex gap-6">
                <div className="w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-secondary-100">
                    <img src={image} alt={product.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-primary-600 font-medium mb-1">{getCategoryLabel(product.category)}</p>
                                <h3 className="font-serif font-semibold text-2xl text-earth-900">{product.productName}</h3>
                            </div>
                            {hasQr && (
                                <Badge variant="success">
                                    <QrCode className="w-3 h-3 mr-1" />Verified
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-earth-600 mb-4">{product.shortDescription}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-earth-900">LKR {(product.retailPrice || 0).toLocaleString()}</span>
                        <div className="flex gap-3">
                            <Link href={`/products/${product._id}`}>
                                <Button variant="outline">View Details</Button>
                            </Link>
                            <Button leftIcon={<ShoppingCart className="w-5 h-5" />}>Add to Cart</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
