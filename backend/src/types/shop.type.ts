import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const ShopSchema = z.object({
    name: z.string().min(1),
    pickup_info: z.string().optional(),
    about: z.string().optional(),
    accepts_subscription: z.boolean().default(false),
    created_at: z.date().or(z.string()).optional(),
    shop_banner: z.string().optional(),
    addressId: objectIdSchema.optional(),
    userId: objectIdSchema.optional(),
    categoryId: objectIdSchema.optional(),
});

export type ShopType = z.infer<typeof ShopSchema>;
