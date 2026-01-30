"use client";

import { motion } from "framer-motion";
import {
    QrCode,
    Shield,
    Leaf,
    TrendingUp,
    Users,
    Award,
} from "lucide-react";
import Card from "@/components/ui/Card";

const features = [
    {
        icon: QrCode,
        title: "QR Traceability",
        description:
            "Scan any product to instantly view its complete journey from farm to table with full transparency.",
        color: "bg-primary-100 text-primary-600",
    },
    {
        icon: Shield,
        title: "Verified Certificates",
        description:
            "All suppliers provide certified organic documents with expiry tracking and authenticity validation.",
        color: "bg-green-100 text-green-600",
    },
    {
        icon: Leaf,
        title: "100% Organic",
        description:
            "Every ingredient is sourced from certified organic suppliers committed to sustainable practices.",
        color: "bg-accent-100 text-accent-600",
    },
    {
        icon: TrendingUp,
        title: "Real-Time Tracking",
        description:
            "Monitor your orders and view live updates on ingredient batch status and certificate validity.",
        color: "bg-blue-100 text-blue-600",
    },
    {
        icon: Users,
        title: "Supplier Network",
        description:
            "Connect with a trusted network of verified organic suppliers and manufacturers worldwide.",
        color: "bg-purple-100 text-purple-600",
    },
    {
        icon: Award,
        title: "Quality Assured",
        description:
            "Rigorous quality checks and admin monitoring ensure only the best products reach you.",
        color: "bg-amber-100 text-amber-600",
    },
];

export default function Features() {
    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-6">
                        Why Choose OrganicTrace?
                    </h2>
                    <p className="text-xl text-earth-600">
                        Experience transparency, trust, and sustainability in every product
                        you purchase. Our innovative platform ensures complete traceability.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card hover padding="lg" className="h-full">
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-serif font-semibold text-2xl text-earth-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-earth-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}