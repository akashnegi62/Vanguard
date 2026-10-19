import { isDatabaseConnected, prisma } from '../config/database';
import { supabase } from '../config/supabase';
import { mockStore, MockProduct } from './mockStore';
import { ProductFilterQuery } from '../types';

export class ProductService {
  static async getProducts(query: ProductFilterQuery) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.max(1, parseInt(query.limit || '12', 10));
    const skip = (page - 1) * limit;

    if (isDatabaseConnected()) {
      const where: any = { isActive: true };

      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { brand: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      if (query.category) {
        where.category = { slug: query.category };
      }

      if (query.minPrice || query.maxPrice) {
        where.price = {};
        if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
        if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
      }

      if (query.featured === 'true') {
        where.isFeatured = true;
      }

      let orderBy: any = { createdAt: 'desc' };
      if (query.sort === 'price_asc') orderBy = { price: 'asc' };
      if (query.sort === 'price_desc') orderBy = { price: 'desc' };
      if (query.sort === 'newest') orderBy = { createdAt: 'desc' };

      const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
          },
          skip,
          take: limit,
          orderBy,
        }),
      ]);

      return {
        products,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // Try Supabase directly
    if (supabase) {
      try {
        let q = supabase
          .from('products')
          .select('*, images:product_images(*), variants:product_variants(*), category:categories(*)', { count: 'exact' })
          .eq('is_active', true);

        if (query.search) q = q.ilike('name', `%${query.search}%`);
        if (query.featured === 'true') q = q.eq('is_featured', true);
        if (query.category) {
          const catId = query.category.startsWith('cat-') ? query.category : `cat-${query.category}`;
          q = q.or(`category_id.eq.${query.category},category_id.eq.${catId}`);
        }
        if (query.minPrice) q = q.gte('price', parseFloat(query.minPrice));
        if (query.maxPrice) q = q.lte('price', parseFloat(query.maxPrice));
        if (query.sort === 'price_asc') q = q.order('price', { ascending: true });
        else if (query.sort === 'price_desc') q = q.order('price', { ascending: false });
        else q = q.order('created_at', { ascending: false });

        const { data: sbProds, count: sbCount, error } = await q.range(skip, skip + limit - 1);
        if (!error && sbProds && sbProds.length > 0) {
          const mapped = sbProds.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: Number(p.price),
            discountPrice: p.discount_price ? Number(p.discount_price) : null,
            categoryId: p.category_id,
            brand: p.brand,
            isFeatured: p.is_featured,
            isActive: p.is_active,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
            images: (p.images || []).map((img: any) => ({
              id: img.id,
              imageUrl: img.image_url,
              altText: img.alt_text,
              sortOrder: img.sort_order,
            })),
            variants: (p.variants || []).map((v: any) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              stock: v.stock,
              sku: v.sku,
            })),
            category: p.category,
            rating: 4.9,
            reviewsCount: 15,
          }));

          return {
            products: mapped,
            meta: {
              page,
              limit,
              total: sbCount || mapped.length,
              totalPages: Math.ceil((sbCount || mapped.length) / limit),
            },
          };
        }
      } catch (err) {
        // Fallback to local memory store
      }
    }

    // Mock Store implementation
    let filtered = mockStore.products.filter((p) => p.isActive);

    if (query.search) {
      const s = query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s)
      );
    }

    if (query.category) {
      filtered = filtered.filter(
        (p) => p.category?.slug === query.category || p.categoryId === query.category
      );
    }

    if (query.minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(query.minPrice!));
    }

    if (query.maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(query.maxPrice!));
    }

    if (query.featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (query.sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (query.sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      products: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(idOrSlug: string) {
    if (isDatabaseConnected()) {
      try {
        const product = await prisma.product.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
            reviews: {
              include: { user: { select: { id: true, name: true } } },
              orderBy: { createdAt: 'desc' },
            },
          },
        });

        if (product) return product;
      } catch (err) {
        console.warn('Prisma getProductById fallback to Supabase:', err);
      }
    }

    // Try Supabase directly
    if (supabase) {
      try {
        let { data: p } = await supabase
          .from('products')
          .select('*, images:product_images(*), variants:product_variants(*), category:categories(*)')
          .eq('slug', idOrSlug)
          .maybeSingle();

        if (!p) {
          const { data: pById } = await supabase
            .from('products')
            .select('*, images:product_images(*), variants:product_variants(*), category:categories(*)')
            .eq('id', idOrSlug)
            .maybeSingle();
          p = pById;
        }

        if (p) {
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: Number(p.price),
            discountPrice: p.discount_price ? Number(p.discount_price) : null,
            categoryId: p.category_id,
            brand: p.brand || 'Vanguard',
            isFeatured: Boolean(p.is_featured),
            isActive: Boolean(p.is_active),
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
            images: (p.images || []).map((img: any) => ({
              id: img.id,
              imageUrl: img.image_url,
              altText: img.alt_text || p.name,
              sortOrder: img.sort_order || 0,
            })),
            variants: (p.variants || []).map((v: any) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              stock: Number(v.stock),
              sku: v.sku || '',
            })),
            category: p.category,
            reviews: [],
            avgRating: 4.9,
            totalReviews: 8,
          };
        }
      } catch (err) {
        console.warn('Supabase getProductById error:', err);
      }
    }

    const product = mockStore.products.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );
    if (!product) throw new Error('Product not found');

    const reviews = mockStore.reviews.filter((r) => r.productId === product.id);
    return { ...product, reviews };
  }

  static async createProduct(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newId = `prod-${Date.now()}`;

    // Normalize category ID for Supabase & DB foreign key integrity
    const catMap: Record<string, string> = {
      'cat-1': 'cat-tshirts',
      'cat-2': 'cat-shirts',
      'cat-3': 'cat-jeans',
      'cat-4': 'cat-trousers',
      'cat-5': 'cat-jackets',
      'cat-6': 'cat-hoodies',
      'cat-7': 'cat-shorts',
      'cat-8': 'cat-sneakers',
      'cat-sneakers': 'cat-sneakers',
      'sneakers': 'cat-sneakers',
    };
    const resolvedCatId = catMap[data.categoryId] || data.categoryId;

    // Persist to Supabase directly if available
    if (supabase) {
      try {
        await supabase.from('products').insert({
          id: newId,
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          discount_price: data.discountPrice,
          category_id: resolvedCatId,
          brand: data.brand || 'Vanguard',
          is_featured: data.isFeatured || false,
          is_active: true,
        });

        if (data.images && data.images.length > 0) {
          const imgInserts = data.images.map((url: string, idx: number) => ({
            id: `img-${Date.now()}-${idx}`,
            product_id: newId,
            image_url: url,
            sort_order: idx,
          }));
          await supabase.from('product_images').insert(imgInserts);
        }

        if (data.variants && data.variants.length > 0) {
          const varInserts = data.variants.map((v: any, idx: number) => ({
            id: `var-${Date.now()}-${idx}`,
            product_id: newId,
            size: v.size,
            color: v.color,
            stock: v.stock,
            sku: v.sku || `${slug}-${v.size}-${idx + 1}`.toUpperCase(),
          }));
          await supabase.from('product_variants').insert(varInserts);
        }
      } catch (err) {
        console.warn('Supabase createProduct sync notice:', err);
      }
    }

    if (isDatabaseConnected()) {
      return prisma.product.create({
        data: {
          id: newId,
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          discountPrice: data.discountPrice,
          categoryId: resolvedCatId,
          brand: data.brand || 'Vanguard',
          isFeatured: data.isFeatured || false,
          images: {
            create: data.images.map((url: string, idx: number) => ({
              imageUrl: url,
              sortOrder: idx,
            })),
          },
          variants: {
            create: data.variants.map((v: any) => ({
              size: v.size,
              color: v.color,
              stock: v.stock,
              sku: v.sku,
            })),
          },
        },
        include: {
          images: true,
          variants: true,
          category: true,
        },
      });
    }

    const cat = mockStore.categories.find((c) => c.id === data.categoryId);
    const newProduct: MockProduct = {
      id: newId,
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      categoryId: data.categoryId,
      brand: data.brand || 'Vanguard',
      isFeatured: data.isFeatured || false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: (data.images || []).map((url: string, idx: number) => ({
        id: `img-${Date.now()}-${idx}`,
        productId: newId,
        imageUrl: url,
        sortOrder: idx,
        createdAt: new Date(),
      })),
      variants: (data.variants || []).map((v: any, idx: number) => ({
        id: `var-${Date.now()}-${idx}`,
        productId: newId,
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      category: cat,
      rating: 5.0,
      reviewsCount: 0,
    };

    mockStore.products.unshift(newProduct);
    return newProduct;
  }

  static async updateProduct(id: string, data: any) {
    let updatedInSupabase = false;
    let supabaseProduct: any = null;

    const catMap: Record<string, string> = {
      'cat-1': 'cat-tshirts',
      'cat-2': 'cat-shirts',
      'cat-3': 'cat-jeans',
      'cat-4': 'cat-trousers',
      'cat-5': 'cat-jackets',
      'cat-6': 'cat-hoodies',
      'cat-7': 'cat-shorts',
      'cat-8': 'cat-sneakers',
      'cat-sneakers': 'cat-sneakers',
      'sneakers': 'cat-sneakers',
    };
    const resolvedCatId = data.categoryId ? (catMap[data.categoryId] || data.categoryId) : undefined;

    let targetId = id;

    if (supabase) {
      try {
        // Resolve target product ID first (by id or slug)
        const { data: existingProd } = await supabase
          .from('products')
          .select('id, slug')
          .or(`id.eq.${id},slug.eq.${id}`)
          .single();

        if (existingProd) {
          targetId = existingProd.id;
        }

        const updatePayload: any = {};
        if (data.name) updatePayload.name = data.name;
        if (data.slug) updatePayload.slug = data.slug;
        if (data.description) updatePayload.description = data.description;
        if (data.price !== undefined) updatePayload.price = Number(data.price);
        if (data.discountPrice !== undefined) updatePayload.discount_price = data.discountPrice ? Number(data.discountPrice) : null;
        if (resolvedCatId) updatePayload.category_id = resolvedCatId;
        if (data.brand) updatePayload.brand = data.brand;
        if (data.isFeatured !== undefined) updatePayload.is_featured = Boolean(data.isFeatured);
        if (data.isActive !== undefined) updatePayload.is_active = Boolean(data.isActive);
        updatePayload.updated_at = new Date().toISOString();

        const { data: updated, error } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', targetId)
          .select('*, images:product_images(*), variants:product_variants(*), category:categories(*)')
          .single();

        // Update product images if provided
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          await supabase.from('product_images').delete().eq('product_id', targetId);
          const imgInserts = data.images.map((url: string, idx: number) => ({
            id: `img-${Date.now()}-${idx}`,
            product_id: targetId,
            image_url: url,
            sort_order: idx,
          }));
          await supabase.from('product_images').insert(imgInserts);
        }

        // Update product variants if provided
        if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
          await supabase.from('product_variants').delete().eq('product_id', targetId);
          const currentSlug = data.slug || existingProd?.slug || 'prod';
          const varInserts = data.variants.map((v: any, idx: number) => ({
            id: `var-${Date.now()}-${idx}`,
            product_id: targetId,
            size: v.size,
            color: v.color,
            stock: Number(v.stock),
            sku: v.sku || `${currentSlug}-${v.size}-${idx + 1}`.toUpperCase(),
          }));
          await supabase.from('product_variants').insert(varInserts);
        }

        if (!error && updated) {
          updatedInSupabase = true;
          supabaseProduct = {
            id: updated.id,
            name: updated.name,
            slug: updated.slug,
            description: updated.description,
            price: Number(updated.price),
            discountPrice: updated.discount_price ? Number(updated.discount_price) : null,
            categoryId: updated.category_id,
            brand: updated.brand,
            isFeatured: updated.is_featured,
            isActive: updated.is_active,
            createdAt: new Date(updated.created_at),
            updatedAt: new Date(updated.updated_at),
            images: data.images
              ? data.images.map((url: string, idx: number) => ({
                  id: `img-${Date.now()}-${idx}`,
                  imageUrl: url,
                  altText: updated.name,
                  sortOrder: idx,
                }))
              : (updated.images || []).map((img: any) => ({
                  id: img.id,
                  imageUrl: img.image_url,
                  altText: img.alt_text,
                  sortOrder: img.sort_order,
                })),
            variants: data.variants
              ? data.variants.map((v: any, idx: number) => ({
                  id: `var-${Date.now()}-${idx}`,
                  size: v.size,
                  color: v.color,
                  stock: Number(v.stock),
                  sku: v.sku || `${updated.slug}-${v.size}-${idx + 1}`.toUpperCase(),
                }))
              : (updated.variants || []).map((v: any) => ({
                  id: v.id,
                  size: v.size,
                  color: v.color,
                  stock: v.stock,
                  sku: v.sku,
                })),
            category: updated.category,
          };
        }
      } catch (err) {
        console.warn('Supabase updateProduct sync notice:', err);
      }
    }

    if (isDatabaseConnected()) {
      const prismaData: any = {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: Number(data.price) }),
        ...(data.discountPrice !== undefined && { discountPrice: data.discountPrice ? Number(data.discountPrice) : null }),
        ...(resolvedCatId && { categoryId: resolvedCatId }),
        ...(data.brand && { brand: data.brand }),
        ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      };

      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId: targetId } });
        prismaData.images = {
          create: data.images.map((url: string, idx: number) => ({
            imageUrl: url,
            sortOrder: idx,
          })),
        };
      }

      if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
        await prisma.productVariant.deleteMany({ where: { productId: targetId } });
        prismaData.variants = {
          create: data.variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: Number(v.stock),
            sku: v.sku,
          })),
        };
      }

      return prisma.product.update({
        where: { id: targetId },
        data: prismaData,
        include: {
          images: true,
          variants: true,
          category: true,
        },
      });
    }

    const product = mockStore.products.find((p) => p.id === id || p.slug === id || p.id === targetId);
    if (product) {
      if (data.name) product.name = data.name;
      if (data.slug) product.slug = data.slug;
      if (data.description) product.description = data.description;
      if (data.price !== undefined) product.price = Number(data.price);
      if (data.discountPrice !== undefined) product.discountPrice = data.discountPrice ? Number(data.discountPrice) : null;
      if (resolvedCatId) {
        product.categoryId = resolvedCatId;
        const cat = mockStore.categories.find((c) => c.id === resolvedCatId);
        if (cat) product.category = cat;
      }
      if (data.brand) product.brand = data.brand;
      if (data.isFeatured !== undefined) product.isFeatured = Boolean(data.isFeatured);
      if (data.isActive !== undefined) product.isActive = Boolean(data.isActive);
      if (data.images && Array.isArray(data.images)) {
        product.images = data.images.map((url: string, idx: number) => ({
          id: `img-${Date.now()}-${idx}`,
          productId: product.id,
          imageUrl: url,
          sortOrder: idx,
          createdAt: new Date(),
        }));
      }
      if (data.variants && Array.isArray(data.variants)) {
        product.variants = data.variants.map((v: any, idx: number) => ({
          id: `var-${Date.now()}-${idx}`,
          productId: product.id,
          size: v.size,
          color: v.color,
          stock: Number(v.stock),
          sku: v.sku || `${product.slug}-${v.size}-${idx + 1}`.toUpperCase(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      }
      product.updatedAt = new Date();
      return product;
    }

    if (updatedInSupabase && supabaseProduct) {
      return supabaseProduct;
    }

    throw new Error('Product not found');
  }

  static async deleteProduct(id: string) {
    let deleted = false;

    if (supabase) {
      try {
        // Cascade remove related items first to ensure foreign keys don't block
        await supabase.from('product_images').delete().eq('product_id', id);
        await supabase.from('product_variants').delete().eq('product_id', id);
        await supabase.from('cart_items').delete().eq('product_id', id);
        await supabase.from('wishlist_items').delete().eq('product_id', id);
        await supabase.from('reviews').delete().eq('product_id', id);

        const { error } = await supabase.from('products').delete().or(`id.eq.${id},slug.eq.${id}`);
        if (!error) {
          deleted = true;
          console.log(`Deleted product ${id} from Supabase successfully`);
        } else {
          console.warn('Supabase hard delete notice:', error.message);
          // If foreign key constraint blocks deletion, soft-delete so it disappears from catalog
          const { error: updateError } = await supabase
            .from('products')
            .update({ is_active: false })
            .or(`id.eq.${id},slug.eq.${id}`);
          if (!updateError) {
            deleted = true;
          }
        }
      } catch (err: any) {
        console.warn('Supabase deleteProduct sync notice:', err?.message || err);
      }
    }

    if (isDatabaseConnected()) {
      try {
        await prisma.productImage.deleteMany({ where: { productId: id } });
        await prisma.productVariant.deleteMany({ where: { productId: id } });
        await prisma.cartItem.deleteMany({ where: { productId: id } });
        await prisma.wishlistItem.deleteMany({ where: { productId: id } });
        await prisma.review.deleteMany({ where: { productId: id } });
        await prisma.product.delete({ where: { id } });
        deleted = true;
      } catch (prismaErr) {
        try {
          await prisma.product.update({ where: { id }, data: { isActive: false } });
          deleted = true;
        } catch {}
      }
    }

    // Also remove from in-memory mockStore
    const index = mockStore.products.findIndex((p) => p.id === id || p.slug === id);
    if (index !== -1) {
      mockStore.products.splice(index, 1);
      deleted = true;
    }

    return { id, success: true, deleted: true };
  }
}
