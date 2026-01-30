"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Leaf
} from "lucide-react";

const footerLinks = {
    company: [
        { label: "About Us", href: "/about" },
        { label: "Our Story", href: "/story" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
    ],
    products: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products?filter=new" },
        { label: "Best Sellers", href: "/products?filter=bestsellers" },
        { label: "Certifications", href: "/certifications" },
    ],
    support: [
        { label: "Help Center", href: "/help" },
        { label: "Track Order", href: "/orders" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Accessibility", href: "/accessibility" },
    ],
};

const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-earth-900 text-white mt-24">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Logo variant="light" className="mb-6" />
                        <p className="text-earth-300 mb-6 max-w-sm">
                            Transparent supply chain for organic products. Verify the authenticity
                            and quality of every ingredient with our QR traceability system.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-earth-300">
                                <Mail className="w-5 h-5 text-primary-400" />
                                <a href="mailto:hello@organictrace.com" className="hover:text-white transition-colors">
                                    hello@organictrace.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-earth-300">
                                <Phone className="w-5 h-5 text-primary-400" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-earth-300">
                                <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                                <span>123 Organic Street, Green City, EC 12345</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h4 className="font-serif font-semibold text-lg mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-earth-300 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-semibold text-lg mb-4">Products</h4>
                        <ul className="space-y-2">
                            {footerLinks.products.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-earth-300 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-semibold text-lg mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-earth-300 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="mt-12 pt-12 border-t border-earth-700">
                    <div className="max-w-xl">
                        <h4 className="font-serif font-semibold text-2xl mb-2 flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-primary-400" />
                            Join Our Green Community
                        </h4>
                        <p className="text-earth-300 mb-6">
                            Get updates on new organic products and exclusive offers.
                        </p>
                        <form className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-full bg-earth-800 border border-earth-700 text-white placeholder:text-earth-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-earth-800 rounded-full transition-colors"
                            aria-label={social.label}
                        >
                            <Icon className="w-5 h-5 text-earth-400 hover:text-white transition-colors" />
                        </a>
                    );
                })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
                {footerLinks.legal.map((link, index) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-earth-400 hover:text-white transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </footer >
    );
}