"use client";

import { Check, X, Eye, Calendar, FileText, Building2, Mail } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

interface ApprovalCardProps {
    approval: {
        id: string;
        name: string;
        email: string;
        role: string;
        requestedDate: string;
        companyInfo: string;
        documents: number;
        phone?: string;
        address?: string;
    };
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

export default function ApprovalCard({
    approval,
    onApprove,
    onReject,
    onViewDetails,
}: ApprovalCardProps) {
    const roleConfig = {
        supplier: {
            variant: "success" as const,
            label: "Supplier",
            icon: Building2,
        },
        manufacturer: {
            variant: "primary" as const,
            label: "Manufacturer",
            icon: Building2,
        },
        customer: {
            variant: "info" as const,
            label: "Customer",
            icon: Building2,
        },
    };

    const config = roleConfig[approval.role as keyof typeof roleConfig] || {
        variant: "info" as const,
        label: approval.role,
        icon: Building2,
    };

    const RoleIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card padding="lg" className="hover:border-primary-300 transition-all">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <RoleIcon className="w-8 h-8 text-amber-600" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                            <div className="flex-1">
                                <h3 className="font-serif font-bold text-2xl text-earth-900 mb-2">
                                    {approval.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <div className="flex items-center gap-2 text-earth-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{approval.email}</span>
                                    </div>
                                    {approval.phone && (
                                        <div className="flex items-center gap-2 text-earth-600">
                                            <span className="text-sm">{approval.phone}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-earth-700">{approval.companyInfo}</p>
                            </div>
                            <Badge variant={config.variant} size="lg">
                                {config.label}
                            </Badge>
                        </div>

                        {/* Info Grid */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-primary-600" />
                                    <p className="text-xs font-medium text-earth-600">
                                        Requested Date
                                    </p>
                                </div>
                                <p className="font-semibold text-earth-900">
                                    {new Date(approval.requestedDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-xs text-earth-600 mt-1">
                                    {Math.floor(
                                        (Date.now() - new Date(approval.requestedDate).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )}{" "}
                                    days ago
                                </p>
                            </div>

                            <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <p className="text-xs font-medium text-earth-600">
                                        Documents Submitted
                                    </p>
                                </div>
                                <p className="font-semibold text-earth-900">
                                    {approval.documents} files
                                </p>
                                <p className="text-xs text-earth-600 mt-1">
                                    Ready for review
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Button
                                size="md"
                                leftIcon={<Check className="w-5 h-5" />}
                                onClick={() => onApprove(approval.id)}
                                className="flex-1 sm:flex-none"
                            >
                                Approve
                            </Button>
                            <Button
                                size="md"
                                variant="outline"
                                leftIcon={<X className="w-5 h-5" />}
                                onClick={() => onReject(approval.id)}
                                className="flex-1 sm:flex-none"
                            >
                                Reject
                            </Button>
                            {onViewDetails && (
                                <Button
                                    size="md"
                                    variant="ghost"
                                    leftIcon={<Eye className="w-5 h-5" />}
                                    onClick={() => onViewDetails(approval.id)}
                                    className="flex-1 sm:flex-none"
                                >
                                    View Details
                                </Button>
                            )}
                        </div>

                        {/* Warning Message for Pending Approvals */}
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-800">
                                ⚠️ <strong>Action Required:</strong> This {config.label.toLowerCase()}
                                registration has been pending for{" "}
                                {Math.floor(
                                    (Date.now() - new Date(approval.requestedDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days. Please review and take action.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}