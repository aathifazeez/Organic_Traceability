"use client";

import { useState } from "react";
import { Search, Plus, Check, AlertCircle, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

// Mock available ingredients from suppliers
const availableIngredients = [
    {
        id: "1",
        name: "Organic Argan Oil",
        batchNumber: "ARG-2024-001",
        supplier: "Atlas Organic Oils",
        origin: "Morocco",
        quantity: "475L",
        certificates: 3,
        certificateStatus: "valid",
    },
    {
        id: "2",
        name: "Cold-Pressed Rosehip Oil",
        batchNumber: "RSH-2024-015",
        supplier: "Rosa Organics Ltd",
        origin: "Chile",
        quantity: "230L",
        certificates: 2,
        certificateStatus: "expiring",
    },
    {
        id: "3",
        name: "Organic Shea Butter",
        batchNumber: "SHB-2024-008",
        supplier: "Fair Trade Shea Cooperative",
        origin: "Ghana",
        quantity: "780kg",
        certificates: 4,
        certificateStatus: "valid",
    },
    {
        id: "4",
        name: "Hyaluronic Acid (Plant-Based)",
        batchNumber: "HYA-2024-002",
        supplier: "BioActive Ingredients Co.",
        origin: "France",
        quantity: "95ml",
        certificates: 1,
        certificateStatus: "valid",
    },
    {
        id: "5",
        name: "Vitamin E (Non-GMO)",
        batchNumber: "VIT-2024-004",
        supplier: "Natural Vitamins Inc",
        origin: "California, USA",
        quantity: "48ml",
        certificates: 1,
        certificateStatus: "valid",
    },
];

interface IngredientSelectorProps {
    selectedIngredients: any[];
    onIngredientsChange: (ingredients: any[]) => void;
}

export default function IngredientSelector({
    selectedIngredients,
    onIngredientsChange,
}: IngredientSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [quantities, setQuantities] = useState<{ [key: string]: string }>({});

    const filteredIngredients = availableIngredients.filter(
        (ing) =>
            ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ing.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSelected = (id: string) =>
        selectedIngredients.some((ing) => ing.id === id);

    const handleToggle = (ingredient: any) => {
        if (isSelected(ingredient.id)) {
            onIngredientsChange(
                selectedIngredients.filter((ing) => ing.id !== ingredient.id)
            );
        } else {
            onIngredientsChange([
                ...selectedIngredients,
                { ...ingredient, quantityUsed: quantities[ingredient.id] || "10" },
            ]);
        }
    };

    const handleQuantityChange = (id: string, value: string) => {
        setQuantities({ ...quantities, [id]: value });
        const updated = selectedIngredients.map((ing) =>
            ing.id === id ? { ...ing, quantityUsed: value } : ing
        );
        onIngredientsChange(updated);
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <Input
                placeholder="Search ingredients by name or batch number..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Selected Ingredients Summary */}
            {selectedIngredients.length > 0 && (
                <Card className="bg-primary-50 border-primary-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                            <span className="font-medium text-primary-900">
                                {selectedIngredients.length} ingredient
                                {selectedIngredients.length !== 1 ? "s" : ""} selected
                            </span>
                        </div>
                        <button
                            onClick={() => onIngredientsChange([])}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                </Card>
            )}

            {/* Available Ingredients */}
            <div className="space-y-3">
                <h3 className="font-semibold text-earth-900">
                    Available Certified Ingredients
                </h3>
                <AnimatePresence mode="popLayout">
                    {filteredIngredients.map((ingredient, index) => {
                        const selected = isSelected(ingredient.id);

                        return (
                            <motion.div
                                key={ingredient.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all ${selected
                                            ? "border-primary-500 bg-primary-50"
                                            : "border-secondary-200 hover:border-primary-300"
                                        }`}
                                    onClick={() => !selected && handleToggle(ingredient)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${selected
                                                    ? "border-primary-600 bg-primary-600"
                                                    : "border-secondary-300"
                                                }`}
                                        >
                                            {selected && <Check className="w-4 h-4 text-white" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-earth-900">
                                                        {ingredient.name}
                                                    </h4>
                                                    <p className="text-sm text-earth-600">
                                                        {ingredient.batchNumber} • {ingredient.supplier}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge
                                                        variant={
                                                            ingredient.certificateStatus === "valid"
                                                                ? "success"
                                                                : "warning"
                                                        }
                                                        size="sm"
                                                    >
                                                        {ingredient.certificates} Cert
                                                        {ingredient.certificates !== 1 ? "s" : ""}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-earth-600 mb-3">
                                                <span>Origin: {ingredient.origin}</span>
                                                <span>Available: {ingredient.quantity}</span>
                                            </div>

                                            {/* Certificate Status Warning */}
                                            {ingredient.certificateStatus === "expiring" && (
                                                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 text-amber-600" />
                                                        <p className="text-xs text-amber-800">
                                                            Some certificates expiring soon
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quantity Input for Selected */}
                                            {selected && (
                                                <div
                                                    className="mt-3 pt-3 border-t border-primary-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <label className="block text-sm font-medium text-earth-900 mb-2">
                                                        Quantity to Use
                                                    </label>
                                                    <div className="flex gap-3">
                                                        <Input
                                                            type="number"
                                                            placeholder="10"
                                                            value={quantities[ingredient.id] || "10"}
                                                            onChange={(e) =>
                                                                handleQuantityChange(ingredient.id, e.target.value)
                                                            }
                                                            className="flex-1"
                                                        />
                                                        <select className="px-4 py-2 border-2 border-secondary-300 rounded-xl bg-white focus:border-primary-500 focus:outline-none">
                                                            <option>ml</option>
                                                            <option>L</option>
                                                            <option>g</option>
                                                            <option>kg</option>
                                                        </select>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggle(ingredient)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredIngredients.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-earth-600">No ingredients found</p>
                    </div>
                )}
            </div>
        </div>
    );
}