import z from "zod"

// Password policy: minimum 8 characters, with at least one letter and one
// number. Enforced server-side at registration (authoritative). Rejects the
// most common weak passwords outright.
const COMMON_WEAK_PASSWORDS = new Set([
    "password", "password1", "12345678", "123456789", "qwerty123",
    "11111111", "iloveyou", "admin123", "letmein1",
]);

export const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .refine((p) => !COMMON_WEAK_PASSWORDS.has(p.toLowerCase()), {
        message: "Password is too common. Please choose a stronger one.",
    });

export const UserSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
    username: z.string().min(3).max(20),
    fullName: z.string().optional(),
    profilePictureUrl: z.string().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    alternateEmail: z.string().optional(),
    role: z.enum(['customer', 'shop', 'admin']).default('customer'),
});

export type UserType = z.infer<typeof UserSchema>;