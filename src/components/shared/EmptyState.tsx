"use client";

import { PackageOpen } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                {icon || <PackageOpen className="w-10 h-10 text-primary-500" />}
            </div>
            <h3 className="text-2xl font-serif font-semibold text-earth-900 mb-2">
                {title}
            </h3>
            <p className="text-earth-600 max-w-md mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
}