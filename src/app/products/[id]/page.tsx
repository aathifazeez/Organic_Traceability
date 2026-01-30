"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    QrCode,
    Check,
    Minus,
    Plus,
    ChevronLeft,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Link from "next/link";

// Mock Product Data
const product = {
    id: "1",
    name: "Organic Quinoa Bowl Mix",
    price: 24.99,
    originalPrice: 32.99,
    rating: 4.8,
    reviews: 234,
    description:
        "Premium organic quinoa blend perfect for nutritious bowl meals. Sourced from certified organic farms with complete traceability. Rich in protein, fiber, and essential amino acids.",
    images: [
        "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        "https://images.unsplash.com/photo-1610390555228-6c73f4c012f8?w=800&q=80",
        "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80",
    ],
    category: "Grains",
    inStock: true,
    stockCount: 45,
    sku: "ORG-QNO-001",
    batchNumber: "BATCH-2024-001",
    qrCode: "QR-ORG-QNO-001-2024",
    features: [
        "100% Certified Organic",
        "Non-GMO Verified",
        "Gluten-Free",
        "High in Protein",
        "Complete Supply Chain Traceability",
    ],
    specifications: {
        weight: "500g",
        origin: "Peru",
        certifications: ["USDA Organic", "EU Organic", "Fair Trade"],
        shelfLife: "12 months",
    },
};

const relatedProducts = [
    {
        id: "2",
        name: "Premium Matcha Powder",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&q=80",
        rating: 4.9,
    },
    {
        id: "3",
        name: "Raw Honey Collection",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784794?w=300&q=80",
        rating: 5.0,
    },
    {
        id: "4",
        name: "Superfood Smoothie Mix",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&q=80",
        rating: 4.7,
    },
];

export default function ProductDetailPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-secondary-200">
                <div className="container-custom py-4">
                    <div className="flex items-center gap-2 text-sm text-earth-600">
                        <Link href="/" className="hover:text-primary-600">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary-600">
                            Products
                        </Link>
                        <span>/</span>
                        <span className="text-earth-900">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Back Button */}
                <Link href="/products">
                    <Button variant="ghost" leftIcon={<ChevronLeft className="w-5 h-5" />} className="mb-8">
                        Back to Products
                    </Button>
                </Link>

                {/* Main Product Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 shadow-organic-lg">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {discount > 0 && (
                                <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                                    {discount}% OFF
                                </div>
                            )}
                            <div className="absolute top-6 left-6">
                                <Badge variant="success" size="lg">
                                    <QrCode className="w-4 h-4 mr-1" />
                                    Verified Organic
                                </Badge>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-xl overflow-hidden transition-all ${selectedImage === index
                                            ? "ring-4 ring-primary-500 scale-105"
                                            : "opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-4">
                            <Badge variant="primary">{product.category}</Badge>
                        </div>

                        <h1 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-earth-700">
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-5xl font-bold text-earth-900">
                                ${product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-2xl text-earth-500 line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-lg text-earth-700 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Features */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-earth-900 mb-4">Key Features:</h3>
                            <ul className="space-y-3">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-earth-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.inStock ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                                    <span className="font-medium">
                                        In Stock ({product.stockCount} available)
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <div className="w-3 h-3 bg-red-600 rounded-full" />
                                    <span className="font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <label className="block font-semibold text-earth-900 mb-3">
                                Quantity:
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-secondary-100 rounded-full">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-secondary-200 rounded-full transition-colors"
                                    >
                                        <Minus className="w-5 h-5 text-earth-700" />
                                    </button>
                                    <span className="px-6 font-semibold text-earth-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                        className="p-3 hover:bg-secondary-200 rounded-full transition-colors"
                                    >
                                        <Plus className="w-5 h-5 text-earth-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
                            <Button
                                size="lg"
                                className="flex-1"
                                leftIcon={<ShoppingCart className="w-5 h-5" />}
                                disabled={!product.inStock}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                size="lg"
                                variant={isWishlisted ? "primary" : "outline"}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                                />
                            </Button>
                            <Button size="lg" variant="outline">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Traceability Info */}
                        <Card className="bg-primary-50 border-primary-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <QrCode className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-earth-900 mb-2">
                                        QR Traceability Available
                                    </h4>
                                    <p className="text-sm text-earth-700 mb-3">
                                        Scan the QR code on your product to view complete supply chain
                                        information, ingredient sources, and certifications.
                                    </p>
                                    <Link href={`/verify/${product.qrCode}`}>
                                        <Button size="sm" variant="primary">
                                            View Traceability Info
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-secondary-200">
                            <div className="text-center">
                                <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-earth-900">Free Shipping</p>
                                <p className="text-xs text-earth-600">On orders $50+</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-earth-900">Certified Organic</p>
                                <p className="text-xs text-earth-600">100% Verified</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-earth-900">Easy Returns</p>
                                <p className="text-xs text-earth-600">30-day policy</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Product Details Tabs */}
                <Card padding="lg" className="mb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-serif font-semibold text-2xl text-earth-900 mb-4">
                                Specifications
                            </h3>
                            <dl className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-secondary-200">
                                    <dt className="text-earth-600">SKU:</dt>
                                    <dd className="font-medium text-earth-900">{product.sku}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-secondary-200">
                                    <dt className="text-earth-600">Batch Number:</dt>
                                    <dd className="font-medium text-earth-900">{product.batchNumber}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-secondary-200">
                                    <dt className="text-earth-600">Weight:</dt>
                                    <dd className="font-medium text-earth-900">{product.specifications.weight}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-secondary-200">
                                    <dt className="text-earth-600">Origin:</dt>
                                    <dd className="font-medium text-earth-900">{product.specifications.origin}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-secondary-200">
                                    <dt className="text-earth-600">Shelf Life:</dt>
                                    <dd className="font-medium text-earth-900">{product.specifications.shelfLife}</dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="font-serif font-semibold text-2xl text-earth-900 mb-4">
                                Certifications
                            </h3>
                            <div className="space-y-3">
                                {product.specifications.certifications.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                                    >
                                        <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                                        <span className="font-medium text-earth-900">{cert}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Related Products */}
                <div>
                    <h2 className="font-serif font-bold text-3xl text-earth-900 mb-8">
                        You May Also Like
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                                <Card hover padding="none" className="overflow-hidden group">
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-serif font-semibold text-lg text-earth-900 mb-2">
                                            {relatedProduct.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-earth-900">
                                                ${relatedProduct.price}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span className="text-sm text-earth-600">
                                                    {relatedProduct.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}