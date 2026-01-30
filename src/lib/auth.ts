// Authentication helper functions

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: "customer" | "supplier" | "manufacturer" | "admin";
    status: "pending" | "approved" | "rejected";
    companyName?: string;
    avatar?: string;
}

// Mock user data - replace with actual API calls
export const mockUsers: AuthUser[] = [
    {
        id: "1",
        email: "customer@example.com",
        name: "John Customer",
        role: "customer",
        status: "approved",
    },
    {
        id: "2",
        email: "supplier@example.com",
        name: "Jane Supplier",
        role: "supplier",
        status: "approved",
        companyName: "Organic Farms Ltd",
    },
    {
        id: "3",
        email: "manufacturer@example.com",
        name: "Bob Manufacturer",
        role: "manufacturer",
        status: "approved",
        companyName: "Green Products Inc",
    },
    {
        id: "4",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        status: "approved",
    },
];

// Simulate login
export async function login(
    email: string,
    password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find((u) => u.email === email);
            if (user && password) {
                resolve({ success: true, user });
            } else {
                resolve({ success: false, error: "Invalid credentials" });
            }
        }, 1000);
    });
}

// Simulate registration
export async function register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    companyName?: string;
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser: AuthUser = {
                id: Date.now().toString(),
                email: data.email,
                name: data.name,
                role: data.role as any,
                status: data.role === "customer" ? "approved" : "pending",
                companyName: data.companyName,
            };
            resolve({ success: true, user: newUser });
        }, 1000);
    });
}

// Password validation
export function validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// Email validation
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get user role redirect
export function getRoleRedirect(role: string): string {
    switch (role) {
        case "customer":
            return "/";
        case "supplier":
            return "/supplier/dashboard";
        case "manufacturer":
            return "/manufacturer/dashboard";
        case "admin":
            return "/admin/dashboard";
        default:
            return "/";
    }
}