'use client';

import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mockData';

interface ProductFiltersProps {
  selectedCategory?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedBrand?: string;
  minPrice?: number;
  maxPrice?: number;
  selectedRating?: number;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const SIZES = ['S', 'M', 'L', 'XL', '30', '32', '34', '38', '40', '42'];
const COLORS = [
  { name: 'Black', hex: '#0f172a' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Olive', hex: '#3f4f24' },
  { name: 'Grey', hex: '#64748b' },
  { name: 'Indigo', hex: '#312e81' },
  { name: 'Tan', hex: '#d4b996' },
];
const BRANDS = [
  'AURA Atelier',
  'Sartorial Studio',
  'Apex Denim',
  'Stonebridge',
  'Monolith',
  'Noir & Co',
];

export default function ProductFilters({
  selectedCategory,
  selectedSize,
  selectedColor,
  selectedBrand,
  minPrice,
  maxPrice,
  selectedRating,
  onFilterChange,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
}: ProductFiltersProps) {
  const content = (
    <div className="space-y-7 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <span className="font-bold text-slate-950 uppercase tracking-wider text-xs">
          Refine Results
        </span>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
          Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: undefined })}
            className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-colors ${
              !selectedCategory
                ? 'bg-slate-900 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.slug })}
              className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] font-mono ${selectedCategory === cat.slug ? 'text-slate-300' : 'text-slate-400'}`}>
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
          Size
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() =>
                onFilterChange({
                  size: selectedSize === size ? undefined : size,
                })
              }
              className={`min-w-8 h-8 px-2 rounded-lg font-mono text-xs border transition-all ${
                selectedSize === size
                  ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
          Color
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {COLORS.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={() =>
                  onFilterChange({
                    color: isSelected ? undefined : color.name,
                  })
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white font-medium'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
          Price Range
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] uppercase text-slate-500 block mb-1">
              Min (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={minPrice || ''}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-slate-500 block mb-1">
              Max (₹)
            </label>
            <input
              type="number"
              placeholder="15000"
              value={maxPrice || ''}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
          Brand Atelier
        </h4>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-950"
            >
              <input
                type="radio"
                name="brandFilter"
                checked={selectedBrand === brand}
                onChange={() =>
                  onFilterChange({
                    brand: selectedBrand === brand ? undefined : brand,
                  })
                }
                className="text-slate-900 focus:ring-0 border-slate-300"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200 sticky top-28 h-fit shadow-xs">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h3 className="font-bold text-slate-950 uppercase text-xs">Filter Catalog</h3>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
