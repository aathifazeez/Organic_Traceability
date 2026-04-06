"use client";

import { useState } from "react";
import { QrCode, Download, Share2, Copy, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

interface QRCodeGeneratorProps {
    productBatch: {
        id: string;
        name: string;
        batchNumber: string;
        qrCode: string;
    };
}

export default function QRCodeGenerator({ productBatch }: QRCodeGeneratorProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(
            `https://organictrace.com/verify/${productBatch.qrCode}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        // Implement QR code download
        console.log("Download QR code");
    };

    const handleShare = () => {
        // Implement share functionality
        console.log("Share QR code");
    };

    return (
        <Card padding="lg">
            <div className="text-center">
                {/* QR Code Display */}
                <div className="inline-block p-8 bg-white rounded-2xl shadow-organic-lg mb-6">
                    {/* Placeholder QR Code - Replace with actual QR code library */}
                    <div className="w-64 h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-primary-600" />
                    </div>
                </div>

                {/* Product Info */}
                <h3 className="font-serif font-bold text-xl text-earth-900 mb-2">
                    {productBatch.name}
                </h3>
                <p className="text-earth-600 mb-4">Batch: {productBatch.batchNumber}</p>

                {/* QR Code Link */}
                <div className="mb-6 p-4 bg-secondary-50 rounded-xl max-w-md mx-auto">
                    <p className="text-sm text-earth-600 mb-2">Verification Link</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm text-primary-700 font-mono truncate">
                            organictrace.com/verify/{productBatch.qrCode}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-earth-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-3">
                    <Button
                        leftIcon={<Download className="w-5 h-5" />}
                        onClick={handleDownload}
                    >
                        Download QR
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Share2 className="w-5 h-5" />}
                        onClick={handleShare}
                    >
                        Share
                    </Button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl text-left">
                    <p className="text-sm text-primary-900">
                        <strong>Note:</strong> This QR code allows customers to verify the
                        authenticity of your product and view complete ingredient traceability.
                    </p>
                </div>
            </div>
        </Card>
    );
}