'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ChevronRight, Clock, CheckCircle2, Truck } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getMyOrders()
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case 'SHIPPED':
        return 'bg-blue-950/80 text-blue-400 border-blue-800';
      case 'PROCESSING':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case 'CANCELLED':
        return 'bg-red-950/80 text-red-400 border-red-800';
      default:
        return 'bg-obsidian-800 text-obsidian-300 border-obsidian-700';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-display">
            Order Archives
          </h1>
          <p className="text-xs text-obsidian-400 mt-1">
            Track and review your recent sartorial purchases and delivery updates.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-obsidian-400">Loading order records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-obsidian-900/30 rounded-2xl border border-obsidian-800 p-8">
            <Package className="w-12 h-12 text-obsidian-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white uppercase">No Orders Found</h3>
            <p className="text-xs text-obsidian-400 mt-1 mb-6">
              You haven't placed any orders yet. Discover our latest collections today.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-brand-500 text-obsidian-950 font-bold text-xs uppercase"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 hover:border-obsidian-700 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-obsidian-800/80 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-white font-bold uppercase">
                      Order #{order.id}
                    </span>
                    <span className="text-obsidian-500">•</span>
                    <span className="text-obsidian-400">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{item.productName}</span>
                        <span className="text-obsidian-400 ml-2">
                          ({item.size} • {item.color} • Qty {item.quantity})
                        </span>
                      </div>
                      <span className="font-mono text-white font-bold">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer details & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-obsidian-800/80 gap-3">
                  <div className="text-xs text-obsidian-400">
                    Payment Method: <span className="text-white font-medium">{order.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-obsidian-500 block">Total</span>
                      <span className="text-base font-extrabold text-brand-300 font-mono">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
