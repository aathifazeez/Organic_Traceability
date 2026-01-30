"use client";

import { motion } from "framer-motion";
import { Sprout, Package, QrCode, ShieldCheck } from "lucide-react";

const steps = [
    {
        icon: Sprout,
        title: "Certified Suppliers",
        description:
            "Organic suppliers upload ingredient batches with verified certifications from recognized bodies.",
        step: "01",
    },
    {
        icon: Package,
        title: "Product Creation",
        description:
            "Manufacturers link certified ingredients to create traceable product batches with full transparency.",
        step: "02",
    },
    {
        icon: QrCode,
        title: "QR Generation",
        description:
            "Each product gets a unique QR code containing complete supply chain and certification data.",
        step: "03",
    },
    {
        icon: ShieldCheck,
        title: "Customer Verification",
        description:
            "Scan the QR code to instantly verify authenticity, view ingredients, suppliers, and certificates.",
        step: "04",
    },
];

export default function HowItWorks() {
    return (
        <section className="section-padding bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-64 h-64 border-2 border-primary-600 rounded-full" />
                <div className="absolute bottom-20 right-20 w-80 h-80 border-2 border-accent-600 rounded-full" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl text-earth-600">
                        Our transparent supply chain ensures every product is traceable from
                        farm to your table in four simple steps.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="relative"
                            >
                                {/* Connecting Line (desktop only) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-16 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-primary-300 to-primary-200" />
                                )}

                                <div className="relative bg-white rounded-3xl p-8 shadow-organic hover:shadow-organic-lg transition-all duration-500 border-2 border-secondary-100 hover:border-primary-200">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-primary-600" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-serif font-semibold text-xl text-earth-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-earth-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}