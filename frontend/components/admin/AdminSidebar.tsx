'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ClipboardList, 
  Users, 
  ArrowLeft
} from 'lucide-react';

const LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand / Logo */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-display text-xl font-black tracking-widest text-slate-950 uppercase">
            VANGUARD
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return to Storefront link */}
      <div className="p-4 border-t border-slate-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </aside>
  );
}
