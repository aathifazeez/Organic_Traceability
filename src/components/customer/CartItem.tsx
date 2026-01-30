"use client";

import { useState } from "react";
import { Minus, Plus, X, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

interface CartItemProps {
    item: {
        id: string;
        name: string;
        variant: string;
        price: number;
        originalPrice?: number;
        quantity: number;
        image: string;
        inStock: boolean;
        skinType: string;
    };
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItem({
    item,
    onUpdateQuantity,
    onRemove,
}: CartItemProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveForLater = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onRemove(item.id);
        }, 500);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="p-6 bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-200 transition-colors"
        >
            <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary-100">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                {item.name}
                            </h3>
                            <p className="text-sm text-earth-600 mb-2">{item.variant}</p>
                            <Badge variant="info" size="sm">
                                For {item.skinType} Skin
                            </Badge>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-earth-600 hover:text-red-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            {/* Price */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-earth-900">
                                    ${item.price}
                                </span>
                                {item.originalPrice && (
                                    <span className="text-sm text-earth-500 line-through">
                                        ${item.originalPrice}
                                    </span>
                                )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-secondary-100 rounded-full">
                                    <button
                                        onClick={() =>
                                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                                        }
                                        className="p-2 hover:bg-secondary-200 rounded-full transition-colors"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4 text-earth-700" />
                                    </button>
                                    <span className="px-4 font-semibold text-earth-900 min-w-[40px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="p-2 hover:bg-secondary-200 rounded-full transition-colors"
                                        disabled={!item.inStock}
                                    >
                                        <Plus className="w-4 h-4 text-earth-700" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSaveForLater}
                                    className="flex items-center gap-2 text-sm text-earth-600 hover:text-primary-600 transition-colors"
                                    disabled={isSaving}
                                >
                                    <Heart className="w-4 h-4" />
                                    {isSaving ? "Saving..." : "Save for later"}
                                </button>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                            <p className="text-sm text-earth-600 mb-1">Subtotal</p>
                            <p className="text-2xl font-bold text-primary-600">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Stock Status */}
                    {!item.inStock && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">Currently out of stock</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}