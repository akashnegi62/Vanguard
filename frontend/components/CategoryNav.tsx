'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { Category } from '@/types';
import { api } from '@/lib/api';

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    api.getCategories()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch categories for CategoryNav', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="categories" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
              Department Archives
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight mt-1 font-display">
              Curated Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-3 md:mt-0 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-slate-600 flex items-center gap-1 group"
          >
            Browse entire collection <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 transition-all duration-300 hover:shadow-xl ${
                idx === 0 ? 'md:col-span-2 md:row-span-1 aspect-[16/9] md:aspect-auto' : 'aspect-[4/5]'
              }`}
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                <span className="text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold">
                  {cat.productCount} Garments
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wide">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white group-hover:text-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 hidden sm:block opacity-90">
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
