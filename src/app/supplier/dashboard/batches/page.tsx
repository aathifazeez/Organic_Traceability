"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import BatchCard from "@/components/supplier/BatchCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

// Mock data - Organic skincare ingredient batches
const mockBatches = [
    {
        id: "1",
        name: "Organic Argan Oil",
        batchNumber: "ARG-2024-001",
        quantity: "500",
        unit: "L",
        origin: "Morocco",
        createdDate: "2024-01-25",
        expiryDate: "2026-01-25",
        status: "active" as const,
        certificateCount: 3,
        certificateStatus: "valid" as const,
    },
    {
        id: "2",
        name: "Cold-Pressed Rosehip Oil",
        batchNumber: "RSH-2024-015",
        quantity: "250",
        unit: "L",
        origin: "Chile",
        createdDate: "2024-01-23",
        expiryDate: "2025-07-23",
        status: "active" as const,
        certificateCount: 2,
        certificateStatus: "expiring" as const,
    },
    {
        id: "3",
        name: "Organic Shea Butter",
        batchNumber: "SHB-2024-008",
        quantity: "800",
        unit: "kg",
        origin: "Ghana",
        createdDate: "2024-01-22",
        expiryDate: "2025-06-22",
        status: "active" as const,
        certificateCount: 4,
        certificateStatus: "valid" as const,
    },
    {
        id: "4",
        name: "Organic Jojoba Oil",
        batchNumber: "JOJ-2024-005",
        quantity: "300",
        unit: "L",
        origin: "Peru",
        createdDate: "2024-01-20",
        expiryDate: "2026-01-20",
        status: "active" as const,
        certificateCount: 2,
        certificateStatus: "valid" as const,
    },
    {
        id: "5",
        name: "Virgin Coconut Oil",
        batchNumber: "COC-2024-012",
        quantity: "600",
        unit: "L",
        origin: "Philippines",
        createdDate: "2024-01-18",
        expiryDate: "2025-04-18",
        status: "pending" as const,
        certificateCount: 3,
        certificateStatus: "valid" as const,
    },
    {
        id: "6",
        name: "Sweet Almond Oil",
        batchNumber: "ALM-2024-003",
        quantity: "400",
        unit: "L",
        origin: "Spain",
        createdDate: "2024-01-15",
        expiryDate: "2025-10-15",
        status: "active" as const,
        certificateCount: 2,
        certificateStatus: "valid" as const,
    },
];

export default function BatchesPage() {
    const [batches, setBatches] = useState(mockBatches);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form state for new batch
    const [newBatch, setNewBatch] = useState({
        name: "",
        batchNumber: "",
        quantity: "",
        unit: "L",
        origin: "",
    });

    const handleEdit = (id: string) => {
        console.log("Edit batch:", id);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this batch?")) {
            setBatches(batches.filter((b) => b.id !== id));
        }
    };

    const handleCreateBatch = () => {
        // Create new batch logic
        const batch = {
            id: Date.now().toString(),
            ...newBatch,
            createdDate: new Date().toISOString().split("T")[0],
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            status: "pending" as const,
            certificateCount: 0,
            certificateStatus: "expired" as const,
        };

        setBatches([batch, ...batches]);
        setIsCreateModalOpen(false);
        setNewBatch({
            name: "",
            batchNumber: "",
            quantity: "",
            unit: "L",
            origin: "",
        });
    };

    const filteredBatches = batches.filter((batch) => {
        const matchesSearch =
            batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                                    Ingredient Batches
                                </h1>
                                <p className="text-earth-600">
                                    Manage your organic skincare ingredient inventory
                                </p>
                            </div>
                            <Button
                                leftIcon={<Plus className="w-5 h-5" />}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
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

                    {/* Batches Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBatches.map((batch, index) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <BatchCard
                                    batch={batch}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {filteredBatches.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-earth-600">No batches found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Batch Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Ingredient Batch"
                size="lg"
            >
                <div className="space-y-6">
                    <Input
                        label="Ingredient Name"
                        placeholder="e.g., Organic Argan Oil"
                        value={newBatch.name}
                        onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Batch Number"
                        placeholder="e.g., ARG-2024-001"
                        value={newBatch.batchNumber}
                        onChange={(e) =>
                            setNewBatch({ ...newBatch, batchNumber: e.target.value })
                        }
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Quantity"
                            type="number"
                            placeholder="500"
                            value={newBatch.quantity}
                            onChange={(e) =>
                                setNewBatch({ ...newBatch, quantity: e.target.value })
                            }
                            required
                        />
                        <Select
                            label="Unit"
                            options={[
                                { value: "L", label: "Liters (L)" },
                                { value: "kg", label: "Kilograms (kg)" },
                                { value: "ml", label: "Milliliters (ml)" },
                                { value: "g", label: "Grams (g)" },
                            ]}
                            value={newBatch.unit}
                            onChange={(e) => setNewBatch({ ...newBatch, unit: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Origin Country"
                        placeholder="e.g., Morocco"
                        value={newBatch.origin}
                        onChange={(e) => setNewBatch({ ...newBatch, origin: e.target.value })}
                        required
                    />

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800">
                            <strong>Note:</strong> After creating the batch, don't forget to upload
                            the required organic certificates to activate it.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleCreateBatch}>
                            Create Batch
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}