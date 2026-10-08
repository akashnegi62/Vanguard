'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (product: any) => {
    const defaultVariant = product.variants?.[0];
    if (defaultVariant) {
      addItem(product, defaultVariant, 1);
      removeItem(product.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="pb-6 border-b border-slate-200 mb-8">
          <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight font-display">
            Personal Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Archived garments saved for future consideration.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto p-8 shadow-xs">
            <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-950 uppercase">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto mb-6">
              You haven't saved any garments to your wishlist yet. Browse the collection to bookmark items.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase shadow-md"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => {
              const imageSrc =
                product.images?.[0]?.imageUrl ||
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

              return (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
                >
                  <div>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-red-500 hover:text-red-700 border border-slate-200 shadow-xs"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 line-clamp-1 mt-0.5">
                      <Link href={`/products/${product.slug}`} className="hover:text-slate-600">
                        {product.name}
                      </Link>
                    </h3>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-950 font-mono">
                        {formatPrice(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="mt-4 w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
