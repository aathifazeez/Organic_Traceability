"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, ShoppingBag, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import ManufacturerSidebar from "@/components/manufacturer/ManufacturerSidebar";
import ProductBatchCard from "@/components/manufacturer/ProductBatchCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

// Mock product listings
const mockProducts = [
    {
        id: "1",
        name: "Organic Rose Face Cream",
        batchNumber: "PROD-2024-001",
        price: 45.99,
        stock: 150,
        category: "face-cream",
        skinType: "Dry",
        isListed: true,
        sales: 89,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    },
    {
        id: "2",
        name: "Vitamin C Brightening Serum",
        batchNumber: "PROD-2024-002",
        price: 38.50,
        stock: 200,
        category: "serum",
        skinType: "All Types",
        isListed: true,
        sales: 134,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    },
    {
        id: "3",
        name: "Hydrating Face Mask",
        batchNumber: "PROD-2024-003",
        price: 28.00,
        stock: 0,
        category: "face-mask",
        skinType: "Sensitive",
        isListed: false,
        sales: 67,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&q=80",
    },
    {
        id: "4",
        name: "Anti-Aging Night Cream",
        batchNumber: "PROD-2024-004",
        price: 52.99,
        stock: 120,
        category: "face-cream",
        skinType: "Combination",
        isListed: true,
        sales: 156,
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80",
    },
    {
        id: "5",
        name: "Gentle Cleansing Foam",
        batchNumber: "PROD-2024-005",
        price: 24.99,
        stock: 180,
        category: "cleanser",
        skinType: "All Types",
        isListed: true,
        sales: 203,
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300&q=80",
    },
    {
        id: "6",
        name: "Revitalizing Eye Cream",
        batchNumber: "PROD-2024-006",
        price: 42.00,
        stock: 90,
        category: "eye-cream",
        skinType: "Dry",
        isListed: false,
        sales: 45,
        image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=300&q=80",
    },
];

export default function ListingsPage() {
    const [products, setProducts] = useState(mockProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const handleEdit = (id: string) => {
        const product = products.find((p) => p.id === id);
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    const handleToggleListing = (id: string) => {
        setProducts(
            products.map((p) =>
                p.id === id ? { ...p, isListed: !p.isListed } : p
            )
        );
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === "all" || product.category === categoryFilter;

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "listed" && product.isListed) ||
            (statusFilter === "unlisted" && !product.isListed);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const stats = {
        totalListings: products.filter((p) => p.isListed).length,
        totalRevenue: products
            .filter((p) => p.isListed)
            .reduce((sum, p) => sum + p.price * p.sales, 0),
        totalSales: products.reduce((sum, p) => sum + p.sales, 0),
        outOfStock: products.filter((p) => p.stock === 0).length,
    };

    return (
        <div className="flex min-h-screen bg-gradient-cream">
            <ManufacturerSidebar />

            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-serif font-bold text-4xl text-earth-900 mb-2">
                                    Product Listings
                                </h1>
                                <p className="text-earth-600">
                                    Manage your e-commerce product listings
                                </p>
                            </div>
                            <Link href="/manufacturer/dashboard/products/create">
                                <Button leftIcon={<Plus className="w-5 h-5" />}>
                                    Add New Product
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.totalListings}
                                    </p>
                                    <p className="text-sm text-earth-600">Active Listings</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        ${stats.totalRevenue.toFixed(0)}
                                    </p>
                                    <p className="text-sm text-earth-600">Revenue</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.totalSales}
                                    </p>
                                    <p className="text-sm text-earth-600">Total Sales</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-earth-900">
                                        {stats.outOfStock}
                                    </p>
                                    <p className="text-sm text-earth-600">Out of Stock</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card padding="md" className="mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search products..."
                                    leftIcon={<Search className="w-5 h-5" />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    options={[
                                        { value: "all", label: "All Categories" },
                                        { value: "face-cream", label: "Face Cream" },
                                        { value: "serum", label: "Serum" },
                                        { value: "face-mask", label: "Face Mask" },
                                        { value: "cleanser", label: "Cleanser" },
                                        { value: "eye-cream", label: "Eye Cream" },
                                    ]}
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    options={[
                                        { value: "all", label: "All Status" },
                                        { value: "listed", label: "Listed" },
                                        { value: "unlisted", label: "Unlisted" },
                                    ]}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Products Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductBatchCard
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleListing={handleToggleListing}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <ShoppingBag className="w-16 h-16 text-earth-400 mx-auto mb-4" />
                            <p className="text-earth-600">No products found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Product Listing"
                size="lg"
            >
                {selectedProduct && (
                    <div className="space-y-6">
                        <Input
                            label="Product Name"
                            value={selectedProduct.name}
                            onChange={(e) =>
                                setSelectedProduct({ ...selectedProduct, name: e.target.value })
                            }
                        />
                        <Input
                            type="number"
                            label="Price ($)"
                            value={selectedProduct.price}
                            onChange={(e) =>
                                setSelectedProduct({
                                    ...selectedProduct,
                                    price: parseFloat(e.target.value),
                                })
                            }
                        />
                        <Input
                            type="number"
                            label="Stock"
                            value={selectedProduct.stock}
                            onChange={(e) =>
                                setSelectedProduct({
                                    ...selectedProduct,
                                    stock: parseInt(e.target.value),
                                })
                            }
                        />
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    setProducts(
                                        products.map((p) =>
                                            p.id === selectedProduct.id ? selectedProduct : p
                                        )
                                    );
                                    setIsEditModalOpen(false);
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}