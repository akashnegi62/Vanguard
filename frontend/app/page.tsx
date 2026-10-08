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
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Curated Categories */}
        <CategoryNav />

        {/* Featured Products */}
        <section className="py-20 border-t border-obsidian-900 bg-obsidian-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-brand-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Iconic Silhouettes
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mt-1 font-display">
                  Featured Garments
                </h2>
              </div>
              <Link
                href="/products"
                className="mt-4 sm:mt-0 text-sm font-semibold text-brand-300 hover:text-white flex items-center gap-1 group"
              >
                View all featured <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts} />
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-16 bg-gradient-to-r from-obsidian-900 via-obsidian-950 to-brand-950 border-y border-obsidian-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs uppercase font-mono tracking-widest text-brand-400">
                The Heritage Guarantee
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display">
                Crafted to Outlast Fast Fashion
              </h3>
              <p className="text-sm text-obsidian-300 leading-relaxed">
                Every seam is reinforced with high-tensile poly-core thread. We source from historic mills in Okayama, Biella, and Lancashire to provide timeless structure.
              </p>
            </div>
            <Link
              href="/products?category=jeans"
              className="px-8 py-4 rounded-full bg-brand-400 hover:bg-brand-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-500/10 shrink-0"
            >
              Shop Selvedge Denim
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20 bg-obsidian-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-brand-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Recent Drops
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mt-1 font-display">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/products?sort=newest"
                className="mt-4 sm:mt-0 text-sm font-semibold text-brand-300 hover:text-white flex items-center gap-1 group"
              >
                Browse latest drops <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <ProductGrid products={newArrivals} />
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-20 border-t border-obsidian-900 bg-obsidian-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-brand-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Customer Favorites
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mt-1 font-display">
                  Best Sellers
                </h2>
              </div>
              <Link
                href="/products?sort=best_selling"
                className="mt-4 sm:mt-0 text-sm font-semibold text-brand-300 hover:text-white flex items-center gap-1 group"
              >
                View all best sellers <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
