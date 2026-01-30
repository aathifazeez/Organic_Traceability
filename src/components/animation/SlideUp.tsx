"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideUpProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export default function SlideUp({
    children,
    delay = 0,
    duration = 0.6,
    className,
}: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}