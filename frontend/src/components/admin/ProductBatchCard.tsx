"use client";

import { ShoppingBag, Eye, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

interface ProductBatchCardProps {
    product: {
        id: string;
        name: string;
        batchNumber: string;
        price: number;
        stock: number;
        category: string;
        skinType: string;
        isListed: boolean;
        sales: number;
        image: string;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleListing: (id: string) => void;
}

export default function ProductBatchCard({
    product,
    onEdit,
    onDelete,
    onToggleListing,
}: ProductBatchCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300 transition-all overflow-hidden shadow-organic"
        >
            {/* Image */}
            <div className="aspect-square relative overflow-hidden bg-secondary-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <Badge variant={product.isListed ? "success" : "warning"}>
                        {product.isListed ? "Listed" : "Unlisted"}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="font-semibold text-lg text-earth-900 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-sm text-earth-600">{product.batchNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-earth-600 mb-1">Price</p>
                        <p className="font-bold text-xl text-primary-600">
                            ${product.price}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-earth-600 mb-1">Stock</p>
                        <p className="font-semibold text-earth-900">{product.stock} units</p>
                    </div>
                    <div>
                        <p className="text-xs text-earth-600 mb-1">Category</p>
                        <p className="font-medium text-earth-900 text-sm capitalize">
                            {product.category.replace("-", " ")}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-earth-600 mb-1">Sales</p>
                        <p className="font-semibold text-earth-900">{product.sales}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <Badge variant="info" size="sm">
                        For {product.skinType} Skin
                    </Badge>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit2 className="w-4 h-4" />}
                        onClick={() => onEdit(product.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant={product.isListed ? "outline" : "primary"}
                        size="sm"
                        leftIcon={
                            product.isListed ? (
                                <ToggleRight className="w-4 h-4" />
                            ) : (
                                <ToggleLeft className="w-4 h-4" />
                            )
                        }
                        onClick={() => onToggleListing(product.id)}
                    >
                        {product.isListed ? "Unlist" : "List"}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}