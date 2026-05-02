"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    Search,
    FileText,
    AlertCircle,
    CheckCircle,
    Calendar,
    Loader2,
    X,
    Image as ImageIcon,
} from "lucide-react";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import CertificateCard from "@/components/supplier/CertificateCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { apiRequest, getAuthToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/_/backend/api/v1";
const SERVER_URL = (process.env.NEXT_PUBLIC_API_URL || "/_/backend/api/v1").replace("/api/v1", "");

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        name: "",
        certificateType: "",
        issuedBy: "",
        issuedDate: "",
        expiryDate: "",
    });

    // Fetch certificates from backend API
    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiRequest("/certificates?limit=50");
            if (res.success) {
                setCertificates(res.data || []);
            } else {
                console.error("Failed to fetch certificates:", res.message);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certificate?")) return;

        try {
            setDeleting(id);
            const res = await apiRequest(`/certificates/${id}`, {
                method: "DELETE",
            });

            if (res.success) {
                setCertificates(certificates.filter((c) => (c._id || c.id) !== id));
            } else {
                alert(res.message || "Failed to delete certificate");
            }
        } catch (error) {
            console.error("Error deleting certificate:", error);
            alert("Failed to delete certificate. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    const handleView = (id: string) => {
        const cert = certificates.find((c) => (c._id || c.id) === id);
        const url = cert?.documentUrl || cert?.fileUrl;
        if (url) {
            window.open(url.startsWith("http") ? url : `${SERVER_URL}${url}`, "_blank");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        // Generate preview for image files
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (ev) => setFilePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadForm.name) return;

        try {
            setUploading(true);

            // Use FormData for file upload — field name must be "certificate" (multer config)
            const formData = new FormData();
            formData.append("certificate", selectedFile);
            formData.append("certificateName", uploadForm.name);
            formData.append("certificateType", uploadForm.certificateType || "USDA Organic");
            formData.append("issuingAuthority", uploadForm.issuedBy);
            formData.append("issueDate", uploadForm.issuedDate);
            formData.append("expiryDate", uploadForm.expiryDate);

            const token = getAuthToken();
            const res = await fetch(`${API_URL}/certificates`, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                await fetchCertificates();
                setIsUploadModalOpen(false);
                setSelectedFile(null);
                setFilePreview(null);
                setUploadForm({
                    name: "",
                    certificateType: "",
                    issuedBy: "",
                    issuedDate: "",
                    expiryDate: "",
                });
            } else {
                alert(data.message || "Failed to upload certificate");
            }
        } catch (error) {
            console.error("Error uploading certificate:", error);
            alert("Failed to upload certificate. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // Calculate statistics from real data
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

    // Map backend data to the format CertificateCard expects
    const mappedCertificates = certificates.map((cert) => {
        const rawUrl = cert.documentUrl || cert.fileUrl || "";
        const fullUrl = rawUrl && !rawUrl.startsWith("http") ? `${SERVER_URL}${rawUrl}` : rawUrl;
        return {
            id: cert._id || cert.id,
            name: cert.certificateName || cert.name,
            fileUrl: fullUrl,
            fileName: cert.documentName || cert.fileName || cert.certificateName || "",
            documentType: cert.documentType || cert.fileType || "",
            issuedBy: cert.issuingAuthority || cert.issuingBody || cert.issuedBy || "",
            issuedDate: cert.issueDate
                ? new Date(cert.issueDate).toISOString().split("T")[0]
                : "",
            expiryDate: cert.expiryDate
                ? new Date(cert.expiryDate).toISOString().split("T")[0]
                : "",
            assignedBatches: cert.batches?.map((b: any) => b.batchNumber || b) || [],
            fileSize: cert.documentSize
                ? `${(cert.documentSize / 1024).toFixed(0)} KB`
                : cert.fileSize || "N/A",
        };
    });

    const filteredCertificates = mappedCertificates.filter((cert) => {
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

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-earth-600 text-lg">Loading certificates...</p>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </main>

            {/* Upload Certificate Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                    setFilePreview(null);
                }}
                title="Upload Certificate"
                size="lg"
            >
                <div className="space-y-6">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            Certificate File
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.heic,.heif,.svg"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="certificate-upload"
                        />
                        <label htmlFor="certificate-upload" className="cursor-pointer block">
                            <div className="border-2 border-dashed border-secondary-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                                {selectedFile ? (
                                    <div className="space-y-2">
                                        {filePreview ? (
                                            /* Image preview */
                                            <img
                                                src={filePreview}
                                                alt="Certificate preview"
                                                className="max-h-40 mx-auto rounded-lg object-contain border border-secondary-200"
                                            />
                                        ) : (
                                            /* PDF icon */
                                            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
                                                <FileText className="w-8 h-8 text-red-600" />
                                            </div>
                                        )}
                                        <p className="font-medium text-earth-900 text-sm">{selectedFile.name}</p>
                                        <p className="text-xs text-earth-500">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <p className="text-xs text-primary-600 underline">Click to change file</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <Upload className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                                        <p className="font-medium text-earth-900 mb-1">
                                            Click to upload certificate
                                        </p>
                                        <p className="text-xs text-earth-500">
                                            PDF, JPG, PNG, WEBP, HEIC, TIFF, GIF, BMP, SVG — up to 10 MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </label>
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

                    <Select
                        label="Certificate Type"
                        options={[
                            { value: "USDA Organic", label: "USDA Organic" },
                            { value: "EU Organic", label: "EU Organic" },
                            { value: "Ecocert", label: "Ecocert" },
                            { value: "Fair Trade", label: "Fair Trade" },
                            { value: "Cosmos Organic", label: "Cosmos Organic" },
                            { value: "Non-GMO Project", label: "Non-GMO Project" },
                            { value: "Leaping Bunny", label: "Leaping Bunny" },
                            { value: "Vegan Society", label: "Vegan Society" },
                            { value: "Soil Association", label: "Soil Association" },
                        ]}
                        value={uploadForm.certificateType}
                        onChange={(e) =>
                            setUploadForm({ ...uploadForm, certificateType: e.target.value })
                        }
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
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleUpload}
                            disabled={!selectedFile || !uploadForm.name || uploading}
                        >
                            {uploading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </span>
                            ) : (
                                "Upload Certificate"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}