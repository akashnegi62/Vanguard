'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';

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
    <div className="flex min-h-screen bg-obsidian-950 text-obsidian-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Category Management"
          subtitle="Configure department taxonomies, lookbook banners, and category visibility"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          }
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="bg-obsidian-900/40 border border-obsidian-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-900/90 text-obsidian-400 uppercase tracking-wider font-bold border-b border-obsidian-800">
                <tr>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Garments</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-obsidian-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {cat.imageUrl && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-obsidian-950 shrink-0">
                            <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                          </div>
                        )}
                        <span className="font-bold text-white text-sm">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-obsidian-400 text-xs">{cat.slug}</td>
                    <td className="py-3 px-4 text-obsidian-400 max-w-xs truncate">{cat.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{cat.productCount || 0}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(cat.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cat.isActive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-obsidian-800 text-obsidian-400 border border-obsidian-700'
                        }`}
                      >
                        {cat.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-red-950 text-obsidian-300 hover:text-red-400 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-white uppercase text-sm">Add Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overcoats"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-obsidian-950 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Editorial description of collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-obsidian-950 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-obsidian-950 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-obsidian-800 text-obsidian-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-500 text-obsidian-950 text-xs font-bold uppercase"
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
