import z from "zod"
import { PaymentSchema } from "../types/payment.type"

export const CreatePaymentDTO = PaymentSchema.pick(
    {
        amount: true,
        orderId:true
    }
).extend({
    provider: z.string().optional(),
    status: z.string().optional(),
    paid_at: z.date().optional()
})

export type CreatePaymentDTO = z.infer<typeof CreatePaymentDTO>

export const UpdatePaymentDTO = PaymentSchema.partial();
export type UpdatePaymentDTO = z.infer<typeof UpdatePaymentDTO>