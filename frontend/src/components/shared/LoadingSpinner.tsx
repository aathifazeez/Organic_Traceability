"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function LoadingSpinner({
    size = "md",
    className,
}: LoadingSpinnerProps) {
    const sizes = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-3",
        lg: "w-16 h-16 border-4",
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={cn(
                    "loader-organic rounded-full",
                    sizes[size],
                    className
                )}
            />
        </div>
    );
}