"use server";
import { forgotPassword, login, register } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export const handleRegister = async (formData: any) => {
    try {
        const res = await register(formData);
        if (res.success) {
            
            return {
                success: true,
                data: res.data,
                message: "Registration successful"
            };
        }
        return { success: false, message: res.message || "Registration failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Registration failed" };
    }
}

export const handleLogin = async (formData: any) => {
    try {
        const res = await login(formData);
        
        if (res.success) {
            await setAuthToken(res.token);
            await setUserData(res.data);
           
            return {
                success: true,
                data: res.data,
                message: "Login successful"
            };
        }
        return { success: false, message: res.message || "Login failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Login failed" };
    }
}

export const handleForgotPassword = async (email: string, password: string) => {
    try {
        const res = await forgotPassword(email, password);
        if (res.success) {
            return {
                success: true,
                message: "Password reset successful"
            };
        }
        return { success: false, message: res.message || "Password reset failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Password reset failed" };
    }
}