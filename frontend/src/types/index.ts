export type UserRole = "customer" | "supplier" | "manufacturer" | "admin";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type CertificateStatus = "valid" | "expiring" | "expired";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    status: ApprovalStatus;
    createdAt: string;
    avatar?: string;
}

export interface Supplier {
    id: string;
    name: string;
    email: string;
    location: string;
    certifications: string[];
    rating: number;
}

export interface Certificate {
    id: string;
    name: string;
    fileUrl: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string;
    status: CertificateStatus;
}

export interface IngredientBatch {
    id: string;
    supplierId: string;
    name: string;
    batchNumber: string;
    quantity: number;
    unit: string;
    certificates: Certificate[];
    createdAt: string;
}

export interface ProductBatch {
    id: string;
    manufacturerId: string;
    productName: string;
    batchNumber: string;
    ingredients: IngredientBatch[];
    qrCode: string;
    manufacturedDate: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    batchId: string;
    stock: number;
    rating: number;
    reviews: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    customerId: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    shippingAddress: Address;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}