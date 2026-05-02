"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
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
    Loader2,
    Leaf,
    Download,
    Scan,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { getProductBySlug, isStaticSlug } from "@/lib/products.config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Pick the right fallback image based on product name
function getFallbackImage(name: string): string {
    const n = (name || "").toLowerCase();
    if (n.includes("coffee") || n.includes("scrub")) return "/images/product-coffee-scrub.png";
    if (n.includes("serum") || n.includes("niacinamide") || n.includes("glimmer")) return "/images/product-serum.png";
    if (n.includes("soap") || n.includes("lavender") || n.includes("berry")) return "/images/product-soap.png";
    if (n.includes("cream") || n.includes("vivid") || n.includes("glow")) return "/images/product-face-cream.png";
    return "/images/product-serum.png";
}

// Ingredient lists per product — matched by product name keywords
const PRODUCT_INGREDIENTS: { keywords: string[]; ingredients: string[] }[] = [
    {
        keywords: ["coffee", "scrub"],
        ingredients: [
            "Coffea Arabica Seed Powder",
            "Sucrose",
            "Cocos Nucifera Oil",
            "Olea Europaea Fruit Oil",
            "Simmondsia Chinensis Seed Oil",
            "Butyrospermum Parkii Butter",
            "Tocopherol — Vitamin E",
        ],
    },
    {
        keywords: ["niacinamide", "serum", "glimmer"],
        ingredients: [
            "Aqua",
            "Aloe Barbadensis Leaf Juice",
            "Niacinamide — Vitamin B3 (10%)",
            "Glycerin — Vegetable Glycerin",
            "Sodium Hyaluronate — Hyaluronic Acid",
            "Panthenol — Pro-Vitamin B5",
            "Xanthan Gum — Natural Gum Thickener",
            "Sodium Benzoate — Preservative System Component",
            "Citric Acid — pH Adjuster",
        ],
    },
    {
        keywords: ["lavender", "berry", "soap"],
        ingredients: [
            "Saponified Olive Oil",
            "Saponified Coconut Oil",
            "Saponified Shea Butter",
            "Aqua",
            "Lavender Powder",
            "Berry Powder",
            "Kaolin — Clay",
        ],
    },
    {
        keywords: ["vivid", "glow", "face cream", "cream"],
        ingredients: [
            "Aqua",
            "Aloe Vera Juice",
            "Glycerin — Vegetable Glycerin",
            "Glyceryl Stearate — Emulsifier",
            "Shea Butter",
            "Jojoba Oil",
            "Rosehip Oil",
            "Tocopherol — Vitamin E",
            "Sodium Benzoate — Preservative System Component",
        ],
    },
];

