"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (!token) {
            setError("Invalid or expired reset token");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }, 1500);
    };

    if (!token) {
        return (
            <AuthLayout title="Invalid Link" subtitle="This reset link is invalid or expired">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <p className="text-earth-700 mb-8">
                        This password reset link is invalid or has expired. Please request a
                        new password reset link.
                    </p>
                    <Link href="/forgot-password">
                        <Button size="lg" className="w-full">
                            Request New Link
                        </Button>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={isSuccess ? "Password Reset!" : "Reset Password"}
            subtitle={
                isSuccess
                    ? "Your password has been updated"
                    : "Enter your new password"
            }
        >
            {!isSuccess ? (
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

                    {/* New Password */}
                    <Input
                        type={showPassword ? "text" : "password"}
                        label="New Password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="w-5 h-5" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="hover:text-primary-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        }
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        helperText="Must be at least 8 characters"
                        required
                    />

                    {/* Confirm New Password */}
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm New Password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="w-5 h-5" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="hover:text-primary-600 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        }
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        required
                    />

                    {/* Password Requirements */}
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                        <p className="text-sm font-medium text-earth-900 mb-2">
                            Password Requirements:
                        </p>
                        <ul className="text-sm text-earth-700 space-y-1">
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        formData.password.length >= 8
                                            ? "text-green-600"
                                            : "text-earth-400"
                                    }
                                >
                                    ✓
                                </span>
                                At least 8 characters
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        /[A-Z]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-earth-400"
                                    }
                                >
                                    ✓
                                </span>
                                One uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        /[0-9]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-earth-400"
                                    }
                                >
                                    ✓
                                </span>
                                One number
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Reset Password
                    </Button>

                    {/* Back to Login */}
                    <Link href="/login">
                        <Button type="button" variant="ghost" size="lg" className="w-full">
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
                        Your password has been successfully reset. You can now log in with
                        your new password.
                    </p>

                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl mb-8">
                        <p className="text-sm text-earth-700">
                            Redirecting to login page in 3 seconds...
                        </p>
                    </div>

                    <Link href="/login">
                        <Button size="lg" className="w-full">
                            Go to Login
                        </Button>
                    </Link>
                </motion.div>
            )}
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <AuthLayout title="Reset Password" subtitle="Loading...">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            </AuthLayout>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}