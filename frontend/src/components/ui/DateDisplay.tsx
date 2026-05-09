"use client";

interface DateDisplayProps {
    date: string | Date;
    format?: "short" | "long" | "relative";
    className?: string;
}

export default function DateDisplay({
    date,
    format = "short",
    className = "",
}: DateDisplayProps) {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const formatDate = () => {
        switch (format) {
            case "short":
                // Format: Jan 29, 2024
                return dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
            case "long":
                // Format: January 29, 2024
                return dateObj.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
            case "relative":
                // Format: 2 days ago
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - dateObj.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0) return "Today";
                if (diffDays === 1) return "Yesterday";
                if (diffDays < 7) return `${diffDays} days ago`;
                if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
                if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
                return `${Math.floor(diffDays / 365)} years ago`;
            default:
                return dateObj.toLocaleDateString();
        }
    };

    return (
        <span className={className} suppressHydrationWarning>
            {formatDate()}
        </span>
    );
}