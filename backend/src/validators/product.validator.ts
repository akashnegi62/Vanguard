import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than zero'),
  discountPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().default('Vanguard'),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url()).min(1, 'At least one image URL is required'),
  variants: z.array(
    z.object({
      size: z.string().min(1),
      color: z.string().min(1),
      stock: z.number().int().nonnegative().default(0),
      sku: z.string().min(1),
    })
  ).min(1, 'At least one variant is required'),
});

export const updateProductSchema = createProductSchema.partial();
