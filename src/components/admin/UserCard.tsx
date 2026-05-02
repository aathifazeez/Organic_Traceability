"use client";

import { useEffect, useRef, useState } from "react";
import { User, Mail, Calendar, MoreVertical, Check, X, Trash2, Ban } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface UserCardProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
        joinedDate: string;
        avatar?: string;
    };
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onRemove?: (id: string) => void;
}

export default function UserCard({ user, onApprove, onReject, onRemove }: UserCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const roleColors: Record<string, string> = {
        customer: "bg-blue-100 text-blue-700",
        supplier: "bg-green-100 text-green-700",
        manufacturer: "bg-purple-100 text-purple-700",
        admin: "bg-red-100 text-red-700",
    };

    const statusColors: Record<string, "success" | "warning" | "danger"> = {
        approved: "success",
        active: "success",
        pending: "warning",
        rejected: "danger",
        suspended: "danger",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300 transition-all p-6 shadow-organic"
        >
            <div className="flex items-start gap-4 mb-4">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-earth-900 mb-1">{user.name}</h3>
                    <p className="text-sm text-earth-600 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                    </p>
                </div>

                {/* 3-dot menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-earth-600" />
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-10 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                            >
                                {user.status !== "rejected" && onReject && (
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onReject(user.id);
                                        }}
                                        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                                    >
                                        <Ban className="w-4 h-4" />
                                        Reject Supplier
                                    </button>
                                )}
                                {onRemove && (
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            if (confirm(`Are you sure you want to permanently remove ${user.name}?`)) {
                                                onRemove(user.id);
                                            }
                                        }}
                                        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors border-t border-gray-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove User
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        roleColors[user.role] ?? "bg-gray-100 text-gray-700"
                    }`}
                >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <Badge variant={statusColors[user.status] ?? "warning"}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-earth-600 mb-4">
                <Calendar className="w-4 h-4" />
                Joined: {new Date(user.joinedDate).toLocaleDateString()}
            </div>

            {user.status === "pending" && onApprove && onReject && (
                <div className="flex gap-2 pt-4 border-t border-secondary-200">
                    <Button
                        size="sm"
                        className="flex-1"
                        leftIcon={<Check className="w-4 h-4" />}
                        onClick={() => onApprove(user.id)}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={() => onReject(user.id)}
                    >
                        Reject
                    </Button>
                </div>
            )}
        </motion.div>
    );
}
