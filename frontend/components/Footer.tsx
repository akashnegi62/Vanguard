import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 mt-auto">
      {/* Value Propositions */}
      <div className="border-b border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Free Express Delivery</h4>
              <p className="text-xs text-slate-500">On all domestic orders over ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Artisanal Craftsmanship</h4>
              <p className="text-xs text-slate-500">Heavyweight Japanese & European cottons</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-500">14-day doorstep return & exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Encrypted Payments</h4>
              <p className="text-xs text-slate-500">Secure checkout with COD & cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-black tracking-widest text-slate-950 uppercase">
                VANGUARD
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Engineered menswear built on principles of structural minimalism, exceptional fabric weights, and lifetime longevity. Handcrafted with reverence for classic tailoring.
            </p>
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-[11px] uppercase font-bold tracking-wider text-slate-800 mb-2">
                Join The Sartorial Guild
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white text-xs text-slate-900 px-3.5 py-2.5 rounded-l-lg border border-slate-300 focus:outline-none focus:border-slate-900 flex-1"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-r-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">Collections</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/products?category=t-shirts" className="hover:text-slate-950 transition-colors">T-Shirts</Link></li>
              <li><Link href="/products?category=shirts" className="hover:text-slate-950 transition-colors">Tailored Shirts</Link></li>
              <li><Link href="/products?category=jeans" className="hover:text-slate-950 transition-colors">Selvedge Denim</Link></li>
              <li><Link href="/products?category=trousers" className="hover:text-slate-950 transition-colors">Wool & Chino Trousers</Link></li>
              <li><Link href="/products?category=jackets" className="hover:text-slate-950 transition-colors">Outerwear & Coats</Link></li>
              <li><Link href="/products?category=hoodies" className="hover:text-slate-950 transition-colors">Heavyweight Hoodies</Link></li>
              <li><Link href="/products?category=shorts" className="hover:text-slate-950 transition-colors">Resort & Chino Shorts</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">Client Service</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/orders" className="hover:text-slate-950 transition-colors">Track Order</Link></li>
              <li><Link href="/cart" className="hover:text-slate-950 transition-colors">View Bag</Link></li>
              <li><Link href="/wishlist" className="hover:text-slate-950 transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/profile" className="hover:text-slate-950 transition-colors">Account Details</Link></li>
              <li><span className="text-slate-400 cursor-not-allowed">Garment Care Guide</span></li>
              <li><span className="text-slate-400 cursor-not-allowed">Size & Fit Advisor</span></li>
            </ul>
          </div>

          {/* Client Account & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">Client Portal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/login" className="hover:text-slate-950 transition-colors">Client Sign In</Link></li>
              <li><Link href="/register" className="hover:text-slate-950 transition-colors">Create Client Account</Link></li>
              <li><Link href="/profile" className="hover:text-slate-950 transition-colors">Personal Wardrobe</Link></li>
              <li><Link href="/orders" className="hover:text-slate-950 transition-colors">Shipping & Returns</Link></li>
              <li><span className="text-slate-400">Concierge: concierge@vanguard.store</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VANGUARD Menswear Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-800">Privacy Policy</span>
            <span className="hover:text-slate-800">Terms of Service</span>
            <span className="hover:text-slate-800">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
