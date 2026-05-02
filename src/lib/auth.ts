// Authentication utilities - Connected to real backend API

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export interface User {
  id: string;
  email: string;
  role: "supplier" | "admin";
  name: string;
  status: "pending" | "approved" | "rejected";
  companyName?: string;
  companyInfo?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
}

/**
 * Login function - connects to backend API
 */
export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success && data.data) {
      const userData: User = {
        id: data.data.user.id || data.data.user._id,
        email: data.data.user.email,
        role: data.data.user.role,
        name: data.data.user.name,
        status: data.data.user.status,
        companyName: data.data.user.companyName,
        companyInfo: data.data.user.companyInfo,
        avatar: data.data.user.avatar,
        createdAt: data.data.user.createdAt,
      };

      return {
        success: true,
        user: userData,
        token: data.data.accessToken,
      };
    }

    return { success: false, error: data.message || "Login failed" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Unable to connect to server. Please try again." };
  }
};

/**
 * Register new supplier
 */
export const register = async (data: {
  email: string;
  password: string;
  name: string;
  role: "supplier";
  companyName?: string;
  companyInfo?: string;
}): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success && result.data) {
      return {
        success: true,
        user: result.data.user,
      };
    }

    return { success: false, error: result.message || "Registration failed" };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Unable to connect to server. Please try again." };
  }
};

/**
 * Password validation
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
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get role-based redirect URL
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
 * Get current user from localStorage
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
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

/**
 * Save current user and token to localStorage
 */
export const saveCurrentUser = (user: User, token?: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentUser", JSON.stringify(user));
  if (token) {
    localStorage.setItem("authToken", token);
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null && getAuthToken() !== null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Make an authenticated API request
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  // If token expired, logout
  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return data;
};

/**
 * Get pending registrations (admin)
 */
export const getPendingRegistrations = async (): Promise<User[]> => {
  try {
    const data = await apiRequest("/users?status=pending");
    return data.data || [];
  } catch {
    return [];
  }
};

/**
 * Approve user registration (admin)
 */
export const approveUser = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = await apiRequest(`/users/${userId}/approve`, {
      method: "PATCH",
    });
    return { success: data.success };
  } catch {
    return { success: false, error: "Failed to approve user" };
  }
};

/**
 * Reject user registration (admin)
 */
export const rejectUser = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = await apiRequest(`/users/${userId}/reject`, {
      method: "PATCH",
    });
    return { success: data.success };
  } catch {
    return { success: false, error: "Failed to reject user" };
  }
};

/**
 * Get all users (admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const data = await apiRequest("/users");
    return data.data || [];
  } catch {
    return [];
  }
};

/**
 * Password reset request
 */
export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return { success: data.success };
  } catch {
    return { success: true }; // Don't reveal errors for security
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return { success: false, error: passwordValidation.errors[0] };
  }

  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    return { success: data.success, error: data.message };
  } catch {
    return { success: false, error: "Failed to reset password" };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  profileData: Partial<User>
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const data = await apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return { success: data.success, user: data.data?.user };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
};

/**
 * Change password
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return { success: false, error: passwordValidation.errors[0] };
  }

  try {
    const data = await apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return { success: data.success, error: data.message };
  } catch {
    return { success: false, error: "Failed to change password" };
  }
};