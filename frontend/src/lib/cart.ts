const CART_KEY = "organic_cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unitsAvailable: number;
  variant?: string;
  skinType?: string;
}

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (item: CartItem): CartItem[] => {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + item.quantity,
      item.unitsAvailable
    );
    saveCart(cart);
    return cart;
  }
  const newCart = [...cart, item];
  saveCart(newCart);
  return newCart;
};

export const updateCartItem = (productId: string, quantity: number): CartItem[] => {
  const cart = getCart().map((i) =>
    i.productId === productId ? { ...i, quantity } : i
  );
  saveCart(cart);
  return cart;
};

export const removeCartItem = (productId: string): CartItem[] => {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
  return cart;
};

export const clearCart = (): void => {
  if (typeof window !== "undefined") localStorage.removeItem(CART_KEY);
};

export const getCartCount = (): number =>
  getCart().reduce((sum, i) => sum + i.quantity, 0);
