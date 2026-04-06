"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle,
    Building2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { register, validatePassword, validateEmail } from "@/lib/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const passwordValidation = validatePassword(formData.password);
    const emailValid = validateEmail(formData.email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validation
        if (!formData.fullName.trim()) {
            setError("Please enter your full name");
            setIsLoading(false);
            return;
        }

        if (!formData.companyName.trim()) {
            setError("Please enter your company name");
            setIsLoading(false);
            return;
        }

        if (!emailValid) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0]);
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (!formData.agreeToTerms) {
            setError("Please accept the terms and conditions");
            setIsLoading(false);
            return;
        }

        // Simulate registration API call
        setTimeout(() => {
            const result = register({
                email: formData.email,
                password: formData.password,
                name: formData.companyName,
                role: "supplier", // Always supplier for public registration
                companyInfo: `${formData.fullName} - ${formData.companyName}`,
            });

            if (result.success) {
                setShowSuccess(true);
                // Don't redirect - show pending approval message
            } else {
                setError(result.error || "Registration failed. Please try again.");
            }
            setIsLoading(false);
        }, 1500);
    };

    // Success screen after registration
    if (showSuccess) {
        return (
            <AuthLayout
                title="Registration Submitted!"
                subtitle="Your supplier account is pending approval"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h3 className="font-serif font-semibold text-2xl text-earth-900 mb-4">
                        Thank You for Registering!
                    </h3>

                    <div className="mb-8 text-left">
                        <p className="text-earth-700 mb-4">
                            Your supplier registration has been submitted successfully. Here's
                            what happens next:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-earth-700">
                                    Our admin team will review your supplier application and
                                    submitted information
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-earth-700">
                                    You'll receive an email notification once your account is
                                    approved (usually within 1-2 business days)
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-earth-700">
                                    After approval, you can login and start adding ingredient
                                    batches and certificates
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>Tip:</strong> While waiting for approval, prepare your
                            organic certificates and ingredient batch information for quick
                            onboarding!
                        </p>
                    </div>

                    <Link href="/login">
                        <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
                            Go to Login
                        </Button>
                    </Link>
                </motion.div>
            </AuthLayout>
        );
    }

    // Registration form
    return (
        <AuthLayout
            title="Register as Supplier"
            subtitle="Create your supplier account to provide organic ingredients"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                >
                    <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-900 mb-1">
                                Supplier Registration
                            </p>
                            <p className="text-sm text-blue-700">
                                Your account will be reviewed by our admin team before activation.
                                Please provide accurate company information.
                            </p>
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

                {/* Form Fields */}
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    leftIcon={<User className="w-5 h-5" />}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                />

                <Input
                    label="Company Name"
                    type="text"
                    placeholder="Natural Oils Co."
                    leftIcon={<Building2 className="w-5 h-5" />}
                    value={formData.companyName}
                    onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                    }
                    required
                    helperText="This will be your supplier display name on the platform"
                />

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="contact@example.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={formData.email && !emailValid ? "Invalid email format" : ""}
                    required
                />

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

                {/* Password Requirements */}
                {formData.password && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm space-y-2"
                    >
                        <p className="font-medium text-earth-700">Password requirements:</p>
                        <ul className="space-y-1">
                            {[
                                {
                                    label: "At least 8 characters",
                                    valid: formData.password.length >= 8,
                                },
                                {
                                    label: "Contains uppercase letter",
                                    valid: /[A-Z]/.test(formData.password),
                                },
                                {
                                    label: "Contains lowercase letter",
                                    valid: /[a-z]/.test(formData.password),
                                },
                                {
                                    label: "Contains number",
                                    valid: /\d/.test(formData.password),
                                },
                            ].map((req, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center gap-2 transition-colors ${req.valid ? "text-green-600" : "text-earth-600"
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {req.label}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-earth-600 hover:text-earth-900 transition-colors"
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
                    error={
                        formData.confirmPassword &&
                            formData.password !== formData.confirmPassword
                            ? "Passwords do not match"
                            : ""
                    }
                    required
                />

                {/* Terms and Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                            setFormData({ ...formData, agreeToTerms: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-2 border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-200 mt-0.5 cursor-pointer"
                    />
                    <span className="text-sm text-earth-700">
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-primary-600 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-primary-600 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Privacy Policy
                        </Link>
                    </span>
                </label>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                    {isLoading ? "Creating Account..." : "Register as Supplier"}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-earth-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-primary-600 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}