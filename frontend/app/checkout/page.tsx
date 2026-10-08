'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/types';
import { ShieldCheck, CheckCircle2, CreditCard, Banknote, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getShipping, getDiscount, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || 'Vikram Mehta',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+91 9811223344',
    addressLine1: 'Flat 402, Signature Heights',
    addressLine2: 'Indiranagar 100ft Road',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Test Payment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const orderPayload = {
      userId: user?.id || 'usr-1',
      totalAmount: total,
      shippingAmount: shipping,
      discountAmount: discount,
      paymentMethod,
      shippingAddress: {
        id: `addr-${Date.now()}`,
        userId: user?.id || 'usr-1',
        ...formData,
        isDefault: true,
      },
      items: items.map((item) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        orderId: '',
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        size: item.variant.size,
        color: item.variant.color,
        quantity: item.quantity,
        unitPrice: item.product.discountPrice || item.product.price,
        subtotal: (item.product.discountPrice || item.product.price) * item.quantity,
        productImage: item.product.images?.[0]?.imageUrl,
      })),
    };

    try {
      const res = await api.createOrder(orderPayload);
      clearCart();
      router.push(`/orders/${res.data.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto py-24 px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Items In Checkout</h2>
          <p className="text-xs text-obsidian-400 mb-6">
            Please add garments to your shopping bag before proceeding to checkout.
          </p>
          <Link
            href="/products"
            className="px-6 py-3 rounded-full bg-brand-500 text-obsidian-950 font-bold text-xs uppercase"
          >
            Browse Collections
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-obsidian-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to bag
          </Link>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-display">
            Express Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details */}
            <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                1. Customer & Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-obsidian-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    placeholder="House / Apartment no., Street address"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Suite, unit, landmark"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-obsidian-400 block mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-obsidian-400 block mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-obsidian-400 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                3. Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Test Payment'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-obsidian-800 bg-obsidian-900/60 hover:border-obsidian-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Test Payment"
                    checked={paymentMethod === 'Test Payment'}
                    onChange={() => setPaymentMethod('Test Payment')}
                    className="mt-0.5 text-brand-500 focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white text-xs">
                      <CreditCard className="w-4 h-4 text-brand-400" /> Test Payment (Instant simulated card)
                    </div>
                    <p className="text-[11px] text-obsidian-400 mt-1">
                      Simulate a completed online payment without charging a real card. Sets order status to PAID.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-obsidian-800 bg-obsidian-900/60 hover:border-obsidian-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-0.5 text-brand-500 focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white text-xs">
                      <Banknote className="w-4 h-4 text-emerald-400" /> Cash on Delivery (COD)
                    </div>
                    <p className="text-[11px] text-obsidian-400 mt-1">
                      Pay via cash or UPI directly to courier upon doorstep delivery. Sets status to PENDING.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary column */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                Items ({items.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-obsidian-950 shrink-0">
                      <Image
                        src={item.product.images?.[0]?.imageUrl || ''}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-white truncate">{item.product.name}</p>
                      <p className="text-[11px] text-obsidian-400">
                        {item.variant.size} • {item.variant.color} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-white font-bold">
                      {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-obsidian-800 space-y-2 text-xs">
                <div className="flex justify-between text-obsidian-300">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-obsidian-300">
                  <span>Shipping</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? <span className="text-emerald-400 font-bold uppercase">Free</span> : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-obsidian-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Amount</span>
                  <span className="text-lg font-mono text-brand-300">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-white hover:bg-brand-300 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/5"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
                    Confirming Order...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-obsidian-950" /> Place Order Now
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-900/30 border border-obsidian-800/60 text-[11px] text-obsidian-400 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />
              <span>By placing your order, you agree to our Terms of Sale and verified delivery terms.</span>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
