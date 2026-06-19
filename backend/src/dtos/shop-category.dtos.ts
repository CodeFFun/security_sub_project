import z from "zod";
import { ShopCategorySchema } from "../types/shop-category.types";

export const CreateShopCategoryDTO = ShopCategorySchema.pick({
    name: true,
    description: true,
});

export type CreateShopCategoryDTO = z.infer<typeof CreateShopCategoryDTO>;

export const UpdateShopCategoryDTO = ShopCategorySchema.partial();

export type UpdateShopCategoryDTO = z.infer<typeof UpdateShopCategoryDTO>;
