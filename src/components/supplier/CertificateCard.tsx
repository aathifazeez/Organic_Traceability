"use client";

import { useState } from "react";
import {
    FileText,
    Calendar,
    Building2,
    Download,
    Eye,
    Trash2,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { getCertificateStatus } from "@/lib/utils";

interface CertificateCardProps {
    certificate: {
        id: string;
        name: string;
        fileUrl: string;
        fileName: string;
        issuedBy: string;
        issuedDate: string;
        expiryDate: string;
        assignedBatches: string[];
        fileSize: string;
    };
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

export default function CertificateCard({
    certificate,
    onDelete,
    onView,
}: CertificateCardProps) {
    const status = getCertificateStatus(certificate.expiryDate);
    const [isHovered, setIsHovered] = useState(false);

    const StatusIcon = status.status === "expired" ? AlertCircle : CheckCircle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300 transition-all p-6 shadow-organic"
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${status.status === "expired"
                            ? "bg-red-100"
                            : status.status === "expiring"
                                ? "bg-amber-100"
                                : "bg-green-100"
                        }`}
                >
                    <FileText
                        className={`w-6 h-6 ${status.status === "expired"
                                ? "text-red-600"
                                : status.status === "expiring"
                                    ? "text-amber-600"
                                    : "text-green-600"
                            }`}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-earth-900 mb-1 truncate">
                        {certificate.name}
                    </h3>
                    <p className="text-sm text-earth-600 truncate">{certificate.fileName}</p>
                </div>
                <Badge
                    variant={
                        status.status === "expired"
                            ? "danger"
                            : status.status === "expiring"
                                ? "warning"
                                : "success"
                    }
                >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                </Badge>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-earth-600" />
                    <span className="text-earth-600">Issued by:</span>
                    <span className="font-medium text-earth-900">
                        {certificate.issuedBy}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-earth-600" />
                        <span className="text-earth-600">Issued:</span>
                        <span className="font-medium text-earth-900">
                            {new Date(certificate.issuedDate).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-earth-600">Expires:</span>
                        <span
                            className={`font-semibold ${status.status === "expired"
                                    ? "text-red-600"
                                    : status.status === "expiring"
                                        ? "text-amber-600"
                                        : "text-green-600"
                                }`}
                        >
                            {new Date(certificate.expiryDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="p-3 bg-secondary-50 rounded-lg">
                    <p className="text-xs text-earth-600 mb-1">Assigned to Batches</p>
                    <div className="flex flex-wrap gap-2">
                        {certificate.assignedBatches.length > 0 ? (
                            certificate.assignedBatches.map((batch, index) => (
                                <Badge key={index} variant="primary" size="sm">
                                    {batch}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-earth-600 italic">Not assigned yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-secondary-200 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={() => onView(certificate.id)}
                >
                    View
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                >
                    Download
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(certificate.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
            </div>
        </motion.div>
    );
}