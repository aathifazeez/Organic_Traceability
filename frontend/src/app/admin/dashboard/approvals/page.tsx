"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckSquare,
    Search,
    Loader2,
    X,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    User,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ApprovalCard from "@/components/admin/ApprovalCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/shared/EmptyState";
import { apiRequest } from "@/lib/auth";

interface ApprovalUser {
    id: string;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    role: string;
    requestedDate: string;
    companyInfo: string;
    documents: number;
    address: string;
    website: string;
    city: string;
    country: string;
}

function SupplierDetailModal({
    approval,
    onClose,
}: {
    approval: ApprovalUser;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-7 h-7 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="font-serif font-bold text-xl text-earth-900">
                                    {approval.name}
                                </h2>
                                {approval.contactName && approval.contactName !== approval.name && (
                                    <p className="text-sm text-earth-500">
                                        Contact: {approval.contactName}
                                    </p>
                                )}
                                <span className="inline-flex items-center text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full mt-1">
                                    Pending Approval
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-earth-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-5">
                        {/* Contact */}
                        <div>
                            <p className="text-xs font-semibold text-earth-400 uppercase tracking-wide mb-3">
                                Contact Information
                            </p>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3 text-sm text-earth-700">
                                    <Mail className="w-4 h-4 text-earth-400 flex-shrink-0" />
                                    <span>{approval.email}</span>
                                </div>
                                {approval.phone && (
                                    <div className="flex items-center gap-3 text-sm text-earth-700">
                                        <Phone className="w-4 h-4 text-earth-400 flex-shrink-0" />
                                        <span>{approval.phone}</span>
                                    </div>
                                )}
                                {approval.website && (
                                    <div className="flex items-center gap-3 text-sm text-earth-700">
                                        <Globe className="w-4 h-4 text-earth-400 flex-shrink-0" />
                                        <a
                                            href={approval.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:underline"
                                        >
                                            {approval.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        {(approval.address || approval.city || approval.country) && (
                            <div className="border-t border-gray-100 pt-5">
                                <p className="text-xs font-semibold text-earth-400 uppercase tracking-wide mb-3">
                                    Location
                                </p>
                                <div className="flex items-start gap-3 text-sm text-earth-700">
                                    <MapPin className="w-4 h-4 text-earth-400 flex-shrink-0 mt-0.5" />
                                    <span>
                                        {[approval.address, approval.city, approval.country]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Company Info */}
                        {approval.companyInfo && (
                            <div className="border-t border-gray-100 pt-5">
                                <p className="text-xs font-semibold text-earth-400 uppercase tracking-wide mb-3">
                                    About the Company
                                </p>
                                <p className="text-sm text-earth-700 leading-relaxed">
                                    {approval.companyInfo}
                                </p>
                            </div>
                        )}

                        {/* Registration date */}
                        <div className="border-t border-gray-100 pt-5">
                            <p className="text-xs font-semibold text-earth-400 uppercase tracking-wide mb-3">
                                Registration
                            </p>
                            <div className="flex items-center gap-3 text-sm text-earth-700">
                                <Calendar className="w-4 h-4 text-earth-400 flex-shrink-0" />
                                <span>
                                    Registered on{" "}
                                    {new Date(approval.requestedDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function ApprovalsPage() {
    const [approvals, setApprovals] = useState<ApprovalUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewingApproval, setViewingApproval] = useState<ApprovalUser | null>(null);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                setLoading(true);
                const res = await apiRequest("/users?status=pending");
                if (res.success) {
                    setApprovals(
                        (res.data || []).map((user: any) => ({
                            id: user._id || user.id,
                            name: user.companyName || user.name,
                            contactName: user.name || "",
                            email: user.email,
                            phone: user.phone || "",
                            role: user.role,
                            requestedDate: user.createdAt
                                ? new Date(user.createdAt).toISOString().split("T")[0]
                                : "",
                            companyInfo: user.companyInfo || user.bio || "",
                            documents: 0,
                            address: user.companyAddress?.street || "",
                            city: user.companyAddress?.city || "",
                            country: user.companyAddress?.country || "",
                            website: user.website || "",
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch pending approvals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingUsers();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            const res = await apiRequest(`/users/${id}/approve`, { method: "PATCH" });
            if (res.success) {
                setApprovals(approvals.filter((a) => a.id !== id));
            } else {
                alert(res.message || "Failed to approve user");
            }
        } catch (error) {
            console.error("Error approving user:", error);
            alert("Failed to approve user. Please try again.");
        }
    };

    const handleReject = async (id: string) => {
        try {
            const res = await apiRequest(`/users/${id}/reject`, { method: "PATCH" });
            if (res.success) {
                setApprovals(approvals.filter((a) => a.id !== id));
            } else {
                alert(res.message || "Failed to reject user");
            }
        } catch (error) {
            console.error("Error rejecting user:", error);
            alert("Failed to reject user. Please try again.");
        }
    };

    const handleViewDetails = (id: string) => {
        const found = approvals.find((a) => a.id === id);
        if (found) setViewingApproval(found);
    };

    const filteredApprovals = approvals.filter((approval) => {
        const matchesRole = filterRole === "all" || approval.role === filterRole;
        const matchesSearch =
            approval.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            approval.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (approval.companyInfo || "").toLowerCase().includes(searchQuery.toLowerCase());
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
                                    Review and approve new supplier registrations
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
                                <p className="text-2xl font-bold text-green-600">{stats.suppliers}</p>
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

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-earth-600 text-lg">Loading approvals...</p>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </main>

            {viewingApproval && (
                <SupplierDetailModal
                    approval={viewingApproval}
                    onClose={() => setViewingApproval(null)}
                />
            )}
        </div>
    );
}
