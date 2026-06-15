import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const OrderSchema = z.object({
    delivery_type: z.string().min(1),
    created_at: z.date().or(z.string()).optional(),
    schedule_for: z.date().or(z.string()).optional(),
    subscriptionId: objectIdSchema.optional(),
    userId: objectIdSchema,
    shopId: objectIdSchema.optional(),
    orderItemsId: objectIdSchema.array().optional(),
});

export type OrderType = z.infer<typeof OrderSchema>;
