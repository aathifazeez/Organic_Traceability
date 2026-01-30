"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    CreditCard,
    Package,
    CheckCircle,
    ArrowLeft,
    Lock,
    Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const steps = [
    { id: 1, name: "Shipping", icon: MapPin },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Package },
];

const orderItems = [
    {
        id: "1",
        name: "Organic Rose Face Cream",
        variant: "50ml",
        price: 45.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=80",
    },
    {
        id: "2",
        name: "Vitamin C Serum",
        variant: "30ml",
        price: 38.50,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=80",
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
    });

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
    });

    const [shippingMethod, setShippingMethod] = useState("standard");

    const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = shippingMethod === "express" ? 12.99 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        // Simulate order processing
        setTimeout(() => {
            router.push("/orders/123456");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-cream">
            <div className="container-custom py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                            className="mb-4"
                        >
                            Back to Cart
                        </Button>
                    </Link>
                    <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                        Checkout
                    </h1>
                    <p className="text-earth-600">Complete your order securely</p>
                </motion.div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                                    ? "bg-green-600 text-white"
                                                    : isActive
                                                        ? "bg-primary-600 text-white"
                                                        : "bg-secondary-200 text-earth-600"
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${isActive || isCompleted
                                                    ? "text-earth-900"
                                                    : "text-earth-600"
                                                }`}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-4 transition-all ${isCompleted ? "bg-green-600" : "bg-secondary-300"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Shipping Information */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card padding="lg">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                            Shipping Information
                                        </h2>
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <Input
                                                    label="First Name"
                                                    placeholder="John"
                                                    value={shippingData.firstName}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            firstName: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <Input
                                                    label="Last Name"
                                                    placeholder="Doe"
                                                    value={shippingData.lastName}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            lastName: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <Input
                                                    type="email"
                                                    label="Email Address"
                                                    placeholder="john@example.com"
                                                    value={shippingData.email}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <Input
                                                    label="Phone Number"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={shippingData.phone}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <Input
                                                label="Street Address"
                                                placeholder="123 Beauty Lane"
                                                value={shippingData.address}
                                                onChange={(e) =>
                                                    setShippingData({
                                                        ...shippingData,
                                                        address: e.target.value,
                                                    })
                                                }
                                                required
                                            />

                                            <div className="grid md:grid-cols-3 gap-6">
                                                <Input
                                                    label="City"
                                                    placeholder="Los Angeles"
                                                    value={shippingData.city}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            city: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <Input
                                                    label="State"
                                                    placeholder="CA"
                                                    value={shippingData.state}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            state: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <Input
                                                    label="ZIP Code"
                                                    placeholder="90001"
                                                    value={shippingData.zipCode}
                                                    onChange={(e) =>
                                                        setShippingData({
                                                            ...shippingData,
                                                            zipCode: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <Select
                                                label="Country"
                                                options={[
                                                    { value: "United States", label: "United States" },
                                                    { value: "Canada", label: "Canada" },
                                                    { value: "United Kingdom", label: "United Kingdom" },
                                                ]}
                                                value={shippingData.country}
                                                onChange={(e) =>
                                                    setShippingData({
                                                        ...shippingData,
                                                        country: e.target.value,
                                                    })
                                                }
                                            />

                                            {/* Shipping Method */}
                                            <div>
                                                <label className="block text-sm font-medium text-earth-700 mb-4">
                                                    Shipping Method
                                                </label>
                                                <div className="space-y-3">
                                                    <label className="flex items-center p-4 border-2 border-secondary-300 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="shipping"
                                                            value="standard"
                                                            checked={shippingMethod === "standard"}
                                                            onChange={(e) => setShippingMethod(e.target.value)}
                                                            className="w-5 h-5 text-primary-600"
                                                        />
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-semibold text-earth-900">
                                                                        Standard Shipping
                                                                    </p>
                                                                    <p className="text-sm text-earth-600">
                                                                        5-7 business days
                                                                    </p>
                                                                </div>
                                                                <p className="font-semibold text-earth-900">
                                                                    $5.99
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-center p-4 border-2 border-secondary-300 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="shipping"
                                                            value="express"
                                                            checked={shippingMethod === "express"}
                                                            onChange={(e) => setShippingMethod(e.target.value)}
                                                            className="w-5 h-5 text-primary-600"
                                                        />
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-semibold text-earth-900 flex items-center gap-2">
                                                                        Express Shipping
                                                                        <Badge variant="info" size="sm">
                                                                            Fast
                                                                        </Badge>
                                                                    </p>
                                                                    <p className="text-sm text-earth-600">
                                                                        2-3 business days
                                                                    </p>
                                                                </div>
                                                                <p className="font-semibold text-earth-900">
                                                                    $12.99
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <Button
                                                size="lg"
                                                className="w-full"
                                                onClick={handleNextStep}
                                            >
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 2: Payment Information */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card padding="lg">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Lock className="w-5 h-5 text-green-600" />
                                            <h2 className="font-serif font-bold text-2xl text-earth-900">
                                                Payment Information
                                            </h2>
                                        </div>

                                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                                            <p className="text-sm text-green-800">
                                                <Lock className="w-4 h-4 inline mr-1" />
                                                Your payment information is secure and encrypted
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <Input
                                                label="Card Number"
                                                placeholder="1234 5678 9012 3456"
                                                value={paymentData.cardNumber}
                                                onChange={(e) =>
                                                    setPaymentData({
                                                        ...paymentData,
                                                        cardNumber: e.target.value,
                                                    })
                                                }
                                                required
                                            />

                                            <Input
                                                label="Cardholder Name"
                                                placeholder="John Doe"
                                                value={paymentData.cardName}
                                                onChange={(e) =>
                                                    setPaymentData({
                                                        ...paymentData,
                                                        cardName: e.target.value,
                                                    })
                                                }
                                                required
                                            />

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <Input
                                                    label="Expiry Date"
                                                    placeholder="MM/YY"
                                                    value={paymentData.expiryDate}
                                                    onChange={(e) =>
                                                        setPaymentData({
                                                            ...paymentData,
                                                            expiryDate: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <Input
                                                    label="CVV"
                                                    placeholder="123"
                                                    value={paymentData.cvv}
                                                    onChange={(e) =>
                                                        setPaymentData({
                                                            ...paymentData,
                                                            cvv: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="flex-1"
                                                    onClick={() => setCurrentStep(1)}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    className="flex-1"
                                                    onClick={handleNextStep}
                                                >
                                                    Review Order
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 3: Review Order */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Shipping Address */}
                                    <Card padding="lg">
                                        <h3 className="font-semibold text-lg text-earth-900 mb-4">
                                            Shipping Address
                                        </h3>
                                        <div className="text-earth-700">
                                            <p className="font-medium">
                                                {shippingData.firstName} {shippingData.lastName}
                                            </p>
                                            <p>{shippingData.address}</p>
                                            <p>
                                                {shippingData.city}, {shippingData.state}{" "}
                                                {shippingData.zipCode}
                                            </p>
                                            <p>{shippingData.country}</p>
                                            <p className="mt-2">{shippingData.phone}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => setCurrentStep(1)}
                                        >
                                            Edit
                                        </Button>
                                    </Card>

                                    {/* Payment Method */}
                                    <Card padding="lg">
                                        <h3 className="font-semibold text-lg text-earth-900 mb-4">
                                            Payment Method
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                                                VISA
                                            </div>
                                            <span className="text-earth-700">
                                                •••• •••• •••• {paymentData.cardNumber.slice(-4)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => setCurrentStep(2)}
                                        >
                                            Edit
                                        </Button>
                                    </Card>

                                    {/* Order Items */}
                                    <Card padding="lg">
                                        <h3 className="font-semibold text-lg text-earth-900 mb-4">
                                            Order Items
                                        </h3>
                                        <div className="space-y-4">
                                            {orderItems.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-20 h-20 rounded-xl object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-earth-900">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-earth-600">
                                                            {item.variant} • Qty: {item.quantity}
                                                        </p>
                                                        <p className="font-semibold text-primary-600 mt-1">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Place Order */}
                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="flex-1"
                                            onClick={() => setCurrentStep(2)}
                                            disabled={isProcessing}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            size="lg"
                                            className="flex-1"
                                            onClick={handlePlaceOrder}
                                            isLoading={isProcessing}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-24"
                        >
                            <Card padding="lg">
                                <h3 className="font-serif font-bold text-xl text-earth-900 mb-6">
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-6">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-earth-900 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-earth-600">
                                                    {item.variant} × {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-earth-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-secondary-200">
                                    <div className="flex justify-between text-earth-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Tax</span>
                                        <span className="font-semibold">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-3 border-t-2 border-secondary-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-serif font-bold text-lg text-earth-900">
                                                Total
                                            </span>
                                            <span className="font-serif font-bold text-2xl text-primary-600">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}