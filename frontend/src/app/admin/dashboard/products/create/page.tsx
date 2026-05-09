"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, AlertCircle, CheckCircle, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import IngredientSelector from "@/components/admin/IngredientSelector";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { apiRequest } from "@/lib/auth";

const steps = [
    { id: 1, name: "Product Details" },
    { id: 2, name: "Select Ingredients" },
    { id: 3, name: "Review & Create" },
];

export default function CreateProductPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [productData, setProductData] = useState({
        name: "",
        shortDescription: "",
        description: "",
        category: "face-cream",
        skinType: "all",
        quantity: "",
        unit: "ml",
        retailPrice: "",
        manufacturedDate: "",
        expiryDate: "",
    });

    const handleNext = () => {
        if (currentStep === 1) {
            if (!productData.name || !productData.shortDescription || !productData.quantity || !productData.manufacturedDate || !productData.expiryDate) {
                alert("Please fill in all required fields");
                return;
            }
        }
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleCreate = async () => {
        setCreateError(null);
        setCreating(true);
        try {
            const body: any = {
                productName: productData.name,
                category: productData.category,
                skinType: productData.skinType,
                shortDescription: productData.shortDescription,
                ingredients: selectedIngredients.map((ing) => ({
                    ingredientBatch: ing._id,
                    quantityUsed: ing.quantityUsed,
                })),
                productionDate: new Date(productData.manufacturedDate).toISOString(),
                expiryDate: new Date(productData.expiryDate).toISOString(),
                totalUnits: parseInt(productData.quantity),
                unitSize: { value: parseInt(productData.quantity), unit: productData.unit },
            };
            if (productData.description) body.longDescription = productData.description;
            if (productData.retailPrice) body.retailPrice = parseFloat(productData.retailPrice);

            const res = await apiRequest("/products", { method: "POST", body: JSON.stringify(body) });

            if (res.success) {
                router.push("/admin/dashboard/products");
            } else {
                setCreateError(res.message || "Failed to create product batch");
            }
        } catch {
            setCreateError("Failed to create product batch. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Back Button */}
                    <Link href="/admin/dashboard/products">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                            className="mb-6"
                        >
                            Back to Products
                        </Button>
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                            Create Product Batch
                        </h1>
                        <p className="text-earth-600">
                            Add a new organic skincare product to your inventory
                        </p>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between max-w-2xl mx-auto">
                            {steps.map((step, index) => {
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;

                                return (
                                    <div key={step.id} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-1">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                                    isCompleted
                                                        ? "bg-green-600 text-white"
                                                        : isActive
                                                        ? "bg-primary-600 text-white"
                                                        : "bg-secondary-200 text-earth-600"
                                                }`}
                                            >
                                                {isCompleted ? "✓" : step.id}
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${
                                                    isActive || isCompleted ? "text-earth-900" : "text-earth-600"
                                                }`}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`h-0.5 flex-1 mx-4 transition-all ${
                                                    isCompleted ? "bg-green-600" : "bg-secondary-300"
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="max-w-4xl mx-auto">
                        {/* Step 1: Product Details */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Product Details
                                    </h2>

                                    <div className="space-y-6">
                                        <Input
                                            label="Product Name *"
                                            placeholder="e.g., Luna Botanica Vivid Glow Face Cream"
                                            value={productData.name}
                                            onChange={(e) =>
                                                setProductData({ ...productData, name: e.target.value })
                                            }
                                        />

                                        <Input
                                            label="Short Description *"
                                            placeholder="e.g., Nourishing organic face cream for all skin types"
                                            value={productData.shortDescription}
                                            onChange={(e) =>
                                                setProductData({ ...productData, shortDescription: e.target.value })
                                            }
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                                Long Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-2xl border-2 border-secondary-300 bg-white/50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                                                placeholder="Detailed product description..."
                                                value={productData.description}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, description: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Select
                                                label="Product Category *"
                                                options={[
                                                    { value: "face-cream", label: "Face Cream" },
                                                    { value: "serum", label: "Serum" },
                                                    { value: "face-mask", label: "Face Mask" },
                                                    { value: "cleanser", label: "Cleanser" },
                                                    { value: "moisturizer", label: "Moisturizer" },
                                                    { value: "toner", label: "Toner" },
                                                    { value: "eye-cream", label: "Eye Cream" },
                                                    { value: "exfoliator", label: "Exfoliator" },
                                                ]}
                                                value={productData.category}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, category: e.target.value })
                                                }
                                            />

                                            <Select
                                                label="Skin Type *"
                                                options={[
                                                    { value: "all", label: "All Skin Types" },
                                                    { value: "dry", label: "Dry Skin" },
                                                    { value: "oily", label: "Oily Skin" },
                                                    { value: "combination", label: "Combination Skin" },
                                                    { value: "sensitive", label: "Sensitive Skin" },
                                                    { value: "normal", label: "Normal Skin" },
                                                ]}
                                                value={productData.skinType}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, skinType: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2">
                                                <Input
                                                    type="number"
                                                    label="Total Units *"
                                                    placeholder="100"
                                                    value={productData.quantity}
                                                    onChange={(e) =>
                                                        setProductData({ ...productData, quantity: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <Select
                                                label="Unit"
                                                options={[
                                                    { value: "ml", label: "ml" },
                                                    { value: "L", label: "L" },
                                                    { value: "g", label: "g" },
                                                    { value: "kg", label: "kg" },
                                                ]}
                                                value={productData.unit}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, unit: e.target.value })
                                                }
                                            />
                                        </div>

                                        <Input
                                            type="number"
                                            label="Retail Price (LKR)"
                                            placeholder="e.g., 2500"
                                            value={productData.retailPrice}
                                            onChange={(e) =>
                                                setProductData({ ...productData, retailPrice: e.target.value })
                                            }
                                        />

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                type="date"
                                                label="Manufactured Date *"
                                                value={productData.manufacturedDate}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, manufacturedDate: e.target.value })
                                                }
                                            />
                                            <Input
                                                type="date"
                                                label="Expiry Date *"
                                                value={productData.expiryDate}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, expiryDate: e.target.value })
                                                }
                                            />
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full"
                                            onClick={handleNext}
                                            rightIcon={<ArrowRight className="w-5 h-5" />}
                                        >
                                            Continue to Select Ingredients
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 2: Select Ingredient Batches */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-2">
                                        Select Ingredient Batches
                                    </h2>
                                    <p className="text-earth-600 mb-6">
                                        Choose supplier ingredient batches for this product. Each batch already has certificates assigned by the supplier.
                                    </p>

                                    {selectedIngredients.length === 0 && (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-amber-900 mb-1">
                                                        No ingredient batches selected
                                                    </p>
                                                    <p className="text-sm text-amber-700">
                                                        You must select at least one ingredient batch to create a product batch.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <IngredientSelector
                                        selectedIngredients={selectedIngredients}
                                        onIngredientsChange={setSelectedIngredients}
                                    />

                                    <div className="flex gap-4 mt-8">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="flex-1"
                                            onClick={handleBack}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            size="lg"
                                            className="flex-1"
                                            onClick={handleNext}
                                            disabled={selectedIngredients.length === 0}
                                            rightIcon={<ArrowRight className="w-5 h-5" />}
                                        >
                                            Review Product
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 3: Review & Create */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Product Summary */}
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Product Summary
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Product Name</p>
                                            <p className="font-semibold text-earth-900">{productData.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Category</p>
                                            <p className="font-semibold text-earth-900 capitalize">
                                                {productData.category.replace(/-/g, " ")}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Skin Type</p>
                                            <p className="font-semibold text-earth-900 capitalize">{productData.skinType}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Total Units</p>
                                            <p className="font-semibold text-earth-900">
                                                {productData.quantity} {productData.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Manufactured Date</p>
                                            <p className="font-semibold text-earth-900">
                                                {new Date(productData.manufacturedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Expiry Date</p>
                                            <p className="font-semibold text-earth-900">
                                                {new Date(productData.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {productData.retailPrice && (
                                            <div>
                                                <p className="text-sm text-earth-600 mb-1">Retail Price</p>
                                                <p className="font-semibold text-earth-900">
                                                    LKR {parseFloat(productData.retailPrice).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-secondary-200">
                                        <p className="text-sm text-earth-600 mb-1">Short Description</p>
                                        <p className="text-earth-700">{productData.shortDescription}</p>
                                    </div>
                                    {productData.description && (
                                        <div className="mt-4">
                                            <p className="text-sm text-earth-600 mb-1">Long Description</p>
                                            <p className="text-earth-700">{productData.description}</p>
                                        </div>
                                    )}
                                </Card>

                                {/* Selected Ingredient Batches */}
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Ingredient Batches ({selectedIngredients.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {selectedIngredients.map((ing) => {
                                            const hasCerts = ing.certificates?.length > 0;
                                            return (
                                                <div
                                                    key={ing._id}
                                                    className="p-4 border-2 border-secondary-200 rounded-xl"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-earth-900">
                                                                {ing.ingredientName}
                                                            </h3>
                                                            <p className="text-sm text-earth-500 font-mono">
                                                                {ing.batchNumber}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-primary-600">
                                                                {ing.quantityUsed.value} {ing.quantityUsed.unit}
                                                            </p>
                                                            <p className="text-xs text-earth-500">quantity to use</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-earth-600">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {ing.origin}
                                                        </span>
                                                        <span>Supplier: <strong>{ing.supplier}</strong></span>
                                                    </div>
                                                    {/* Certificates */}
                                                    <div className="mt-3 pt-3 border-t border-secondary-100">
                                                        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-2">
                                                            Certificates
                                                        </p>
                                                        {hasCerts ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {ing.certificates.map((cert: any) => {
                                                                    const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                                                                    return (
                                                                        <span
                                                                            key={cert._id || cert}
                                                                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                                                isExpired
                                                                                    ? "bg-red-100 text-red-700"
                                                                                    : "bg-green-100 text-green-700"
                                                                            }`}
                                                                        >
                                                                            <FileText className="w-3 h-3" />
                                                                            {cert.certificateName || cert.certificateType || "Certificate"}
                                                                            {cert.issuingAuthority ? ` · ${cert.issuingAuthority}` : ""}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-amber-700">
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span className="text-sm">No certificates assigned to this batch</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>

                                {/* Error */}
                                {createError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-800">{createError}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1"
                                        onClick={handleBack}
                                        disabled={creating}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="flex-1"
                                        onClick={handleCreate}
                                        disabled={creating}
                                        leftIcon={creating ? undefined : <Save className="w-5 h-5" />}
                                    >
                                        {creating ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Creating...
                                            </span>
                                        ) : "Create Product Batch"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
