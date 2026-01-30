"use client";

import { motion } from "framer-motion";
import { Target, Eye, Award, Users, Leaf, Globe } from "lucide-react";
import Card from "@/components/ui/Card";

const values = [
    {
        icon: Leaf,
        title: "Sustainability",
        description: "Committed to eco-friendly practices and supporting organic farming communities worldwide.",
    },
    {
        icon: Globe,
        title: "Transparency",
        description: "Complete traceability from farm to table with QR-verified supply chains.",
    },
    {
        icon: Award,
        title: "Quality",
        description: "Rigorous certification checks ensuring only the highest quality organic products.",
    },
    {
        icon: Users,
        title: "Community",
        description: "Building trust between suppliers, manufacturers, and conscious consumers.",
    },
];

const stats = [
    { value: "10,000+", label: "Verified Products" },
    { value: "500+", label: "Organic Suppliers" },
    { value: "50+", label: "Countries" },
    { value: "99.9%", label: "Traceability" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white section-padding overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="/images/about-hero.png"
                        alt="Organic Skincare Ingredients"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6">
                            About OrganicTrace
                        </h1>
                        <p className="text-xl text-primary-100">
                            Revolutionizing the organic skincare industry through complete transparency
                            and traceability. Every product, every ingredient, fully verified.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card padding="lg" className="h-full">
                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Target className="w-8 h-8 text-primary-600" />
                                </div>
                                <h2 className="font-serif font-bold text-3xl text-earth-900 mb-4">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-earth-700 leading-relaxed">
                                    To empower consumers with complete transparency in organic
                                    products, ensuring every ingredient is traceable, certified, and
                                    sustainable. We bridge the gap between organic suppliers and
                                    conscious consumers through innovative QR technology.
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card padding="lg" className="h-full">
                                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Eye className="w-8 h-8 text-accent-600" />
                                </div>
                                <h2 className="font-serif font-bold text-3xl text-earth-900 mb-4">
                                    Our Vision
                                </h2>
                                <p className="text-lg text-earth-700 leading-relaxed">
                                    A world where every organic product comes with verifiable proof
                                    of authenticity. Where consumers can make informed choices, and
                                    suppliers are rewarded for their commitment to quality and
                                    sustainability.
                                </p>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="font-serif font-bold text-5xl md:text-6xl text-primary-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-earth-700 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-6">
                            Our Values
                        </h2>
                        <p className="text-xl text-earth-600">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Card hover padding="lg" className="text-center h-full">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Icon className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <h3 className="font-serif font-semibold text-xl text-earth-900 mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-earth-600">{value.description}</p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}