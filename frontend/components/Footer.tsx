import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 border-t border-obsidian-900 text-obsidian-400 mt-auto">
      {/* Value Propositions */}
      <div className="border-b border-obsidian-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Free Express Delivery</h4>
              <p className="text-xs text-obsidian-400">On all domestic orders over ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Artisanal Craftsmanship</h4>
              <p className="text-xs text-obsidian-400">Heavyweight Japanese & European cottons</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hassle-Free Returns</h4>
              <p className="text-xs text-obsidian-400">14-day doorstep return & exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Encrypted Payments</h4>
              <p className="text-xs text-obsidian-400">Secure checkout with COD & cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-extrabold tracking-widest text-white uppercase">
                VANGUARD
              </span>
            </Link>
            <p className="text-sm text-obsidian-400 leading-relaxed max-w-sm">
              Engineered menswear built on principles of structural minimalism, exceptional fabric weights, and lifetime longevity. Handcrafted with reverence for classic tailoring.
            </p>
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs uppercase font-semibold tracking-wider text-obsidian-300 mb-2">
                Join The Sartorial Guild
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-obsidian-900 text-sm text-white px-4 py-2.5 rounded-l-lg border border-obsidian-800 focus:outline-none focus:border-brand-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-obsidian-950 px-4 py-2.5 rounded-r-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Collections</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=t-shirts" className="hover:text-brand-300 transition-colors">T-Shirts</Link></li>
              <li><Link href="/products?category=shirts" className="hover:text-brand-300 transition-colors">Tailored Shirts</Link></li>
              <li><Link href="/products?category=jeans" className="hover:text-brand-300 transition-colors">Selvedge Denim</Link></li>
              <li><Link href="/products?category=trousers" className="hover:text-brand-300 transition-colors">Wool & Chino Trousers</Link></li>
              <li><Link href="/products?category=jackets" className="hover:text-brand-300 transition-colors">Outerwear & Coats</Link></li>
              <li><Link href="/products?category=hoodies" className="hover:text-brand-300 transition-colors">Heavyweight Hoodies</Link></li>
              <li><Link href="/products?category=shorts" className="hover:text-brand-300 transition-colors">Resort & Chino Shorts</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Client Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/orders" className="hover:text-brand-300 transition-colors">Track Order</Link></li>
              <li><Link href="/cart" className="hover:text-brand-300 transition-colors">View Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-brand-300 transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/profile" className="hover:text-brand-300 transition-colors">Account Details</Link></li>
              <li><span className="text-obsidian-500 cursor-not-allowed">Garment Care Guide</span></li>
              <li><span className="text-obsidian-500 cursor-not-allowed">Size & Fit Advisor</span></li>
            </ul>
          </div>

          {/* Administration & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Portal & Roles</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/admin/products" className="hover:text-brand-300 transition-colors">Catalog Management</Link></li>
              <li><Link href="/admin/orders" className="hover:text-brand-300 transition-colors">Order Fulfillment</Link></li>
              <li><Link href="/login" className="hover:text-brand-300 transition-colors">Customer Login</Link></li>
              <li><Link href="/register" className="hover:text-brand-300 transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-obsidian-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-obsidian-500">
          <p>© {new Date().getFullYear()} VANGUARD Menswear Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-obsidian-400">Privacy Policy</span>
            <span className="hover:text-obsidian-400">Terms of Service</span>
            <span className="hover:text-obsidian-400">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
