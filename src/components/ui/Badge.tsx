"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "primary" | "success" | "warning" | "danger" | "info";
    size?: "sm" | "md" | "lg";
}

export default function Badge({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}: BadgeProps) {
    const variants = {
        primary: "bg-primary-100 text-primary-700 border-primary-200",
        success: "bg-green-100 text-green-700 border-green-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        danger: "bg-red-100 text-red-700 border-red-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-medium border",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}