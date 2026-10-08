'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import ProductSort from '@/components/ProductSort';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read filter params
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const size = searchParams.get('size') || undefined;
  const color = searchParams.get('color') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api
      .getProducts({
        category,
        search,
        size,
        color,
        brand,
        minPrice,
        maxPrice,
        rating,
        sort,
        page,
        limit: 12,
      })
      .then((res) => {
        if (!isMounted) return;
        setProducts(res.data);
        if (res.pagination) {
          setTotalCount(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        } else {
          setTotalCount(res.data.length);
          setTotalPages(1);
        }
      })
      .catch((err) => {
        console.error('Failed to load products', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category, search, size, color, brand, minPrice, maxPrice, rating, sort, page]);

  const updateFilters = (newParams: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    if (!newParams.page) {
      params.delete('page');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight font-display">
          {category ? category.replace('-', ' ') : 'All Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          {search ? `Search results for "${search}"` : 'Artisanal menswear engineered with heavyweight textiles.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <ProductFilters
          selectedCategory={category}
          selectedSize={size}
          selectedColor={color}
          selectedBrand={brand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedRating={rating}
          onFilterChange={updateFilters}
          onReset={handleResetFilters}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Main Product Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Toggle Button */}
          <div className="flex items-center justify-between gap-4 mb-4 lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 uppercase shadow-xs"
            >
              <Filter className="w-4 h-4 text-slate-600" /> Filters
            </button>
          </div>

          <ProductSort
            currentSort={sort}
            onSortChange={(newSort) => updateFilters({ sort: newSort })}
            totalResults={totalCount}
          />

          <div className="mt-6">
            <ProductGrid products={products} isLoading={isLoading} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 pt-6 border-t border-slate-200">
              <button
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
                className="p-2 rounded-lg bg-white border border-slate-300 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-600 font-mono">
                Page <span className="text-slate-900 font-bold">{page}</span> of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: page + 1 })}
                className="p-2 rounded-lg bg-white border border-slate-300 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-xs"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
