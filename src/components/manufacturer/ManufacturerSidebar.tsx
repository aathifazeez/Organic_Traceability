"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Beaker,
    ShoppingBag,
    QrCode,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const manufacturerNavLinks = [
    {
        href: "/manufacturer/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/manufacturer/dashboard/products",
        label: "Product Batches",
        icon: Beaker,
    },
    {
        href: "/manufacturer/dashboard/listings",
        label: "Product Listings",
        icon: ShoppingBag,
    },
    {
        href: "/manufacturer/dashboard/qr-codes",
        label: "QR Codes",
        icon: QrCode,
    },
    {
        href: "/manufacturer/dashboard/settings",
        label: "Settings",
        icon: Settings,
    },
];

export default function ManufacturerSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/manufacturer/dashboard") {
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
                    <p className="text-sm text-earth-600 mt-2">Manufacturer Portal</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {manufacturerNavLinks.map((link) => {
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
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-secondary-200">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="https://i.pravatar.cc/150?img=33"
                            alt="Manufacturer"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-earth-900 truncate">
                                PureGlow Organics
                            </p>
                            <p className="text-sm text-earth-600 truncate">Manufacturer</p>
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