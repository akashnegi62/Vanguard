import { isDatabaseConnected, prisma } from '../config/database';
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

      if (!product) throw new Error('Product not found');
      return product;
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

    if (isDatabaseConnected()) {
      return prisma.product.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          discountPrice: data.discountPrice,
          categoryId: data.categoryId,
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
      id: `prod-${Date.now()}`,
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
        productId: `prod-${Date.now()}`,
        imageUrl: url,
        sortOrder: idx,
        createdAt: new Date(),
      })),
      variants: (data.variants || []).map((v: any, idx: number) => ({
        id: `var-${Date.now()}-${idx}`,
        productId: `prod-${Date.now()}`,
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
    if (isDatabaseConnected()) {
      return prisma.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.discountPrice !== undefined && { discountPrice: data.discountPrice }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.brand && { brand: data.brand }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
        include: {
          images: true,
          variants: true,
          category: true,
        },
      });
    }

    const product = mockStore.products.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');

    Object.assign(product, data, { updatedAt: new Date() });
    return product;
  }

  static async deleteProduct(id: string) {
    if (isDatabaseConnected()) {
      return prisma.product.delete({ where: { id } });
    }

    const index = mockStore.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockStore.products.splice(index, 1);
    return { id };
  }
}
