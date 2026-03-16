"use client";

import { useState, use } from "react";
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

// Products Data
const productsData = {
    "1": {
        id: "1",
        name: "Organic Botanical Face Serum",
        price: 42.99,
        originalPrice: 54.99,
        rating: 4.9,
        reviews: 287,
        description:
            "Luxurious botanical face serum infused with organic plant extracts and essential oils. This lightweight formula absorbs quickly to deliver deep hydration and nourishment. Certified organic ingredients sourced from sustainable farms with complete traceability.",
        images: [
            "/images/product-face-serum.png",
            "/images/product-face-serum.png",
            "/images/product-face-serum.png",
            "/images/product-face-serum.png",
        ],
        category: "Serums",
        inStock: true,
        stockCount: 45,
        sku: "ORG-SER-001",
        batchNumber: "BATCH-2024-001",
        qrCode: "QR-ORG-SER-001-2024",
        features: [
            "100% Certified Organic",
            "Cruelty-Free & Vegan",
            "Paraben-Free",
            "Rich in Antioxidants",
            "Complete Supply Chain Traceability",
        ],
        specifications: {
            weight: "30ml",
            origin: "France",
            certifications: ["USDA Organic", "EU Organic", "Ecocert"],
            shelfLife: "12 months",
        },
    },
    "2": {
        id: "2",
        name: "Natural Shea & Cocoa Body Butter",
        price: 34.99,
        originalPrice: 39.99,
        rating: 4.8,
        reviews: 215,
        description:
            "Rich and creamy body butter made with organic shea and cocoa butter. Deeply moisturizes and nourishes dry skin, leaving it soft and supple. Ethically sourced ingredients with full traceability from farm to jar.",
        images: [
            "/images/product-body-butter.png",
            "/images/product-body-butter.png",
            "/images/product-body-butter.png",
            "/images/product-body-butter.png",
        ],
        category: "Moisturizers",
        inStock: true,
        stockCount: 38,
        sku: "ORG-BB-002",
        batchNumber: "BATCH-2024-002",
        qrCode: "QR-ORG-BB-002-2024",
        features: [
            "100% Certified Organic",
            "Fair Trade Certified",
            "Non-GMO",
            "Deep Moisturizing",
            "Complete Supply Chain Traceability",
        ],
        specifications: {
            weight: "200ml",
            origin: "Ghana",
            certifications: ["USDA Organic", "Fair Trade", "Ecocert"],
            shelfLife: "18 months",
        },
    },
    "3": {
        id: "3",
        name: "Aloe & Green Tea Facial Cleanser",
        price: 28.99,
        originalPrice: 35.99,
        rating: 5.0,
        reviews: 342,
        description:
            "Gentle foaming cleanser with organic aloe vera and green tea extract. Effectively removes impurities while maintaining skin's natural moisture balance. Certified organic ingredients with transparent sourcing.",
        images: [
            "/images/product-facial-cleanser.png",
            "/images/product-facial-cleanser.png",
            "/images/product-facial-cleanser.png",
            "/images/product-facial-cleanser.png",
        ],
        category: "Cleansers",
        inStock: true,
        stockCount: 52,
        sku: "ORG-CL-003",
        batchNumber: "BATCH-2024-003",
        qrCode: "QR-ORG-CL-003-2024",
        features: [
            "100% Certified Organic",
            "pH Balanced",
            "Sulfate-Free",
            "Gentle Formula",
            "Complete Supply Chain Traceability",
        ],
        specifications: {
            weight: "150ml",
            origin: "Japan",
            certifications: ["USDA Organic", "EU Organic", "JAS Organic"],
            shelfLife: "12 months",
        },
    },
    "4": {
        id: "4",
        name: "Herbal Clay & Matcha Face Mask",
        price: 38.99,
        originalPrice: 44.99,
        rating: 4.7,
        reviews: 198,
        description:
            "Purifying face mask combining organic clay and matcha green tea. Draws out impurities, minimizes pores, and revitalizes skin. Sustainably sourced ingredients with complete farm-to-face traceability.",
        images: [
            "/images/product-face-mask.png",
            "/images/product-face-mask.png",
            "/images/product-face-mask.png",
            "/images/product-face-mask.png",
        ],
        category: "Masks",
        inStock: true,
        stockCount: 29,
        sku: "ORG-MSK-004",
        batchNumber: "BATCH-2024-004",
        qrCode: "QR-ORG-MSK-004-2024",
        features: [
            "100% Certified Organic",
            "Detoxifying Formula",
            "Natural Clay",
            "Antioxidant-Rich",
            "Complete Supply Chain Traceability",
        ],
        specifications: {
            weight: "100g",
            origin: "Japan",
            certifications: ["USDA Organic", "EU Organic", "Cosmos Organic"],
            shelfLife: "24 months",
        },
    },
    "5": {
        id: "5",
        name: "Botanical Eye Cream",
        price: 45.99,
        originalPrice: 54.99,
        rating: 4.8,
        reviews: 156,
        description:
            "Nourishing eye cream with organic botanical extracts. Reduces the appearance of fine lines and dark circles while hydrating delicate eye area. Premium organic ingredients with verified traceability.",
        images: [
            "/images/product-eye-cream.png",
            "/images/product-eye-cream.png",
            "/images/product-eye-cream.png",
            "/images/product-eye-cream.png",
        ],
        category: "Eye Care",
        inStock: false,
        stockCount: 0,
        sku: "ORG-EYE-005",
        batchNumber: "BATCH-2024-005",
        qrCode: "QR-ORG-EYE-005-2024",
        features: [
            "100% Certified Organic",
            "Anti-Aging Formula",
            "Caffeine-Infused",
            "Lightweight Texture",
            "Complete Supply Chain Traceability",
        ],
        specifications: {
            weight: "15ml",
            origin: "Switzerland",
            certifications: ["USDA Organic", "EU Organic", "Bio Suisse"],
            shelfLife: "12 months",
        },
    },
    "6": {
        id: "6",
        name: "Organic Night Cream",
        price: 52.99,
        originalPrice: 64.99,
        rating: 4.9,
        reviews: 223,
        description:
            "Intensive overnight moisturizer with organic oils and plant extracts. Repairs and regenerates skin while you sleep. Premium certified organic ingredients with full supply chain transparency.",
        images: [
            "/images/product-night-cream.png",
            "/images/product-night-cream.png",
            "/images/product-night-cream.png",
            "/images/product-night-cream.png",
        ],
        category: "Night Care",
        inStock: true,
        stockCount: 34,
        sku: "ORG-NC-006",
        batchNumber: "BATCH-2024-006",
        qrCode: "QR-ORG-NC-006-2024",
        features: [
            "100% Certified Organic",
            "Regenerating Formula",
            "Rich in Vitamins",
            "Night Repair Complex",
            "Complete Supply Chain Traceability",
        ],
        specifications: {
            weight: "50ml",
            origin: "France",
            certifications: ["USDA Organic", "EU Organic", "Cosmebio"],
            shelfLife: "12 months",
        },
    },
};


export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params Promise using React.use() for Next.js 15
    const { id } = use(params);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Get product from productsData based on ID
    const product = productsData[id as keyof typeof productsData];

    // If product not found, show error or redirect
    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-cream flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-earth-900 mb-4">Product Not Found</h1>
                    <p className="text-earth-600 mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/products">
                        <Button>Back to Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Get related products (exclude current product)
    const relatedProducts = Object.values(productsData)
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
        .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images[0],
            rating: p.rating,
        }));

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;


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