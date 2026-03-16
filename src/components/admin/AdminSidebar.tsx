"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    Activity,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const adminNavLinks = [
    {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/admin/dashboard/users",
        label: "User Management",
        icon: Users,
    },
    {
        href: "/admin/dashboard/approvals",
        label: "Approvals",
        icon: CheckSquare,
        badge: 5, // Pending approvals count
    },
    {
        href: "/admin/dashboard/monitoring",
        label: "System Monitoring",
        icon: Activity,
    },
    {
        href: "/admin/dashboard/reports",
        label: "Reports & Analytics",
        icon: BarChart3,
    },
    {
        href: "/admin/dashboard/settings",
        label: "Settings",
        icon: Settings,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/admin/dashboard") {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-organic"
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-earth-900" />
                ) : (
                    <Menu className="w-6 h-6 text-earth-900" />
                )}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden fixed inset-0 bg-earth-900/50 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isMobileMenuOpen ? 0 : "-100%",
                }}
                className={cn(
                    "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-secondary-200 z-40 transition-transform lg:translate-x-0",
                    "flex flex-col"
                )}
            >
                {/* Logo */}
                <div className="p-6 border-b border-secondary-200">
                    <Logo />
                    <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-semibold text-red-600">Admin Portal</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {adminNavLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative",
                                        active
                                            ? "bg-red-100 text-red-700 font-medium"
                                            : "text-earth-700 hover:bg-secondary-100"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="flex-1">{link.label}</span>
                                    {link.badge && link.badge > 0 && (
                                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                                            {link.badge}
                                        </span>
                                    )}
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-secondary-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-earth-900 truncate">
                                Admin User
                            </p>
                            <p className="text-sm text-earth-600 truncate">
                                System Administrator
                            </p>
                        </div>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </motion.aside>
        </>
    );
}