import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));

export const AddressSchema = z.object({
    label: z.string().min(1),
    line1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1).default("Nep"),
    lat: z.number().optional(),
    lng: z.number().optional(),
    is_default: z.boolean().default(false),
    userId: objectIdSchema,
});

export type AddressType = z.infer<typeof AddressSchema>;
