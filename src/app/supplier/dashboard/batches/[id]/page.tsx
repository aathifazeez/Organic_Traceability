"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Package,
    Calendar,
    MapPin,
    FileText,
    Edit2,
    Trash2,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2,
    Link2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { apiRequest } from "@/lib/auth";

export default function BatchDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;

    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Edit form state
    const [editData, setEditData] = useState({ ingredientName: "", quantity: "", origin: "" });
    const [saving, setSaving] = useState(false);

    // Certificate assignment state
    const [availableCerts, setAvailableCerts] = useState<any[]>([]);
    const [loadingCerts, setLoadingCerts] = useState(false);
    const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
    const [assigning, setAssigning] = useState(false);
    const [removingCertId, setRemovingCertId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const res = await apiRequest(`/batches/${id}`);
                if (res.success && res.data?.batch) {
                    const b = res.data.batch;
                    setBatch(b);
                    setEditData({
                        ingredientName: b.ingredientName || "",
                        quantity: b.quantity?.value?.toString() || "",
                        origin: b.origin?.country || "",
                    });
                } else {
                    setNotFound(true);
                }
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBatch();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this batch?")) return;
        try {
            setDeleting(true);
            const res = await apiRequest(`/batches/${id}`, { method: "DELETE" });
            if (res.success) {
                router.push("/supplier/dashboard/batches");
            } else {
                alert(res.message || "Failed to delete batch");
            }
        } catch {
            alert("Failed to delete batch. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        try {
            setSaving(true);
            const res = await apiRequest(`/batches/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ingredientName: editData.ingredientName,
                    quantity: { value: parseFloat(editData.quantity), unit: batch.quantity?.unit },
                    origin: { country: editData.origin },
                }),
            });
            if (res.success) {
                setBatch(res.data.batch);
                setIsEditModalOpen(false);
            } else {
                alert(res.message || "Failed to update batch");
            }
        } catch {
            alert("Failed to update batch. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const openAssignModal = async () => {
        setIsAssignModalOpen(true);
        setLoadingCerts(true);
        setSelectedCertIds([]);
        try {
            const res = await apiRequest("/certificates?limit=50");
            if (res.success) setAvailableCerts(res.data || []);
        } catch { /* ignore */ }
        finally { setLoadingCerts(false); }
    };

    const toggleCert = (certId: string) => {
        setSelectedCertIds((prev) =>
            prev.includes(certId) ? prev.filter((c) => c !== certId) : [...prev, certId]
        );
    };

    const handleAssignCerts = async () => {
        if (selectedCertIds.length === 0) return;
        setAssigning(true);
        try {
            for (const certId of selectedCertIds) {
                const res = await apiRequest(`/batches/${id}/certificates`, {
                    method: "PATCH",
                    body: JSON.stringify({ certificateId: certId }),
                });
                if (res.success && res.data?.batch) setBatch(res.data.batch);
            }
            setIsAssignModalOpen(false);
        } catch {
            alert("Failed to assign some certificates.");
        } finally {
            setAssigning(false);
        }
    };

    const handleRemoveCert = async (certId: string) => {
        if (!confirm("Remove this certificate from the batch?")) return;
        setRemovingCertId(certId);
        try {
            const res = await apiRequest(`/batches/${id}/certificates/${certId}`, { method: "DELETE" });
            if (res.success) {
                setBatch((prev: any) => ({
                    ...prev,
                    certificates: prev.certificates.filter((c: any) =>
                        (c._id || c) !== certId
                    ),
                }));
            }
        } catch {
            alert("Failed to remove certificate.");
        } finally {
            setRemovingCertId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-cream">
                <SupplierSidebar />
                <main className="flex-1 overflow-auto flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                </main>
            </div>
        );
    }

    if (notFound || !batch) {
        return (
            <div className="flex min-h-screen bg-gradient-cream">
                <SupplierSidebar />
                <main className="flex-1 overflow-auto flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-earth-900 mb-4">Batch Not Found</h2>
                        <Link href="/supplier/dashboard/batches">
                            <Button>Back to Batches</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const certificates: any[] = batch.certificates || [];
    const usedInProducts: any[] = batch.usedInProducts || [];
    const quantityUsedTotal = usedInProducts.reduce((acc: number, u: any) => acc + (u.quantityUsed?.value || 0), 0);

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <SupplierSidebar />
            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    <Link href="/supplier/dashboard/batches">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-5 h-5" />} className="mb-6">
                            Back to Batches
                        </Button>
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="font-serif font-bold text-4xl text-earth-900">{batch.ingredientName}</h1>
                                    <Badge variant={batch.status === "active" ? "success" : "warning"}>{batch.status}</Badge>
                                </div>
                                <p className="text-earth-600 font-mono">Batch Number: {batch.batchNumber}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" leftIcon={<Edit2 className="w-5 h-5" />} onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                                <Button variant="outline" leftIcon={<Trash2 className="w-5 h-5" />} onClick={handleDelete} disabled={deleting}>
                                    {deleting ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Batch Information */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">Batch Information</h2>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Quantity</p>
                                            <p className="text-lg font-semibold text-earth-900">{batch.quantity?.value} {batch.quantity?.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Remaining</p>
                                            <p className="text-lg font-semibold text-primary-600">{batch.quantityRemaining?.value} {batch.quantityRemaining?.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Origin</p>
                                            <p className="text-lg font-semibold text-earth-900 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-primary-600" />
                                                {batch.origin?.country}{batch.origin?.region ? `, ${batch.origin.region}` : ""}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Supplier</p>
                                            <p className="text-lg font-semibold text-earth-900">{batch.supplier?.companyName || batch.supplier?.name || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Created Date</p>
                                            <p className="text-lg font-semibold text-earth-900 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary-600" />
                                                {new Date(batch.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-earth-600 mb-1">Expiry Date</p>
                                            <p className="text-lg font-semibold text-earth-900 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary-600" />
                                                {new Date(batch.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {batch.description && (
                                        <div className="pt-6 border-t border-secondary-200">
                                            <p className="text-sm text-earth-600 mb-2">Description</p>
                                            <p className="text-earth-700 leading-relaxed">{batch.description}</p>
                                        </div>
                                    )}
                                    {batch.processingMethod && (
                                        <div className="pt-6 border-t border-secondary-200 mt-6">
                                            <p className="text-sm text-earth-600 mb-2">Processing Method</p>
                                            <p className="text-earth-700">{batch.processingMethod}</p>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>

                            {/* Certificates */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900">
                                            Certificates ({certificates.length})
                                        </h2>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            leftIcon={<Link2 className="w-4 h-4" />}
                                            onClick={openAssignModal}
                                        >
                                            Assign Certificate
                                        </Button>
                                    </div>
                                    {certificates.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-secondary-300 rounded-xl">
                                            <FileText className="w-12 h-12 text-earth-400 mx-auto mb-3" />
                                            <p className="text-earth-600 mb-3">No certificates attached to this batch.</p>
                                            <Button size="sm" variant="outline" leftIcon={<Link2 className="w-4 h-4" />} onClick={openAssignModal}>
                                                Assign a Certificate
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {certificates.map((cert: any) => {
                                                const certId = cert._id || cert;
                                                const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                                                return (
                                                    <div key={certId} className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 transition-colors">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                                    <FileText className="w-5 h-5 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-earth-900 mb-1">{cert.certificateName}</h3>
                                                                    <p className="text-sm text-earth-600">Issued by: {cert.issuingAuthority || cert.issuingBody}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={isExpired ? "danger" : "success"}>
                                                                    {isExpired ? <AlertCircle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                                                                    {isExpired ? "Expired" : "Valid"}
                                                                </Badge>
                                                                <button
                                                                    onClick={() => handleRemoveCert(certId)}
                                                                    disabled={removingCertId === certId}
                                                                    className="p-1 text-earth-400 hover:text-red-500 transition-colors"
                                                                    title="Remove"
                                                                >
                                                                    {removingCertId === certId
                                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                                        : <X className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs text-earth-600">Issue Date</p>
                                                                <p className="text-sm font-medium text-earth-900">{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "—"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-earth-600">Expiry Date</p>
                                                                <p className="text-sm font-medium text-earth-900">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "—"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Card>
                            </motion.div>

                            {/* Usage in Products */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">Used in Products</h2>
                                    {usedInProducts.length > 0 ? (
                                        <div className="space-y-4">
                                            {usedInProducts.map((usage: any, index: number) => (
                                                <div key={index} className="p-4 bg-secondary-50 rounded-xl">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-earth-900">{usage.productBatch?.productName || "Product"}</h3>
                                                            <p className="text-sm text-earth-600">{usage.productBatch?.batchNumber}</p>
                                                        </div>
                                                        <Badge variant="info">{usage.quantityUsed?.value} {usage.quantityUsed?.unit}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="w-12 h-12 text-earth-400 mx-auto mb-3" />
                                            <p className="text-earth-600">This batch hasn't been used in any products yet</p>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="sticky top-24 space-y-6">
                                <Card padding="lg">
                                    <h3 className="font-semibold text-lg text-earth-900 mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">Certificates</span>
                                            <span className="font-bold text-earth-900">{certificates.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">Used in Products</span>
                                            <span className="font-bold text-earth-900">{usedInProducts.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">Original Quantity</span>
                                            <span className="font-bold text-earth-900">{batch.quantity?.value} {batch.quantity?.unit}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-earth-600">Remaining</span>
                                            <span className="font-bold text-primary-600">{batch.quantityRemaining?.value} {batch.quantityRemaining?.unit}</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card padding="lg" className={certificates.length > 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
                                    <div className="flex items-start gap-3">
                                        {certificates.length > 0 ? (
                                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                        )}
                                        <div>
                                            <h3 className={`font-semibold mb-1 ${certificates.length > 0 ? "text-green-900" : "text-amber-900"}`}>
                                                {certificates.length > 0 ? "Certified Batch" : "No Certificates"}
                                            </h3>
                                            <p className={`text-sm ${certificates.length > 0 ? "text-green-700" : "text-amber-700"}`}>
                                                {certificates.length > 0 ? "Organic certifications are attached" : "Upload certificates to verify this batch"}
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
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Batch" size="lg">
                <div className="space-y-4">
                    <Input
                        label="Ingredient Name"
                        value={editData.ingredientName}
                        onChange={(e) => setEditData({ ...editData, ingredientName: e.target.value })}
                    />
                    <Input
                        label="Quantity"
                        type="number"
                        value={editData.quantity}
                        onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                    />
                    <Input
                        label="Origin Country"
                        value={editData.origin}
                        onChange={(e) => setEditData({ ...editData, origin: e.target.value })}
                    />
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleSaveEdit} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
