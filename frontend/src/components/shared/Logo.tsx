"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

interface LogoProps {
    className?: string;
    variant?: "light" | "dark";
}

export default function Logo({ className = "", variant = "dark" }: LogoProps) {
    const textColor = variant === "dark" ? "text-earth-900" : "text-white";
    const iconColor = variant === "dark" ? "text-primary-600" : "text-primary-300";

    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative">
                <Leaf className={`w-8 h-8 ${iconColor}`} strokeWidth={2.5} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-500 rounded-full" />
            </div>
            <span className={`text-2xl font-serif font-bold ${textColor}`}>
                Organic<span className="text-primary-600">Trace</span>
            </span>
        </Link>
    );
}