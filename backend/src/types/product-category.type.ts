import mongoose from "mongoose";
import z from "zod";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const ProductCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    shopId: objectIdSchema.optional(),
});

export type ProductCategoryType = z.infer<typeof ProductCategorySchema>;