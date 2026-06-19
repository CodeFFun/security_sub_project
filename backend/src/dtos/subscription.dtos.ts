import z from "zod"
import { SubscriptionSchema } from "../types/subscription.type"

export const CreateSubscriptionDTO = SubscriptionSchema.pick(
    {
        start_date: true,
        remaining_cycle: true,
        userId: true,
        paymentId: true,
        shopId: true,
        subscription_planId: true,
    }
).partial({
    paymentId: true,
    userId: true,
})

export type CreateSubscriptionDTO = z.infer<typeof CreateSubscriptionDTO>

export const UpdateSubscriptionDTO = SubscriptionSchema.partial();
export type UpdateSubscriptionDTO = z.infer<typeof UpdateSubscriptionDTO>