"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Building2,
    ShoppingBag,
    Factory,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import RoleCard from "@/components/auth/RoleCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const roles = [
    {
        id: "customer",
        icon: ShoppingBag,
        title: "Customer",
        description: "Browse and purchase verified organic products",
    },
    {
        id: "supplier",
        icon: Building2,
        title: "Supplier",
        description: "Upload ingredient batches and certifications",
    },
    {
        id: "manufacturer",
        icon: Factory,
        title: "Manufacturer",
        description: "Create products and generate QR codes",
    },
];

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState("customer");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleNextStep = () => {
        setError("");
        if (step === 1) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.agreeToTerms) {
            setError("Please agree to the terms and conditions");
            return;
        }

        if (
            (selectedRole === "supplier" || selectedRole === "manufacturer") &&
            !formData.companyName
        ) {
            setError("Company name is required");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Redirect based on role
            if (selectedRole === "customer") {
                router.push("/");
            } else {
                // Show pending approval message
                setStep(3);
            }
        }, 1500);
    };

    return (
        <AuthLayout
            title={step === 3 ? "Registration Submitted!" : "Create Account"}
            subtitle={
                step === 3
                    ? "Your account is pending approval"
                    : "Join OrganicTrace today"
            }
        >
            <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="space-y-4 mb-6">
                            <p className="text-sm text-earth-600 mb-4">
                                Select your account type to get started
                            </p>
                            {roles.map((role) => (
                                <RoleCard
                                    key={role.id}
                                    icon={role.icon}
                                    title={role.title}
                                    description={role.description}
                                    selected={selectedRole === role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                />
                            ))}
                        </div>

                        {selectedRole !== "customer" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-900 mb-1">
                                            Approval Required
                                        </p>
                                        <p className="text-sm text-amber-800">
                                            Supplier and Manufacturer accounts require admin approval
                                            before activation.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <Button
                            type="button"
                            size="lg"
                            className="w-full"
                            onClick={handleNextStep}
                        >
                            Continue
                        </Button>

                        <p className="text-center text-sm text-earth-600 mt-6">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                )}

                {/* Step 2: Registration Form */}
                {step === 2 && (
                    <motion.form
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
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

                        {/* Full Name */}
                        <Input
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            leftIcon={<User className="w-5 h-5" />}
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                        />

                        {/* Company Name (for suppliers and manufacturers) */}
                        {(selectedRole === "supplier" ||
                            selectedRole === "manufacturer") && (
                                <Input
                                    type="text"
                                    label="Company Name"
                                    placeholder="Your Company Ltd."
                                    leftIcon={<Building2 className="w-5 h-5" />}
                                    value={formData.companyName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, companyName: e.target.value })
                                    }
                                    required
                                />
                            )}

                        {/* Email */}
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="your@email.com"
                            leftIcon={<Mail className="w-5 h-5" />}
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            required
                        />

                        {/* Password */}
                        <Input
                            type={showPassword ? "text" : "password"}
                            label="Password"
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

                        {/* Confirm Password */}
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
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

                        {/* Terms and Conditions */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) =>
                                    setFormData({ ...formData, agreeToTerms: e.target.checked })
                                }
                                className="w-5 h-5 mt-0.5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-earth-700">
                                I agree to the{" "}
                                <Link
                                    href="/terms"
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <div className="space-y-3">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Create Account
                            </Button>
                            <Button
                                type="button"
                                size="lg"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                        </div>

                        <p className="text-center text-sm text-earth-600 mt-6">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.form>
                )}

                {/* Step 3: Success Message (for suppliers/manufacturers) */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h3 className="font-serif font-bold text-2xl text-earth-900 mb-4">
                            Registration Submitted!
                        </h3>

                        <p className="text-earth-600 mb-6">
                            Your {selectedRole} account has been created and is pending admin
                            approval. You'll receive an email notification once your account is
                            activated.
                        </p>

                        <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl mb-8">
                            <h4 className="font-semibold text-earth-900 mb-2">
                                What happens next?
                            </h4>
                            <ul className="text-sm text-earth-700 space-y-2 text-left">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-600 mt-1">✓</span>
                                    <span>Admin will review your registration details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-600 mt-1">✓</span>
                                    <span>You'll receive an email within 24-48 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-600 mt-1">✓</span>
                                    <span>Once approved, you can log in and start using your account</span>
                                </li>
                            </ul>
                        </div>

                        <Link href="/login">
                            <Button size="lg" className="w-full">
                                Go to Login
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
}