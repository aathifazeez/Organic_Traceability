"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Plus,
    Upload,
    Eye,
    TrendingUp,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const supplierNavLinks = [
    {
        href: "/supplier/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        section: "main",
    },
    {
        href: "/supplier/dashboard/batches",
        label: "Ingredient Batches",
        icon: Package,
        section: "main",
    },
    {
        href: "/supplier/dashboard/certificates",
        label: "Certificates",
        icon: FileText,
        section: "main",
    },
    {
        href: "/supplier/dashboard/analytics",
        label: "Analytics",
        icon: BarChart3,
        section: "main",
    },
    {
        href: "/supplier/dashboard/settings",
        label: "Settings",
        icon: Settings,
        section: "main",
    },
];

// Quick Actions - now in sidebar
const quickActions = [
    {
        href: "/supplier/dashboard/batches?action=create",
        label: "Create Batch",
        icon: Plus,
        color: "bg-primary-600 hover:bg-primary-700 text-white",
    },
    {
        href: "/supplier/dashboard/certificates?action=upload",
        label: "Upload Certificate",
        icon: Upload,
        color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
        href: "/supplier/dashboard/batches",
        label: "View Batches",
        icon: Eye,
        color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
];

export default function SupplierSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/supplier/dashboard") {
            return pathname === path;
        }
        return pathname.startsWith(path.split("?")[0]); // Handle query params
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
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-secondary-200 z-40",
                    "transition-transform duration-300 ease-in-out",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0",
                    "flex flex-col"
                )}
            >

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    {/* Quick Actions Section */}
                    <div className="mb-6">
                        <p className="px-4 py-2 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                            Quick Actions
                        </p>
                        <div className="space-y-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                            action.color
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{action.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Navigation */}
                    <div>
                        <p className="px-4 py-2 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                            Navigation
                        </p>
                        <div className="space-y-2">
                            {supplierNavLinks.map((link) => {
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
                                                ? "bg-primary-100 text-primary-700 font-medium"
                                                : "text-earth-700 hover:bg-secondary-100"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                        {active && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {/* Stats Summary */}
                <div className="p-4 border-t border-secondary-200 bg-secondary-50">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-xs text-earth-600 mb-1">Batches</p>
                            <p className="text-xl font-bold text-primary-600">45</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-xs text-earth-600 mb-1">Certificates</p>
                            <p className="text-xl font-bold text-green-600">18</p>
                        </div>
                    </div>
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-secondary-200">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="Supplier"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-earth-900 truncate">
                                Natural Oils Co.
                            </p>
                            <p className="text-sm text-earth-600 truncate">Supplier</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}