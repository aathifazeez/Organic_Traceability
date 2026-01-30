"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="/images/contact-hero.png"
                        alt="Organic Skincare Workspace"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-primary-100">
                            Have questions? We'd love to hear from you. Send us a message and
                            we'll respond as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <h2 className="font-serif font-bold text-3xl text-earth-900 mb-6">
                                    Contact Information
                                </h2>

                                <Card padding="lg">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-earth-900 mb-1">Email</h3>

                                            <a
                                                href="mailto:hello@organictrace.com"
                                                className="text-primary-600 hover:underline"
                                            >
                                                hello@organictrace.com
                                            </a>
                                        </div>
                                    </div>
                                </Card>

                                <Card padding="lg">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-accent-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-earth-900 mb-1">Phone</h3>

                                            <a
                                                href="tel:+1234567890"
                                                className="text-primary-600 hover:underline"
                                            >
                                                +1 (234) 567-890
                                            </a>
                                        </div>
                                    </div>
                                </Card>

                                <Card padding="lg">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-earth-900 mb-1">
                                                Address
                                            </h3>
                                            <p className="text-earth-700">
                                                123 Organic Street
                                                <br />
                                                Green City, EC 12345
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2"
                        >
                            <Card padding="lg">
                                <h2 className="font-serif font-bold text-3xl text-earth-900 mb-6">
                                    Send us a Message
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="Your Name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({ ...formData, subject: e.target.value })
                                        }
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-secondary-300 bg-white/50 backdrop-blur-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-300 placeholder:text-earth-400"
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full md:w-auto"
                                        rightIcon={<Send className="w-5 h-5" />}
                                    >
                                        Send Message
                                    </Button>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}