import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-950 border-b border-slate-200">
      {/* 100% Visible High-Definition Fashion Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1920&auto=format&fit=crop&q=95"
          alt="Men's Luxury Fashion Editorial"
          fill
          priority
          className="object-cover object-center opacity-100"
        />
        {/* Subtle Dark Editorial Gradient to ensure pristine typography legibility while keeping image 100% visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold uppercase tracking-widest mb-6 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Spring / Summer 2026 Collection</span>
        </div>

        {/* Updated Tagline / Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-tight max-w-3xl mx-auto mb-6 drop-shadow-md">
          Timeless <span className="underline decoration-amber-400 decoration-4 underline-offset-8">Luxury</span> for the Modern Man
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed mb-10 drop-shadow-sm">
          Heavyweight French terry, Kojima selvedge denim, and structured double-pleated wool. Tailored with uncompromising reverence for materials.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group"
          >
            Explore The Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products?category=t-shirts"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur-md font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center"
          >
            Heavyweight Tees
          </Link>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-12 sm:pt-16 border-t border-white/20 mt-12 sm:mt-16 max-w-3xl mx-auto text-center">
          <div className="p-3.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15">
            <div className="text-xl sm:text-2xl font-black text-white font-display">280+ GSM</div>
            <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5">Heavy Cotton Knits</div>
          </div>
          <div className="p-3.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15">
            <div className="text-xl sm:text-2xl font-black text-white font-display">14 OZ</div>
            <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5">Kurabo Selvedge</div>
          </div>
          <div className="p-3.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15">
            <div className="text-xl sm:text-2xl font-black text-white font-display">100%</div>
            <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5">Organic & Traceable</div>
          </div>
          <div className="p-3.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15">
            <div className="text-xl sm:text-2xl font-black text-white font-display">14 DAYS</div>
            <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5">Free Returns</div>
          </div>
        </div>
      </div>
    </section>
  );
}
