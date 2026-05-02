"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Eye,
    Award,
    Users,
    Leaf,
    Globe,
    Building2,
    MapPin,
    CheckCircle,
    AlertCircle,
    FileText,
    ExternalLink,
    Loader2,
    X,
} from "lucide-react";
import Card from "@/components/ui/Card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

const IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
];

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

interface Certificate {
    _id: string;
    certificateName: string;
    certificateType: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    documentUrl: string;
    documentType: string;
    documentName: string;
}

interface Supplier {
    _id: string;
    name: string;
    companyName: string;
    bio?: string;
    companyInfo?: string;
    companyAddress?: { country?: string };
    avatar?: string;
    certificates: Certificate[];
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function getCertStatusStyle(status: string) {
    if (status === "expired") return "bg-red-50 text-red-700 border-red-200";
    if (status === "expiring-soon") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

function CertificateModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
    const isImage = IMAGE_TYPES.includes(cert.documentType);
    const fileUrl = `${BACKEND_URL}${cert.documentUrl}`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-100">
                        <div>
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-2 ${getCertStatusStyle(cert.status)}`}
                            >
                                {cert.status === "expired" ? (
                                    <AlertCircle className="w-3.5 h-3.5" />
                                ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                )}
                                {cert.status === "valid"
                                    ? "Verified & Valid"
                                    : cert.status === "expiring-soon"
                                    ? "Expiring Soon"
                                    : "Expired"}
                            </span>
                            <h3 className="font-serif font-bold text-xl text-earth-900">
                                {cert.certificateName}
                            </h3>
                            <p className="text-sm text-earth-500 mt-0.5">{cert.certificateType}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-earth-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50/60 border-b border-gray-100">
                        {[
                            { label: "Issuing Authority", value: cert.issuingAuthority },
                            { label: "Certificate Type", value: cert.certificateType },
                            {
                                label: "Issue Date",
                                value: new Date(cert.issueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }),
                            },
                            {
                                label: "Expiry Date",
                                value: new Date(cert.expiryDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }),
                            },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-earth-400 uppercase tracking-wide mb-1">
                                    {item.label}
                                </p>
                                <p className="text-sm font-medium text-earth-800">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Document Preview */}
                    <div className="p-6">
                        <p className="text-xs text-earth-400 uppercase tracking-wide mb-3">
                            Certificate Document
                        </p>
                        {isImage ? (
                            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                    src={fileUrl}
                                    alt={cert.certificateName}
                                    className="w-full object-contain max-h-72"
                                />
                            </div>
                        ) : (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                                <object
                                    data={fileUrl}
                                    type="application/pdf"
                                    className="w-full h-64"
                                >
                                    <div className="flex flex-col items-center justify-center h-64 text-earth-400 gap-3">
                                        <FileText className="w-10 h-10 text-earth-300" />
                                        <p className="text-sm">PDF preview not supported in this browser</p>
                                    </div>
                                </object>
                            </div>
                        )}
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open in New Tab
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function SupplierCard({ supplier, index }: { supplier: Supplier; index: number }) {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [showAll, setShowAll] = useState(false);

    const visibleCerts = showAll ? supplier.certificates : supplier.certificates.slice(0, 3);
    const description =
        supplier.bio ||
        supplier.companyInfo ||
        "Certified organic ingredient supplier committed to sustainable and ethical sourcing practices.";
    const country = supplier.companyAddress?.country;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
                <div className="p-6 pb-4 flex-1">
                    {/* Supplier header */}
                    <div className="flex items-start gap-4 mb-4">
                        {supplier.avatar ? (
                            <img
                                src={`${BACKEND_URL}${supplier.avatar}`}
                                alt={supplier.companyName || supplier.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-primary-100 flex-shrink-0"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center border-2 border-primary-100 flex-shrink-0">
                                <span className="text-primary-700 font-bold text-lg">
                                    {getInitials(supplier.companyName || supplier.name)}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-earth-900 leading-tight">
                                        {supplier.companyName || supplier.name}
                                    </h3>
                                    <p className="text-sm text-earth-500">{supplier.name}</p>
                                </div>
                                <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Verified
                                </span>
                            </div>
                            {country && (
                                <p className="flex items-center gap-1 mt-1.5 text-xs text-earth-400">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {country}
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-earth-600 leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>

                {/* Certificates */}
                <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                    {supplier.certificates.length === 0 ? (
                        <p className="text-xs text-earth-300 italic">No certificates on display</p>
                    ) : (
                        <>
                            <p className="text-xs text-earth-400 uppercase tracking-wide font-medium mb-3">
                                {supplier.certificates.length} Verified Certificate
                                {supplier.certificates.length !== 1 ? "s" : ""}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {visibleCerts.map((cert) => (
                                    <button
                                        key={cert._id}
                                        onClick={() => setSelectedCert(cert)}
                                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:shadow-sm hover:scale-105 ${getCertStatusStyle(cert.status)}`}
                                    >
                                        {cert.status === "expired" ? (
                                            <AlertCircle className="w-3.5 h-3.5" />
                                        ) : (
                                            <Award className="w-3.5 h-3.5" />
                                        )}
                                        {cert.certificateType}
                                    </button>
                                ))}
                                {!showAll && supplier.certificates.length > 3 && (
                                    <button
                                        onClick={() => setShowAll(true)}
                                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-earth-500 hover:bg-gray-50 transition-colors"
                                    >
                                        +{supplier.certificates.length - 3} more
                                    </button>
                                )}
                            </div>
                            <p className="mt-3 text-xs text-earth-400">
                                Click a badge to view the certificate document
                            </p>
                        </>
                    )}
                </div>
            </motion.div>

            {selectedCert && (
                <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
            )}
        </>
    );
}

export default function AboutPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await fetch(`${API_URL}/public/suppliers`);
                const data = await res.json();
                if (data.success && data.data?.suppliers) {
                    setSuppliers(data.data.suppliers);
                }
            } catch (error) {
                console.error("Failed to fetch suppliers:", error);
            } finally {
                setLoadingSuppliers(false);
            }
        };

        fetchSuppliers();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-cream">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white section-padding overflow-hidden">
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

            {/* Our Suppliers */}
            <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                            <Building2 className="w-4 h-4" />
                            Verified Partners
                        </div>
                        <h2 className="font-serif font-bold text-4xl md:text-5xl text-earth-900 mb-6">
                            Our Suppliers
                        </h2>
                        <p className="text-xl text-earth-600">
                            Every supplier below has been reviewed and approved by our team. Their
                            certifications are independently verified — click any badge to view the
                            original certificate document.
                        </p>
                    </motion.div>

                    {loadingSuppliers ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                            <p className="text-earth-500 text-lg">Loading verified suppliers...</p>
                        </div>
                    ) : suppliers.length === 0 ? (
                        <div className="text-center py-24">
                            <Building2 className="w-16 h-16 text-earth-200 mx-auto mb-4" />
                            <p className="text-earth-400 text-xl font-medium mb-2">
                                No suppliers listed yet
                            </p>
                            <p className="text-earth-400 text-sm">
                                We&apos;re onboarding our verified partners. Check back soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suppliers.map((supplier, i) => (
                                <SupplierCard key={supplier._id} supplier={supplier} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
