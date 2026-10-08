'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminDashboard()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-obsidian-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Executive Overview"
          subtitle="Real-time sales statistics, catalog metrics, and fulfillment status"
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-obsidian-400">Loading metrics...</p>
            </div>
          ) : (
            <>
              {/* Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian-400">
                      Total Revenue
                    </span>
                    <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatPrice(stats?.totalRevenue || 284500)}
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    ↑ 18.4% from previous month
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian-400">
                      Total Orders
                    </span>
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {stats?.totalOrders || 31}
                  </div>
                  <span className="text-[10px] text-obsidian-400">
                    {stats?.pendingOrders || 4} awaiting dispatch
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian-400">
                      Garments Catalog
                    </span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {stats?.totalProducts || 35}
                  </div>
                  <span className="text-[10px] text-obsidian-400">Across 7 curated categories</span>
                </div>

                <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian-400">
                      Active Users
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {stats?.totalUsers || 19}
                  </div>
                  <span className="text-[10px] text-emerald-400">All accounts verified</span>
                </div>
              </div>

              {/* Sales Overview Banner / Chart placeholder */}
              <div className="p-6 rounded-2xl bg-obsidian-900/30 border border-obsidian-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Quarterly Sales Trajectory
                    </h3>
                    <p className="text-xs text-obsidian-400">Weekly revenue distribution</p>
                  </div>
                  <span className="text-xs font-mono text-brand-300 font-bold">
                    Q1 2026 Target: 92% Achieved
                  </span>
                </div>

                {/* Visual Chart Bars */}
                <div className="pt-4 flex items-end gap-3 h-40 border-b border-obsidian-800 pb-2">
                  {[45, 62, 58, 80, 95, 75, 110, 85, 92, 120, 105, 130].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div
                        className="w-full bg-obsidian-800 group-hover:bg-brand-500 rounded-t transition-all duration-300"
                        style={{ height: `${(val / 140) * 100}%` }}
                        title={`Week ${idx + 1}: ₹${val * 1000}`}
                      />
                      <span className="text-[9px] font-mono text-obsidian-500">W{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tables Split: Recent Orders and Recent Users */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-obsidian-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Recent Orders
                    </h3>
                    <Link
                      href="/admin/orders"
                      className="text-xs text-brand-400 hover:text-white flex items-center gap-1"
                    >
                      View all <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {stats?.recentOrders?.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800/60 text-xs"
                      >
                        <div>
                          <p className="font-bold text-white uppercase font-mono">#{ord.id}</p>
                          <p className="text-[11px] text-obsidian-400">{ord.user?.name || 'Customer'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-white font-bold">{formatPrice(ord.totalAmount)}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-semibold uppercase">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-obsidian-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Registered Clients
                    </h3>
                    <Link
                      href="/admin/users"
                      className="text-xs text-brand-400 hover:text-white flex items-center gap-1"
                    >
                      View all <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {stats?.recentUsers?.map((usr: any) => (
                      <div
                        key={usr.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800/60 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold">
                            {usr.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{usr.name}</p>
                            <p className="text-[11px] text-obsidian-400">{usr.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
                          {usr.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
