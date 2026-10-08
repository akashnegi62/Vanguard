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
  ArrowLeft,
  ShieldAlert
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
    <aside className="w-64 bg-obsidian-950 border-r border-obsidian-900 flex flex-col shrink-0 min-h-screen">
      {/* Brand / Logo */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-obsidian-900">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-display text-xl font-black tracking-widest text-white uppercase">
            VANGUARD
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-500 text-obsidian-950">
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-brand-500 text-obsidian-950 font-bold shadow-lg shadow-brand-500/10'
                  : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return to Storefront link */}
      <div className="p-4 border-t border-obsidian-900">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-obsidian-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-obsidian-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </aside>
  );
}
