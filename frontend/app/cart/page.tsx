'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getShipping,
    getDiscount,
    getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between pb-6 border-b border-obsidian-800 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-display">
              Shopping Bag
            </h1>
            <p className="text-xs text-obsidian-400 mt-1">
              Review your selected garments before proceeding to secure checkout.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-obsidian-900/30 rounded-2xl border border-obsidian-800/60 max-w-xl mx-auto p-8">
            <div className="w-16 h-16 rounded-full bg-obsidian-800 text-obsidian-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-obsidian-400 mt-2 max-w-sm mx-auto leading-relaxed mb-6">
              Looks like you haven't added any garments to your bag yet. Explore our curated archives for menswear essentials.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-400 hover:bg-brand-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                const imageSrc =
                  item.product.images?.[0]?.imageUrl ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-obsidian-900/40 border border-obsidian-800/80 hover:border-obsidian-700 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-28 aspect-[3/4] sm:aspect-square rounded-xl overflow-hidden bg-obsidian-950 shrink-0">
                      <Image
                        src={imageSrc}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-brand-400 font-bold">
                              {item.product.brand}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-white hover:text-brand-300 transition-colors">
                              <Link href={`/products/${item.product.slug}`}>
                                {item.product.name}
                              </Link>
                            </h3>
                          </div>
                          <span className="text-base font-extrabold text-white">
                            {formatPrice(itemPrice * item.quantity)}
                          </span>
                        </div>

                        {/* Variant details */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-obsidian-400">
                          <span className="px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-200 border border-obsidian-700 font-mono">
                            Size: {item.variant.size}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-200 border border-obsidian-700">
                            Color: {item.variant.color}
                          </span>
                          <span className="text-[11px] text-obsidian-500">
                            {formatPrice(itemPrice)} each
                          </span>
                        </div>
                      </div>

                      {/* Bottom actions: stepper and remove */}
                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-obsidian-800/60">
                        <div className="flex items-center border border-obsidian-800 bg-obsidian-900 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-xs text-obsidian-300 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-xs text-obsidian-300 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-obsidian-300">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Total Savings</span>
                      <span className="font-mono">- {formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-obsidian-300">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-white">
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-bold uppercase">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {subtotal < 1999 && (
                    <p className="text-[11px] text-brand-300/80 bg-brand-950/40 p-2 rounded border border-brand-900/60">
                      Add {formatPrice(1999 - subtotal)} more to qualify for complimentary express delivery!
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-obsidian-800 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Total Due
                  </span>
                  <span className="text-xl font-extrabold text-white font-mono">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl bg-white hover:bg-brand-300 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/5"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Guarantees Box */}
              <div className="p-5 rounded-2xl bg-obsidian-900/30 border border-obsidian-800/60 space-y-3 text-xs text-obsidian-400">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-brand-400" />
                  <span>Free express delivery on orders over ₹1,999</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>All payments encrypted with SSL standard</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
