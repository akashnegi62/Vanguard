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
  const hoverImage = product.images?.[1]?.imageUrl || mainImage;

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
    <div className="group relative flex flex-col bg-obsidian-900/60 border border-obsidian-800/80 rounded-xl overflow-hidden hover:border-brand-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/60">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-obsidian-950">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-brand-500 text-obsidian-950 text-[11px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-obsidian-900/90 backdrop-blur-md text-brand-300 text-[10px] font-bold px-2 py-0.5 rounded border border-brand-500/30 uppercase tracking-widest">
              Signature
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-obsidian-950/60 text-obsidian-300 hover:text-white border border-white/10 hover:bg-obsidian-950/90'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={added}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-brand-300 text-obsidian-950'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-obsidian-400 mb-1">
          <span className="uppercase tracking-widest font-semibold text-brand-400">
            {product.brand}
          </span>
          {product.avgRating && (
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.avgRating.toFixed(1)}</span>
              {product.totalReviews ? (
                <span className="text-obsidian-500">({product.totalReviews})</span>
              ) : null}
            </div>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-white hover:text-brand-300 transition-colors line-clamp-1 mb-2"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-extrabold text-white">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-obsidian-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Available sizes hint */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {Array.from(new Set(product.variants.map((v) => v.size))).slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700"
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
