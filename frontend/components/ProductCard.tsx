'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const [added, setAdded] = React.useState(false);

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const mainImage = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants?.[0];
    if (defaultVariant) {
      addItem(product, defaultVariant, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 transition-all duration-200 hover:shadow-md">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
              Signature
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs ${
            isFavorite
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-white'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={added}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="uppercase tracking-wider font-bold text-slate-700">
            {product.brand}
          </span>
          {product.avgRating && (
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors line-clamp-1 mb-2"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm sm:text-base font-black text-slate-950 font-mono">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-slate-400 line-through font-mono">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Available sizes */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            {Array.from(new Set(product.variants.map((v) => v.size))).slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
