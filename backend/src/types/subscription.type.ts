import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const SubscriptionSchema = z.object({
    status: z.string().min(1),
    start_date: z.date().or(z.string()),
    remaining_cycle: z.number().int().nonnegative(),
    created_at: z.date().or(z.string()).optional(),
    subscription_planId: objectIdSchema.optional(),
    shopId: objectIdSchema.optional(),
    userId: objectIdSchema.optional(),
    paymentId: objectIdSchema.optional(),
});

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
