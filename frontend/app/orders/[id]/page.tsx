'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  CreditCard,
  MapPin
} from 'lucide-react';

const STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getOrderById(id)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
            <Link href="/orders" className="text-xs text-brand-400 hover:underline">
              Return to order history
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIdx = STEPS.indexOf(order.orderStatus);

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs text-obsidian-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                Order #{order.id}
              </h1>
              <p className="text-xs text-obsidian-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/40">
                Status: {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-obsidian-400 mb-6">
            Fulfillment Journey
          </h2>
          <div className="grid grid-cols-5 gap-2 text-center">
            {STEPS.map((step, idx) => {
              const isPastOrCurrent = currentStepIdx >= idx;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPastOrCurrent
                        ? 'bg-brand-500 text-obsidian-950 shadow-lg shadow-brand-500/20'
                        : 'bg-obsidian-800 text-obsidian-500'
                    }`}
                  >
                    {isPastOrCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide truncate max-w-full ${
                      isPastOrCurrent ? 'text-white' : 'text-obsidian-600'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Card */}
        <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-obsidian-400 pb-3 border-b border-obsidian-800">
            Garments Snapshot ({order.items.length})
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-obsidian-950 shrink-0">
                    <Image
                      src={
                        item.productImage ||
                        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'
                      }
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{item.productName}</p>
                    <p className="text-obsidian-400 text-xs mt-0.5">
                      Size: {item.size} • Color: {item.color} • Qty {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-white font-bold text-sm">
                    {formatPrice(item.subtotal)}
                  </span>
                  <p className="text-[10px] text-obsidian-500">
                    {formatPrice(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-obsidian-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-obsidian-300">
              <span>Subtotal</span>
              <span className="font-mono text-white">
                {formatPrice(order.totalAmount - order.shippingAmount)}
              </span>
            </div>
            <div className="flex justify-between text-obsidian-300">
              <span>Shipping</span>
              <span className="font-mono text-white">
                {order.shippingAmount === 0 ? 'Free' : formatPrice(order.shippingAmount)}
              </span>
            </div>
            <div className="pt-2 border-t border-obsidian-800 flex justify-between font-bold text-sm text-white">
              <span>Total Paid</span>
              <span className="font-mono text-brand-300 text-base">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-brand-400 font-bold uppercase tracking-wider text-xs mb-1">
              <MapPin className="w-4 h-4" /> Delivery Address
            </div>
            {order.shippingAddress ? (
              <div className="text-obsidian-300 space-y-0.5 leading-relaxed">
                <p className="font-bold text-white">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="text-obsidian-400 pt-1">Phone: {order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-obsidian-500">Address recorded on order manifest.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-brand-400 font-bold uppercase tracking-wider text-xs mb-1">
              <CreditCard className="w-4 h-4" /> Payment Details
            </div>
            <div className="space-y-1.5 text-obsidian-300">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="text-white font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span
                  className={`font-bold ${
                    order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
