"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    Search,
    Filter,
    FileText,
    AlertCircle,
    CheckCircle,
    Calendar,
} from "lucide-react";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import CertificateCard from "@/components/supplier/CertificateCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

// Mock certificates data
const mockCertificates = [
    {
        id: "1",
        name: "USDA Organic Certificate",
        fileUrl: "/certificates/usda-organic.pdf",
        fileName: "USDA_Organic_2024.pdf",
        issuedBy: "USDA Organic Program",
        issuedDate: "2024-01-15",
        expiryDate: "2025-01-15",
        assignedBatches: ["ARG-2024-001", "RSH-2024-015"],
        fileSize: "2.4 MB",
    },
    {
        id: "2",
        name: "Ecocert Organic Certification",
        fileUrl: "/certificates/ecocert.pdf",
        fileName: "Ecocert_Certificate_2024.pdf",
        issuedBy: "Ecocert",
        issuedDate: "2024-01-10",
        expiryDate: "2024-02-28",
        assignedBatches: ["SHB-2024-008", "JOJ-2024-005"],
        fileSize: "1.8 MB",
    },
    {
        id: "3",
        name: "Fair Trade Certificate",
        fileUrl: "/certificates/fairtrade.pdf",
        fileName: "FairTrade_2024.pdf",
        issuedBy: "Fair Trade USA",
        issuedDate: "2023-12-20",
        expiryDate: "2024-12-20",
        assignedBatches: ["COC-2024-012"],
        fileSize: "3.1 MB",
    },
    {
        id: "4",
        name: "Cosmos Organic Standard",
        fileUrl: "/certificates/cosmos.pdf",
        fileName: "COSMOS_Organic_2024.pdf",
        issuedBy: "Cosmetics Organic Standard",
        issuedDate: "2024-01-05",
        expiryDate: "2025-06-30",
        assignedBatches: ["ARG-2024-001", "ALM-2024-003"],
        fileSize: "2.9 MB",
    },
    {
        id: "5",
        name: "Non-GMO Project Verification",
        fileUrl: "/certificates/non-gmo.pdf",
        fileName: "NonGMO_Verification_2024.pdf",
        issuedBy: "Non-GMO Project",
        issuedDate: "2023-11-15",
        expiryDate: "2024-11-15",
        assignedBatches: ["JOJ-2024-005", "ALM-2024-003"],
        fileSize: "1.5 MB",
    },
    {
        id: "6",
        name: "EU Organic Certification",
        fileUrl: "/certificates/eu-organic.pdf",
        fileName: "EU_Organic_2024.pdf",
        issuedBy: "European Commission",
        issuedDate: "2024-01-20",
        expiryDate: "2025-12-31",
        assignedBatches: [],
        fileSize: "2.2 MB",
    },
];

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState(mockCertificates);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        name: "",
        issuedBy: "",
        issuedDate: "",
        expiryDate: "",
        assignedBatches: [] as string[],
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this certificate?")) {
            setCertificates(certificates.filter((c) => c.id !== id));
        }
    };

    const handleView = (id: string) => {
        console.log("View certificate:", id);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        const newCert = {
            id: Date.now().toString(),
            ...uploadForm,
            fileUrl: `/certificates/${selectedFile.name}`,
            fileName: selectedFile.name,
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        };

        setCertificates([newCert, ...certificates]);
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setUploadForm({
            name: "",
            issuedBy: "",
            issuedDate: "",
            expiryDate: "",
            assignedBatches: [],
        });
    };

    // Calculate statistics
    const stats = {
        total: certificates.length,
        valid: certificates.filter(
            (c) => new Date(c.expiryDate) > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length,
        expiring: certificates.filter((c) => {
            const daysUntilExpiry = Math.ceil(
                (new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
        }).length,
        expired: certificates.filter((c) => new Date(c.expiryDate) < new Date()).length,
    };

    const filteredCertificates = certificates.filter((cert) => {
        const matchesSearch =
            cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === "all") return matchesSearch;

        const daysUntilExpiry = Math.ceil(
            (new Date(cert.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        if (statusFilter === "valid") return matchesSearch && daysUntilExpiry > 30;
        if (statusFilter === "expiring")
            return matchesSearch && daysUntilExpiry > 0 && daysUntilExpiry <= 30;
        if (statusFilter === "expired") return matchesSearch && daysUntilExpiry < 0;

        return matchesSearch;
    });

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <SupplierSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    Certificates
                                </h1>
                                <p className="text-earth-600">
                                    Manage organic certifications for your ingredients
                                </p>
                            </div>
                            <Button
                                leftIcon={<Upload className="w-5 h-5" />}
                                onClick={() => setIsUploadModalOpen(true)}
                            >
                                Upload Certificate
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <Card padding="md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-earth-900">
                                            {stats.total}
                                        </p>
                                        <p className="text-sm text-earth-600">Total</p>
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
                                            {stats.valid}
                                        </p>
                                        <p className="text-sm text-earth-600">Valid</p>
                                    </div>
                                </div>
                            </Card>

                            <Card padding="md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-earth-900">
                                            {stats.expiring}
                                        </p>
                                        <p className="text-sm text-earth-600">Expiring</p>
                                    </div>
                                </div>
                            </Card>

                            <Card padding="md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-earth-900">
                                            {stats.expired}
                                        </p>
                                        <p className="text-sm text-earth-600">Expired</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Filters */}
                        <Card padding="md">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search certificates..."
                                        leftIcon={<Search className="w-5 h-5" />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select
                                        options={[
                                            { value: "all", label: "All Certificates" },
                                            { value: "valid", label: "Valid" },
                                            { value: "expiring", label: "Expiring Soon" },
                                            { value: "expired", label: "Expired" },
                                        ]}
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Certificates Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCertificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CertificateCard
                                    certificate={cert}
                                    onDelete={handleDelete}
                                    onView={handleView}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {filteredCertificates.length === 0 && (
                        <div className="text-center py-16">
                            <FileText className="w-16 h-16 text-earth-400 mx-auto mb-4" />
                            <p className="text-earth-600">No certificates found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Upload Certificate Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload Certificate"
                size="lg"
            >
                <div className="space-y-6">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            Certificate File (PDF)
                        </label>
                        <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="certificate-upload"
                            />
                            <label
                                htmlFor="certificate-upload"
                                className="cursor-pointer block"
                            >
                                <Upload className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                                {selectedFile ? (
                                    <div>
                                        <p className="font-medium text-earth-900">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-sm text-earth-600">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-medium text-earth-900 mb-1">
                                            Click to upload certificate
                                        </p>
                                        <p className="text-sm text-earth-600">PDF files only</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <Input
                        label="Certificate Name"
                        placeholder="e.g., USDA Organic Certificate"
                        value={uploadForm.name}
                        onChange={(e) =>
                            setUploadForm({ ...uploadForm, name: e.target.value })
                        }
                        required
                    />

                    <Input
                        label="Issued By"
                        placeholder="e.g., USDA Organic Program"
                        value={uploadForm.issuedBy}
                        onChange={(e) =>
                            setUploadForm({ ...uploadForm, issuedBy: e.target.value })
                        }
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Issue Date"
                            value={uploadForm.issuedDate}
                            onChange={(e) =>
                                setUploadForm({ ...uploadForm, issuedDate: e.target.value })
                            }
                            required
                        />
                        <Input
                            type="date"
                            label="Expiry Date"
                            value={uploadForm.expiryDate}
                            onChange={(e) =>
                                setUploadForm({ ...uploadForm, expiryDate: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                        <p className="text-sm text-earth-700">
                            <strong>Note:</strong> You can assign this certificate to ingredient
                            batches after uploading.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsUploadModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleUpload}
                            disabled={!selectedFile || !uploadForm.name}
                        >
                            Upload Certificate
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}