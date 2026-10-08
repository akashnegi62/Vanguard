'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New category form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800');

  const handleToggleActive = (id: string) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug: slugify(name),
      description,
      imageUrl,
      isActive: true,
      productCount: 0,
    };
    setCategories([...categories, newCat]);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Category Management"
          subtitle="Configure department taxonomies, lookbook banners, and category visibility"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          }
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Garments</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {cat.imageUrl && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                          </div>
                        )}
                        <span className="font-bold text-slate-950 text-sm">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-xs">{cat.slug}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{cat.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-950">{cat.productCount || 0}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(cat.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {cat.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors border border-slate-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-950 uppercase text-xs">Add Department</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overcoats"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Editorial description of collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-950 text-white text-xs font-bold uppercase hover:bg-slate-800"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
