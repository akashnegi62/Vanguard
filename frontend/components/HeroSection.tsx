import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-slate-100 border-b border-slate-200">
      {/* Editorial Background Image with Light Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1800&auto=format&fit=crop&q=85"
          alt="Luxury Menswear"
          fill
          priority
          className="object-cover object-top opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Spring / Summer 2026 Collection</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 tracking-tight uppercase leading-tight max-w-4xl mx-auto mb-6">
          Architectural <span className="text-slate-900 underline decoration-slate-300 decoration-4 underline-offset-8">Essentials</span> for the Modern Man
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Heavyweight French terry, Kojima selvedge denim, and structured double-pleated wool. Tailored with uncompromising reverence for materials.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-slate-950/10 flex items-center justify-center gap-2 group"
          >
            Explore The Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products?category=t-shirts"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center shadow-sm"
          >
            Heavyweight Tees
          </Link>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-12 sm:pt-16 border-t border-slate-200/80 mt-12 sm:mt-16 max-w-3xl mx-auto text-center">
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">280+ GSM</div>
            <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mt-0.5">Heavy Cotton Knits</div>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">14 OZ</div>
            <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mt-0.5">Kurabo Selvedge</div>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">100%</div>
            <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mt-0.5">Organic & Traceable</div>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">14 DAYS</div>
            <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mt-0.5">Free Returns</div>
          </div>
        </div>
      </div>
    </section>
  );
}
