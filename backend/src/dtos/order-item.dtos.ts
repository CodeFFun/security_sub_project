import z from "zod"
import { OrderItemSchema } from "../types/order-item.type"

export const CreateOrderItemDTO = OrderItemSchema.pick({
    quantity: true,
    unit_price: true,
    productId: true
})
export type CreateOrderItemDTO = z.infer<typeof CreateOrderItemDTO>

export const UpdateOrderItemDTO = OrderItemSchema.partial();
export type UpdateOrderItemDTO = z.infer<typeof UpdateOrderItemDTO>