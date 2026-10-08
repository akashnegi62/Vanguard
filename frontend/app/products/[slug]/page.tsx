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

    const cleanSlug = decodeURIComponent(slug);

    api
      .getProductBySlug(cleanSlug)
      .then((res) => {
        const prod = res.data;
        if (!prod) {
          setProduct(null);
          return;
        }

        // Defensive normalization for newly added products
        if (!prod.images || prod.images.length === 0) {
          prod.images = [
            {
              id: 'img-fallback',
              imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900',
              sortOrder: 0,
              altText: prod.name,
            },
          ];
        }
        if (!prod.variants || prod.variants.length === 0) {
          prod.variants = [
            {
              id: `var-${prod.id}`,
              productId: prod.id,
              size: 'M',
              color: 'Standard',
              stock: 10,
              sku: `${prod.slug}-M`,
            },
          ];
        }

        setProduct(prod);
        setSelectedVariant(prod.variants[0]);

        if (prod.categoryId) {
          api
            .getProducts({ category: prod.categoryId, limit: 4 })
            .then((relRes) => {
              if (relRes?.data) {
                setRelatedProducts(relRes.data.filter((p) => p.id !== prod.id).slice(0, 4));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Failed to load product details:', err);
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading garment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Garment Not Found</h2>
            <p className="text-xs text-slate-500 mb-6">The item you are seeking does not exist or has been archived.</p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
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

  const availableVariants = product.variants || [];
  const availableSizes = Array.from(new Set(availableVariants.map((v) => v.size)));
  const availableColors = Array.from(new Set(availableVariants.map((v) => v.color)));

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-100">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/products" className="hover:text-slate-900">Catalog</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={currentImages[selectedImageIndex]?.imageUrl || currentImages[0]?.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-slate-950 text-white text-xs font-black px-2.5 py-1 rounded tracking-wider uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {currentImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-slate-950 opacity-100 shadow-xs'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
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
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  {product.brand}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 mt-1 uppercase tracking-tight font-display">
                  {product.name}
                </h1>

                {/* Rating & reviews header */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-900">{product.avgRating?.toFixed(1) || '4.8'}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <a href="#reviews" className="text-xs text-slate-500 hover:text-slate-900 underline font-medium">
                    {product.reviews?.length || product.totalReviews || 0} Customer Reviews
                  </a>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="flex items-baseline gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-3xl font-black text-slate-950 font-mono">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-base text-slate-400 line-through font-mono">
                    {formatPrice(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Save {formatPrice(product.price - product.discountPrice!)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Variants Selector */}
              <div className="space-y-4 pt-1">
                {/* Size Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900 uppercase tracking-wider">
                      Select Size: {selectedVariant?.size}
                    </span>
                    <span className="text-slate-500 cursor-pointer hover:underline">
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
                              ? 'bg-slate-950 border-slate-950 text-white font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50'
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
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
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
                              ? 'border-slate-950 bg-slate-950 text-white font-bold'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
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
                    <span className="text-emerald-700 flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({selectedVariant.stock} garments available)
                    </span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(selectedVariant?.stock || 10, quantity + 1)
                        )
                      }
                      className="px-4 py-3 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      addedNotice
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 hover:bg-slate-800 text-white'
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
                    className={`p-3.5 rounded-xl border transition-all shadow-xs ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50'
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
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-950 border border-slate-300 transition-all shadow-xs"
                >
                  Buy Now — Express Checkout
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Truck className="w-4 h-4 text-slate-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 block">Express Delivery</span>
                  <span className="text-[10px] text-slate-500 block">3-5 Day Dispatch</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <RotateCcw className="w-4 h-4 text-slate-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 block">14-Day Returns</span>
                  <span className="text-[10px] text-slate-500 block">Hassle-Free Exchange</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-slate-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 block">100% Authentic</span>
                  <span className="text-[10px] text-slate-500 block">Direct From Atelier</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section id="reviews" className="py-16 border-t border-slate-200 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-2xl font-black text-slate-950 uppercase font-display">
                  Client Reviews & Ratings
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Verified customer feedback regarding fit, drape, and material quality.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {product.avgRating?.toFixed(1) || '4.8'} out of 5
                </span>
              </div>
            </div>

            {/* Review Form */}
            <div className="mb-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Leave a Verified Review
              </h4>
              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg mb-4">
                  Thank you! Your review has been submitted.
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-amber-500 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-600 ml-2 font-mono">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1">
                    Your Thoughts on Fit & Fabric
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the fabric weight, sizing accuracy, and overall drape..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-bold border border-slate-200">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {rev.user?.name || 'Verified Customer'}
                        </span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No customer reviews yet. Be the first to review this garment!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-20 border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
                  Complete the Wardrobe
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight mt-1 font-display">
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
