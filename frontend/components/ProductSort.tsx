'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'best_selling', label: 'Best Selling' },
];

export default function ProductSort({
  currentSort,
  onSortChange,
  totalResults,
}: ProductSortProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-900">{totalResults}</span> curated garments
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Sort By:
        </span>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort garments by"
          className="bg-white border border-slate-300 text-xs text-slate-900 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-900 cursor-pointer shadow-xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
