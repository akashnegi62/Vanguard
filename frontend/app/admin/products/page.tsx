'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    api
      .getProducts({ limit: 50 })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you wish to delete this garment from the active catalog?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Product Management"
          subtitle="Full catalog inventory, pricing rules, and active variant matrices"
          action={
            <Link
              href="/admin/products/new"
              className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Garment
            </Link>
          }
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search products by title or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total Products: <span className="text-slate-900 font-bold">{filtered.length}</span>
            </span>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="py-20 text-center text-xs text-slate-500">
                Loading product records...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-500">
                No garments found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Garment</th>
                      <th className="py-3.5 px-4">Brand</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((product) => {
                      const image = product.images?.[0]?.imageUrl || '';
                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                {image && (
                                  <Image
                                    src={image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-slate-950 block max-w-xs truncate">
                                  {product.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {product.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {product.brand}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-slate-950 font-bold">
                              {formatPrice(product.discountPrice || product.price)}
                            </span>
                            {product.discountPrice && (
                              <span className="block text-[10px] text-slate-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-mono font-bold ${
                                (product.totalStock || 0) > 10
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {product.totalStock || 25} in stock
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleActive(product.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                product.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {product.isActive ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" /> Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors border border-slate-200"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
