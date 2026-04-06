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
    Beaker,
    QrCode,
    ShoppingBag,
    Plus,
    UserPlus,
    Eye,
    FileText,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const adminNavLinks = [
    // Admin Core Features
    {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        section: "admin",
    },
    {
        href: "/admin/dashboard/users",
        label: "User Management",
        icon: Users,
        section: "admin",
    },
    {
        href: "/admin/dashboard/approvals",
        label: "Supplier Approvals",
        icon: CheckSquare,
        badge: 5,
        section: "admin",
    },

    // Manufacturing Features
    {
        href: "/admin/dashboard/products",
        label: "Product Batches",
        icon: Beaker,
        section: "manufacturing",
    },
    {
        href: "/admin/dashboard/qr-codes",
        label: "QR Codes",
        icon: QrCode,
        section: "manufacturing",
    },
    {
        href: "/admin/dashboard/listings",
        label: "Product Listings",
        icon: ShoppingBag,
        section: "manufacturing",
    },

    // System
    {
        href: "/admin/dashboard/monitoring",
        label: "System Monitoring",
        icon: Activity,
        section: "system",
    },
    {
        href: "/admin/dashboard/reports",
        label: "Reports & Analytics",
        icon: BarChart3,
        section: "system",
    },
    {
        href: "/admin/dashboard/settings",
        label: "Settings",
        icon: Settings,
        section: "system",
    },
];

// Quick Actions - now in sidebar
const quickActions = [
    {
        href: "/admin/dashboard/products/create",
        label: "Create Product",
        icon: Plus,
        color: "bg-primary-600 hover:bg-primary-700 text-white",
    },
    {
        href: "/admin/dashboard/qr-codes",
        label: "Generate QR",
        icon: QrCode,
        color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
        href: "/admin/dashboard/approvals",
        label: "View Approvals",
        icon: Eye,
        color: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
        href: "/admin/dashboard/reports",
        label: "View Reports",
        icon: FileText,
        color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/admin/dashboard") {
            return pathname === path;
        }
        return pathname.startsWith(path.split("?")[0]);
    };

    // Group links by section
    const adminLinks = adminNavLinks.filter((link) => link.section === "admin");
    const manufacturingLinks = adminNavLinks.filter(
        (link) => link.section === "manufacturing"
    );
    const systemLinks = adminNavLinks.filter((link) => link.section === "system");

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
                    // Fixed positioning for mobile, sticky for desktop
                    "fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-secondary-200 z-40",
                    // Transform based on mobile menu state
                    "transition-transform duration-300 ease-in-out",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                    // On desktop, always visible
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
                        <div className="grid grid-cols-2 gap-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center",
                                            action.color
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">{action.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Admin Section */}
                    <div className="mb-6">
                        <p className="px-4 py-2 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                            Administration
                        </p>
                        <div className="space-y-2">
                            {adminLinks.map((link) => {
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
                    </div>

                    {/* Manufacturing Section */}
                    <div className="mb-6">
                        <p className="px-4 py-2 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                            Manufacturing
                        </p>
                        <div className="space-y-2">
                            {manufacturingLinks.map((link) => {
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
                    </div>

                    {/* System Section */}
                    <div>
                        <p className="px-4 py-2 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                            System
                        </p>
                        <div className="space-y-2">
                            {systemLinks.map((link) => {
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
                    </div>
                </nav>

                {/* Stats Summary */}
                <div className="p-4 border-t border-secondary-200 bg-secondary-50">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-xs text-earth-600 mb-1">Users</p>
                            <p className="text-lg font-bold text-blue-600">1247</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-xs text-earth-600 mb-1">Products</p>
                            <p className="text-lg font-bold text-purple-600">342</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-xs text-earth-600 mb-1">Pending</p>
                            <p className="text-lg font-bold text-amber-600">5</p>
                        </div>
                    </div>
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-secondary-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-earth-900 truncate">Admin User</p>
                            <p className="text-sm text-earth-600 truncate">
                                Admin & Manufacturer
                            </p>
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