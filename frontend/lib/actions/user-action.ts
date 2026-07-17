
"use server";
import { updateUser, createUser, getUser, getAllUsers } from "../api/user";

export const handleUpdateUser = async ( formData: any) => {
    try {
        const res = await updateUser(formData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "User updated successfully"
            };
        }
        return { success: false, message: res.message || "User update failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "User update failed" };
    }
}

