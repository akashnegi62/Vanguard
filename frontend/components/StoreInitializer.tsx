'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function StoreInitializer() {
  const initAuth = useAuthStore((s) => s.initialize);
  const initCart = useCartStore((s) => s.initialize);
  const initWishlist = useWishlistStore((s) => s.initialize);

  useEffect(() => {
    initAuth();
    initCart();
    initWishlist();
  }, [initAuth, initCart, initWishlist]);

  return null;
}
