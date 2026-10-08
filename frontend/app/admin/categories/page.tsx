'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  ExternalLink,
  ImageIcon
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCategories();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800');
    setIsActive(true);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setIsActive(cat.isActive !== false);
    setIsModalOpen(true);
    setFeedback(null);
  };

  // Auto-generate slug when typing name in Add mode
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newStatus } : c))
    );

    try {
      await api.updateCategory(id, { isActive: newStatus });
      setFeedback({ type: 'success', message: 'Department visibility updated in database.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      // Revert on failure
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
      );
      setFeedback({ type: 'error', message: err.message || 'Failed to update visibility.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete department "${catName}"? This will unlink it from active products.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setFeedback({ type: 'success', message: `Department "${catName}" removed successfully.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete department.' });
      setTimeout(() => setFeedback(null), 3000);
      loadCategories();
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const cleanedImage = imageUrl.trim();
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || '',
        imageUrl: cleanedImage || '',
        image_url: cleanedImage || '',
        isActive,
      };

      if (editingCategory) {
        // Edit flow
        const res = await api.updateCategory(editingCategory.id, payload);
        if (res?.data || res?.success) {
          // Optimistically update table row immediately with updated image
          const updatedData = res.data || {};
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? {
                    ...c,
                    ...updatedData,
                    name: payload.name,
                    slug: payload.slug || c.slug,
                    description: payload.description,
                    imageUrl: cleanedImage,
                    isActive: payload.isActive,
                  }
                : c
            )
          );
          setFeedback({ type: 'success', message: `Department "${name}" updated successfully across catalog!` });
          setIsModalOpen(false);
          await loadCategories();
        } else {
          throw new Error(res?.message || 'Failed to update category');
        }
      } else {
        // Create flow
        const res = await api.createCategory(payload);
        if (res?.data || res?.success) {
          setFeedback({ type: 'success', message: `Department "${name}" created successfully!` });
          setIsModalOpen(false);
          await loadCategories();
        } else {
          throw new Error(res?.message || 'Failed to create category');
        }
      }
    } catch (err: any) {
      console.error('Save category error:', err);
      setFeedback({ type: 'error', message: err?.message || 'Operation failed. Check connection.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Category Management"
          subtitle="Configure department taxonomies, edit lookbook banners, and manage catalog navigation"
          action={
            <button
              onClick={handleOpenAddModal}
              className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          }
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Notification Alert */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold animate-fadeIn ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Search bar and counter */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search departments by title or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total Departments: <span className="text-slate-900 font-bold">{filteredCategories.length}</span>
            </span>
          </div>

          {/* Categories Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="py-20 text-center space-y-2">
                <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Loading departments from database...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-600">
                  {search ? 'No departments match your search.' : 'No departments configured yet.'}
                </p>
                {!search && (
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Create First Department
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                              {cat.imageUrl ? (
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-950 text-sm block">{cat.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {cat.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-xs">
                          <Link
                            href={`/products?category=${cat.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-950 hover:underline"
                            title="View category catalog in new tab"
                          >
                            <span>/{cat.slug}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                          {cat.description || <span className="text-slate-400 italic">No description</span>}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-950">
                          {cat.productCount ?? 0}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleActive(cat.id, cat.isActive)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              cat.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {cat.isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-400" /> Hidden
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(cat)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors border border-slate-200"
                              title="Edit department"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(cat.id, cat.name)}
                              disabled={deletingId === cat.id}
                              className={`p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200 ${
                                deletingId === cat.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Delete category"
                            >
                              <Trash2 className={`w-3.5 h-3.5 ${deletingId === cat.id ? 'animate-pulse' : ''}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Unified Add / Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-black text-slate-950 uppercase text-base tracking-wide">
                  {editingCategory ? `Edit Department: ${editingCategory.name}` : 'Add Department'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingCategory
                    ? 'Modify department titles, catalog slug, banner media, and live visibility.'
                    : 'Create a new garment category or department in your store catalog.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Department Name */}
              <div>
                <label className="text-xs text-slate-700 block mb-1 font-bold uppercase tracking-wider">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneakers, Knitwear, Suits"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-950 transition-all font-medium"
                />
              </div>

              {/* Catalog Slug */}
              <div>
                <label className="text-xs text-slate-700 block mb-1 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>URL Slug *</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">/products?category={slug || '...'}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sneakers, knitwear, suits"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-slate-950 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-slate-700 block mb-1 font-bold uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Editorial description of collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-950 transition-all"
                />
              </div>

              {/* Banner Image URL & Preview */}
              <div>
                <label className="text-xs text-slate-700 block mb-1 font-bold uppercase tracking-wider">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-950 transition-all font-mono"
                />
                
                {/* Live Image Thumbnail Preview */}
                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex-1 min-w-0">
                      <span className="font-semibold text-slate-800 block">Lookbook Banner Preview</span>
                      <span className="text-slate-400 truncate block font-mono text-[10px]">{imageUrl}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility Status Toggle */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Department Visibility</span>
                  <span className="text-[11px] text-slate-500 block">
                    {isActive ? 'Visible in store catalog, search filters, and navigation' : 'Hidden from storefront catalog'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    'Saving...'
                  ) : editingCategory ? (
                    'Save Changes'
                  ) : (
                    'Add Department'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
