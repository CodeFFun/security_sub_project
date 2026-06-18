import z from "zod";
import { UserSchema } from "../types/user.type";

// Public self-registration: users may only sign up as customer or shop.
// The privileged "admin" role must never be assignable from this endpoint.
export const CreateUserDTO = UserSchema.pick(
    {
        email: true,
        password: true,
        username: true,
    }
).extend({
    role: z.enum(['customer', 'shop']).default('customer'),
});
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// Admin-only user creation: full role set including admin. Guarded by
// authorizedMiddleware + adminOnlyMiddleware at the route level.
export const AdminCreateUserDTO = UserSchema.pick(
    {
        email: true,
        password: true,
        username: true,
    }
).extend({
    role: z.enum(['customer', 'shop', 'admin']).default('customer'),
});
export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// Used by the password-reset ("forgot password") endpoint. Deliberately
// password-only: role must NOT be changeable here, otherwise anyone could
// escalate any account to admin by email without authentication.
export const RoleDTO = z.object({
    password: z.string().min(6),
});
export type RoleDTO = z.infer<typeof RoleDTO>;
export const UpdateUserDTO = UserSchema.pick({
    fullName: true,
    profilePictureUrl: true,
    phoneNumber: true,
    alternateEmail: true,
})
.partial()
.merge(
    z.object({
        password: z.string().optional(),
    })
);

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;