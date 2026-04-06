"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import IngredientSelector from "@/components/admin/IngredientSelector";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const steps = [
    { id: 1, name: "Product Details" },
    { id: 2, name: "Select Ingredients" },
    { id: 3, name: "Review & Create" },
];

export default function CreateProductPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);

    const [productData, setProductData] = useState({
        name: "",
        batchNumber: "",
        description: "",
        category: "face-cream",
        skinType: "all",
        quantity: "",
        unit: "ml",
        manufacturedDate: "",
        expiryDate: "",
    });

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCreate = () => {
        // Create product batch
        console.log("Creating product:", { productData, selectedIngredients });
        router.push("/admin/dashboard/products");
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
                                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                                    ? "bg-green-600 text-white"
                                                    : isActive
                                                        ? "bg-primary-600 text-white"
                                                        : "bg-secondary-200 text-earth-600"
                                                    }`}
                                            >
                                                {isCompleted ? "✓" : step.id}
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${isActive || isCompleted
                                                    ? "text-earth-900"
                                                    : "text-earth-600"
                                                    }`}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`h-0.5 flex-1 mx-4 transition-all ${isCompleted ? "bg-green-600" : "bg-secondary-300"
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
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Product Details
                                    </h2>

                                    <div className="space-y-6">
                                        <Input
                                            label="Product Name"
                                            placeholder="e.g., Organic Rose Face Cream"
                                            value={productData.name}
                                            onChange={(e) =>
                                                setProductData({ ...productData, name: e.target.value })
                                            }
                                            required
                                        />

                                        <Input
                                            label="Batch Number"
                                            placeholder="e.g., PROD-2024-001"
                                            value={productData.batchNumber}
                                            onChange={(e) =>
                                                setProductData({
                                                    ...productData,
                                                    batchNumber: e.target.value,
                                                })
                                            }
                                            required
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-2xl border-2 border-secondary-300 bg-white/50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                                                placeholder="Describe your product..."
                                                value={productData.description}
                                                onChange={(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Select
                                                label="Product Category"
                                                options={[
                                                    { value: "face-cream", label: "Face Cream" },
                                                    { value: "serum", label: "Serum" },
                                                    { value: "face-mask", label: "Face Mask" },
                                                    { value: "cleanser", label: "Cleanser" },
                                                    { value: "moisturizer", label: "Moisturizer" },
                                                    { value: "toner", label: "Toner" },
                                                    { value: "eye-cream", label: "Eye Cream" },
                                                ]}
                                                value={productData.category}
                                                onChange={(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        category: e.target.value,
                                                    })
                                                }
                                            />

                                            <Select
                                                label="Skin Type"
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
                                                    setProductData({
                                                        ...productData,
                                                        skinType: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                type="number"
                                                label="Quantity"
                                                placeholder="100"
                                                value={productData.quantity}
                                                onChange={(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        quantity: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <Select
                                                label="Unit"
                                                options={[
                                                    { value: "ml", label: "Milliliters (ml)" },
                                                    { value: "L", label: "Liters (L)" },
                                                    { value: "g", label: "Grams (g)" },
                                                    { value: "kg", label: "Kilograms (kg)" },
                                                ]}
                                                value={productData.unit}
                                                onChange={(e) =>
                                                    setProductData({ ...productData, unit: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                type="date"
                                                label="Manufactured Date"
                                                value={productData.manufacturedDate}
                                                onChange={(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        manufacturedDate: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <Input
                                                type="date"
                                                label="Expiry Date"
                                                value={productData.expiryDate}
                                                onChange={(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        expiryDate: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full"
                                            onClick={handleNext}
                                            rightIcon={<ArrowRight className="w-5 h-5" />}
                                        >
                                            Continue to Ingredients
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 2: Select Ingredients */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-2">
                                        Select Ingredients
                                    </h2>
                                    <p className="text-earth-600 mb-6">
                                        Choose certified organic ingredients for your product
                                    </p>

                                    {selectedIngredients.length === 0 && (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-amber-900 mb-1">
                                                        No ingredients selected
                                                    </p>
                                                    <p className="text-sm text-amber-700">
                                                        You must select at least one certified ingredient to
                                                        create a product batch.
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
                                exit={{ opacity: 0, x: -20 }}
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
                                            <p className="font-semibold text-earth-900">
                                                {productData.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Batch Number</p>
                                            <p className="font-semibold text-earth-900">
                                                {productData.batchNumber}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Category</p>
                                            <p className="font-semibold text-earth-900 capitalize">
                                                {productData.category.replace("-", " ")}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Skin Type</p>
                                            <p className="font-semibold text-earth-900 capitalize">
                                                {productData.skinType}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Quantity</p>
                                            <p className="font-semibold text-earth-900">
                                                {productData.quantity} {productData.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Expiry Date</p>
                                            <p className="font-semibold text-earth-900">
                                                {new Date(productData.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {productData.description && (
                                        <div className="mt-6 pt-6 border-t border-secondary-200">
                                            <p className="text-sm text-earth-600 mb-2">Description</p>
                                            <p className="text-earth-700">{productData.description}</p>
                                        </div>
                                    )}
                                </Card>

                                {/* Selected Ingredients */}
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Ingredients ({selectedIngredients.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {selectedIngredients.map((ingredient) => (
                                            <div
                                                key={ingredient.id}
                                                className="p-4 bg-secondary-50 rounded-xl"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-earth-900">
                                                            {ingredient.name}
                                                        </h3>
                                                        <p className="text-sm text-earth-600">
                                                            {ingredient.batchNumber} • {ingredient.supplier}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-primary-600">
                                                            {ingredient.quantityUsed || "10"} ml
                                                        </p>
                                                        <p className="text-sm text-earth-600">
                                                            {ingredient.certificates} certificates
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Actions */}
                                <div className="flex gap-4">
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
                                        onClick={handleCreate}
                                        leftIcon={<Save className="w-5 h-5" />}
                                    >
                                        Create Product Batch
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