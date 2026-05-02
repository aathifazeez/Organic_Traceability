"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Plus, Search, Beaker, Trash2, QrCode, Download, Loader2, X,
    Eye, EyeOff, Upload, Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { apiRequest } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/_/backend/api/v1";

const CATEGORY_OPTIONS = [
    { value: "face-cream", label: "Face Cream" },
    { value: "serum", label: "Serum" },
    { value: "face-mask", label: "Face Mask" },
    { value: "cleanser", label: "Cleanser" },
    { value: "moisturizer", label: "Moisturizer" },
    { value: "toner", label: "Toner" },
    { value: "eye-cream", label: "Eye Cream" },
    { value: "sunscreen", label: "Sunscreen" },
    { value: "night-cream", label: "Night Cream" },
    { value: "exfoliator", label: "Exfoliator" },
];

const SKIN_TYPE_OPTIONS = [
    { value: "all", label: "All Skin Types" },
    { value: "dry", label: "Dry" },
    { value: "oily", label: "Oily" },
    { value: "combination", label: "Combination" },
    { value: "sensitive", label: "Sensitive" },
    { value: "normal", label: "Normal" },
    { value: "acne-prone", label: "Acne-Prone" },
];

interface ProductBatch {
    _id: string;
    productName: string;
    batchNumber: string;
    ingredients?: any[];
    unitsRemaining?: number;
    retailPrice?: number;
    createdAt: string;
    status: string;
    isListed: boolean;
    qrCode?: { qrCodeImage: string; qrId: string; _id: string } | null;
    images?: { url: string; isPrimary: boolean }[];
}

function getFallbackImage(name: string): string {
    const n = (name || "").toLowerCase();
    if (n.includes("coffee") || n.includes("scrub")) return "/images/product-coffee-scrub.png";
    if (n.includes("serum") || n.includes("niacinamide")) return "/images/product-serum.png";
    if (n.includes("soap") || n.includes("lavender")) return "/images/product-soap.png";
    if (n.includes("cream") || n.includes("vivid")) return "/images/product-face-cream.png";
    return "/images/product-serum.png";
}

