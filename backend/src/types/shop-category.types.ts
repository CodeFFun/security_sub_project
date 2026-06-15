import { z } from 'zod';

export const ShopCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export type ShopCategoryType = z.infer<typeof ShopCategorySchema>;