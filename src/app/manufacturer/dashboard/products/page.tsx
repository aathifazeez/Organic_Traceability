"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Beaker } from "lucide-react";
import Link from "next/link";
import ManufacturerSidebar from "@/components/manufacturer/ManufacturerSidebar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock product batches
const productBatches = [
    {
        id: "1",
        name: "Organic Rose Face Cream",
        batchNumber: "PROD-2024-001",
        ingredients: 5,
        quantity: "150 units",
        createdDate: "2024-01-28",
        status: "active",
    },
    {
        id: "2",
        name: "Vitamin C Brightening Serum",
        batchNumber: "PROD-2024-002",
        ingredients: 4,
        quantity: "200 units",
        createdDate: "2024-01-26",
        status: "active",
    },
    {
        id: "3",
        name: "Hydrating Face Mask",
        batchNumber: "PROD-2024-003",
        ingredients: 6,
        quantity: "100 units",
        createdDate: "2024-01-25",
        status: "pending",
    },
];

export default function ProductBatchesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBatches = productBatches.filter(
        (batch) =>
            batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <ManufacturerSidebar />

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
                                    Product Batches
                                </h1>
                                <p className="text-earth-600">
                                    Manage your organic skincare production batches
                                </p>
                            </div>
                            <Link href="/manufacturer/dashboard/products/create">
                                <Button leftIcon={<Plus className="w-5 h-5" />}>
                                    Create New Batch
                                </Button>
                            </Link>
                        </div>

                        <Card padding="md">
                            <Input
                                placeholder="Search batches..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Card>
                    </motion.div>

                    {/* Batches List */}
                    <div className="space-y-4">
                        {filteredBatches.map((batch, index) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card hover padding="lg">
                                    <Link href={`/manufacturer/dashboard/products/${batch.id}`}>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                                                <Beaker className="w-8 h-8 text-primary-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-xl text-earth-900">
                                                            {batch.name}
                                                        </h3>
                                                        <p className="text-earth-600">{batch.batchNumber}</p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            batch.status === "active" ? "success" : "warning"
                                                        }
                                                    >
                                                        {batch.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-6 text-sm text-earth-600">
                                                    <span>{batch.ingredients} ingredients</span>
                                                    <span>{batch.quantity}</span>
                                                    <span>
                                                        Created: {new Date(batch.createdDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}