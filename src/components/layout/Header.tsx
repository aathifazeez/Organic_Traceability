"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import Logo from "@/components/shared/Logo";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock user - replace with actual auth
const mockUser = {
    role: "customer" as const,
    name: "John Doe",
    isLoggedIn: false,
};

const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

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
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                2
                            </span>
                        </Link>

                        {/* Auth Buttons */}
                        {mockUser.isLoggedIn ? (
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                                    Profile
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
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
                                        Cart (2)
                                    </Button>
                                </Link>

                                {mockUser.isLoggedIn ? (
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                Login
                                            </Button>
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