import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const OrderItemSchema = z.object({
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
    productId: objectIdSchema.optional(),
});

export type OrderItemType = z.infer<typeof OrderItemSchema>;
