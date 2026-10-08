import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
