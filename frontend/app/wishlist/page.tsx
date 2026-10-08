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
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="pb-6 border-b border-obsidian-800 mb-8">
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-display">
            Personal Wishlist
          </h1>
          <p className="text-xs text-obsidian-400 mt-1">
            Archived garments saved for future consideration.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-obsidian-900/30 rounded-2xl border border-obsidian-800/60 max-w-xl mx-auto p-8">
            <Heart className="w-12 h-12 text-obsidian-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white uppercase">Your Wishlist is Empty</h2>
            <p className="text-xs text-obsidian-400 mt-2 max-w-sm mx-auto mb-6">
              You haven't saved any garments to your wishlist yet. Browse the collection to bookmark items.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-400 hover:bg-brand-500 text-obsidian-950 font-bold text-xs uppercase"
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
                  className="p-4 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 flex flex-col justify-between hover:border-obsidian-700 transition-all"
                >
                  <div>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-obsidian-950 mb-3">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-obsidian-950/80 text-red-400 hover:text-red-300 border border-red-500/30"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-brand-400">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                      <Link href={`/products/${product.slug}`} className="hover:text-brand-300">
                        {product.name}
                      </Link>
                    </h3>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-white">
                        {formatPrice(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-obsidian-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="mt-4 w-full py-2.5 rounded-lg bg-white hover:bg-brand-300 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
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
