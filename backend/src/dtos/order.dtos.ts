import z from "zod";
import { OrderSchema } from "../types/order.type";

export const CreateOrderDTO = OrderSchema.pick(
    {
        schedule_for: true,
        subscriptionId: true,
        userId: true,
        shopId: true,
        orderItemsId: true,
    }
).partial({
    schedule_for: true,
    subscriptionId: true,
    userId: true,
    orderItemsId: true,    
})
export type CreateOrderDTO = z.infer<typeof CreateOrderDTO>

export const UpdateOrderDTO = OrderSchema.partial();
export type UpdateOrderDTO = z.infer<typeof UpdateOrderDTO>