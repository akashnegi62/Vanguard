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
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight font-display">
              Shopping Bag
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Review your selected garments before proceeding to secure checkout.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-wide">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed mb-6">
              Looks like you haven't added any garments to your bag yet. Explore our curated archives for menswear essentials.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-28 aspect-[3/4] sm:aspect-square rounded-xl overflow-hidden bg-slate-100 shrink-0">
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
                            <span className="text-[10px] uppercase font-bold text-slate-500">
                              {item.product.brand}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-950 hover:text-slate-600 transition-colors">
                              <Link href={`/products/${item.product.slug}`}>
                                {item.product.name}
                              </Link>
                            </h3>
                          </div>
                          <span className="text-base font-black text-slate-950 font-mono">
                            {formatPrice(itemPrice * item.quantity)}
                          </span>
                        </div>

                        {/* Variant details */}
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px] font-semibold">
                            Size: {item.variant.size}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                            Color: {item.variant.color}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {formatPrice(itemPrice)} each
                          </span>
                        </div>
                      </div>

                      {/* Bottom actions: stepper and remove */}
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                        <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
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
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-950 font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Total Savings</span>
                      <span className="font-mono font-bold">- {formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-slate-950 font-bold">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {subtotal < 1999 && (
                    <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      Add {formatPrice(1999 - subtotal)} more to qualify for complimentary express delivery!
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Total Due
                  </span>
                  <span className="text-xl font-black text-slate-950 font-mono">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Guarantees Box */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs text-slate-600 shadow-xs">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-slate-800 shrink-0" />
                  <span>Free express delivery on orders over ₹1,999</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-slate-800 shrink-0" />
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
