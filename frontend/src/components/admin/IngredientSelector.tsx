"use client";

import { useState, useEffect } from "react";
import { Search, Check, AlertCircle, CheckCircle, FileText, Loader2, MapPin, Package } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/auth";

interface IngredientSelectorProps {
    selectedIngredients: any[];
    onIngredientsChange: (ingredients: any[]) => void;
}

export default function IngredientSelector({
    selectedIngredients,
    onIngredientsChange,
}: IngredientSelectorProps) {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [quantities, setQuantities] = useState<{ [key: string]: { value: string; unit: string } }>({});

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await apiRequest("/products/ingredients/available?limit=50");
                if (res.success) setBatches(res.data?.ingredients || []);
            } catch {
                /* ignore */
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

    const filteredBatches = batches.filter(
        (b) =>
            b.ingredientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.supplier?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSelected = (id: string) => selectedIngredients.some((ing) => ing._id === id);

    const getQuantity = (id: string) =>
        quantities[id] || { value: "10", unit: "g" };

    const handleToggle = (batch: any) => {
        const id = batch._id;
        if (isSelected(id)) {
            onIngredientsChange(selectedIngredients.filter((ing) => ing._id !== id));
        } else {
            const q = getQuantity(id);
            onIngredientsChange([
                ...selectedIngredients,
                {
                    _id: id,
                    ingredientName: batch.ingredientName,
                    batchNumber: batch.batchNumber,
                    supplier: batch.supplier?.companyName || batch.supplier?.name || "—",
                    origin: batch.origin?.country || "—",
                    certificates: batch.certificates || [],
                    availableQty: batch.quantityRemaining,
                    quantityUsed: { value: parseFloat(q.value) || 10, unit: q.unit },
                },
            ]);
        }
    };

    const handleQuantityChange = (id: string, value: string, unit?: string) => {
        const current = getQuantity(id);
        const updated = { value, unit: unit ?? current.unit };
        setQuantities({ ...quantities, [id]: updated });
        onIngredientsChange(
            selectedIngredients.map((ing) =>
                ing._id === id
                    ? { ...ing, quantityUsed: { value: parseFloat(value) || 0, unit: updated.unit } }
                    : ing
            )
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mr-3" />
                <span className="text-earth-600">Loading ingredient batches...</span>
            </div>
        );
    }

    if (batches.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-secondary-300 rounded-xl">
                <Package className="w-12 h-12 text-earth-400 mx-auto mb-3" />
                <p className="font-medium text-earth-700 mb-1">No ingredient batches available</p>
                <p className="text-sm text-earth-500">
                    Suppliers need to create and activate ingredient batches first.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Search */}
            <Input
                placeholder="Search by ingredient name, batch number, or supplier..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Selected count banner */}
            {selectedIngredients.length > 0 && (
                <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-primary-900 text-sm">
                            {selectedIngredients.length} ingredient batch{selectedIngredients.length !== 1 ? "es" : ""} selected
                        </span>
                    </div>
                    <button
                        onClick={() => onIngredientsChange([])}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Batch list */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">
                    Supplier Ingredient Batches ({filteredBatches.length})
                </p>
                <AnimatePresence mode="popLayout">
                    {filteredBatches.map((batch, index) => {
                        const id = batch._id;
                        const selected = isSelected(id);
                        const hasCerts = batch.certificates?.length > 0;
                        const q = getQuantity(id);

                        return (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <div
                                    className={`border-2 rounded-xl transition-all ${
                                        selected
                                            ? "border-primary-500 bg-primary-50/60"
                                            : "border-secondary-200 hover:border-primary-300 bg-white"
                                    }`}
                                >
                                    {/* Header row — clickable to select */}
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => handleToggle(batch)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                                    selected
                                                        ? "border-primary-600 bg-primary-600"
                                                        : "border-secondary-300"
                                                }`}
                                            >
                                                {selected && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div>
                                                        <h4 className="font-semibold text-earth-900">
                                                            {batch.ingredientName}
                                                        </h4>
                                                        <p className="text-sm text-earth-500 font-mono">
                                                            {batch.batchNumber}
                                                        </p>
                                                    </div>
                                                    {/* Certificate badges */}
                                                    <div className="flex flex-wrap gap-1.5 justify-end">
                                                        {hasCerts ? (
                                                            batch.certificates.map((cert: any) => {
                                                                const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                                                                return (
                                                                    <span
                                                                        key={cert._id || cert}
                                                                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                                            isExpired
                                                                                ? "bg-red-100 text-red-700"
                                                                                : "bg-green-100 text-green-700"
                                                                        }`}
                                                                    >
                                                                        <FileText className="w-3 h-3" />
                                                                        {cert.certificateName || cert.certificateType || "Cert"}
                                                                    </span>
                                                                );
                                                            })
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                                <AlertCircle className="w-3 h-3" />
                                                                No Certs
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-earth-600">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {batch.origin?.country || "—"}
                                                        {batch.origin?.region ? `, ${batch.origin.region}` : ""}
                                                    </span>
                                                    <span>
                                                        Supplier: <strong>{batch.supplier?.companyName || batch.supplier?.name || "—"}</strong>
                                                    </span>
                                                    <span>
                                                        Available: <strong>{batch.quantityRemaining?.value} {batch.quantityRemaining?.unit}</strong>
                                                    </span>
                                                    {batch.qualityGrade && (
                                                        <span>
                                                            Grade: <strong>{batch.qualityGrade}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity input — only when selected */}
                                    {selected && (
                                        <div
                                            className="px-4 pb-4 border-t border-primary-200 pt-3 mt-0"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <p className="text-sm font-medium text-earth-900 mb-2">
                                                Quantity to use in this product batch
                                            </p>
                                            <div className="flex gap-3 items-center">
                                                <Input
                                                    type="number"
                                                    placeholder="10"
                                                    value={q.value}
                                                    onChange={(e) => handleQuantityChange(id, e.target.value)}
                                                    className="w-36"
                                                />
                                                <select
                                                    value={q.unit}
                                                    onChange={(e) => handleQuantityChange(id, q.value, e.target.value)}
                                                    className="px-3 py-2 border-2 border-secondary-300 rounded-xl bg-white focus:border-primary-500 focus:outline-none text-sm"
                                                >
                                                    <option value="ml">ml</option>
                                                    <option value="L">L</option>
                                                    <option value="g">g</option>
                                                    <option value="kg">kg</option>
                                                    <option value="oz">oz</option>
                                                    <option value="lb">lb</option>
                                                </select>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggle(batch)}
                                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredBatches.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-earth-500">No ingredient batches match your search</p>
                    </div>
                )}
            </div>
        </div>
    );
}
