"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Loader2, CheckCircle, FileText, Link2, ChevronRight } from "lucide-react";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import BatchCard from "@/components/supplier/BatchCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { apiRequest } from "@/lib/auth";

const EMPTY_FORM = {
    name: "",
    scientificName: "",
    quantity: "",
    unit: "kg",
    origin: "",
    region: "",
    description: "",
    processingMethod: "",
    qualityGrade: "Standard",
    expiryDate: "",
    unitPrice: "",
};

export default function BatchesPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal steps: null | "create" | "assign"
    const [modalStep, setModalStep] = useState<null | "create" | "assign">(null);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Created batch (needed for step 2)
    const [createdBatch, setCreatedBatch] = useState<any>(null);

    // Certificates available for assignment
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loadingCerts, setLoadingCerts] = useState(false);
    const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
    const [assigning, setAssigning] = useState(false);

    // Create form state
    const [newBatch, setNewBatch] = useState({ ...EMPTY_FORM });

    // Preview batch number format
    const previewBatchNo = `ING-${Date.now().toString().slice(-6)}-XXXX`;

    const fetchBatches = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set("limit", "50");
            params.set("sortBy", "createdAt");
            params.set("sortOrder", "desc");
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (searchQuery) params.set("search", searchQuery);

            const res = await apiRequest(`/batches?${params.toString()}`);
            if (res.success) setBatches(res.data || []);
        } catch (error) {
            console.error("Error fetching batches:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    // Load supplier's certificates for assignment step
    const fetchCertificates = async () => {
        setLoadingCerts(true);
        try {
            const res = await apiRequest("/certificates?limit=50");
            if (res.success) setCertificates(res.data || []);
        } catch { /* ignore */ }
        finally { setLoadingCerts(false); }
    };

    const handleEdit = (id: string) => {
        console.log("Edit batch:", id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this batch?")) return;
        try {
            setDeleting(id);
            const res = await apiRequest(`/batches/${id}`, { method: "DELETE" });
            if (res.success) {
                setBatches(batches.filter((b) => (b._id || b.id) !== id));
            } else {
                alert(res.message || "Failed to delete batch");
            }
        } catch {
            alert("Failed to delete batch. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    // ── Step 1: Create batch ──────────────────────────────────
    const handleCreateBatch = async () => {
        if (!newBatch.name || !newBatch.quantity || !newBatch.origin || !newBatch.expiryDate) {
            alert("Please fill in all required fields (name, quantity, origin, expiry date)");
            return;
        }
        try {
            setCreating(true);
            const body: any = {
                ingredientName: newBatch.name,
                quantity: { value: parseFloat(newBatch.quantity), unit: newBatch.unit },
                origin: { country: newBatch.origin, region: newBatch.region || undefined },
                expiryDate: new Date(newBatch.expiryDate).toISOString(),
            };
            if (newBatch.scientificName) body.scientificName = newBatch.scientificName;
            if (newBatch.description) body.description = newBatch.description;
            if (newBatch.processingMethod) body.processingMethod = newBatch.processingMethod;
            if (newBatch.qualityGrade) body.qualityGrade = newBatch.qualityGrade;
            if (newBatch.unitPrice) body.unitPrice = parseFloat(newBatch.unitPrice);

            const res = await apiRequest("/batches", { method: "POST", body: JSON.stringify(body) });

            if (res.success) {
                setCreatedBatch(res.data?.batch);
                setNewBatch({ ...EMPTY_FORM });
                // Move to step 2 — assign certificate
                await fetchCertificates();
                setSelectedCertIds([]);
                setModalStep("assign");
            } else {
                alert(res.message || "Failed to create batch");
            }
        } catch {
            alert("Failed to create batch. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    // ── Step 2: Assign certificates ───────────────────────────
    const toggleCert = (id: string) => {
        setSelectedCertIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleAssign = async () => {
        if (!createdBatch || selectedCertIds.length === 0) {
            finishAndClose();
            return;
        }
        setAssigning(true);
        try {
            for (const certId of selectedCertIds) {
                await apiRequest(`/batches/${createdBatch._id}/certificates`, {
                    method: "PATCH",
                    body: JSON.stringify({ certificateId: certId }),
                });
            }
        } catch {
            alert("Batch created but some certificates could not be assigned. You can assign them later from the batch detail page.");
        } finally {
            setAssigning(false);
            finishAndClose();
        }
    };

    const finishAndClose = async () => {
        await fetchBatches();
        setModalStep(null);
        setCreatedBatch(null);
        setSelectedCertIds([]);
    };

    // ── Mapped batches ────────────────────────────────────────
    const mappedBatches = batches.map((batch) => ({
        id: batch._id || batch.id,
        name: batch.ingredientName,
        batchNumber: batch.batchNumber,
        quantity: batch.quantity?.value?.toString() || "0",
        unit: batch.quantity?.unit || "kg",
        origin: batch.origin?.country || "Unknown",
        createdDate: batch.createdAt ? new Date(batch.createdAt).toISOString().split("T")[0] : "",
        expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toISOString().split("T")[0] : "",
        status: batch.status || "pending",
        certificateCount: batch.certificates?.length || 0,
        certificateStatus: "valid" as const,
    }));

    const filteredMapped = mappedBatches.filter((b) =>
        searchQuery
            ? b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase())
            : true
    );

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <SupplierSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">Ingredient Batches</h1>
                                <p className="text-earth-600">Manage your organic ingredient inventory</p>
                            </div>
                            <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setModalStep("create")}>
                                Create New Batch
                            </Button>
                        </div>

                        {/* Filters */}
                        <Card padding="md">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by name or batch number..."
                                        leftIcon={<Search className="w-5 h-5" />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select
                                        options={[
                                            { value: "all", label: "All Status" },
                                            { value: "active", label: "Active" },
                                            { value: "pending", label: "Pending" },
                                            { value: "expired", label: "Expired" },
                                        ]}
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Batch List */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-earth-600 text-lg">Loading batches...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMapped.map((batch, index) => (
                                    <motion.div
                                        key={batch.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <BatchCard batch={batch} onEdit={handleEdit} onDelete={handleDelete} />
                                    </motion.div>
                                ))}
                            </div>
                            {filteredMapped.length === 0 && (
                                <div className="text-center py-16">
                                    <p className="text-earth-600">No batches found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* ── STEP 1: Create Batch Modal ── */}
            <Modal
                isOpen={modalStep === "create"}
                onClose={() => setModalStep(null)}
                title="Create New Ingredient Batch"
                size="lg"
            >
                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                    {/* Batch Number Preview */}
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-0.5">
                                Ingredient Batch No.
                            </p>
                            <p className="font-mono font-bold text-earth-900 text-lg tracking-wider">
                                ING-AUTO-XXXX
                            </p>
                            <p className="text-xs text-earth-500 mt-0.5">Auto-generated when batch is created</p>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div>
                        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-4">Basic Information</p>
                        <div className="space-y-4">
                            <Input
                                label="Ingredient Name *"
                                placeholder="e.g., Organic Argan Oil"
                                value={newBatch.name}
                                onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                            />
                            <Input
                                label="Scientific Name"
                                placeholder="e.g., Argania spinosa"
                                value={newBatch.scientificName}
                                onChange={(e) => setNewBatch({ ...newBatch, scientificName: e.target.value })}
                            />
                            <Input
                                label="Description"
                                placeholder="Brief description of this ingredient..."
                                value={newBatch.description}
                                onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="border-t border-secondary-200 pt-4">
                        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-4">Quantity</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Quantity *"
                                type="number"
                                placeholder="500"
                                value={newBatch.quantity}
                                onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                            />
                            <Select
                                label="Unit"
                                options={[
                                    { value: "kg", label: "Kilograms (kg)" },
                                    { value: "g", label: "Grams (g)" },
                                    { value: "L", label: "Liters (L)" },
                                    { value: "ml", label: "Milliliters (ml)" },
                                    { value: "lb", label: "Pounds (lb)" },
                                    { value: "oz", label: "Ounces (oz)" },
                                ]}
                                value={newBatch.unit}
                                onChange={(e) => setNewBatch({ ...newBatch, unit: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Origin */}
                    <div className="border-t border-secondary-200 pt-4">
                        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-4">Origin</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Country *"
                                placeholder="e.g., Morocco"
                                value={newBatch.origin}
                                onChange={(e) => setNewBatch({ ...newBatch, origin: e.target.value })}
                            />
                            <Input
                                label="Region"
                                placeholder="e.g., Souss-Massa"
                                value={newBatch.region}
                                onChange={(e) => setNewBatch({ ...newBatch, region: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Quality */}
                    <div className="border-t border-secondary-200 pt-4">
                        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-4">Quality & Processing</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Quality Grade"
                                options={[
                                    { value: "Premium", label: "Premium" },
                                    { value: "A", label: "Grade A" },
                                    { value: "B", label: "Grade B" },
                                    { value: "Standard", label: "Standard" },
                                ]}
                                value={newBatch.qualityGrade}
                                onChange={(e) => setNewBatch({ ...newBatch, qualityGrade: e.target.value })}
                            />
                            <Input
                                label="Unit Price (LKR)"
                                type="number"
                                placeholder="e.g., 1250"
                                value={newBatch.unitPrice}
                                onChange={(e) => setNewBatch({ ...newBatch, unitPrice: e.target.value })}
                            />
                        </div>
                        <div className="mt-4">
                            <Input
                                label="Processing Method"
                                placeholder="e.g., Cold-pressed, Steam-distilled"
                                value={newBatch.processingMethod}
                                onChange={(e) => setNewBatch({ ...newBatch, processingMethod: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="border-t border-secondary-200 pt-4">
                        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-4">Dates</p>
                        <Input
                            label="Expiry Date *"
                            type="date"
                            value={newBatch.expiryDate}
                            onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setModalStep(null)} disabled={creating}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleCreateBatch}
                            disabled={creating}
                            rightIcon={creating ? undefined : <ChevronRight className="w-4 h-4" />}
                        >
                            {creating ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </span>
                            ) : "Create & Assign Certificate"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* ── STEP 2: Assign Certificate Modal ── */}
            <Modal
                isOpen={modalStep === "assign"}
                onClose={finishAndClose}
                title="Assign Certificate to Batch"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Success Banner */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-900 mb-1">Batch Created Successfully!</p>
                            {createdBatch && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-green-700">
                                        {createdBatch.ingredientName}
                                    </span>
                                    <span className="font-mono text-sm font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">
                                        {createdBatch.batchNumber}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Certificate selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Link2 className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-earth-900">
                                Select Certificates to Assign
                            </h3>
                        </div>

                        {loadingCerts ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                            </div>
                        ) : certificates.length === 0 ? (
                            <div className="p-6 text-center border-2 border-dashed border-secondary-300 rounded-xl">
                                <FileText className="w-12 h-12 text-earth-400 mx-auto mb-3" />
                                <p className="font-medium text-earth-700 mb-1">No certificates uploaded yet</p>
                                <p className="text-sm text-earth-500">
                                    Go to <strong>Certificates</strong> in the sidebar to upload one first, then assign it to this batch from the batch detail page.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {certificates.map((cert: any) => {
                                    const certId = cert._id || cert.id;
                                    const isSelected = selectedCertIds.includes(certId);
                                    const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                                    return (
                                        <button
                                            key={certId}
                                            onClick={() => !isExpired && toggleCert(certId)}
                                            disabled={isExpired}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                                isSelected
                                                    ? "border-primary-500 bg-primary-50"
                                                    : isExpired
                                                    ? "border-secondary-200 bg-secondary-50 opacity-50 cursor-not-allowed"
                                                    : "border-secondary-200 hover:border-primary-300 hover:bg-primary-50/40"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                        isSelected ? "border-primary-500 bg-primary-500" : "border-secondary-400"
                                                    }`}>
                                                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-earth-900 text-sm">
                                                            {cert.certificateName}
                                                        </p>
                                                        <p className="text-xs text-earth-500">
                                                            {cert.certificateType} · {cert.issuingAuthority || cert.issuedBy}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    isExpired
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}>
                                                    {isExpired ? "Expired" : "Valid"}
                                                </span>
                                            </div>
                                            {cert.expiryDate && (
                                                <p className="text-xs text-earth-400 mt-1 ml-8">
                                                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {selectedCertIds.length > 0 && (
                        <p className="text-sm text-primary-700 font-medium">
                            {selectedCertIds.length} certificate{selectedCertIds.length > 1 ? "s" : ""} selected
                        </p>
                    )}

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={finishAndClose} disabled={assigning}>
                            Skip for Now
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleAssign}
                            disabled={assigning || selectedCertIds.length === 0}
                        >
                            {assigning ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Assigning...
                                </span>
                            ) : `Assign & Finish`}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
