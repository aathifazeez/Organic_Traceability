"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, QrCode } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        x: [0, -10, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
                />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-20">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-organic mb-6"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-earth-700">
                                100% Organic & Traceable
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl leading-tight text-earth-900 mb-6">
                            Pure Nature,{" "}
                            <span className="text-gradient">Verified Trust</span>
                        </h1>

                        <p className="text-xl text-earth-600 leading-relaxed mb-8 max-w-xl">
                            Experience complete transparency in organic products. Scan QR codes to
                            trace ingredients from farm to your table, with verified certifications
                            every step of the way.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link href="/products">
                                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                    Explore Products
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg">
                                    How It Works
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { icon: ShieldCheck, label: "Certified Organic", value: "100%" },
                                { icon: QrCode, label: "QR Traceable", value: "Every Product" },
                                { icon: Leaf, label: "Eco-Friendly", value: "Sustainable" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <item.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                    <p className="font-semibold text-earth-900">{item.value}</p>
                                    <p className="text-sm text-earth-600">{item.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-square">
                            {/* Main Image */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-3xl overflow-hidden shadow-organic-xl"
                            >
                                <img
                                    src="/images/hero-skincare.png"
                                    alt="Organic Skincare Products"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent" />
                            </motion.div>

                            {/* Floating Card - QR Code */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-organic-xl max-w-xs"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <QrCode className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-earth-900 mb-1">
                                            Scan & Verify
                                        </h4>
                                        <p className="text-sm text-earth-600">
                                            Instant access to full supply chain transparency
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Badge - Certification */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                className="absolute -top-6 -right-6 bg-white rounded-full p-4 shadow-organic-lg"
                            >
                                <div className="text-center">
                                    <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                    <p className="text-xs font-semibold text-earth-900">Certified</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}