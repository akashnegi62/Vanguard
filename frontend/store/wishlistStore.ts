import { create } from 'zustand';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  initialize: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  initialize: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('mens_store_wishlist');
    if (stored) {
      try {
        set({ items: JSON.parse(stored) });
      } catch {
        localStorage.removeItem('mens_store_wishlist');
      }
    }
  },

  addItem: (product: Product) => {
    const { items } = get();
    if (!items.some((i) => i.id === product.id)) {
      const updated = [...items, product];
      if (typeof window !== 'undefined') {
        localStorage.setItem('mens_store_wishlist', JSON.stringify(updated));
      }
      set({ items: updated });
    }
  },

  removeItem: (productId: string) => {
    const updated = get().items.filter((i) => i.id !== productId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mens_store_wishlist', JSON.stringify(updated));
    }
    set({ items: updated });
  },

  toggleItem: (product: Product) => {
    const { items, removeItem, addItem } = get();
    if (items.some((i) => i.id === product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((i) => i.id === productId);
  },
}));
