"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    ShieldX,
    Search,
    FileText,
    Calendar,
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    Eye,
    X,
    AlertCircle,
    Image as ImageIcon,
    RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { apiRequest, getAuthToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
const SERVER_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1").replace("/api/v1", "");

type TabType = "pending" | "verified" | "rejected";

interface Certificate {
    _id: string;
    certificateNumber: string;
    certificateName: string;
    certificateType: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    isVerified: boolean;
    verifiedAt?: string;
    verificationNotes?: string;
    documentUrl: string;
    documentName: string;
    documentType: string;
    documentSize?: number;
    supplier: {
        _id: string;
        name: string;
        email: string;
        companyName: string;
    };
    verifiedBy?: { name: string; email: string };
}

export default function AdminCertificatesPage() {
    const [tab, setTab] = useState<TabType>("pending");
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Review modal state
    const [reviewCert, setReviewCert] = useState<Certificate | null>(null);
    const [reviewNotes, setReviewNotes] = useState("");
    const [processing, setProcessing] = useState(false);

    const [pendingCount, setPendingCount] = useState(0);

    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiRequest("/certificates?limit=100");
            if (res.success) {
                setCertificates(res.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch certificates:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    useEffect(() => {
        const pending = certificates.filter(
            (c) => !c.isVerified && c.status !== "revoked"
        ).length;
        setPendingCount(pending);
    }, [certificates]);

    const handleVerify = async () => {
        if (!reviewCert) return;
        try {
            setProcessing(true);
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/certificates/${reviewCert._id}/verify`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ notes: reviewNotes }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchCertificates();
                setReviewCert(null);
                setReviewNotes("");
            } else {
                alert(data.message || "Failed to verify certificate");
            }
        } catch (error) {
            console.error("Verify error:", error);
            alert("Failed to verify certificate");
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!reviewCert) return;
        if (!reviewNotes.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }
        try {
            setProcessing(true);
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/certificates/${reviewCert._id}/reject`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ notes: reviewNotes }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchCertificates();
                setReviewCert(null);
                setReviewNotes("");
            } else {
                alert(data.message || "Failed to reject certificate");
            }
        } catch (error) {
            console.error("Reject error:", error);
            alert("Failed to reject certificate");
        } finally {
            setProcessing(false);
        }
    };

    const getFileUrl = (cert: Certificate) =>
        cert.documentUrl?.startsWith("http")
            ? cert.documentUrl
            : `${SERVER_URL}${cert.documentUrl}`;

    const isImage = (cert: Certificate) =>
        cert.documentType?.startsWith("image/") ||
        /\.(jpg|jpeg|png|webp|gif|bmp|tiff|tif|heic|heif|svg)$/i.test(cert.documentName || "");

    const filteredCerts = certificates.filter((c) => {
        const matchesSearch =
            c.certificateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.supplier?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

        if (tab === "pending") return matchesSearch && !c.isVerified && c.status !== "revoked";
        if (tab === "verified") return matchesSearch && c.isVerified;
        if (tab === "rejected") return matchesSearch && c.status === "revoked";
        return matchesSearch;
    });

    const stats = {
        pending: certificates.filter((c) => !c.isVerified && c.status !== "revoked").length,
        verified: certificates.filter((c) => c.isVerified).length,
        rejected: certificates.filter((c) => c.status === "revoked").length,
    };

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    Certificate Verification
                                </h1>
                                <p className="text-earth-600">
                                    Review and verify supplier-uploaded organic certificates
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                leftIcon={<RefreshCw className="w-4 h-4" />}
                                onClick={fetchCertificates}
                                disabled={loading}
                            >
                                Refresh
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Card padding="md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-earth-900">{stats.pending}</p>
                                        <p className="text-sm text-earth-600">Pending Review</p>
                                    </div>
                                </div>
                            </Card>
                            <Card padding="md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-earth-900">{stats.verified}</p>
                                        <p className="text-sm text-earth-600">Verified</p>
                                    </div>
                                </div>
                            </Card>
                            <Card padding="md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <ShieldX className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-earth-900">{stats.rejected}</p>
                                        <p className="text-sm text-earth-600">Rejected</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Tabs + Search */}
                        <Card padding="md">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                {/* Tabs */}
                                <div className="flex bg-secondary-100 rounded-xl p-1 gap-1">
                                    {(["pending", "verified", "rejected"] as TabType[]).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTab(t)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize relative ${
                                                tab === t
                                                    ? "bg-white text-earth-900 shadow-sm"
                                                    : "text-earth-600 hover:text-earth-900"
                                            }`}
                                        >
                                            {t}
                                            {t === "pending" && stats.pending > 0 && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                                                    {stats.pending}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {/* Search */}
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by name, number, or supplier..."
                                        leftIcon={<Search className="w-5 h-5" />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-earth-600 text-lg">Loading certificates...</p>
                        </div>
                    ) : filteredCerts.length === 0 ? (
                        <div className="text-center py-16">
                            <ShieldCheck className="w-16 h-16 text-earth-300 mx-auto mb-4" />
                            <p className="text-earth-600 text-lg font-medium">
                                {tab === "pending" ? "No pending certificates" : `No ${tab} certificates`}
                            </p>
                            <p className="text-earth-500 text-sm mt-1">
                                {tab === "pending" && "All caught up — nothing to review right now."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCerts.map((cert, index) => (
                                <motion.div
                                    key={cert._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <CertCard
                                        cert={cert}
                                        isImageFile={isImage(cert)}
                                        fileUrl={getFileUrl(cert)}
                                        tab={tab}
                                        onReview={() => {
                                            setReviewCert(cert);
                                            setReviewNotes("");
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewCert && (
                    <ReviewModal
                        cert={reviewCert}
                        fileUrl={getFileUrl(reviewCert)}
                        isImageFile={isImage(reviewCert)}
                        notes={reviewNotes}
                        onNotesChange={setReviewNotes}
                        onVerify={handleVerify}
                        onReject={handleReject}
                        onClose={() => { setReviewCert(null); setReviewNotes(""); }}
                        processing={processing}
                        tab={tab}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---------- Certificate Card ---------- */
function CertCard({
    cert,
    isImageFile,
    fileUrl,
    tab,
    onReview,
}: {
    cert: Certificate;
    isImageFile: boolean;
    fileUrl: string;
    tab: TabType;
    onReview: () => void;
}) {
    const daysLeft = Math.ceil(
        (new Date(cert.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const isExpired = daysLeft < 0;

    return (
        <div className="bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300 transition-all p-5 shadow-sm flex flex-col gap-4">
            {/* Top row */}
            <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-secondary-200 flex-shrink-0 bg-secondary-50 flex items-center justify-center">
                    {isImageFile && fileUrl ? (
                        <img src={fileUrl} alt={cert.certificateName} className="w-full h-full object-cover" />
                    ) : isImageFile ? (
                        <ImageIcon className="w-6 h-6 text-blue-400" />
                    ) : (
                        <FileText className="w-6 h-6 text-red-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-earth-900 truncate text-sm leading-tight mb-1">
                        {cert.certificateName}
                    </h3>
                    <p className="text-xs text-earth-500 truncate">{cert.certificateNumber}</p>
                    <p className="text-xs font-medium text-primary-700 mt-1">{cert.certificateType}</p>
                </div>
                {/* Status badge */}
                {tab === "verified" && (
                    <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                    </Badge>
                )}
                {tab === "rejected" && (
                    <Badge variant="danger" size="sm">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                )}
                {tab === "pending" && (
                    <Badge variant="warning" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                )}
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-earth-600">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                        <span className="font-medium text-earth-800">{cert.supplier?.companyName}</span>
                        {" · "}{cert.issuingAuthority}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-earth-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                        Expires:{" "}
                        <span className={`font-medium ${isExpired ? "text-red-600" : daysLeft <= 30 ? "text-amber-600" : "text-green-600"}`}>
                            {new Date(cert.expiryDate).toLocaleDateString()}
                            {!isExpired && ` (${daysLeft}d)`}
                        </span>
                    </span>
                </div>
                {cert.verificationNotes && tab !== "pending" && (
                    <div className="p-2 bg-secondary-50 rounded-lg text-xs text-earth-600 italic">
                        &ldquo;{cert.verificationNotes}&rdquo;
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-secondary-100 flex gap-2">
                <Button
                    variant={tab === "pending" ? "primary" : "outline"}
                    size="sm"
                    className="flex-1"
                    leftIcon={tab === "pending" ? <ShieldCheck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    onClick={onReview}
                >
                    {tab === "pending" ? "Review" : "View Details"}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(fileUrl, "_blank")}
                    title="Open file"
                >
                    <Eye className="w-4 h-4 text-earth-500" />
                </Button>
            </div>
        </div>
    );
}

/* ---------- Review Modal ---------- */
function ReviewModal({
    cert,
    fileUrl,
    isImageFile,
    notes,
    onNotesChange,
    onVerify,
    onReject,
    onClose,
    processing,
    tab,
}: {
    cert: Certificate;
    fileUrl: string;
    isImageFile: boolean;
    notes: string;
    onNotesChange: (v: string) => void;
    onVerify: () => void;
    onReject: () => void;
    onClose: () => void;
    processing: boolean;
    tab: TabType;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
                    <div>
                        <h2 className="font-semibold text-earth-900 text-lg">{cert.certificateName}</h2>
                        <p className="text-sm text-earth-500">{cert.certificateNumber} · {cert.supplier?.companyName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-earth-600" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-0 h-full">
                        {/* Left: Certificate File Preview */}
                        <div className="bg-secondary-50 border-r border-secondary-200 flex items-center justify-center p-4 min-h-64">
                            {isImageFile ? (
                                <img
                                    src={fileUrl}
                                    alt={cert.certificateName}
                                    className="max-w-full max-h-96 object-contain rounded-lg shadow-sm border border-secondary-200"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "";
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : (
                                <iframe
                                    src={fileUrl}
                                    title={cert.certificateName}
                                    className="w-full h-80 rounded-lg border border-secondary-200"
                                />
                            )}
                        </div>

                        {/* Right: Certificate Details + Actions */}
                        <div className="p-6 flex flex-col gap-4">
                            {/* Details */}
                            <div className="space-y-3">
                                <DetailRow label="Type" value={cert.certificateType} />
                                <DetailRow label="Issuing Authority" value={cert.issuingAuthority} />
                                <DetailRow
                                    label="Issue Date"
                                    value={new Date(cert.issueDate).toLocaleDateString()}
                                />
                                <DetailRow
                                    label="Expiry Date"
                                    value={new Date(cert.expiryDate).toLocaleDateString()}
                                />
                                <DetailRow label="Supplier" value={cert.supplier?.companyName} />
                                <DetailRow label="Supplier Email" value={cert.supplier?.email} />
                                <DetailRow
                                    label="File"
                                    value={cert.documentName || "Certificate document"}
                                />
                                {cert.documentSize && (
                                    <DetailRow
                                        label="File Size"
                                        value={`${(cert.documentSize / 1024).toFixed(0)} KB`}
                                    />
                                )}
                            </div>

                            {/* Already verified/rejected notice */}
                            {tab !== "pending" && (
                                <div className={`p-3 rounded-lg text-sm ${
                                    tab === "verified" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
                                }`}>
                                    <div className="flex items-center gap-2 font-medium mb-1">
                                        {tab === "verified"
                                            ? <><CheckCircle className="w-4 h-4" /> Verified</>
                                            : <><XCircle className="w-4 h-4" /> Rejected</>
                                        }
                                    </div>
                                    {cert.verifiedAt && (
                                        <p className="text-xs opacity-80">
                                            {new Date(cert.verifiedAt).toLocaleString()}
                                        </p>
                                    )}
                                    {cert.verificationNotes && (
                                        <p className="mt-1 italic">&ldquo;{cert.verificationNotes}&rdquo;</p>
                                    )}
                                </div>
                            )}

                            {/* Notes input (only for pending) */}
                            {tab === "pending" && (
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">
                                        Verification Notes{" "}
                                        <span className="text-earth-400 font-normal">(required for rejection)</span>
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => onNotesChange(e.target.value)}
                                        rows={3}
                                        placeholder="Add notes about this certificate..."
                                        className="w-full px-3 py-2 text-sm border-2 border-secondary-300 rounded-xl focus:border-primary-500 focus:outline-none resize-none"
                                    />
                                </div>
                            )}

                            {/* Action buttons (only for pending) */}
                            {tab === "pending" && (
                                <div className="flex gap-3 mt-auto pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                        leftIcon={<XCircle className="w-4 h-4" />}
                                        onClick={onReject}
                                        disabled={processing}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        leftIcon={
                                            processing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <ShieldCheck className="w-4 h-4" />
                                            )
                                        }
                                        onClick={onVerify}
                                        disabled={processing}
                                    >
                                        {processing ? "Processing..." : "Verify"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-earth-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm text-earth-900 font-medium">{value || "—"}</span>
        </div>
    );
}
