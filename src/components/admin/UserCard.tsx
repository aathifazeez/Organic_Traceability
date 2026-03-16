"use client";

import { User, Mail, Calendar, MoreVertical, Check, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

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
}

export default function UserCard({ user, onApprove, onReject }: UserCardProps) {
    const roleColors = {
        customer: "bg-blue-100 text-blue-700",
        supplier: "bg-green-100 text-green-700",
        manufacturer: "bg-purple-100 text-purple-700",
        admin: "bg-red-100 text-red-700",
    };

    const statusColors = {
        approved: "success",
        pending: "warning",
        rejected: "danger",
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
                    <h3 className="font-semibold text-lg text-earth-900 mb-1">
                        {user.name}
                    </h3>
                    <p className="text-sm text-earth-600 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                    </p>
                </div>
                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-earth-600" />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role as keyof typeof roleColors]
                        }`}
                >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <Badge variant={statusColors[user.status as keyof typeof statusColors] as any}>
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