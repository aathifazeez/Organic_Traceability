"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        x: [0, -10, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="relative">
                        <Leaf className="w-10 h-10 text-primary-600" strokeWidth={2.5} />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full" />
                    </div>
                    <span className="text-3xl font-serif font-bold text-earth-900">
                        Organic<span className="text-primary-600">Trace</span>
                    </span>
                </Link>

                {/* Auth Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-organic-xl p-8 border border-secondary-200/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-serif font-bold text-3xl text-earth-900 mb-2">
                            {title}
                        </h1>
                        <p className="text-earth-600">{subtitle}</p>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </motion.div>
        </div>
    );
}