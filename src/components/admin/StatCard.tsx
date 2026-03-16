"use client";

import { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon: LucideIcon;
    color: string;
    delay?: number;
}

export default function StatCard({
    title,
    value,
    change,
    trend = "neutral",
    icon: Icon,
    color,
    delay = 0,
}: StatCardProps) {
    const trendColors = {
        up: "text-green-600",
        down: "text-red-600",
        neutral: "text-earth-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card hover padding="lg">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {change && (
                        <div className={`text-sm font-medium ${trendColors[trend]}`}>
                            {change}
                        </div>
                    )}
                </div>
                <p className="text-sm text-earth-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-earth-900">{value}</p>
            </Card>
        </motion.div>
    );
}