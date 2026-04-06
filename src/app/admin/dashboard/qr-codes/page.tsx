"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Search, Download, CheckCircle, AlertCircle } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import QRCodeGenerator from "@/components/admin/QRCodeGenerator";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

// Mock product batches with QR codes
const productBatches = [
    {
        id: "1",
        name: "Organic Rose Face Cream",
        batchNumber: "PROD-2024-001",
        qrCode: "QR-ROSE-CREAM-001",
        qrGenerated: true,
        generatedDate: "2024-01-28",
        scans: 145,
    },
    {
        id: "2",
        name: "Vitamin C Brightening Serum",
        batchNumber: "PROD-2024-002",
        qrCode: "QR-VIT-C-SERUM-002",
        qrGenerated: true,
        generatedDate: "2024-01-26",
        scans: 98,
    },
    {
        id: "3",
        name: "Hydrating Face Mask",
        batchNumber: "PROD-2024-003",
        qrCode: "QR-FACE-MASK-003",
        qrGenerated: false,
        generatedDate: null,
        scans: 0,
    },
    {
        id: "4",
        name: "Anti-Aging Night Cream",
        batchNumber: "PROD-2024-004",
        qrCode: "QR-NIGHT-CREAM-004",
        qrGenerated: true,
        generatedDate: "2024-01-24",
        scans: 213,
    },
    {
        id: "5",
        name: "Gentle Cleansing Foam",
        batchNumber: "PROD-2024-005",
        qrCode: "QR-CLEANSER-005",
        qrGenerated: true,
        generatedDate: "2024-01-22",
        scans: 167,
    },
];

export default function QRCodesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const filteredProducts = productBatches.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewQR = (product: any) => {
        setSelectedProduct(product);
        setIsQRModalOpen(true);
    };

    const handleGenerateQR = (product: any) => {
        // Generate QR code logic
        console.log("Generate QR for:", product);
        setSelectedProduct({ ...product, qrGenerated: true });
        setIsQRModalOpen(true);
    };

    const stats = {
        total: productBatches.length,
        generated: productBatches.filter((p) => p.qrGenerated).length,
        pending: productBatches.filter((p) => !p.qrGenerated).length,
        totalScans: productBatches.reduce((sum, p) => sum + p.scans, 0),
    };

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                            QR Code Management
                        </h1>
                        <p className="text-earth-600">
                            Generate and manage QR codes for product traceability
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <QrCode className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.total}
                                    </p>
                                    <p className="text-sm text-earth-600">Total Products</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.generated}
                                    </p>
                                    <p className="text-sm text-earth-600">QR Generated</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.pending}
                                    </p>
                                    <p className="text-sm text-earth-600">Pending</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <QrCode className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.totalScans}
                                    </p>
                                    <p className="text-sm text-earth-600">Total Scans</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card padding="md" className="mb-8">
                        <Input
                            placeholder="Search products..."
                            leftIcon={<Search className="w-5 h-5" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Card>

                    {/* Products Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card hover padding="lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                                <QrCode className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-earth-900 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-earth-600">
                                                    {product.batchNumber}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={product.qrGenerated ? "success" : "warning"}
                                        >
                                            {product.qrGenerated ? "Generated" : "Pending"}
                                        </Badge>
                                    </div>

                                    {product.qrGenerated ? (
                                        <>
                                            <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-earth-600">
                                                        QR Code:
                                                    </span>
                                                    <code className="text-sm font-mono text-primary-700">
                                                        {product.qrCode}
                                                    </code>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-earth-600">
                                                        Generated:
                                                    </span>
                                                    <span className="text-sm font-medium text-earth-900">
                                                        {new Date(
                                                            product.generatedDate!
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-earth-600">
                                                        Total Scans:
                                                    </span>
                                                    <span className="text-sm font-bold text-primary-600">
                                                        {product.scans}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleViewQR(product)}
                                                >
                                                    View QR
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    leftIcon={<Download className="w-4 h-4" />}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-amber-800">
                                                        QR code not generated yet. Generate one to enable
                                                        product verification.
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleGenerateQR(product)}
                                            >
                                                Generate QR Code
                                            </Button>
                                        </>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <QrCode className="w-16 h-16 text-earth-400 mx-auto mb-4" />
                            <p className="text-earth-600">No products found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* QR Code Modal */}
            <Modal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                title="QR Code"
                size="md"
            >
                {selectedProduct && <QRCodeGenerator productBatch={selectedProduct} />}
            </Modal>
        </div>
    );
}