import { createShop, deleteShop, getAllShopsOfAUser, getShopsById, updateShop, getAllShops } from "../api/shop";

export const handleCreateShop = async (formData: FormData) => {
    try {
        const res = await createShop(formData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Shop created successfully"
            };
        }
        return { success: false, message: res.message || "Shop creation failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Shop creation failed" };
    }
}
export const handleGetShopsById = async (id: string) => {
    try {
        const res = await getShopsById(id);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Shop fetched successfully"
            };
        }
        return { success: false, message: res.message || "Shop fetching failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Shop fetching failed" };
    }
}
export const handleGetAllShopsOfAUser = async () => {
    try {
        const res = await getAllShopsOfAUser();
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Shop fetched successfully"
            };
        }
        return { success: false, message: res.message || "Shop fetching failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Shop fetching failed" };
    }
}

export const handleGetAllShops = async () => {
    try {
        const res = await getAllShops();
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Shops fetched successfully"
            };
        }
        return { success: false, message: res.message || "Shops fetching failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Shops fetching failed" };
    }
}
export const handleUpdateShop = async (id:string,formData: FormData) => {
    try {
        const res = await updateShop(id, formData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Shop updated successfully"
            };
        }
        return { success: false, message: res.message || "Shop updating failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Shop updating failed" };
    }
}
export const handleDeleteShop = async (id: string) => {
    try {
        const res = await deleteShop(id);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Shop Deleted successfully"
            };
        }
        return { success: false, message: res.message || "Shop deletion failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Shop deletion failed" };
    }
}
