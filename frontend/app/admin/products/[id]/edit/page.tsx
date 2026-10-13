'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { slugify } from '@/lib/utils';
import { api } from '@/lib/api';
import { Product, Category } from '@/types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Eye,
} from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('Vanguard Atelier');
  const [categoryId, setCategoryId] = useState('cat-tshirts');
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [variants, setVariants] = useState<
    Array<{ size: string; color: string; stock: number; sku?: string }>
  >([]);

  // Fetch product and categories on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setErrorMsg('');

      // Fetch categories
      try {
        const catRes = await api.getCategories();
        if (catRes.data && catRes.data.length > 0 && isMounted) {
          setCategories(catRes.data);
        }
      } catch (e) {
        console.warn('Could not fetch categories, using fallback', e);
      }

      // Fetch product details
      try {
        const prodRes = await api.getProductById(id);
        if (prodRes.data && isMounted) {
          const p = prodRes.data;
          setName(p.name || '');
          setSlug(p.slug || '');
          setBrand(p.brand || 'Vanguard Atelier');
          setCategoryId(p.categoryId || 'cat-tshirts');
          setPrice(Number(p.price) || 0);
          setDiscountPrice(p.discountPrice !== null && p.discountPrice !== undefined ? Number(p.discountPrice) : '');
          setDescription(p.description || '');
          setIsFeatured(Boolean(p.isFeatured));
          setIsActive(p.isActive !== undefined ? Boolean(p.isActive) : true);

          // Images
          if (p.images && p.images.length > 0) {
            setImageUrl(p.images[0].imageUrl);
            setAdditionalImages(p.images.slice(1).map((img) => img.imageUrl));
          } else {
            setImageUrl('');
            setAdditionalImages([]);
          }

          // Variants
          if (p.variants && p.variants.length > 0) {
            setVariants(
              p.variants.map((v) => ({
                size: v.size,
                color: v.color,
                stock: Number(v.stock),
                sku: v.sku,
              }))
            );
          } else {
            setVariants([
              { size: 'M', color: 'Black', stock: 20 },
              { size: 'L', color: 'Black', stock: 15 },
            ]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || 'Failed to fetch garment details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleNameChange = (val: string) => {
    setName(val);
    // If slug was empty or matched a slugified version of previous title
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: 'XL', color: 'Black', stock: 10 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddAdditionalImage = () => {
    if (!newImageInput.trim()) return;
    setAdditionalImages([...additionalImages, newImageInput.trim()]);
    setNewImageInput('');
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    // Combine primary and additional images
    const allImages: string[] = [];
    if (imageUrl.trim()) allImages.push(imageUrl.trim());
    additionalImages.forEach((img) => {
      if (img.trim() && !allImages.includes(img.trim())) {
        allImages.push(img.trim());
      }
    });

    if (allImages.length === 0) {
      setErrorMsg('Please specify at least one valid image URL.');
      setIsSubmitting(false);
      return;
    }

    if (variants.length === 0) {
      setErrorMsg('Please configure at least one size variant.');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.updateProduct(id, {
        name,
        slug: slug || slugify(name),
        description: description || `${brand} ${name} crafted with luxury materials.`,
        price: Number(price),
        discountPrice: discountPrice !== '' ? Number(discountPrice) : null,
        categoryId,
        brand,
        images: allImages,
        isFeatured,
        isActive,
        variants: variants.map((v, i) => ({
          size: v.size,
          color: v.color,
          stock: Number(v.stock),
          sku: v.sku || `${(slug || 'prod')}-${v.size}-${i + 1}`.toUpperCase(),
        })),
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update garment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Edit Garment"
          subtitle={`Editing inventory catalog details for ${name || id}`}
        />

        <main className="flex-1 p-8 max-w-4xl space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to product catalog
            </Link>

            {slug && (
              <Link
                href={`/products/${slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-950 font-medium"
              >
                <Eye className="w-3.5 h-3.5" /> View on Storefront
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
              <p className="text-xs font-medium">Loading garment data from database...</p>
            </div>
          ) : (
            <>
              {isSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Garment updates saved successfully! Redirecting to catalog...</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="font-bold">Error:</span> {errorMsg}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information */}
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
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
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

                {/* Pricing & Media */}
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
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 block mb-1 font-medium">Discount Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Optional discount price"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs text-slate-600 block font-medium">Primary Image URL</label>
                      <div className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            placeholder="https://images.unsplash.com/..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                          />
                        </div>
                        {imageUrl && (
                          <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Images */}
                    <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-3">
                      <label className="text-xs text-slate-600 block font-medium">
                        Additional Gallery Images (Optional)
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste additional image URL..."
                          value={newImageInput}
                          onChange={(e) => setNewImageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAdditionalImage();
                            }
                          }}
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalImage}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Image
                        </button>
                      </div>

                      {additionalImages.length > 0 && (
                        <div className="space-y-2">
                          {additionalImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs"
                            >
                              <div className="w-8 h-8 rounded border border-slate-200 overflow-hidden bg-white shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img}
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <span className="flex-1 truncate text-slate-600 font-mono text-[11px]">{img}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAdditionalImage(idx)}
                                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Variants & Inventory */}
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
                    <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-slate-500 px-1">
                      <div className="col-span-3">Size</div>
                      <div className="col-span-4">Color</div>
                      <div className="col-span-3">Stock Units</div>
                      <div className="col-span-2 text-right">Action</div>
                    </div>

                    {variants.map((v, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-3">
                          <input
                            type="text"
                            required
                            placeholder="Size (e.g. M)"
                            value={v.size}
                            onChange={(e) => {
                              const copy = [...variants];
                              copy[idx].size = e.target.value;
                              setVariants(copy);
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                          />
                        </div>

                        <div className="col-span-4">
                          <input
                            type="text"
                            required
                            placeholder="Color (e.g. Black)"
                            value={v.color}
                            onChange={(e) => {
                              const copy = [...variants];
                              copy[idx].color = e.target.value;
                              setVariants(copy);
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="Stock"
                            value={v.stock}
                            onChange={(e) => {
                              const copy = [...variants];
                              copy[idx].stock = Number(e.target.value);
                              setVariants(copy);
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          {variants.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="text-slate-400 hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-red-50"
                              title="Delete variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 px-2 italic">Min 1</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visibility & Badges */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-3">
                    Catalog Visibility & Status
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-950 focus:ring-0 border-slate-300 accent-slate-950"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Active Status</div>
                        <div className="text-[11px] text-slate-500">
                          {isActive ? 'Visible in store catalog' : 'Archived / Hidden from customer catalog'}
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-950 focus:ring-0 border-slate-300 accent-slate-950"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          Featured Garment <Sparkles className="w-3 h-3 text-amber-500" />
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Prominently highlighted on storefront landing page
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/admin/products"
                    className="py-3 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3.5 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Updates...
                      </>
                    ) : (
                      'Save Garment Updates'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
