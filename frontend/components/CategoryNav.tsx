import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mockData';

export default function CategoryNav() {
  return (
    <section id="categories" className="py-20 bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
              Department Archives
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mt-1 font-display">
              Curated Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-semibold text-brand-300 hover:text-white flex items-center gap-1 group"
          >
            Browse entire collection <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`group relative rounded-2xl overflow-hidden bg-obsidian-900 border border-obsidian-800 transition-all duration-300 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-black/80 ${
                idx === 0 ? 'md:col-span-2 md:row-span-1 aspect-[16/9] md:aspect-auto' : 'aspect-[4/5]'
              }`}
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-75"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-xs font-mono uppercase text-brand-300 mb-1">
                  {cat.productCount} Garments
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-brand-500 group-hover:text-obsidian-950 text-white flex items-center justify-center backdrop-blur-md transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-obsidian-300 mt-2 line-clamp-2 hidden sm:block opacity-80">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
