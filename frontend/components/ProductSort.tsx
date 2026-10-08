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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
      <div className="text-xs text-obsidian-400">
        Showing <span className="font-bold text-white">{totalResults}</span> curated garments
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-obsidian-400 shrink-0" />
        <span className="text-xs text-obsidian-400 uppercase tracking-wider font-semibold">
          Sort By:
        </span>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort garments by"
          className="bg-obsidian-900 border border-obsidian-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
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
