import z from "zod";
import { AddressSchema } from "../types/address.type";
export const CreateAddressDTO = AddressSchema.pick(
    {
        line1: true,
        label: true,
        city: true,
        state: true,
        country: true,
    }
)

export type CreateAddressDTO = z.infer<typeof CreateAddressDTO>;

export const UpdateAddressDTO = AddressSchema.partial();
export type UpdateAddressDTO = z.infer<typeof UpdateAddressDTO>;