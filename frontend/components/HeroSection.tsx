import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-obsidian-950 border-b border-obsidian-800">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1800&auto=format&fit=crop&q=85"
          alt="Luxury Menswear"
          fill
          priority
          className="object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/70 to-obsidian-950/30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-obsidian-950/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-widest mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spring / Summer 2026 Collection</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-tight max-w-4xl mx-auto mb-6">
          Architectural <span className="gold-gradient-text">Essentials</span> for the Modern Man
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-obsidian-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Heavyweight French terry, Kojima selvedge denim, and structured double-pleated wool. Tailored with uncompromising reverence for materials.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-brand-300 text-obsidian-950 font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
          >
            Explore The Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products?category=t-shirts"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-obsidian-900/80 hover:bg-obsidian-800 text-white border border-obsidian-700 font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center"
          >
            Heavyweight Tees
          </Link>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-16 border-t border-obsidian-800/60 mt-16 max-w-3xl mx-auto text-center">
          <div>
            <div className="text-2xl font-extrabold text-white font-display">280+ GSM</div>
            <div className="text-xs text-obsidian-400 uppercase tracking-wider mt-1">Heavy Cotton Knits</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display">14 OZ</div>
            <div className="text-xs text-obsidian-400 uppercase tracking-wider mt-1">Kurabo Selvedge</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display">100%</div>
            <div className="text-xs text-obsidian-400 uppercase tracking-wider mt-1">Organic & Traceable</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display">14 DAYS</div>
            <div className="text-xs text-obsidian-400 uppercase tracking-wider mt-1">Complimentary Returns</div>
          </div>
        </div>
      </div>
    </section>
  );
}