export default function AdminProductBatchesPage() {
    const [products, setProducts] = useState<ProductBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [generatingQrId, setGeneratingQrId] = useState<string | null>(null);
    const [qrModal, setQrModal] = useState<{ image: string; name: string } | null>(null);
    const [uploadQrProductId, setUploadQrProductId] = useState<string | null>(null);
    const [uploadQrFile, setUploadQrFile] = useState<File | null>(null);
    const [uploadQrPreview, setUploadQrPreview] = useState<string | null>(null);
    const [uploadingQr, setUploadingQr] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({
        productName: "", category: "face-cream", skinType: "all",
        shortDescription: "", longDescription: "", retailPrice: "",
        totalUnits: "", keyFeatures: "",
        imageUrl: "",
    });
    const [addQrFile, setAddQrFile] = useState<File | null>(null);
    const [addQrPreview, setAddQrPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addQrRef = useRef<HTMLInputElement>(null);

    const fetchProducts = async () => {
        try {
            const res = await apiRequest("/products?limit=100");
            if (res.success) {
                setProducts(res.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await apiRequest(`/products/${id}`, { method: "DELETE" });
            if (res.success) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
            } else {
                alert(res.message || "Failed to delete product");
            }
        } catch {
            alert("Failed to delete product");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleListing = async (product: ProductBatch) => {
        setTogglingId(product._id);
        try {
            const res = await apiRequest(`/products/${product._id}/toggle-listing`, { method: "PATCH" });
            if (res.success) {
                setProducts((prev) =>
                    prev.map((p) =>
                        p._id === product._id ? { ...p, isListed: !p.isListed } : p
                    )
                );
            } else {
                alert(res.message || "Failed to toggle listing");
            }
        } catch {
            alert("Failed to toggle listing");
        } finally {
            setTogglingId(null);
        }
    };

    const handleGenerateQr = async (product: ProductBatch) => {
        setGeneratingQrId(product._id);
        try {
            const res = await apiRequest(`/qr/generate/${product._id}`, { method: "POST" });
            if (res.success && res.data?.qrCode?.qrCodeImage) {
                setQrModal({ image: res.data.qrCode.qrCodeImage, name: product.productName });
                setProducts((prev) =>
                    prev.map((p) =>
                        p._id === product._id ? { ...p, qrCode: res.data.qrCode } : p
                    )
                );
            } else {
                alert(res.message || "Failed to generate QR code");
            }
        } catch {
            alert("Failed to generate QR code");
        } finally {
            setGeneratingQrId(null);
        }
    };

    const handleDownloadQr = (image: string, name: string) => {
        const link = document.createElement("a");
        link.href = image;
        link.download = `qr-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.click();
    };

    const handleUploadQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadQrFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setUploadQrPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleUploadQrSubmit = async () => {
        if (!uploadQrProductId || (!uploadQrFile && !uploadQrPreview)) return;
        setUploadingQr(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const formData = new FormData();
            if (uploadQrFile) {
                formData.append("qrImage", uploadQrFile);
            } else if (uploadQrPreview) {
                formData.append("qrCodeImage", uploadQrPreview);
            }

            const res = await fetch(`${API_URL}/qr/upload/${uploadQrProductId}`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setProducts((prev) =>
                    prev.map((p) =>
                        p._id === uploadQrProductId ? { ...p, qrCode: data.data.qrCode } : p
                    )
                );
                setUploadQrProductId(null);
                setUploadQrFile(null);
                setUploadQrPreview(null);
            } else {
                alert(data.message || "Failed to upload QR code");
            }
        } catch {
            alert("Failed to upload QR code");
        } finally {
            setUploadingQr(false);
        }
    };

    const handleAddQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAddQrFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setAddQrPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleAddProduct = async () => {
        if (!addForm.productName || !addForm.shortDescription || !addForm.totalUnits) {
            alert("Product name, description, and total units are required.");
            return;
        }
        setSubmitting(true);
        try {
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 2);

            const payload: any = {
                productName: addForm.productName,
                category: addForm.category,
                skinType: addForm.skinType,
                shortDescription: addForm.shortDescription,
                longDescription: addForm.longDescription || addForm.shortDescription,
                retailPrice: parseFloat(addForm.retailPrice) || 0,
                totalUnits: parseInt(addForm.totalUnits) || 1,
                unitSize: { value: 50, unit: "ml" },
                expiryDate: expiryDate.toISOString(),
                keyFeatures: addForm.keyFeatures
                    ? addForm.keyFeatures.split("\n").map((f) => f.trim()).filter(Boolean)
                    : [],
                isListed: true,
            };

            if (addForm.imageUrl) {
                payload.imageUrlDirect = addForm.imageUrl;
            }

            const res = await apiRequest("/products", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (res.success) {
                const newProduct = res.data?.productBatch || res.data;

                // If image URL provided, patch images array
                if (addForm.imageUrl && newProduct?._id) {
                    await apiRequest(`/products/${newProduct._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            images: [{ url: addForm.imageUrl, isPrimary: true }],
                        }),
                    });
                    newProduct.images = [{ url: addForm.imageUrl, isPrimary: true }];
                }

                // Upload QR if provided
                if (addQrFile && newProduct?._id) {
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                    const formData = new FormData();
                    formData.append("qrImage", addQrFile);
                    const qrRes = await fetch(`${API_URL}/qr/upload/${newProduct._id}`, {
                        method: "POST",
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                        body: formData,
                    });
                    const qrData = await qrRes.json();
                    if (qrData.success) {
                        newProduct.qrCode = qrData.data.qrCode;
                    }
                }

                setProducts((prev) => [newProduct, ...prev]);
                setShowAddModal(false);
                setAddForm({
                    productName: "", category: "face-cream", skinType: "all",
                    shortDescription: "", longDescription: "", retailPrice: "",
                    totalUnits: "", keyFeatures: "", imageUrl: "",
                });
                setAddQrFile(null);
                setAddQrPreview(null);
            } else {
                alert(res.message || "Failed to create product");
            }
        } catch (e: any) {
            alert(e?.message || "Failed to create product");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            (p.productName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.batchNumber || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">Product Batches</h1>
                                <p className="text-earth-600">Manage organic skincare production batches</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    leftIcon={<Plus className="w-5 h-5" />}
                                    onClick={() => setShowAddModal(true)}
                                >
                                    Quick Add Product
                                </Button>
                                <Link href="/admin/dashboard/products/create">
                                    <Button leftIcon={<Beaker className="w-5 h-5" />}>Create with Ingredients</Button>
                                </Link>
                            </div>
                        </div>

                        <Card padding="md">
                            <Input
                                placeholder="Search batches..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Card>
                    </motion.div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-earth-600 text-lg">Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <Card padding="lg">
                            <p className="text-center text-earth-600 py-8">No product batches found.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredProducts.map((product, index) => {
                                const imgs: any[] = product.images || [];
                                const thumb = imgs.find((i: any) => i.isPrimary)?.url || imgs[0]?.url || getFallbackImage(product.productName);

                                return (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card padding="lg">
                                            <div className="flex items-center gap-6">
                                                {/* Thumbnail */}
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary-100 flex-shrink-0">
                                                    <img src={thumb} alt={product.productName} className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2 gap-2">
                                                        <div>
                                                            <h3 className="font-semibold text-xl text-earth-900">{product.productName}</h3>
                                                            <p className="text-earth-600">{product.batchNumber}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Badge variant={product.status === "active" ? "success" : product.status === "pending" ? "warning" : "info"}>
                                                                {product.status}
                                                            </Badge>
                                                            <Badge variant={product.isListed ? "success" : "info"}>
                                                                {product.isListed ? "Listed" : "Unlisted"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-sm text-earth-600">
                                                        {product.unitsRemaining != null && (
                                                            <span>{product.unitsRemaining} units remaining</span>
                                                        )}
                                                        {product.retailPrice != null && (
                                                            <span>LKR {product.retailPrice.toLocaleString()}</span>
                                                        )}
                                                        <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                                                    {/* Toggle Listing */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        leftIcon={togglingId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : product.isListed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        onClick={() => handleToggleListing(product)}
                                                        disabled={togglingId === product._id}
                                                    >
                                                        {product.isListed ? "Unlist" : "List"}
                                                    </Button>

                                                    {/* QR: Generate or View */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        leftIcon={generatingQrId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                                                        onClick={() => {
                                                            if (product.qrCode?.qrCodeImage) {
                                                                setQrModal({ image: product.qrCode.qrCodeImage, name: product.productName });
                                                            } else {
                                                                handleGenerateQr(product);
                                                            }
                                                        }}
                                                        disabled={generatingQrId === product._id}
                                                    >
                                                        {product.qrCode?.qrCodeImage ? "View QR" : "Generate QR"}
                                                    </Button>

                                                    {/* Upload QR */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        leftIcon={<Upload className="w-4 h-4" />}
                                                        onClick={() => {
                                                            setUploadQrProductId(product._id);
                                                            setUploadQrFile(null);
                                                            setUploadQrPreview(null);
                                                        }}
                                                    >
                                                        Upload QR
                                                    </Button>

                                                    {/* Delete */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        leftIcon={deletingId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                        onClick={() => handleDelete(product._id, product.productName)}
                                                        disabled={deletingId === product._id}
                                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* ── View QR Modal ── */}
            {qrModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif font-bold text-xl text-earth-900">QR Code</h3>
                            <button onClick={() => setQrModal(null)} className="text-earth-600 hover:text-earth-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-earth-600 text-sm mb-4 text-center">{qrModal.name}</p>
                        <div className="flex justify-center mb-6">
                            <img src={qrModal.image} alt="QR Code" className="w-48 h-48 border border-secondary-200 rounded-lg" />
                        </div>
                        <Button
                            size="lg"
                            className="w-full"
                            leftIcon={<Download className="w-5 h-5" />}
                            onClick={() => handleDownloadQr(qrModal.image, qrModal.name)}
                        >
                            Download QR Code
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* ── Upload QR Modal ── */}
            {uploadQrProductId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif font-bold text-xl text-earth-900">Upload QR Code</h3>
                            <button onClick={() => { setUploadQrProductId(null); setUploadQrFile(null); setUploadQrPreview(null); }} className="text-earth-600 hover:text-earth-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div
                            className="border-2 border-dashed border-primary-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors mb-6"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploadQrPreview ? (
                                <img src={uploadQrPreview} alt="QR Preview" className="w-40 h-40 mx-auto object-contain" />
                            ) : (
                                <>
                                    <ImageIcon className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                                    <p className="text-earth-600 text-sm">Click to upload QR image (PNG/JPG)</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadQrFileChange}
                        />

                        <Button
                            size="lg"
                            className="w-full"
                            disabled={!uploadQrFile || uploadingQr}
                            leftIcon={uploadingQr ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            onClick={handleUploadQrSubmit}
                        >
                            {uploadingQr ? "Uploading..." : "Upload QR Code"}
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* ── Quick Add Product Modal ── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl my-4"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif font-bold text-2xl text-earth-900">Quick Add Product</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-earth-600 hover:text-earth-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Product Name *"
                                value={addForm.productName}
                                onChange={(e) => setAddForm({ ...addForm, productName: e.target.value })}
                                placeholder="e.g. Luna Botanica Coffee Scrub"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Category *</label>
                                    <Select
                                        options={CATEGORY_OPTIONS}
                                        value={addForm.category}
                                        onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Skin Type *</label>
                                    <Select
                                        options={SKIN_TYPE_OPTIONS}
                                        value={addForm.skinType}
                                        onChange={(e) => setAddForm({ ...addForm, skinType: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Short Description *</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                                    rows={2}
                                    value={addForm.shortDescription}
                                    onChange={(e) => setAddForm({ ...addForm, shortDescription: e.target.value })}
                                    placeholder="Brief product description (max 200 chars)"
                                    maxLength={200}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Long Description</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                                    rows={3}
                                    value={addForm.longDescription}
                                    onChange={(e) => setAddForm({ ...addForm, longDescription: e.target.value })}
                                    placeholder="Full product description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Retail Price (LKR)"
                                    type="number"
                                    value={addForm.retailPrice}
                                    onChange={(e) => setAddForm({ ...addForm, retailPrice: e.target.value })}
                                    placeholder="e.g. 2500"
                                />
                                <Input
                                    label="Total Units *"
                                    type="number"
                                    value={addForm.totalUnits}
                                    onChange={(e) => setAddForm({ ...addForm, totalUnits: e.target.value })}
                                    placeholder="e.g. 100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Key Features (one per line)</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                                    rows={3}
                                    value={addForm.keyFeatures}
                                    onChange={(e) => setAddForm({ ...addForm, keyFeatures: e.target.value })}
                                    placeholder={"100% Organic Ingredients\nCruelty-Free\nParaben-free"}
                                />
                            </div>

                            <Input
                                label="Product Image URL"
                                value={addForm.imageUrl}
                                onChange={(e) => setAddForm({ ...addForm, imageUrl: e.target.value })}
                                placeholder="e.g. /images/product-coffee-scrub.png"
                            />

                            {/* QR Code Upload */}
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">Upload QR Code (optional)</label>
                                <div
                                    className="border-2 border-dashed border-primary-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary-500 transition-colors"
                                    onClick={() => addQrRef.current?.click()}
                                >
                                    {addQrPreview ? (
                                        <img src={addQrPreview} alt="QR Preview" className="w-24 h-24 mx-auto object-contain" />
                                    ) : (
                                        <>
                                            <QrCode className="w-8 h-8 text-primary-400 mx-auto mb-1" />
                                            <p className="text-earth-600 text-xs">Click to upload QR image</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={addQrRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAddQrFileChange}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                disabled={submitting}
                                leftIcon={submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                onClick={handleAddProduct}
                            >
                                {submitting ? "Creating..." : "Create Product"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
