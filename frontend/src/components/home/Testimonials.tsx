"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Card from "@/components/ui/Card";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Health Enthusiast",
        avatar: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        text: "Finally, complete transparency! I can see exactly where my food comes from and verify all certifications. This is the future of organic shopping.",
    },
    {
        name: "Michael Chen",
        role: "Restaurant Owner",
        avatar: "https://i.pravatar.cc/150?img=2",
        rating: 5,
        text: "As a chef, knowing the source of every ingredient is crucial. OrganicTrace gives me and my customers peace of mind with QR verification.",
    },
    {
        name: "Emily Rodriguez",
        role: "Organic Farmer",
        avatar: "https://i.pravatar.cc/150?img=3",
        rating: 5,
        text: "This platform has transformed how we connect with customers. Our certifications are visible to everyone, building trust like never before.",
    },
];

export default function Testimonials() {
    return (
        <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
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
                        Loved by Our Community
                    </h2>
                    <p className="text-xl text-earth-600">
                        Join thousands of satisfied customers who trust OrganicTrace for
                        verified organic products.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card hover padding="lg" className="h-full relative">
                                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary-200" />

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-earth-700 leading-relaxed mb-6 relative z-10">
                                    &ldquo;{testimonial.text}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-4 border-t border-secondary-200">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-earth-900">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-earth-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}