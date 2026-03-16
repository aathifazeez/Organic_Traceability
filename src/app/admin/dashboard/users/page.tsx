"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, UserPlus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserCard from "@/components/admin/UserCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

// Mock users data
const mockUsers = [
    {
        id: "1",
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        role: "customer",
        status: "approved",
        joinedDate: "2024-01-15",
        avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
        id: "2",
        name: "Natural Oils Co.",
        email: "contact@naturaloils.com",
        role: "supplier",
        status: "pending",
        joinedDate: "2024-01-29",
    },
    {
        id: "3",
        name: "PureGlow Organics",
        email: "info@pureglow.com",
        role: "manufacturer",
        status: "approved",
        joinedDate: "2024-01-10",
        avatar: "https://i.pravatar.cc/150?img=33",
    },
    {
        id: "4",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        role: "customer",
        status: "approved",
        joinedDate: "2024-01-22",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: "5",
        name: "EcoBeauty Manufacturing",
        email: "info@ecobeauty.com",
        role: "manufacturer",
        status: "pending",
        joinedDate: "2024-01-28",
    },
    {
        id: "6",
        name: "Atlas Organic Oils",
        email: "sales@atlasoils.com",
        role: "supplier",
        status: "approved",
        joinedDate: "2024-01-05",
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleApprove = (id: string) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, status: "approved" } : user
            )
        );
    };

    const handleReject = (id: string) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, status: "rejected" } : user
            )
        );
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
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
                            <Button leftIcon={<UserPlus className="w-5 h-5" />}>
                                Add User
                            </Button>
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
                                            { value: "customer", label: "Customer" },
                                            { value: "supplier", label: "Supplier" },
                                            { value: "manufacturer", label: "Manufacturer" },
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
                </div>
            </main>
        </div>
    );
}