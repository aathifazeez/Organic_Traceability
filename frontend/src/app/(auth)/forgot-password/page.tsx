"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <AuthLayout
            title={isSubmitted ? "Check Your Email" : "Forgot Password?"}
            subtitle={
                isSubmitted
                    ? "We've sent you a reset link"
                    : "Enter your email to reset your password"
            }
        >
            {!isSubmitted ? (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-red-800 font-medium">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Info Message */}
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                        <p className="text-sm text-earth-700">
                            Enter the email address associated with your account and we'll send
                            you a link to reset your password.
                        </p>
                    </div>

                    {/* Email Input */}
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="your@email.com"
                        leftIcon={<Mail className="w-5 h-5" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Send Reset Link
                    </Button>

                    {/* Back to Login */}
                    <Link href="/login">
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            className="w-full"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                        >
                            Back to Login
                        </Button>
                    </Link>
                </motion.form>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <p className="text-earth-700 mb-8">
                        We've sent a password reset link to{" "}
                        <span className="font-semibold text-earth-900">{email}</span>. Please
                        check your inbox and follow the instructions.
                    </p>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
                        <p className="text-sm text-amber-800">
                            Didn't receive the email? Check your spam folder or{" "}
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="font-semibold text-amber-900 hover:underline"
                            >
                                try again
                            </button>
                        </p>
                    </div>

                    <Link href="/login">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                        >
                            Back to Login
                        </Button>
                    </Link>
                </motion.div>
            )}
        </AuthLayout>
    );
}