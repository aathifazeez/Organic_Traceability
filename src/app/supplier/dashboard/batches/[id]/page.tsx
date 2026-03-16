"use client";

import { motion } from "framer-motion";
import {
    Package,
    Calendar,
    MapPin,
    FileText,
    Edit2,
    Trash2,
    Plus,
    ArrowLeft,
    Download,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { useState } from "react";

// Mock batch detail data
const batchDetail = {
    id: "1",
    name: "Organic Argan Oil",
    batchNumber: "ARG-2024-001",
    quantity: "500",
    unit: "L",
    origin: "Morocco",
    supplier: "Atlas Organic Oils",
    createdDate: "2024-01-25",
    expiryDate: "2026-01-25",
    status: "active",
    description:
        "Premium cold-pressed organic argan oil extracted from kernels of the argan tree. Rich in vitamin E, essential fatty acids, and antioxidants. Perfect for anti-aging skincare formulations.",
    processingMethod: "Cold-Pressed",
    storageConditions: "Store in cool, dark place at 15-25°C",
    certificates: [
        {
            id: "1",
            name: "USDA Organic Certificate",
            issuedBy: "USDA Organic Program",
            issuedDate: "2024-01-15",
            expiryDate: "2025-01-15",
            status: "valid",
            fileUrl: "/certificates/usda-organic.pdf",
        },
        {
            id: "2",
            name: "Ecocert Organic Certification",
            issuedBy: "Ecocert",
            issuedDate: "2024-01-10",
            expiryDate: "2025-06-30",
            status: "valid",
            fileUrl: "/certificates/ecocert.pdf",
        },
        {
            id: "3",
            name: "Fair Trade Certificate",
            issuedBy: "Fair Trade USA",
            issuedDate: "2023-12-20",
            expiryDate: "2024-12-20",
            status: "valid",
            fileUrl: "/certificates/fairtrade.pdf",
        },
    ],
    usedByManufacturers: [
        {
            id: "1",
            name: "PureGlow Organics",
            productName: "Organic Rose Face Cream",
            quantityUsed: "15L",
            date: "2024-01-28",
        },
        {
            id: "2",
            name: "Natural Beauty Co.",
            productName: "Anti-Aging Serum",
            quantityUsed: "10L",
            date: "2024-01-26",
        },
    ],
};

export default function BatchDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this batch?")) {
            router.push("/supplier/dashboard/batches");
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <SupplierSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Back Button */}
                    <Link href="/supplier/dashboard/batches">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                            className="mb-6"
                        >
                            Back to Batches
                        </Button>
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="font-serif font-bold text-4xl text-earth-900">
                                        {batchDetail.name}
                                    </h1>
                                    <Badge
                                        variant={
                                            batchDetail.status === "active" ? "success" : "warning"
                                        }
                                    >
                                        {batchDetail.status}
                                    </Badge>
                                </div>
                                <p className="text-earth-600 font-mono">
                                    Batch Number: {batchDetail.batchNumber}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    leftIcon={<Edit2 className="w-5 h-5" />}
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    leftIcon={<Trash2 className="w-5 h-5" />}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Batch Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Batch Information
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Quantity</p>
                                            <p className="text-lg font-semibold text-earth-900">
                                                {batchDetail.quantity} {batchDetail.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Origin</p>
                                            <p className="text-lg font-semibold text-earth-900 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-primary-600" />
                                                {batchDetail.origin}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Supplier</p>
                                            <p className="text-lg font-semibold text-earth-900">
                                                {batchDetail.supplier}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">
                                                Processing Method
                                            </p>
                                            <p className="text-lg font-semibold text-earth-900">
                                                {batchDetail.processingMethod}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Created Date</p>
                                            <p className="text-lg font-semibold text-earth-900 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary-600" />
                                                {new Date(batchDetail.createdDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Expiry Date</p>
                                            <p className="text-lg font-semibold text-earth-900 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary-600" />
                                                {new Date(batchDetail.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-secondary-200">
                                        <p className="text-sm text-earth-600 mb-2">Description</p>
                                        <p className="text-earth-700 leading-relaxed">
                                            {batchDetail.description}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-secondary-200 mt-6">
                                        <p className="text-sm text-earth-600 mb-2">
                                            Storage Conditions
                                        </p>
                                        <p className="text-earth-700">{batchDetail.storageConditions}</p>
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Certificates */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900">
                                            Certificates ({batchDetail.certificates.length})
                                        </h2>
                                        <Button
                                            size="sm"
                                            leftIcon={<Plus className="w-4 h-4" />}
                                            onClick={() => setIsAddCertModalOpen(true)}
                                        >
                                            Add Certificate
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {batchDetail.certificates.map((cert) => (
                                            <div
                                                key={cert.id}
                                                className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-earth-900 mb-1">
                                                                {cert.name}
                                                            </h3>
                                                            <p className="text-sm text-earth-600">
                                                                Issued by: {cert.issuedBy}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="success">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Valid
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <p className="text-xs text-earth-600">Issued Date</p>
                                                        <p className="text-sm font-medium text-earth-900">
                                                            {new Date(cert.issuedDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-earth-600">Expiry Date</p>
                                                        <p className="text-sm font-medium text-earth-900">
                                                            {new Date(cert.expiryDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-3 border-t border-secondary-200">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        leftIcon={<Download className="w-4 h-4" />}
                                                    >
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Usage History */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Usage by Manufacturers
                                    </h2>
                                    {batchDetail.usedByManufacturers.length > 0 ? (
                                        <div className="space-y-4">
                                            {batchDetail.usedByManufacturers.map((usage) => (
                                                <div
                                                    key={usage.id}
                                                    className="p-4 bg-secondary-50 rounded-xl"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-earth-900">
                                                                {usage.name}
                                                            </h3>
                                                            <p className="text-sm text-earth-600">
                                                                {usage.productName}
                                                            </p>
                                                        </div>
                                                        <Badge variant="info">{usage.quantityUsed}</Badge>
                                                    </div>
                                                    <p className="text-xs text-earth-600">
                                                        Used on: {new Date(usage.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="w-12 h-12 text-earth-400 mx-auto mb-3" />
                                            <p className="text-earth-600">
                                                This batch hasn't been used yet
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="sticky top-24 space-y-6"
                            >
                                {/* Quick Stats */}
                                <Card padding="lg">
                                    <h3 className="font-semibold text-lg text-earth-900 mb-4">
                                        Quick Stats
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">
                                                Certificates
                                            </span>
                                            <span className="font-bold text-earth-900">
                                                {batchDetail.certificates.length}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">Used By</span>
                                            <span className="font-bold text-earth-900">
                                                {batchDetail.usedByManufacturers.length} Manufacturers
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">
                                                Total Quantity Used
                                            </span>
                                            <span className="font-bold text-earth-900">
                                                {batchDetail.usedByManufacturers.reduce(
                                                    (acc, usage) => acc + parseInt(usage.quantityUsed),
                                                    0
                                                )}
                                                L
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">
                                                Remaining
                                            </span>
                                            <span className="font-bold text-primary-600">
                                                {parseInt(batchDetail.quantity) -
                                                    batchDetail.usedByManufacturers.reduce(
                                                        (acc, usage) => acc + parseInt(usage.quantityUsed),
                                                        0
                                                    )}
                                                L
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Compliance Status */}
                                <Card padding="lg" className="bg-green-50 border-green-200">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-green-900 mb-1">
                                                Fully Compliant
                                            </h3>
                                            <p className="text-sm text-green-700">
                                                All certificates are valid and up to date
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Batch"
                size="lg"
            >
                <div className="space-y-4">
                    <Input label="Batch Name" value={batchDetail.name} />
                    <Input label="Quantity" value={batchDetail.quantity} />
                    <Input label="Origin" value={batchDetail.origin} />
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="flex-1">Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}