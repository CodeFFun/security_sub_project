import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const VendorSchema = z.object({
    fullName: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    verified: z.boolean().default(false),
    timezone: z.string().optional(),
    created_at: z.date().or(z.string()).optional(),
    shopId: objectIdSchema.optional(),
});

export type VendorType = z.infer<typeof VendorSchema>;
