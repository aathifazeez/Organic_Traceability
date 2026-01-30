"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}

export default function RoleCard({
    icon: Icon,
    title,
    description,
    selected,
    onClick,
}: RoleCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                selected
                    ? "border-primary-500 bg-primary-50 shadow-organic"
                    : "border-secondary-300 bg-white hover:border-primary-300 hover:shadow-organic"
            )}
        >
            <div className="flex items-start gap-4">
                <div
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                        selected
                            ? "bg-primary-600 text-white"
                            : "bg-primary-100 text-primary-600"
                    )}
                >
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3
                        className={cn(
                            "font-semibold text-lg mb-1 transition-colors",
                            selected ? "text-primary-700" : "text-earth-900"
                        )}
                    >
                        {title}
                    </h3>
                    <p className="text-sm text-earth-600">{description}</p>
                </div>
                {selected && (
                    <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </motion.button>
    );
}