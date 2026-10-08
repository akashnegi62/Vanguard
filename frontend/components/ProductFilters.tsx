'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
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
  { name: 'Black', hex: '#18181b' },
  { name: 'White', hex: '#f4f4f5' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Olive', hex: '#3f4f24' },
  { name: 'Grey', hex: '#71717a' },
  { name: 'Indigo', hex: '#2b3a67' },
  { name: 'Tan', hex: '#c5a880' },
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
    <div className="space-y-8 text-sm">
      <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
        <span className="font-bold text-white uppercase tracking-wider text-xs">
          Refine Results
        </span>
        <button
          onClick={onReset}
          className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
          Category
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onFilterChange({ category: undefined })}
            className={`w-full text-left py-1 px-2 rounded text-xs transition-colors ${
              !selectedCategory
                ? 'bg-brand-500/10 text-brand-300 font-bold'
                : 'text-obsidian-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.slug })}
              className={`w-full text-left py-1 px-2 rounded text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-brand-500/10 text-brand-300 font-bold'
                  : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-obsidian-600 font-mono">
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
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
              className={`min-w-8 h-8 px-2 rounded font-mono text-xs border transition-all ${
                selectedSize === size
                  ? 'bg-brand-500 border-brand-400 text-obsidian-950 font-bold'
                  : 'bg-obsidian-900 border-obsidian-800 text-obsidian-300 hover:border-obsidian-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
          Color
        </h4>
        <div className="flex flex-wrap gap-2">
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
                    ? 'border-brand-400 bg-brand-500/10 text-white font-medium'
                    : 'border-obsidian-800 bg-obsidian-900/80 text-obsidian-400 hover:border-obsidian-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40"
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
        <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
          Price Range
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] uppercase text-obsidian-500 block mb-1">
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
              className="w-full bg-obsidian-900 border border-obsidian-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-obsidian-500 block mb-1">
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
              className="w-full bg-obsidian-900 border border-obsidian-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
          Brand Atelier
        </h4>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-xs text-obsidian-300 hover:text-white"
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
                className="rounded border-obsidian-800 text-brand-500 focus:ring-0 bg-obsidian-900"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4.5, 4.0, 3.5].map((rate) => (
            <button
              key={rate}
              onClick={() =>
                onFilterChange({
                  rating: selectedRating === rate ? undefined : rate,
                })
              }
              className={`w-full text-left py-1 px-2 rounded text-xs transition-colors flex items-center justify-between ${
                selectedRating === rate
                  ? 'bg-brand-500/10 text-brand-300 font-bold'
                  : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <span>{rate}★ & Above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-obsidian-950 p-5 rounded-2xl border border-obsidian-900 sticky top-28 h-fit">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-obsidian-950 border-l border-obsidian-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-800 mb-6">
              <h3 className="font-bold text-white uppercase text-sm">Filters</h3>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-obsidian-400 hover:text-white"
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
