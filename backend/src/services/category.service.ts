import { isDatabaseConnected, prisma } from '../config/database';
import { supabase } from '../config/supabase';
import { mockStore, MockCategory } from './mockStore';

export class CategoryService {
  static async getCategories() {
    if (isDatabaseConnected()) {
      try {
        const cats = await prisma.category.findMany({
          include: {
            _count: { select: { products: true } },
          },
          orderBy: { name: 'asc' },
        });
        if (cats && cats.length > 0) {
          return cats.map((c) => ({
            ...c,
            productCount: c._count?.products || 0,
          }));
        }
      } catch (err) {
        console.warn('Prisma getCategories fallback:', err);
      }
    }

    // Try Supabase directly
    if (supabase) {
      try {
        const { data: sbCats, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!error && sbCats && sbCats.length > 0) {
          // Fetch products to count
          const { data: prods } = await supabase.from('products').select('category_id');
          const countMap: Record<string, number> = {};
          (prods || []).forEach((p: any) => {
            if (p.category_id) {
              countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
            }
          });

          return sbCats.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageUrl: c.image_url,
            isActive: c.is_active,
            productCount: countMap[c.id] || countMap[c.slug] || 0,
            _count: {
              products: countMap[c.id] || countMap[c.slug] || 0,
            },
          }));
        }
      } catch (err) {
        console.warn('Supabase getCategories error:', err);
      }
    }

    return mockStore.categories.map((c) => ({
      ...c,
      productCount: mockStore.products.filter((p) => p.categoryId === c.id).length,
      _count: {
        products: mockStore.products.filter((p) => p.categoryId === c.id).length,
      },
    }));
  }

  static async getCategoryById(idOrSlug: string) {
    if (isDatabaseConnected()) {
      try {
        const cat = await prisma.category.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
          include: {
            products: {
              where: { isActive: true },
              include: { images: true, variants: true },
            },
          },
        });
        if (cat) return cat;
      } catch (err) {
        console.warn('Prisma getCategoryById fallback:', err);
      }
    }

    if (supabase) {
      try {
        const { data: cat } = await supabase
          .from('categories')
          .select('*')
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
          .maybeSingle();

        if (cat) {
          const { data: prods } = await supabase
            .from('products')
            .select('*, images:product_images(*), variants:product_variants(*)')
            .eq('category_id', cat.id);

          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            imageUrl: cat.image_url,
            isActive: cat.is_active,
            products: prods || [],
          };
        }
      } catch (err) {
        console.warn('Supabase getCategoryById error:', err);
      }
    }

    const cat = mockStore.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
    if (!cat) throw new Error('Category not found');

    const products = mockStore.products.filter((p) => p.categoryId === cat.id);
    return { ...cat, products };
  }

  static async createCategory(data: { name: string; description?: string; imageUrl?: string; isActive?: boolean }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newId = `cat-${slug || Date.now()}`;

    let createdCategory: any = null;

    if (isDatabaseConnected()) {
      try {
        createdCategory = await prisma.category.create({
          data: {
            name: data.name,
            slug,
            description: data.description || null,
            imageUrl: data.imageUrl || null,
            isActive: data.isActive !== false,
          },
        });
      } catch (err) {
        console.warn('Prisma createCategory error, fallback to Supabase:', err);
      }
    }

    if (supabase) {
      try {
        const record = {
          id: newId,
          name: data.name,
          slug,
          description: data.description || null,
          image_url: data.imageUrl || null,
          is_active: data.isActive !== false,
        };
        const { data: sbCat, error } = await supabase.from('categories').upsert(record).select().single();
        if (!error && sbCat) {
          createdCategory = {
            id: sbCat.id,
            name: sbCat.name,
            slug: sbCat.slug,
            description: sbCat.description,
            imageUrl: sbCat.image_url,
            isActive: sbCat.is_active,
            productCount: 0,
          };
        }
      } catch (err) {
        console.warn('Supabase createCategory error:', err);
      }
    }

    // Always update mockStore in memory too
    const newMock: MockCategory = {
      id: createdCategory?.id || newId,
      name: data.name,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: data.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingIdx = mockStore.categories.findIndex((c) => c.slug === slug || c.id === newId);
    if (existingIdx >= 0) {
      mockStore.categories[existingIdx] = newMock;
    } else {
      mockStore.categories.push(newMock);
    }

    return createdCategory || newMock;
  }

  static async updateCategory(id: string, data: any) {
    let updatedCat: any = null;

    const computedSlug = data.slug
      ? data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : undefined;

    const rawImg = data.imageUrl !== undefined ? data.imageUrl : data.image_url;
    const finalImage = rawImg !== undefined ? (rawImg ? String(rawImg).trim() : null) : undefined;

    let targetId = id;
    if (supabase) {
      try {
        const { data: existing } = await supabase
          .from('categories')
          .select('id, slug')
          .or(`id.eq.${id},slug.eq.${id}`)
          .maybeSingle();
        if (existing?.id) {
          targetId = existing.id;
        }
      } catch {}
    }

    if (isDatabaseConnected()) {
      try {
        updatedCat = await prisma.category.update({
          where: { id: targetId },
          data: {
            ...(data.name && { name: data.name }),
            ...(computedSlug && { slug: computedSlug }),
            ...(data.description !== undefined && { description: data.description || null }),
            ...(finalImage !== undefined && { imageUrl: finalImage }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
          },
        });
      } catch (err) {
        console.warn('Prisma updateCategory fallback:', err);
      }
    }

    if (supabase) {
      try {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (computedSlug) payload.slug = computedSlug;
        if (data.description !== undefined) payload.description = data.description || null;
        if (finalImage !== undefined) payload.image_url = finalImage;
        if (data.isActive !== undefined) payload.is_active = data.isActive;

        const { data: sbCat, error: sbErr } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', targetId)
          .select()
          .maybeSingle();

        if (sbCat) {
          updatedCat = {
            id: sbCat.id,
            name: sbCat.name,
            slug: sbCat.slug,
            description: sbCat.description,
            imageUrl: sbCat.image_url,
            isActive: sbCat.is_active,
          };
        } else if (sbErr) {
          console.warn('Supabase updateCategory notice:', sbErr.message);
        }
      } catch (err: any) {
        console.warn('Supabase updateCategory error:', err?.message || err);
      }
    }

    const cat = mockStore.categories.find((c) => c.id === id || c.slug === id || c.id === targetId);
    if (cat) {
      if (data.name) cat.name = data.name;
      if (computedSlug) cat.slug = computedSlug;
      if (data.description !== undefined) cat.description = data.description || null;
      if (finalImage !== undefined) cat.imageUrl = finalImage;
      if (data.isActive !== undefined) cat.isActive = data.isActive;
      cat.updatedAt = new Date();
    }

    return updatedCat || cat || { id: targetId, ...data, imageUrl: finalImage };
  }

  static async deleteCategory(id: string) {
    if (isDatabaseConnected()) {
      try {
        await prisma.category.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma deleteCategory fallback:', err);
      }
    }

    if (supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCategory error:', err);
      }
    }

    const index = mockStore.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockStore.categories.splice(index, 1);
    }

    return { id };
  }
}
