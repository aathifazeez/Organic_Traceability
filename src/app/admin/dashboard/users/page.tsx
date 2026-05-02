"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, UserPlus, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserCard from "@/components/admin/UserCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { apiRequest } from "@/lib/auth";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (roleFilter !== "all") params.set("role", roleFilter);

            const res = await apiRequest(`/users?${params.toString()}`);
            if (res.success) {
                setUsers(
                    (res.data || []).map((user: any) => ({
                        id: user._id || user.id,
                        name: user.companyName || user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                        joinedDate: user.createdAt
                            ? new Date(user.createdAt).toISOString().split("T")[0]
                            : "",
                        avatar: user.avatar || undefined,
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [statusFilter, roleFilter]);

    const handleApprove = async (id: string) => {
        try {
            const res = await apiRequest(`/users/${id}/approve`, {
                method: "PATCH",
            });
            if (res.success) {
                setUsers(
                    users.map((user) =>
                        user.id === id ? { ...user, status: "approved" } : user
                    )
                );
            } else {
                alert(res.message || "Failed to approve user");
            }
        } catch (error) {
            console.error("Error approving user:", error);
            alert("Failed to approve user.");
        }
    };

    const handleReject = async (id: string) => {
        try {
            const res = await apiRequest(`/users/${id}/reject`, {
                method: "PATCH",
            });
            if (res.success) {
                setUsers(
                    users.map((user) =>
                        user.id === id ? { ...user, status: "rejected" } : user
                    )
                );
            } else {
                alert(res.message || "Failed to reject user");
            }
        } catch (error) {
            console.error("Error rejecting user:", error);
            alert("Failed to reject user.");
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const res = await apiRequest(`/users/${id}`, { method: "DELETE" });
            if (res.success) {
                setUsers(users.filter((user) => user.id !== id));
            } else {
                alert(res.message || "Failed to remove user");
            }
        } catch (error) {
            console.error("Error removing user:", error);
            alert("Failed to remove user.");
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const stats = {
        total: users.length,
        approved: users.filter((u) => u.status === "approved").length,
        pending: users.filter((u) => u.status === "pending").length,
        rejected: users.filter((u) => u.status === "rejected").length,
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
                                    User Management
                                </h1>
                                <p className="text-earth-600">
                                    Manage all users across the platform
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Total Users</p>
                                <p className="text-2xl font-bold text-earth-900">{stats.total}</p>
                            </Card>
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Approved</p>
                                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                            </Card>
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                            </Card>
                            <Card padding="md">
                                <p className="text-sm text-earth-600 mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                            </Card>
                        </div>

                        {/* Filters */}
                        <Card padding="md">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search users..."
                                        leftIcon={<Search className="w-5 h-5" />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select
                                        options={[
                                            { value: "all", label: "All Roles" },
                                            { value: "supplier", label: "Supplier" },
                                            { value: "admin", label: "Admin" },
                                        ]}
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select
                                        options={[
                                            { value: "all", label: "All Status" },
                                            { value: "approved", label: "Approved" },
                                            { value: "pending", label: "Pending" },
                                            { value: "rejected", label: "Rejected" },
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
                            <p className="text-earth-600 text-lg">Loading users...</p>
                        </div>
                    ) : (
                        <>
                            {/* Users Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredUsers.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <UserCard
                                            user={user}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                            onRemove={handleRemove}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-16">
                                    <Users className="w-16 h-16 text-earth-400 mx-auto mb-4" />
                                    <p className="text-earth-600">No users found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}