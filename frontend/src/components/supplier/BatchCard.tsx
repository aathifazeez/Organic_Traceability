"use client";

import { Package, Calendar, MapPin, FileCheck, Edit2, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

interface BatchCardProps {
    batch: {
        id: string;
        name: string;
        batchNumber: string;
        quantity: string;
        unit: string;
        origin: string;
        createdDate: string;
        expiryDate: string;
        status: "active" | "pending" | "expired";
        certificateCount: number;
        certificateStatus: "valid" | "expiring" | "expired";
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function BatchCard({ batch, onEdit, onDelete }: BatchCardProps) {
    const statusConfig = {
        active: { color: "success", label: "Active" },
        pending: { color: "warning", label: "Pending" },
        expired: { color: "danger", label: "Expired" },
    };

    const certStatusConfig = {
        valid: { color: "success", label: "All Valid" },
        expiring: { color: "warning", label: "Expiring Soon" },
        expired: { color: "danger", label: "Expired" },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300 transition-all p-6 shadow-organic"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-earth-900 mb-1">
                            {batch.name}
                        </h3>
                        <p className="text-sm text-earth-600 font-mono">
                            {batch.batchNumber}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant={statusConfig[batch.status].color as any}>
                        {statusConfig[batch.status].label}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-earth-600 mb-1">Quantity</p>
                    <p className="font-semibold text-earth-900">
                        {batch.quantity} {batch.unit}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-earth-600 mb-1">Origin</p>
                    <p className="font-semibold text-earth-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {batch.origin}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-earth-600 mb-1">Created</p>
                    <p className="font-semibold text-earth-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(batch.createdDate).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-earth-600 mb-1">Certificates</p>
                    <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary-600" />
                        <span className="font-semibold text-earth-900">
                            {batch.certificateCount}
                        </span>
                        <Badge variant={certStatusConfig[batch.certificateStatus].color as any} size="sm">
                            {certStatusConfig[batch.certificateStatus].label}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-secondary-200 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    leftIcon={<Edit2 className="w-4 h-4" />}
                    onClick={() => onEdit(batch.id)}
                >
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(batch.id)}
                >
                    <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
            </div>
        </motion.div>
    );
}