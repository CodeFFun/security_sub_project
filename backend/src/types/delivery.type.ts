import mongoose from "mongoose";
import z from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
}).transform((val) => new mongoose.Types.ObjectId(val));


export const DeliverySchema = z.object({
    status: z.string().min(1),
    courier_name: z.string().min(1),
    tracking_id: z.string().min(1),
    picked_at: z.date().or(z.string()).optional(),
    delivered_at: z.date().or(z.string()).optional(),
    orderId: objectIdSchema,
});

export type DeliveryType = z.infer<typeof DeliverySchema>;
