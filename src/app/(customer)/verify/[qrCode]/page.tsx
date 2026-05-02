"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

interface Certificate {
    type: string;
    number: string;
    authority: string;
    status: string;
    expiryDate: string;
}

interface Ingredient {
    ingredientName: string;
    batchNumber: string;
    supplier: { name: string; companyName: string };
    origin: string;
    qualityGrade: string;
    certificates: Certificate[];
}

interface VerificationData {
    verified: boolean;
    qrId: string;
    scanCount: number;
    product: {
        batchNumber: string;
        productName: string;
        category: string;
        skinType: string;
        description: string;
        productionDate: string;
        expiryDate: string;
        manufacturer: { name: string; companyName: string };
    };
    ingredients: Ingredient[];
    certificationSummary: {
        totalCertificates: number;
        uniqueSuppliers: number;
        certificateTypes: string[];
    };
}

export default function QRVerificationPage() {
    const params = useParams();
    const qrCode = params.qrCode as string;
    const [data, setData] = useState<VerificationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${API_URL}/qr/verify/${qrCode}`);
                const json = await res.json();
                if (json.success && json.data) {
                    setData(json.data);
                } else {
                    setError(json.message || "Could not verify this QR code.");
                }
            } catch {
                setError("Failed to connect to verification server.");
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [qrCode]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e8]">
                <Loader2 className="w-12 h-12 text-[#2d6a4f] animate-spin mb-4" />
                <p className="text-[#2d6a4f] font-medium text-lg">Verifying product authenticity...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e8] p-6">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
                <p className="text-gray-600 text-center max-w-sm">{error}</p>
            </div>
        );
    }

    const certifiedIngredients = data.ingredients.filter(
        (ing) => ing.certificates && ing.certificates.length > 0
    );
    const nonCertifiedIngredients = data.ingredients.filter(
        (ing) => !ing.certificates || ing.certificates.length === 0
    );
    const allCertified = certifiedIngredients.length === data.ingredients.length && data.ingredients.length > 0;

    return (
        <div className="min-h-screen bg-[#f5f0e8]">
            <div className="max-w-lg mx-auto shadow-2xl">
                {/* Header */}
                <div className="bg-[#2d6a4f] px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-white font-bold text-xl leading-tight">
                        Product Batch Traceability Certification
                    </h1>
                </div>

                {/* Product Info */}
                <div className="bg-white px-6 py-5">
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>
                            <span className="font-semibold text-gray-800">Product: </span>
                            <span className="font-bold text-[#2d6a4f]">{data.product.productName}</span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800">Product Batch: </span>
                            <span className="font-semibold">{data.product.batchNumber}</span>
                            {data.product.description && (
                                <span className="text-gray-500"> ({data.product.description})</span>
                            )}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800">Certification Status: </span>
                            {allCertified ? (
                                <span className="font-bold text-[#2d6a4f]">Approved and Certified</span>
                            ) : (
                                <span className="font-bold text-amber-600">Partially Certified</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Section Header */}
                {certifiedIngredients.length > 0 && (
                    <>
                        <div className="bg-[#e8dfc8] px-6 py-3 text-center">
                            <h2 className="font-bold text-gray-800 text-sm">
                                Certified Organic/Natural Ingredient Batch Records
                            </h2>
                        </div>

                        {/* Ingredient Records */}
                        <div className="bg-white divide-y divide-gray-100">
                            {certifiedIngredients.map((ing, index) => (
                                <div key={index} className="px-6 py-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] flex-shrink-0" />
                                        <span className="font-bold text-gray-800 text-sm">
                                            {ing.batchNumber} ({ing.ingredientName})
                                        </span>
                                    </div>
                                    <div className="space-y-2 pl-7 text-sm">
                                        <p>
                                            <span className="font-semibold text-gray-800">Supplier Declaration: </span>
                                            <span className="text-gray-600">
                                                Ingredient batch {ing.batchNumber} supplied for manufacturing.
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-800">Admin Verification: </span>
                                            <span className="text-gray-600">
                                                Ingredient batch {ing.batchNumber} confirmed as used in Product Batch {data.product.batchNumber}.
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-800">Certification Status: </span>
                                            <span className="font-bold text-[#2d6a4f]">Approved and Certified.</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Note about non-certified ingredients */}
                {nonCertifiedIngredients.length > 0 && (
                    <div className="bg-white px-6 pb-6 pt-4">
                        <div className="border border-gray-300 rounded-lg p-4 text-sm text-gray-700 bg-[#fafaf7]">
                            <span className="font-bold text-gray-800">Note: </span>
                            Synthetic/support ingredients such as{" "}
                            <span className="font-medium">
                                {nonCertifiedIngredients.map((ing) => ing.ingredientName).join(", ")}
                            </span>{" "}
                            are not included in the organic ingredient certification record.
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-[#f0ebe0] px-6 py-4 text-center text-xs text-gray-500 border-t border-gray-200">
                    <p>Verified by OrganicTrace Blockchain Platform</p>
                    <p className="mt-1">Scan ID: {data.qrId} · Scan #{data.scanCount}</p>
                </div>
            </div>
        </div>
    );
}
