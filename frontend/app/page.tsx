'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ArrowRight, Sparkles, Flame, Clock } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = [...MOCK_PRODUCTS].reverse().slice(0, 4);
  const bestSellers = [...MOCK_PRODUCTS]
    .sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Curated Categories */}
        <CategoryNav />

        {/* Featured Products */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Iconic Silhouettes
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight mt-1 font-display">
                  Featured Garments
                </h2>
              </div>
              <Link
                href="/products"
                className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-slate-600 flex items-center gap-1 group"
              >
                View all featured <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts} />
          </div>
        </section>

        {/* High-Contrast Editorial Banner */}
        <section className="py-16 bg-slate-900 text-white border-y border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs uppercase font-mono tracking-widest text-brand-300 font-bold">
                The Heritage Guarantee
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
                Crafted to Outlast Fast Fashion
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every seam is reinforced with high-tensile poly-core thread. We source from historic mills in Okayama, Biella, and Lancashire to provide timeless structure.
              </p>
            </div>
            <Link
              href="/products?category=jeans"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shrink-0"
            >
              Shop Selvedge Denim
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Recent Drops
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight mt-1 font-display">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/products?sort=newest"
                className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-slate-600 flex items-center gap-1 group"
              >
                Browse latest drops <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <ProductGrid products={newArrivals} />
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Customer Favorites
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight mt-1 font-display">
                  Best Sellers
                </h2>
              </div>
              <Link
                href="/products?sort=best_selling"
                className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-slate-600 flex items-center gap-1 group"
              >
                View all best sellers <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <ProductGrid products={bestSellers} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