function getIngredients(productName: string, slug?: string): string[] {
    // Match by slug first (most accurate)
    const slugMap: Record<string, string[]> = {
        "coffee-scrub": PRODUCT_INGREDIENTS[0].ingredients,
        "niacinamide-serum": PRODUCT_INGREDIENTS[1].ingredients,
        "lavender-berry-soap": PRODUCT_INGREDIENTS[2].ingredients,
        "vivid-glow-face-cream": PRODUCT_INGREDIENTS[3].ingredients,
    };
    if (slug && slugMap[slug]) return slugMap[slug];

    // Fall back to keyword match on name
    const n = (productName || "").toLowerCase();
    for (const entry of PRODUCT_INGREDIENTS) {
        if (entry.keywords.some((kw) => n.includes(kw))) return entry.ingredients;
    }
    return ["Aqua", "Aloe Barbadensis Leaf Juice", "Glycerin", "Tocopherol — Vitamin E"];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        // Static slug (e.g. "coffee-scrub") — load from config, no API needed
        if (isStaticSlug(id)) {
            const staticProduct = getProductBySlug(id)!;
            // Normalise to the same shape the rest of the page expects
            setProduct({
                _id: staticProduct.slug,
                productName: staticProduct.name,
                category: staticProduct.category,
                retailPrice: staticProduct.price,
                shortDescription: staticProduct.shortDescription,
                longDescription: staticProduct.longDescription,
                keyFeatures: staticProduct.keyFeatures,
                images: [{ url: staticProduct.image, isPrimary: true }],
                batchNumber: staticProduct.batchNumber,
                unitsRemaining: staticProduct.unitsRemaining,
                qrCode: null,
                // store the slug so ingredients lookup works correctly
                _slug: staticProduct.slug,
            });
            setLoading(false);
            return;
        }

        // DB product — fetch by MongoDB id
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/products/${id}`);
                const data = await res.json();
                if (data.success && data.data?.product) {
                    setProduct(data.data.product);
                    fetchRelated(data.data.product.category);
                } else {
                    setNotFound(true);
                }
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelated = async (category: string) => {
            try {
                const res = await fetch(`${API_URL}/products?isListed=true&status=active&category=${category}&limit=4`);
                const data = await res.json();
                if (data.success) {
                    setRelatedProducts((data.data || []).filter((p: any) => p._id !== id).slice(0, 3));
                }
            } catch { /* ignore */ }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        const imgs: any[] = product.images || [];
        const imageUrl = imgs.find((i: any) => i.isPrimary)?.url || imgs[0]?.url || getFallbackImage(product.productName);
        addToCart({
            productId: product._id,
            name: product.productName,
            price: product.retailPrice,
            quantity,
            image: imageUrl,
            unitsAvailable: product.unitsRemaining,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleDownloadQr = () => {
        if (!product?.qrCode?.qrCodeImage) return;
        const link = document.createElement("a");
        link.href = product.qrCode.qrCodeImage;
        link.download = `qr-${product.productName?.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-cream flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div className="min-h-screen bg-gradient-cream flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-earth-900 mb-4">Product Not Found</h1>
                    <p className="text-earth-600 mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/products"><Button>Back to Products</Button></Link>
                </div>
            </div>
        );
    }

    const images: any[] = product.images || [];
    const fallbackImage = getFallbackImage(product.productName);
    const imageUrls = images.length > 0
        ? images.map((i: any) => i.url)
        : [fallbackImage];

    // Use real ingredient batch data from DB when available
    const realIngredients: string[] =
        product.ingredients && product.ingredients.length > 0
            ? product.ingredients.map((ing: any) => {
                  const batch = ing.ingredientBatch;
                  if (!batch) return null;
                  const name = batch.ingredientName || batch.scientificName || "Unknown";
                  return batch.scientificName && batch.scientificName !== batch.ingredientName
                      ? `${batch.scientificName} — ${batch.ingredientName}`
                      : name;
              }).filter(Boolean) as string[]
            : [];

    const ingredients = realIngredients.length > 0
        ? realIngredients
        : getIngredients(product.productName, product._slug || id);
    const inStock = (product.unitsRemaining || 0) > 0;
    const qrImage: string | null = product.qrCode?.qrCodeImage || null;

    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-secondary-200">
                <div className="container-custom py-4">
                    <div className="flex items-center gap-2 text-sm text-earth-600">
                        <Link href="/" className="hover:text-primary-600">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary-600">Products</Link>
                        <span>/</span>
                        <span className="text-earth-900">{product.productName}</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <Link href="/products">
                    <Button variant="ghost" leftIcon={<ChevronLeft className="w-5 h-5" />} className="mb-8">
                        Back to Products
                    </Button>
                </Link>

                {/* ── Main Product Section ── */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 shadow-organic-lg bg-secondary-100">
                            <img
                                src={imageUrls[selectedImage]}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 left-6">
                                <Badge variant="success" size="lg">
                                    <QrCode className="w-4 h-4 mr-1" />
                                    Verified Organic
                                </Badge>
                            </div>
                        </div>
                        {imageUrls.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {imageUrls.map((url: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-xl overflow-hidden transition-all bg-secondary-100 ${selectedImage === index ? "ring-4 ring-primary-500 scale-105" : "opacity-70 hover:opacity-100"}`}
                                    >
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div className="mb-4">
                            <Badge variant="primary">{product.category}</Badge>
                        </div>

                        <h1 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-4">
                            {product.productName}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-bold text-earth-900">LKR</span>
                            <span className="text-5xl font-bold text-earth-900">
                                {(product.retailPrice || 0).toLocaleString()}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-earth-700 leading-relaxed mb-8">
                            {product.longDescription || product.shortDescription || "A premium Luna Botanica organic skincare product, crafted with certified organic ingredients and complete supply chain transparency."}
                        </p>

                        {/* Key Features */}
                        {product.keyFeatures && product.keyFeatures.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-semibold text-earth-900 mb-3">Key Features</h3>
                                <ul className="space-y-2">
                                    {product.keyFeatures.map((f: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-earth-700">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Stock */}
                        <div className="mb-6">
                            {inStock ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                                    <span className="font-medium">In Stock ({product.unitsRemaining} units available)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <div className="w-3 h-3 bg-red-600 rounded-full" />
                                    <span className="font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="block font-semibold text-earth-900 mb-3">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-secondary-100 rounded-full">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary-200 rounded-full transition-colors">
                                        <Minus className="w-5 h-5 text-earth-700" />
                                    </button>
                                    <span className="px-6 font-semibold text-earth-900">{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.unitsRemaining || 1, quantity + 1))} className="p-3 hover:bg-secondary-200 rounded-full transition-colors">
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
                                leftIcon={addedToCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                disabled={!inStock}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? "Added to Cart!" : "Add to Cart"}
                            </Button>
                            <Button size="lg" variant={isWishlisted ? "primary" : "outline"} onClick={() => setIsWishlisted(!isWishlisted)}>
                                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                            </Button>
                            <Button size="lg" variant="outline">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-secondary-200">
                            <div className="text-center">
                                <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-earth-900">Free Shipping</p>
                                <p className="text-xs text-earth-600">Orders LKR 10,000+</p>
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

                {/* ── Ingredients Section ── */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                    <Card padding="lg">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="font-serif font-bold text-2xl text-earth-900">Ingredients We Use</h2>
                                <p className="text-sm text-earth-600">Sourced from certified organic suppliers worldwide</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {ingredients.map((ing, i) => {
                                // Split "Name — Description" if present
                                const [mainName, subNote] = ing.split(" — ");
                                return (
                                    <div key={i} className="flex items-start gap-3 p-4 border-2 border-secondary-200 rounded-2xl hover:border-primary-300 transition-colors">
                                        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Leaf className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-earth-900 text-sm">{mainName}</p>
                                            {subNote && <p className="text-xs text-earth-500 mt-0.5">{subNote}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-sm text-green-800">
                                <strong>Full Transparency:</strong> Every ingredient is traceable back to its source. Scan the QR code below to view the complete supply chain journey.
                            </p>
                        </div>
                    </Card>
                </motion.div>

                {/* ── QR Code Section ── */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                    <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* QR Code image or placeholder */}
                            <div className="flex-shrink-0">
                                {qrImage ? (
                                    <div className="text-center">
                                        <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-primary-200 bg-white p-2 shadow-lg">
                                            <img src={qrImage} alt="QR Code" className="w-full h-full object-contain" />
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-3"
                                            leftIcon={<Download className="w-4 h-4" />}
                                            onClick={handleDownloadQr}
                                        >
                                            Download QR
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 rounded-2xl border-4 border-dashed border-primary-300 bg-white/60 flex flex-col items-center justify-center">
                                        <QrCode className="w-16 h-16 text-primary-400 mb-2" />
                                        <p className="text-xs text-primary-500 text-center px-4">QR code will appear here once generated</p>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                                    <Scan className="w-6 h-6 text-primary-600" />
                                    <h3 className="font-serif font-bold text-2xl text-earth-900">Scan to Verify</h3>
                                </div>
                                <p className="text-earth-700 mb-4 leading-relaxed">
                                    Scan this QR code with your phone camera to instantly verify the authenticity of this product and trace every ingredient back to its organic source farm.
                                </p>
                                <ul className="space-y-2 text-sm text-earth-700">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        View complete ingredient supply chain
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        Verify organic certifications
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        Check batch number & manufacturing date
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        Confirm product authenticity
                                    </li>
                                </ul>
                                {product.batchNumber && (
                                    <div className="mt-4 inline-block bg-white/70 rounded-xl px-4 py-2">
                                        <p className="text-xs text-earth-600">Batch Number</p>
                                        <p className="font-mono font-bold text-earth-900">{product.batchNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* ── Related Products ── */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="font-serif font-bold text-3xl text-earth-900 mb-8">You May Also Like</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.map((p: any) => {
                                const imgs: any[] = p.images || [];
                                const thumb = imgs[0]?.url || getFallbackImage(p.productName);
                                return (
                                    <Link key={p._id} href={`/products/${p._id}`}>
                                        <Card hover padding="none" className="overflow-hidden group cursor-pointer">
                                            <div className="aspect-square overflow-hidden bg-secondary-100">
                                                <img src={thumb} alt={p.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-serif font-semibold text-lg text-earth-900 mb-2">{p.productName}</h3>
                                                <span className="text-xl font-bold text-earth-900">LKR {(p.retailPrice || 0).toLocaleString()}</span>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
