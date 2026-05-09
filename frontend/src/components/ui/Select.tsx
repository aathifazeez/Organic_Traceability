"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "w-full px-4 py-3 pr-10 rounded-2xl border-2 bg-white/50 backdrop-blur-sm appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-200",
                            error
                                ? "border-red-400 focus:border-red-500"
                                : "border-secondary-300 focus:border-primary-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400 pointer-events-none" />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;