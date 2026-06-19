import z from "zod"
import { ProductSchema } from "../types/product.type"

export const CreateProductDTO = ProductSchema.pick(
    {
        name: true,
        base_price: true,
        stock_quantity: true,
        shopId: true,
        description: true,
        discount: true,
        categoryId: true,
    }
)

export type CreateProductDTO = z.infer<typeof CreateProductDTO>

export const UpdateProductDTO = ProductSchema.partial();
export type UpdateProductDTO = z.infer<typeof UpdateProductDTO>
