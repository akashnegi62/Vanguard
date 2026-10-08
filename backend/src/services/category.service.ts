import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore, MockCategory } from './mockStore';

export class CategoryService {
  static async getCategories() {
    if (isDatabaseConnected()) {
      return prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { name: 'asc' },
      });
    }

    return mockStore.categories.map((c) => ({
      ...c,
      _count: {
        products: mockStore.products.filter((p) => p.categoryId === c.id).length,
      },
    }));
  }

  static async getCategoryById(idOrSlug: string) {
    if (isDatabaseConnected()) {
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
      if (!cat) throw new Error('Category not found');
      return cat;
    }

    const cat = mockStore.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
    if (!cat) throw new Error('Category not found');

    const products = mockStore.products.filter((p) => p.categoryId === cat.id);
    return { ...cat, products };
  }

  static async createCategory(data: { name: string; description?: string; imageUrl?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (isDatabaseConnected()) {
      return prisma.category.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          imageUrl: data.imageUrl,
        },
      });
    }

    const newCat: MockCategory = {
      id: `cat-${slug}`,
      name: data.name,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStore.categories.push(newCat);
    return newCat;
  }

  static async updateCategory(id: string, data: any) {
    if (isDatabaseConnected()) {
      return prisma.category.update({
        where: { id },
        data,
      });
    }

    const cat = mockStore.categories.find((c) => c.id === id);
    if (!cat) throw new Error('Category not found');
    Object.assign(cat, data, { updatedAt: new Date() });
    return cat;
  }

  static async deleteCategory(id: string) {
    if (isDatabaseConnected()) {
      return prisma.category.delete({ where: { id } });
    }

    const index = mockStore.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    mockStore.categories.splice(index, 1);
    return { id };
  }
}
