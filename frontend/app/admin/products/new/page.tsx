'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { slugify } from '@/lib/utils';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('AURA Atelier');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [price, setPrice] = useState(2499);
  const [discountPrice, setDiscountPrice] = useState(1999);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900');
  const [isFeatured, setIsFeatured] = useState(true);

  const [variants, setVariants] = useState([
    { size: 'M', color: 'Black', stock: 20 },
    { size: 'L', color: 'Black', stock: 15 },
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: 'XL', color: 'Black', stock: 10 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-obsidian-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Create Garment"
          subtitle="Add a new luxury garment to the storefront catalog"
        />

        <main className="flex-1 p-8 max-w-4xl space-y-6 overflow-y-auto">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-obsidian-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to product catalog
          </Link>

          {isSuccess && (
            <div className="p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Garment created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                General Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage Wash Heavyweight Tee"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Brand Atelier</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {MOCK_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-obsidian-400 block mb-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the fabric weight, silhouette, and craftsmanship..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Image */}
            <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3">
                Pricing & Media
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian-400 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-obsidian-400 block mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
              <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Sizes & Inventory Stock
                </h2>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Size Variant
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Size (e.g. M)"
                      value={v.size}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].size = e.target.value;
                        setVariants(copy);
                      }}
                      className="w-24 bg-obsidian-900 border border-obsidian-800 rounded-lg p-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={v.color}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].color = e.target.value;
                        setVariants(copy);
                      }}
                      className="w-32 bg-obsidian-900 border border-obsidian-800 rounded-lg p-2 text-xs text-white"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].stock = Number(e.target.value);
                        setVariants(copy);
                      }}
                      className="w-24 bg-obsidian-900 border border-obsidian-800 rounded-lg p-2 text-xs text-white"
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-obsidian-500 hover:text-red-400 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="py-3.5 px-8 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-xl transition-all"
            >
              Publish Garment to Catalog
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
