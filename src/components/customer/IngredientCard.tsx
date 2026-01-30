"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, AlertCircle, Calendar } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface IngredientCardProps {
    ingredient: {
        id: string;
        name: string;
        batchNumber: string;
        supplier: string;
        origin: string;
        quantity: string;
        certifications: {
            name: string;
            issuedBy: string;
            expiryDate: string;
            status: "valid" | "expiring" | "expired";
        }[];
    };
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <Card hover padding="lg">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-earth-900 mb-1">
                            {ingredient.name}
                        </h3>
                        <p className="text-sm text-earth-600">
                            Batch: {ingredient.batchNumber}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-earth-600">Supplier:</span>
                        <span className="font-medium text-earth-900">
                            {ingredient.supplier}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-earth-600">Origin:</span>
                        <span className="font-medium text-earth-900">
                            {ingredient.origin}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-earth-600">Quantity:</span>
                        <span className="font-medium text-earth-900">
                            {ingredient.quantity}
                        </span>
                    </div>
                </div>

                {/* Certifications */}
                <div className="pt-4 border-t border-secondary-200">
                    <p className="text-sm font-medium text-earth-900 mb-3">
                        Certifications:
                    </p>
                    <div className="space-y-2">
                        {ingredient.certifications.map((cert, index) => {
                            const statusConfig = {
                                valid: {
                                    color: "success",
                                    icon: ShieldCheck,
                                    text: "Valid",
                                },
                                expiring: {
                                    color: "warning",
                                    icon: AlertCircle,
                                    text: "Expiring Soon",
                                },
                                expired: {
                                    color: "danger",
                                    icon: AlertCircle,
                                    text: "Expired",
                                },
                            };

                            const config = statusConfig[cert.status];
                            const StatusIcon = config.icon;

                            return (
                                <div
                                    key={index}
                                    className="p-3 bg-secondary-50 rounded-lg border border-secondary-200"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-medium text-earth-900 text-sm">
                                            {cert.name}
                                        </p>
                                        <Badge variant={config.color as any} size="sm">
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {config.text}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-earth-600">
                                        Issued by: {cert.issuedBy}
                                    </p>
                                    <p className="text-xs text-earth-600 flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}