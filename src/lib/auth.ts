// Authentication utilities and mock user data

export interface User {
  id: string;
  email: string;
  password: string;
  role: "supplier" | "admin";
  name: string;
  status: "pending" | "approved" | "rejected";
  companyInfo?: string;
  createdAt: string;
}

// Mock users database - UPDATED: Only 2 roles now
const mockUsers: User[] = [
  {
    id: "1",
    email: "supplier@organictrace.com",
    password: "supplier123",
    role: "supplier",
    name: "Natural Oils Co.",
    status: "approved",
    companyInfo: "Supplier of organic essential oils",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    email: "admin@organictrace.com",
    password: "admin123",
    role: "admin",
    name: "OrganicTrace Admin",
    status: "approved",
    companyInfo: "Platform Administrator & Manufacturer",
    createdAt: "2024-01-01",
  },
  // Additional test suppliers
  {
    id: "3",
    email: "supplier2@organictrace.com",
    password: "supplier123",
    role: "supplier",
    name: "Atlas Organic Oils",
    status: "approved",
    companyInfo: "Premium organic oils from Morocco",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    email: "supplier3@organictrace.com",
    password: "supplier123",
    role: "supplier",
    name: "Fair Trade Shea Co.",
    status: "pending",
    companyInfo: "Fair trade shea butter supplier",
    createdAt: "2024-01-29",
  },
];

// Pending registrations (for approval workflow)
let pendingRegistrations: User[] = [];

/**
 * Login function
 * @param email - User email
 * @param password - User password
 * @returns Success status and user data or error
 */
export const login = (
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  if (user.status === "pending") {
    return {
      success: false,
      error: "Your account is pending approval. Please wait for admin confirmation.",
    };
  }

  if (user.status === "rejected") {
    return {
      success: false,
      error: "Your account has been rejected. Please contact support.",
    };
  }

  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = user;

  return { success: true, user: userWithoutPassword as User };
};

/**
 * Register new user (only suppliers can register publicly)
 * @param data - Registration data
 * @returns Success status and user data or error
 */
export const register = (data: {
  email: string;
  password: string;
  name: string;
  role: "supplier"; // Only supplier registration allowed
  companyInfo?: string;
}): { success: boolean; user?: User; error?: string } => {
  // Check if email already exists
  const existingUser = mockUsers.find((u) => u.email === data.email);
  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }

  // Create new user with pending status
  const newUser: User = {
    id: Date.now().toString(),
    email: data.email,
    password: data.password,
    role: data.role,
    name: data.name,
    status: "pending", // All new suppliers need admin approval
    companyInfo: data.companyInfo,
    createdAt: new Date().toISOString(),
  };

  // Add to pending registrations
  pendingRegistrations.push(newUser);

  // In production, this would be saved to database
  // For now, we'll also add to mockUsers with pending status
  mockUsers.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;

  return { success: true, user: userWithoutPassword as User };
};

/**
 * Password validation
 * @param password - Password to validate
 * @returns Validation result with errors
 */
export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Email validation
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get role-based redirect URL
 * @param role - User role
 * @returns Dashboard URL for the role
 */
export const getRoleRedirect = (role: string): string => {
  switch (role) {
    case "supplier":
      return "/supplier/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
};

/**
 * Get current user from localStorage (mock implementation)
 * In production, this would validate JWT token
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem("currentUser");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

/**
 * Save current user to localStorage (mock implementation)
 * In production, this would store JWT token
 */
export const saveCurrentUser = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentUser", JSON.stringify(user));
};

/**
 * Logout user
 */
export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("currentUser");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Get pending registrations (for admin)
 */
export const getPendingRegistrations = (): User[] => {
  return mockUsers.filter((u) => u.status === "pending");
};

/**
 * Approve user registration (admin only)
 */
export const approveUser = (userId: string): { success: boolean; error?: string } => {
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  user.status = "approved";
  return { success: true };
};

/**
 * Reject user registration (admin only)
 */
export const rejectUser = (userId: string): { success: boolean; error?: string } => {
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  user.status = "rejected";
  return { success: true };
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = (): User[] => {
  return mockUsers.map(({ password, ...user }) => user as User);
};

/**
 * Password reset request
 */
export const requestPasswordReset = (
  email: string
): { success: boolean; error?: string } => {
  const user = mockUsers.find((u) => u.email === email);

  if (!user) {
    // Don't reveal if email exists for security
    return { success: true };
  }

  // In production, send email with reset link
  console.log(`Password reset requested for: ${email}`);

  return { success: true };
};

/**
 * Reset password with token
 */
export const resetPassword = (
  token: string,
  newPassword: string
): { success: boolean; error?: string } => {
  const passwordValidation = validatePassword(newPassword);

  if (!passwordValidation.isValid) {
    return { success: false, error: passwordValidation.errors[0] };
  }

  // In production, validate token and update password
  console.log(`Password reset with token: ${token}`);

  return { success: true };
};

/**
 * Update user profile
 */
export const updateProfile = (
  userId: string,
  data: Partial<User>
): { success: boolean; user?: User; error?: string } => {
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Update allowed fields
  if (data.name) user.name = data.name;
  if (data.companyInfo) user.companyInfo = data.companyInfo;

  const { password: _, ...userWithoutPassword } = user;

  return { success: true, user: userWithoutPassword as User };
};

/**
 * Change password
 */
export const changePassword = (
  userId: string,
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } => {
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  if (user.password !== currentPassword) {
    return { success: false, error: "Current password is incorrect" };
  }

  const passwordValidation = validatePassword(newPassword);

  if (!passwordValidation.isValid) {
    return { success: false, error: passwordValidation.errors[0] };
  }

  user.password = newPassword;

  return { success: true };
};