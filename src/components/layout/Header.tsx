"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import Logo from "@/components/shared/Logo";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, logout, type User as AuthUser } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";

const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentUser(getCurrentUser());
        setCartCount(getCartCount());
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setIsProfileDropdownOpen(false);
        router.push("/");
    };

    const getDashboardHref = (role?: string) => {
        if (role === "admin") return "/admin/dashboard";
        if (role === "supplier") return "/supplier/dashboard";
        return "/";
    };

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-secondary-200/50">
            <nav className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors relative group",
                                    isActive(link.href)
                                        ? "text-primary-600"
                                        : "text-earth-700 hover:text-primary-600"
                                )}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="activeLink"
                                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary-600"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
                        >
                            <Search className="w-5 h-5 text-earth-600" />
                        </button>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="p-2 hover:bg-secondary-100 rounded-full transition-colors relative"
                        >
                            <ShoppingCart className="w-5 h-5 text-earth-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {currentUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-secondary-100 transition-colors"
                                >
                                    {currentUser.avatar ? (
                                        <img
                                            src={currentUser.avatar}
                                            alt={currentUser.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-primary-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center">
                                            <span className="text-primary-700 font-semibold text-sm">
                                                {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-earth-800 max-w-[120px] truncate">
                                        {currentUser.companyName || currentUser.name}
                                    </span>
                                    <ChevronDown className={cn("w-4 h-4 text-earth-500 transition-transform", isProfileDropdownOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-200 py-1 z-50"
                                        >
                                            <Link
                                                href={getDashboardHref(currentUser.role)}
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-earth-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <div className="border-t border-secondary-100 my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-earth-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-earth-900" />
                        )}
                    </button>
                </div>

                {/* Search Bar */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pb-4"
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                                <input
                                    type="text"
                                    placeholder="Search organic products..."
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-secondary-300 bg-white/50 backdrop-blur-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-secondary-200"
                    >
                        <div className="container-custom py-6 space-y-4">
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block py-2 text-base font-medium transition-colors",
                                        isActive(link.href)
                                            ? "text-primary-600"
                                            : "text-earth-700 hover:text-primary-600"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-secondary-200 space-y-3">
                                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start" leftIcon={<ShoppingCart className="w-5 h-5" />}>
                                        Cart {cartCount > 0 ? `(${cartCount})` : ""}
                                    </Button>
                                </Link>

                                {currentUser ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 py-2">
                                            {currentUser.avatar ? (
                                                <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <span className="text-primary-700 font-semibold">
                                                        {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-earth-900 text-sm">{currentUser.companyName || currentUser.name}</p>
                                                <p className="text-xs text-earth-500 capitalize">{currentUser.role}</p>
                                            </div>
                                        </div>
                                        <Link href={getDashboardHref(currentUser.role)} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                leftIcon={<LayoutDashboard className="w-4 h-4" />}
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="w-full text-red-600 border-red-300"
                                            leftIcon={<LogOut className="w-4 h-4" />}
                                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full">Login</Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
