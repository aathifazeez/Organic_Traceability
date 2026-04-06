// Site Configuration
export const SITE_CONFIG = {
    name: "OrganicTrace",
    description: "Blockchain-secured organic skincare traceability platform",
    url: "https://organictrace.com",
    email: "support@organictrace.com",
    phone: "+1 (555) 123-4567",
    address: "123 Organic Street, Portland, OR 97205",
};

// User Roles - UPDATED: Only 2 roles now
export const USER_ROLES = {
    SUPPLIER: "supplier",
    ADMIN: "admin", // Admin is also the manufacturer
} as const;

export const ROLE_LABELS = {
    supplier: "Supplier",
    admin: "Admin / Manufacturer",
} as const;

// Role-based Dashboard Routes
export const ROLE_DASHBOARDS = {
    supplier: "/supplier/dashboard",
    admin: "/admin/dashboard",
} as const;

// Navigation Links
export const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

// Supplier Navigation
export const supplierNavLinks = [
    { href: "/supplier/dashboard", label: "Dashboard" },
    { href: "/supplier/dashboard/batches", label: "Ingredient Batches" },
    { href: "/supplier/dashboard/certificates", label: "Certificates" },
    { href: "/supplier/dashboard/analytics", label: "Analytics" },
    { href: "/supplier/dashboard/settings", label: "Settings" },
];

// Admin Navigation - UPDATED: Now includes manufacturing features
export const adminNavLinks = [
    // Administration
    { href: "/admin/dashboard", label: "Dashboard", section: "admin" },
    { href: "/admin/dashboard/users", label: "User Management", section: "admin" },
    { href: "/admin/dashboard/approvals", label: "Supplier Approvals", section: "admin" },

    // Manufacturing (moved from manufacturer role)
    { href: "/admin/dashboard/products", label: "Product Batches", section: "manufacturing" },
    { href: "/admin/dashboard/qr-codes", label: "QR Codes", section: "manufacturing" },
    { href: "/admin/dashboard/listings", label: "Product Listings", section: "manufacturing" },

    // System
    { href: "/admin/dashboard/monitoring", label: "System Monitoring", section: "system" },
    { href: "/admin/dashboard/reports", label: "Reports & Analytics", section: "system" },
    { href: "/admin/dashboard/settings", label: "Settings", section: "system" },
];

// Product Categories
export const PRODUCT_CATEGORIES = [
    { value: "face-cream", label: "Face Cream" },
    { value: "serum", label: "Serum" },
    { value: "face-mask", label: "Face Mask" },
    { value: "cleanser", label: "Cleanser" },
    { value: "moisturizer", label: "Moisturizer" },
    { value: "toner", label: "Toner" },
    { value: "eye-cream", label: "Eye Cream" },
    { value: "sunscreen", label: "Sunscreen" },
    { value: "night-cream", label: "Night Cream" },
    { value: "exfoliator", label: "Exfoliator" },
] as const;

// Skin Types
export const SKIN_TYPES = [
    { value: "all", label: "All Skin Types" },
    { value: "dry", label: "Dry Skin" },
    { value: "oily", label: "Oily Skin" },
    { value: "combination", label: "Combination Skin" },
    { value: "sensitive", label: "Sensitive Skin" },
    { value: "normal", label: "Normal Skin" },
    { value: "acne-prone", label: "Acne-Prone Skin" },
] as const;

// Certificate Types
export const CERTIFICATE_TYPES = [
    "USDA Organic",
    "EU Organic",
    "Ecocert",
    "Fair Trade",
    "Cosmos Organic",
    "Non-GMO Project",
    "Leaping Bunny",
    "Vegan Society",
    "Soil Association",
] as const;

// Ingredient Units
export const INGREDIENT_UNITS = [
    { value: "ml", label: "Milliliters (ml)" },
    { value: "L", label: "Liters (L)" },
    { value: "g", label: "Grams (g)" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lb", label: "Pounds (lb)" },
] as const;

// Batch Status
export const BATCH_STATUS = {
    ACTIVE: "active",
    PENDING: "pending",
    EXPIRED: "expired",
    DEPLETED: "depleted",
} as const;

// Order Status
export const ORDER_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const;

// User Account Status
export const ACCOUNT_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    SUSPENDED: "suspended",
} as const;

// Animation Variants
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
};

export const slideInFromLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.3 },
};

