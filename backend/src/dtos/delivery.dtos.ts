import z from "zod";
import { DeliverySchema } from "../types/delivery.type";

export const CreateDeliveryDTO = DeliverySchema.pick(
    {
        orderId: true,
        courier_name: true,
    }
)

export type CreateDeliveryDTO = z.infer<typeof CreateDeliveryDTO>

export const UpdateDeliveryDtO = DeliverySchema.partial();
export type UpdateDeliveryDTO = z.infer<typeof UpdateDeliveryDtO>