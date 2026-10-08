'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Eye } from 'lucide-react';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminOrders()
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

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: PaymentStatus) => {
    await api.updatePaymentStatus(orderId, newStatus);
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o))
    );
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.name && o.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (o.user?.email && o.user.email.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-obsidian-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Fulfillment & Orders"
          subtitle="Customer purchase manifests, delivery tracking, and payment validation"
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-obsidian-500 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-3" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-obsidian-400 uppercase tracking-wider font-semibold">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-obsidian-900 border border-obsidian-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Statuses</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-obsidian-900/40 border border-obsidian-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-900/90 text-obsidian-400 uppercase tracking-wider font-bold border-b border-obsidian-800">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800/60">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-obsidian-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white uppercase">
                      #{order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">
                        {order.user?.name || 'Customer'}
                      </span>
                      <span className="text-[10px] text-obsidian-500">
                        {order.user?.email || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-obsidian-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white font-bold">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)
                        }
                        className={`text-[10px] font-bold uppercase rounded px-2 py-1 border bg-obsidian-950 focus:outline-none ${
                          order.paymentStatus === 'PAID'
                            ? 'text-emerald-400 border-emerald-800'
                            : 'text-amber-400 border-amber-800'
                        }`}
                      >
                        {PAYMENT_STATUSES.map((ps) => (
                          <option key={ps} value={ps}>
                            {ps}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="text-[10px] font-bold uppercase rounded px-2 py-1 border bg-obsidian-950 border-obsidian-700 text-white focus:outline-none focus:border-brand-500"
                      >
                        {ORDER_STATUSES.map((os) => (
                          <option key={os} value={os}>
                            {os}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/orders/${order.id}`}
                        className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-obsidian-300 hover:text-white inline-flex items-center"
                        title="View order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