export const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Social Media Links
export const SOCIAL_LINKS = {
    facebook: "https://facebook.com/organictrace",
    instagram: "https://instagram.com/organictrace",
    twitter: "https://twitter.com/organictrace",
    linkedin: "https://linkedin.com/company/organictrace",
};

// Contact Information
export const CONTACT_INFO = {
    email: "support@organictrace.com",
    phone: "+1 (555) 123-4567",
    address: "123 Organic Street, Portland, OR 97205",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM PST",
};

// Company Information
export const COMPANY_INFO = {
    name: "OrganicTrace",
    tagline: "Pure Nature, Verified Trust",
    mission:
        "To provide complete transparency in the organic skincare supply chain through blockchain technology.",
    vision:
        "A world where every consumer can verify the authenticity and origin of their organic skincare products.",
    founded: "2024",
    location: "Portland, Oregon, USA",
};

// Feature Highlights
export const FEATURES = [
    {
        title: "QR Code Verification",
        description:
            "Instantly verify product authenticity with blockchain-secured QR codes",
        icon: "QrCode",
    },
    {
        title: "Complete Traceability",
        description:
            "Track ingredients from certified suppliers to finished products",
        icon: "Shield",
    },
    {
        title: "Certified Organic",
        description:
            "All products verified with internationally recognized organic certifications",
        icon: "Leaf",
    },
    {
        title: "Transparent Supply Chain",
        description:
            "Full visibility into every step of the production process",
        icon: "TrendingUp",
    },
    {
        title: "Trusted Suppliers",
        description:
            "Partnerships with verified organic ingredient suppliers worldwide",
        icon: "Users",
    },
    {
        title: "Quality Assurance",
        description:
            "Rigorous quality control at every stage of production",
        icon: "Award",
    },
];

// Trust Indicators
export const TRUST_INDICATORS = [
    { label: "100% Certified", value: "Organic" },
    { label: "QR Traceable", value: "Every Product" },
    { label: "Eco-Friendly", value: "Packaging" },
    { label: "Cruelty-Free", value: "Verified" },
];

// FAQ Data
export const FAQ_DATA = [
    {
        question: "What makes your products organic?",
        answer:
            "All our products are made with ingredients sourced from certified organic suppliers. Each ingredient batch comes with valid organic certifications (USDA, EU Organic, Ecocert, etc.) that you can verify through our QR code system.",
    },
    {
        question: "How does QR code verification work?",
        answer:
            "Every product has a unique QR code that links to its complete supply chain information. Scan the code to see the product batch, all ingredients used, their suppliers, origin countries, and organic certifications.",
    },
    {
        question: "Are your products cruelty-free?",
        answer:
            "Yes, all our products are 100% cruelty-free and never tested on animals. Many of our suppliers hold Leaping Bunny and Vegan Society certifications.",
    },
    {
        question: "What certifications do you have?",
        answer:
            "Our products and ingredients carry various certifications including USDA Organic, EU Organic, Ecocert, Fair Trade, Cosmos Organic, and Non-GMO Project verification.",
    },
    {
        question: "Can I become a supplier?",
        answer:
            "Yes! We're always looking for certified organic ingredient suppliers. Register as a supplier, submit your certifications, and our admin team will review your application.",
    },
];

// Testimonials
export const TESTIMONIALS = [
    {
        name: "Sarah Johnson",
        role: "Verified Customer",
        avatar: "https://i.pravatar.cc/150?img=47",
        rating: 5,
        quote:
            "I love being able to scan the QR code and see exactly where each ingredient comes from. It's transparency at its finest!",
    },
    {
        name: "Michael Chen",
        role: "Organic Enthusiast",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 5,
        quote:
            "Finally, a skincare brand that proves their organic claims with actual certificates. The traceability is impressive.",
    },
    {
        name: "Emma Wilson",
        role: "Skincare Blogger",
        avatar: "https://i.pravatar.cc/150?img=5",
        rating: 5,
        quote:
            "The quality is outstanding, and knowing the complete supply chain gives me peace of mind. Highly recommend!",
    },
];

// Stats for Homepage
export const PLATFORM_STATS = [
    { label: "Products Verified", value: "10,000+", icon: "Package" },
    { label: "Certified Suppliers", value: "500+", icon: "Users" },
    { label: "Countries", value: "50+", icon: "Globe" },
    { label: "Traceability Rate", value: "99.9%", icon: "Shield" },
];