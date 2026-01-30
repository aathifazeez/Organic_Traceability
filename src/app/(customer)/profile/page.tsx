"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    ShoppingBag,
    Heart,
    Bell,
    Shield,
    CreditCard,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock user data
const mockUser = {
    id: "1",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=47",
    joinedDate: "2024-01-15",
    addresses: [
        {
            id: "1",
            type: "home",
            name: "Home",
            street: "123 Beauty Lane",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "United States",
            isDefault: true,
        },
        {
            id: "2",
            type: "work",
            name: "Office",
            street: "456 Business Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90002",
            country: "United States",
            isDefault: false,
        },
    ],
    stats: {
        totalOrders: 24,
        totalSpent: 1847.52,
        savedProducts: 12,
    },
};

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
    });

    const handleSave = () => {
        // Save profile changes
        setIsEditing(false);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "addresses", label: "Addresses", icon: MapPin },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gradient-cream">
            <div className="container-custom py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                        My Account
                    </h1>
                    <p className="text-earth-600">
                        Manage your profile and preferences
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <Card padding="lg">
                            {/* Profile Picture */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <img
                                        src={mockUser.avatar}
                                        alt={mockUser.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                                    />
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="font-serif font-semibold text-xl text-earth-900 mt-4">
                                    {mockUser.name}
                                </h2>
                                <p className="text-sm text-earth-600">{mockUser.email}</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-secondary-200">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">
                                        {mockUser.stats.totalOrders}
                                    </p>
                                    <p className="text-xs text-earth-600">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">
                                        ${mockUser.stats.totalSpent}
                                    </p>
                                    <p className="text-xs text-earth-600">Spent</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">
                                        {mockUser.stats.savedProducts}
                                    </p>
                                    <p className="text-xs text-earth-600">Saved</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                                    ? "bg-primary-100 text-primary-700 font-medium"
                                                    : "text-earth-700 hover:bg-secondary-100"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900">
                                            Personal Information
                                        </h2>
                                        {!isEditing ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                leftIcon={<Edit2 className="w-4 h-4" />}
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    leftIcon={<X className="w-4 h-4" />}
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    leftIcon={<Save className="w-4 h-4" />}
                                                    onClick={handleSave}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-6">
                                            <Input
                                                label="Full Name"
                                                leftIcon={<User className="w-5 h-5" />}
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                            />
                                            <Input
                                                type="email"
                                                label="Email Address"
                                                leftIcon={<Mail className="w-5 h-5" />}
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                            />
                                            <Input
                                                label="Phone Number"
                                                leftIcon={<Phone className="w-5 h-5" />}
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, phone: e.target.value })
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-earth-600">Full Name</p>
                                                    <p className="font-semibold text-earth-900">
                                                        {mockUser.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-earth-600">Email Address</p>
                                                    <p className="font-semibold text-earth-900">
                                                        {mockUser.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-earth-600">Phone Number</p>
                                                    <p className="font-semibold text-earth-900">
                                                        {mockUser.phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-earth-600">Member Since</p>
                                                    <p className="font-semibold text-earth-900">
                                                        {new Date(mockUser.joinedDate).toLocaleDateString(
                                                            "en-US",
                                                            { year: "numeric", month: "long", day: "numeric" }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif font-bold text-2xl text-earth-900">
                                            Saved Addresses
                                        </h2>
                                        <Button size="sm">Add New Address</Button>
                                    </div>

                                    <div className="space-y-4">
                                        {mockUser.addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className="p-6 border-2 border-secondary-200 rounded-2xl hover:border-primary-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-earth-900">
                                                                {address.name}
                                                            </h3>
                                                            {address.isDefault && (
                                                                <Badge variant="primary" size="sm">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-earth-700">{address.street}</p>
                                                        <p className="text-earth-700">
                                                            {address.city}, {address.state} {address.zipCode}
                                                        </p>
                                                        <p className="text-earth-700">{address.country}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {!address.isDefault && (
                                                    <Button variant="outline" size="sm">
                                                        Set as Default
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card padding="lg">
                                    <h2 className="font-serif font-bold text-2xl text-earth-900 mb-6">
                                        Security Settings
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-secondary-50 rounded-2xl">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-earth-900 mb-2">
                                                        Password
                                                    </h3>
                                                    <p className="text-sm text-earth-600">
                                                        Last changed 3 months ago
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Change Password
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-secondary-50 rounded-2xl">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-earth-900 mb-2">
                                                        Two-Factor Authentication
                                                    </h3>
                                                    <p className="text-sm text-earth-600">
                                                        Add an extra layer of security
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Enable
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}