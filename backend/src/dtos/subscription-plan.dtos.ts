import z from "zod"
import { SubscriptionPlanSchema } from "../types/subscription-plan.type"

export const CreateSubscriptionPlanDTO = SubscriptionPlanSchema.pick(
    {
        frequency: true,
        price_per_cycle: true,
        productId: true,
        active: true,
        quantity: true,
    }
)

export type CreateSubscriptionPlanDTO = z.infer<typeof CreateSubscriptionPlanDTO>

export const UpdateSubscriptionPlanDTO = SubscriptionPlanSchema.partial();
export type UpdateSubscriptionPlanDTO = z.infer<typeof UpdateSubscriptionPlanDTO>