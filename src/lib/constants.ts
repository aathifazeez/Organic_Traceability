export const SITE_CONFIG = {
    name: "OrganicTrace",
    description: "Transparent Supply Chain for Organic Products",
    url: "https://organictrace.com",
    ogImage: "/og-image.jpg",
};

export const USER_ROLES = {
    CUSTOMER: "customer",
    SUPPLIER: "supplier",
    MANUFACTURER: "manufacturer",
    ADMIN: "admin",
} as const;

export const APPROVAL_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export const ORDER_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const;

export const CERTIFICATE_STATUS = {
    VALID: "valid",
    EXPIRING: "expiring",
    EXPIRED: "expired",
} as const;

export const NAVIGATION_LINKS = {
    public: [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ],
    customer: [
        { href: "/profile", label: "Profile" },
        { href: "/orders", label: "Orders" },
        { href: "/cart", label: "Cart" },
    ],
    supplier: [
        { href: "/supplier/dashboard", label: "Dashboard" },
        { href: "/supplier/batches", label: "Ingredient Batches" },
        { href: "/supplier/certificates", label: "Certificates" },
    ],
    manufacturer: [
        { href: "/manufacturer/dashboard", label: "Dashboard" },
        { href: "/manufacturer/products", label: "Product Batches" },
        { href: "/manufacturer/listings", label: "Listings" },
    ],
    admin: [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/approvals", label: "Approvals" },
        { href: "/admin/analytics", label: "Analytics" },
    ],
};

export const ANIMATION_VARIANTS = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
    },
    slideUp: {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    },
    slideDown: {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    },
    slideLeft: {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    },
    slideRight: {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    },
    stagger: {
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
};