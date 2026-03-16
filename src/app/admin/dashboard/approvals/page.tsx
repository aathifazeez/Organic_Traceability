"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Search } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ApprovalCard from "@/components/admin/ApprovalCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/shared/EmptyState";

// Mock approvals data
const mockApprovals = [
    {
        id: "1",
        name: "Natural Oils Co.",
        email: "contact@naturaloils.com",
        phone: "+1 (555) 123-4567",
        role: "supplier",
        requestedDate: "2024-01-29",
        companyInfo: "Supplier of organic essential oils from Morocco and Mediterranean regions",
        documents: 3,
        address: "123 Organic Street, Portland, OR",
    },
    {
        id: "2",
        name: "EcoBeauty Manufacturing",
        email: "info@ecobeauty.com",
        phone: "+1 (555) 234-5678",
        role: "manufacturer",
        requestedDate: "2024-01-28",
        companyInfo: "Certified organic skincare manufacturer specializing in anti-aging products",
        documents: 5,
        address: "456 Green Avenue, San Francisco, CA",
    },
    {
        id: "3",
        name: "Organic Extracts Ltd",
        email: "sales@organicextracts.com",
        phone: "+1 (555) 345-6789",
        role: "supplier",
        requestedDate: "2024-01-28",
        companyInfo: "Plant extract supplier with Fair Trade certification",
        documents: 4,
        address: "789 Botanical Blvd, Seattle, WA",
    },
    {
        id: "4",
        name: "Green Beauty Labs",
        email: "hello@greenbeauty.com",
        phone: "+1 (555) 456-7890",
        role: "manufacturer",
        requestedDate: "2024-01-27",
        companyInfo: "Natural cosmetics manufacturer with USDA Organic certification",
        documents: 6,
        address: "321 Eco Lane, Austin, TX",
    },
    {
        id: "5",
        name: "Pure Botanicals",
        email: "info@purebotanicals.com",
        phone: "+1 (555) 567-8901",
        role: "supplier",
        requestedDate: "2024-01-26",
        companyInfo: "Botanical ingredients supplier sourcing from sustainable farms",
        documents: 3,
        address: "654 Nature Drive, Denver, CO",
    },
];

export default function ApprovalsPage() {
    const [approvals, setApprovals] = useState(mockApprovals);
    const [filterRole, setFilterRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const handleApprove = (id: string) => {
        console.log("Approving:", id);
        setApprovals(approvals.filter((a) => a.id !== id));
        // In real app, send approval to backend
    };

    const handleReject = (id: string) => {
        console.log("Rejecting:", id);
        setApprovals(approvals.filter((a) => a.id !== id));
        // In real app, send rejection to backend
    };

    const handleViewDetails = (id: string) => {
        console.log("Viewing details for:", id);
        // Navigate to details page or open modal
    };

    const filteredApprovals = approvals.filter((approval) => {
        const matchesRole = filterRole === "all" || approval.role === filterRole;
        const matchesSearch =
            approval.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            approval.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            approval.companyInfo.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesRole && matchesSearch;
    });

    const stats = {
        total: approvals.length,
        suppliers: approvals.filter((a) => a.role === "supplier").length,
        manufacturers: approvals.filter((a) => a.role === "manufacturer").length,
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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    Pending Approvals
                                </h1>
                                <p className="text-earth-600">
                                    Review and approve new supplier and manufacturer registrations
                                </p>
                            </div>
                            <Badge variant="danger" size="lg">
                                {approvals.length} Pending
                            </Badge>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Total Pending</p>
                                <p className="text-2xl font-bold text-earth-900">{stats.total}</p>
                            </Card>
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Suppliers</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.suppliers}
                                </p>
                            </Card>
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Manufacturers</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    {stats.manufacturers}
                                </p>
                            </Card>
                        </div>

                        {/* Filters */}
                        <Card padding="md">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by name, email, or company info..."
                                        leftIcon={<Search className="w-5 h-5" />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-64">
                                    <Select
                                        options={[
                                            { value: "all", label: "All Roles" },
                                            { value: "supplier", label: "Suppliers Only" },
                                            { value: "manufacturer", label: "Manufacturers Only" },
                                        ]}
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Approvals List */}
                    <div className="space-y-6">
                        {filteredApprovals.map((approval, index) => (
                            <motion.div
                                key={approval.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ApprovalCard
                                    approval={approval}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    onViewDetails={handleViewDetails}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredApprovals.length === 0 && (
                        <EmptyState
                            icon={<CheckSquare className="w-10 h-10 text-primary-500" />}
                            title={
                                searchQuery || filterRole !== "all"
                                    ? "No approvals found"
                                    : "No pending approvals"
                            }
                            description={
                                searchQuery || filterRole !== "all"
                                    ? "Try adjusting your filters or search query"
                                    : "All registrations have been reviewed"
                            }
                            actionLabel={
                                searchQuery || filterRole !== "all" ? "Clear Filters" : undefined
                            }
                            onAction={
                                searchQuery || filterRole !== "all"
                                    ? () => {
                                        setSearchQuery("");
                                        setFilterRole("all");
                                    }
                                    : undefined
                            }
                        />
                    )}
                </div>
            </main>
        </div>
    );
}