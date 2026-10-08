import { create } from 'zustand';
import { Product, ProductVariant, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getShipping: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getTotalCount: () => number;
  initialize: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  setIsOpen: (isOpen) => set({ isOpen }),

  initialize: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('mens_store_cart');
    if (stored) {
      try {
        set({ items: JSON.parse(stored) });
      } catch {
        localStorage.removeItem('mens_store_cart');
      }
    }
  },

  addItem: (product: Product, variant: ProductVariant, quantity = 1) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) => item.productId === product.id && item.variantId === variant.id
    );

    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      updatedItems = [...items];
      const newQty = Math.min(
        updatedItems[existingIndex].quantity + quantity,
        variant.stock
      );
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQty,
      };
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        variantId: variant.id,
        product,
        variant,
        quantity: Math.min(quantity, variant.stock),
      };
      updatedItems = [...items, newItem];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('mens_store_cart', JSON.stringify(updatedItems));
    }
    set({ items: updatedItems });
  },

  removeItem: (itemId: string) => {
    const updated = get().items.filter((item) => item.id !== itemId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mens_store_cart', JSON.stringify(updated));
    }
    set({ items: updated });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const updated = get().items.map((item) => {
      if (item.id === itemId) {
        const validQty = Math.min(quantity, item.variant.stock);
        return { ...item, quantity: validQty };
      }
      return item;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('mens_store_cart', JSON.stringify(updated));
    }
    set({ items: updated });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mens_store_cart');
    }
    set({ items: [] });
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    // Free shipping above ₹1999
    return subtotal >= 1999 ? 0 : 149;
  },

  getDiscount: () => {
    // If original price > discount price, compute savings
    return get().items.reduce((total, item) => {
      if (item.product.discountPrice && item.product.discountPrice < item.product.price) {
        return total + (item.product.price - item.product.discountPrice) * item.quantity;
      }
      return total;
    }, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShipping();
    return subtotal + shipping;
  },

  getTotalCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
