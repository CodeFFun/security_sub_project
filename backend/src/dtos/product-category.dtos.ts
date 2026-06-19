import z from "zod";
import { ProductCategorySchema } from "../types/product-category.type";

export const CreateProductCategoryDTO = ProductCategorySchema.pick({
    name: true,
    description: true,
    shopId: true,
});

export type CreateProductCategoryDTO = z.infer<typeof CreateProductCategoryDTO>;

export const UpdateProductCategoryDTO = ProductCategorySchema.partial();

export type UpdateProductCategoryDTO = z.infer<typeof UpdateProductCategoryDTO>;
