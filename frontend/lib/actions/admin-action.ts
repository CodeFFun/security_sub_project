import { createUser, getAllUsers, getUser, updateUser } from "../api/admin";

export const  handleCreateUser = async (formData: any) => {
    try {
        const res = await createUser(formData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "User created successfully"
            };
        }
        return { success: false, message: res.message || "User creation failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "User creation failed" };
    }
}

export const handleGetUserById = async (userid:string) => {
    try {
        const res = await getUser(userid);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "User fetched successfully"
            };
        }
        return { success: false, message: res.message || "Fetching user failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Fetching user failed" };
    }
}

export const handleGetAllUsers = async () => {
    try {
        const res = await getAllUsers();
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Users fetched successfully"
            };
        }
        return { success: false, message: res.message || "Fetching users failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Fetching users failed" };
    }
}

export const handleUpdateUser = async ( userId:string, formData: FormData) => {
    try {
        const res = await updateUser(userId, formData);
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
