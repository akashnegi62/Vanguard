import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
