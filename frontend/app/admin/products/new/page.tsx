'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { slugify } from '@/lib/utils';
import { api } from '@/lib/api';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('Vanguard Atelier');
  const [categoryId, setCategoryId] = useState('cat-tshirts');
  const [price, setPrice] = useState(2499);
  const [discountPrice, setDiscountPrice] = useState(1999);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900');

  const [variants, setVariants] = useState([
    { size: 'M', color: 'Black', stock: 20 },
    { size: 'L', color: 'Black', stock: 15 },
  ]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.createProduct({
        name,
        slug,
        description: description || `${brand} ${name} crafted with luxury materials.`,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        categoryId,
        brand,
        images: [imageUrl],
        variants: variants.map((v, i) => ({
          size: v.size,
          color: v.color,
          stock: Number(v.stock),
          sku: `${slug || 'prod'}-${v.size}-${i + 1}`.toUpperCase(),
        })),
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Create Garment"
          subtitle="Add a new luxury garment to the storefront catalog"
        />

        <main className="flex-1 p-8 max-w-4xl space-y-6 overflow-y-auto">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to product catalog
          </Link>

          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Garment created successfully! Redirecting...
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-3">
                General Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage Wash Heavyweight Tee"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Brand Atelier</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  >
                    <option value="cat-tshirts">T-Shirts</option>
                    <option value="cat-shirts">Shirts</option>
                    <option value="cat-jeans">Jeans</option>
                    <option value="cat-trousers">Trousers</option>
                    <option value="cat-jackets">Jackets</option>
                    <option value="cat-hoodies">Hoodies</option>
                    <option value="cat-shorts">Shorts</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the fabric weight, silhouette, and craftsmanship..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Image */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-3">
                Pricing & Media
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-600 block mb-1 font-medium">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950">
                  Sizes & Inventory Stock
                </h2>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-xs text-slate-700 hover:text-slate-950 font-bold flex items-center gap-1"
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
                      className="w-24 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
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
                      className="w-32 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
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
                      className="w-24 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-slate-400 hover:text-red-600 p-2"
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
              disabled={isSubmitting}
              className="py-3.5 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Publishing Garment...' : 'Publish Garment to Catalog'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
