import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const PaymentSchema = z.object({
    provider: z.string().min(1),
    status: z.string().min(1),
    amount: z.number().positive(),
    paid_at: z.date().or(z.string()).optional(),
    orderId: objectIdSchema.array().optional(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
