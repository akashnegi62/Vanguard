'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { api } from '@/lib/api';
import { Product, ProductVariant, Review } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ChevronRight,
  Sparkles,
  Send
} from 'lucide-react';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    api
      .getProductBySlug(slug)
      .then((res) => {
        const prod = res.data;
        setProduct(prod);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
        // Load related products from same category
        api.getProducts({ category: prod.categoryId, limit: 4 }).then((relRes) => {
          setRelatedProducts(relRes.data.filter((p) => p.id !== prod.id).slice(0, 4));
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-obsidian-400">Loading garment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Garment Not Found</h2>
            <p className="text-sm text-obsidian-400 mb-6">The item you are seeking does not exist or has been archived.</p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-brand-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const currentImages = product.images.length > 0 ? product.images : [{ id: '1', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900', sortOrder: 0 }];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await api.addReview(product.id, reviewRating, reviewComment);
      const newReview: Review = res.data;
      setProduct({
        ...product,
        reviews: [newReview, ...(product.reviews || [])],
        totalReviews: (product.totalReviews || 0) + 1,
      });
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-obsidian-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-white">Catalog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery Column */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-obsidian-900 border border-obsidian-800">
                <Image
                  src={currentImages[selectedImageIndex]?.imageUrl || currentImages[0]?.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-brand-500 text-obsidian-950 text-xs font-black px-2.5 py-1 rounded tracking-wider uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {currentImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-brand-500 opacity-100'
                          : 'border-obsidian-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.imageUrl}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Actions Column */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
                  {product.brand}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 uppercase tracking-tight font-display">
                  {product.name}
                </h1>

                {/* Rating & reviews header */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold">{product.avgRating?.toFixed(1) || '4.8'}</span>
                  </div>
                  <span className="text-obsidian-600">•</span>
                  <a href="#reviews" className="text-xs text-obsidian-400 hover:text-white underline">
                    {product.reviews?.length || product.totalReviews || 0} Reviews
                  </a>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-4 bg-obsidian-900/60 rounded-xl border border-obsidian-800">
                <span className="text-3xl font-extrabold text-white">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-base text-obsidian-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Save {formatPrice(product.price - product.discountPrice!)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-obsidian-300 leading-relaxed">
                {product.description}
              </p>

              {/* Variants Selector */}
              <div className="space-y-4 pt-2">
                {/* Size Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Select Size: {selectedVariant?.size}
                    </span>
                    <span className="text-obsidian-400 cursor-pointer hover:underline">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const isSelected = selectedVariant?.size === size;
                      const variantForSize = product.variants.find((v) => v.size === size);
                      const isOutOfStock = (variantForSize?.stock || 0) <= 0;

                      return (
                        <button
                          key={size}
                          disabled={isOutOfStock}
                          onClick={() => {
                            if (variantForSize) setSelectedVariant(variantForSize);
                          }}
                          className={`min-w-12 h-11 px-3 rounded-lg font-mono text-xs border transition-all ${
                            isSelected
                              ? 'bg-brand-500 border-brand-400 text-obsidian-950 font-bold shadow-md'
                              : 'bg-obsidian-900 border-obsidian-800 text-obsidian-200 hover:border-obsidian-600'
                          } ${isOutOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Color: {selectedVariant?.color}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const isSelected = selectedVariant?.color === color;
                      const variantForColor = product.variants.find((v) => v.color === color);

                      return (
                        <button
                          key={color}
                          onClick={() => {
                            if (variantForColor) setSelectedVariant(variantForColor);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            isSelected
                              ? 'border-brand-400 bg-brand-500/20 text-white font-semibold'
                              : 'border-obsidian-800 bg-obsidian-900 text-obsidian-400 hover:border-obsidian-700'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stock status */}
                <div className="text-xs">
                  {selectedVariant && selectedVariant.stock > 0 ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({selectedVariant.stock} units available)
                    </span>
                  ) : (
                    <span className="text-red-400">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-obsidian-800 bg-obsidian-900 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-obsidian-300 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(selectedVariant?.stock || 10, quantity + 1)
                        )
                      }
                      className="px-4 py-3 text-obsidian-300 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                      addedNotice
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-brand-300 text-obsidian-950'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleItem(product)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isFavorite
                        ? 'bg-red-500/20 border-red-500/40 text-red-500'
                        : 'bg-obsidian-900 border-obsidian-800 text-obsidian-300 hover:text-white hover:border-obsidian-700'
                    }`}
                    title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-brand-500 hover:bg-brand-400 text-obsidian-950 transition-all shadow-lg shadow-brand-500/10"
                >
                  Buy Now — Instant Checkout
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-obsidian-900 text-center">
                <div className="p-3 bg-obsidian-900/40 rounded-xl border border-obsidian-800/60">
                  <Truck className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-white block">Express Courier</span>
                  <span className="text-[10px] text-obsidian-400 block">3-5 Day Dispatch</span>
                </div>
                <div className="p-3 bg-obsidian-900/40 rounded-xl border border-obsidian-800/60">
                  <RotateCcw className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-white block">14-Day Returns</span>
                  <span className="text-[10px] text-obsidian-400 block">Hassle-Free Exchange</span>
                </div>
                <div className="p-3 bg-obsidian-900/40 rounded-xl border border-obsidian-800/60">
                  <ShieldCheck className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-white block">100% Authentic</span>
                  <span className="text-[10px] text-obsidian-400 block">Milled In House</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section id="reviews" className="py-16 border-t border-obsidian-900 bg-obsidian-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-obsidian-800">
              <div>
                <h3 className="text-2xl font-bold text-white uppercase font-display">
                  Client Reviews & Ratings
                </h3>
                <p className="text-xs text-obsidian-400 mt-1">
                  Verified customer feedback regarding fit, drape, and material quality.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">
                  {product.avgRating?.toFixed(1) || '4.8'} out of 5
                </span>
              </div>
            </div>

            {/* Submit Review Form */}
            <div className="mb-10 bg-obsidian-900/50 p-6 rounded-2xl border border-obsidian-800">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Leave a Verified Review
              </h4>
              {reviewSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg mb-4">
                  Thank you! Your review has been submitted.
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-amber-400 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400' : 'text-obsidian-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-obsidian-300 ml-2 font-mono">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">
                    Your Thoughts on Fit & Fabric
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the fabric weight, sizing accuracy, and overall drape..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl bg-obsidian-900/30 border border-obsidian-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-bold">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-white">
                          {rev.user?.name || 'Verified Customer'}
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-obsidian-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-obsidian-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-obsidian-600 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-obsidian-500">
                  No customer reviews yet. Be the first to review this garment!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-20 border-t border-obsidian-900 bg-obsidian-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
                  Complete the Wardrobe
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mt-1 font-display">
                  Related Garments
                </h3>
              </div>
              <ProductGrid products={relatedProducts} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
