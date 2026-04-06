"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { login, saveCurrentUser, getRoleRedirect } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const result = login(formData.email, formData.password);

            if (result.success && result.user) {
                // Save user to localStorage (in production, use JWT)
                saveCurrentUser(result.user);

                // Redirect based on role
                const redirectUrl = getRoleRedirect(result.user.role);
                router.push(redirectUrl);
            } else {
                setError(result.error || "Login failed. Please try again.");
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your OrganicTrace account"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Demo Credentials Info */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-primary-50 border border-primary-200 rounded-xl"
                >
                    <p className="font-medium text-primary-900 mb-2 text-sm">
                        Demo Credentials:
                    </p>
                    <div className="text-sm text-primary-800 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Supplier:</span>
                            <code className="bg-white px-2 py-0.5 rounded text-xs">
                                supplier@organictrace.com
                            </code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Password:</span>
                            <code className="bg-white px-2 py-0.5 rounded text-xs">
                                supplier123
                            </code>
                        </div>
                        <div className="border-t border-primary-200 my-2"></div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Admin:</span>
                            <code className="bg-white px-2 py-0.5 rounded text-xs">
                                admin@organictrace.com
                            </code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Password:</span>
                            <code className="bg-white px-2 py-0.5 rounded text-xs">
                                admin123
                            </code>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800">{error}</p>
                    </motion.div>
                )}

                {/* Email Input */}
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                {/* Password Input */}
                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-earth-600 hover:text-earth-900 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    }
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-200 cursor-pointer"
                        />
                        <span className="text-sm text-earth-700 group-hover:text-earth-900 transition-colors">
                            Remember me
                        </span>
                    </label>

                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary-600 hover:underline font-medium"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                    {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-secondary-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-secondary-50 text-earth-600">
                            New to OrganicTrace?
                        </span>
                    </div>
                </div>

                {/* Register Link */}
                <Link href="/register">
                    <Button variant="outline" size="lg" className="w-full">
                        Create Supplier Account
                    </Button>
                </Link>

                {/* Additional Info */}
                <p className="text-center text-xs text-earth-600">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}