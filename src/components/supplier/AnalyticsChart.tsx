"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

interface AnalyticsChartProps {
    title: string;
    data: { label: string; value: number }[];
    type?: "bar" | "line";
}

export default function AnalyticsChart({
    title,
    data,
    type = "bar",
}: AnalyticsChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <Card padding="lg">
            <h3 className="font-semibold text-lg text-earth-900 mb-6">{title}</h3>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-earth-700">{item.label}</span>
                            <span className="text-sm font-semibold text-earth-900">
                                {item.value}
                            </span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}