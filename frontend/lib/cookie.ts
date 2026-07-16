"use server";
import { cookies } from "next/headers";

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const isProduction = process.env.NODE_ENV === "production";

// Shared hardening: httpOnly blocks JS/XSS from reading the cookie, sameSite
// mitigates CSRF, secure forces HTTPS-only transport in production.
const secureCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: THIRTY_DAYS,
};

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "auth_token", value: token, ...secureCookieOptions });
}
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value || null;
}
export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    // cookie can only store string values
    cookieStore.set({ name: "user_data", value: JSON.stringify(userData), ...secureCookieOptions });
}
export const getUserData = async () => {
    const cookieStore = await cookies();
    const data = cookieStore.get("user_data")?.value || null;
    return data ? JSON.parse(data) : null;
}
export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
}