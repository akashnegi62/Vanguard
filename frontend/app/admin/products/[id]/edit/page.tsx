'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mockData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const prod = MOCK_PRODUCTS.find((p) => p.id === id);
    if (prod) {
      setProduct(prod);
      setName(prod.name);
      setPrice(prod.price);
      setDiscountPrice(prod.discountPrice || 0);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-obsidian-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Edit Garment"
          subtitle={`Editing inventory details for ${product?.name || id}`}
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
              <CheckCircle2 className="w-4 h-4" /> Updates saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
            <div>
              <label className="text-xs text-obsidian-400 block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Discount Price (₹)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Save Garment Updates
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
