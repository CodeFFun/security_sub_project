import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const SubscriptionPlanSchema = z.object({
    frequency: z.number().min(1),
    price_per_cycle: z.number().positive(),
    active: z.boolean().default(true),
    quantity: z.number().min(1).optional(),
    created_at: z.date().or(z.string()).optional(),
    productId: objectIdSchema.array().optional(),
});

export type SubscriptionPlanType = z.infer<typeof SubscriptionPlanSchema>;
